# Security review — Softphone Companion and its workspace wiring

| | |
|---|---|
| **Date** | 2026-09-15 |
| **Reviewed at** | `0e7ebb34` (`main`) |
| **Scope** | `packages/electron-softphone-companion` (all of `src/`, build and packaging config) and the workspace wiring in `src/app/api/agent-workspace/external-softphone/`, `src/app/api/agent-workspace/websocket/useWebSocketClient.ts`, `src/features/modules/call/call.js` |
| **Out of scope** | the `electron-sip` addon's C++ internals beyond its call surface, the Webitel backend, `packages/electron-workspace` |
| **Method** | source read of every file in scope; no dynamic testing against a live SIP deployment |

This document lists what is **still open**. F1, F2, F4, F5, F10, F11, F12 and
F15 were remediated in the change that introduced this review and have been
dropped from the list; their numbering is left as gaps so references in that
change's commits and pull request stay valid. What the fixes left behind is
recorded under *Residual risk* below.

Everything that remains needs a decision — backend work, packaging, or a
release-process change — that does not belong in a hardening patch.

## Trust boundary

```
┌─ Browser ──────────────────┐         ┌─ Webitel Softphone Companion ─────┐
│ cc-workspaces (UI)         │         │ Electron main process:            │
│  webitel-sdk Client #1     │  ws://  │  local WS server 127.0.0.1:10029  │
│  registerWebDevice: false  │◄───────►│  webitel-sdk Client #2            │
│  cli.phone = RemotePhone ──┼─answer,─│    (token from web via hello)     │
│                            │  call   │  pjsip (electron-sip addon)       │
└──────────┬─────────────────┘         └───────────┬───────────────────────┘
           │ wss (hangup, hold, dtmf,              │ SIP UDP: REGISTER,
           │ mute, transfer, bridge, ...)          │ INVITE/200 OK + RTP
           ▼                                       ▼
        Webitel engine  ◄──────────────────────────┘
```

The companion is a **tray-only Electron app with no renderer process**: no
`BrowserWindow` is ever constructed, so there is no preload, no `contextBridge`
surface and no IPC. Its entire attack surface is the plaintext loopback
WebSocket server in `src/main/local-server.ts`.

Two properties decide everything below:

1. **A WebSocket client is not bound by the same-origin policy.** Any page the
   operator opens, in any tab, can `new WebSocket('ws://127.0.0.1:10029')`;
   browsers permit this from an `https://` page because the target is loopback.
2. **Nothing authenticates the two peers to each other.** The workspace hands
   its access token to whatever answers the port, and the utility has no way to
   tell the workspace from anything else running as the same user. Pairing (see
   *Residual risk*) now constrains *which backend* a client can point the
   utility at, but it does not make either side prove who it is — which is F3,
   the one finding that gates a wide rollout.

Everything on the machine — every local process and every website the operator
visits — sits on the untrusted side of that boundary.

## Findings

### F3 — The workspace hands its access token to an unauthenticated listener — **High — not fixed (needs backend work)**

```ts
// src/app/api/agent-workspace/external-softphone/useExternalSoftphone.ts
function sendHello() {
    send('hello', {
        token: localStorage.getItem('access-token'),
        endpoint,
        protocolVersion: PROTOCOL_VERSION,
    });
}
```

`access-token` is the genuine Webitel session bearer (`src/main.ts` stores it
from the `?accessToken=` query param and sends it as `X-Webitel-Access`). The
browser verifies nothing about the listener: no certificate, no signed
handshake, no challenge, no OS-level peer-credential check. Detection is
"the socket opened" — `probe()` resolves `true` on `onopen` alone.

**Exploit path.** Any unprivileged local process binds `127.0.0.1:10029` before
the companion does and harvests the operator's token on every login, reload and
reconnect. The Electron single-instance lock does not help: whoever binds first
wins, and the real app simply logs `EADDRINUSE`. The reverse direction is just
as open — a rogue listener replies `{type:'state', sipRegistered:true}`, the
browser attaches a `RemotePhone` and lights up the Answer button, and every
`answer`/`call` the operator issues is silently black-holed.

Two local peers with **no shared secret and no trusted introducer cannot
authenticate each other**, and any secret shipped in the workspace bundle is
readable by the same attacker. So every route below works by introducing one of
those two things. In rough order of preference:

1. **Backend-mediated presence** *(needs backend work)*. The companion
   registers its session with the Webitel engine (it already authenticates
   there); the browser asks the engine whether a companion session is live for
   this user instead of trusting whoever answers the port, and addresses it
   through the engine. The loopback socket then carries nothing sensitive.
2. **A pairing secret plus a mutual challenge** *(no backend work)*. The
   companion generates a secret at first run and shows it in the tray; the
   operator enters it once in the workspace settings. The browser then sends
   `challenge {nonce}` as its first frame and only proceeds if the reply
   carries `HMAC(secret, nonce)` — so a squatter that cannot produce the MAC
   never receives the token, and the workspace falls back to the web phone.
   Storing the secret on the workspace origin is not a weakening: anything with
   script execution there already holds the token. Costs one manual pairing
   step per workstation.
3. **A scoped, short-lived handoff token** *(needs backend work)* minted for the
   companion — so a squatter gets a credential that can fetch SIP config and
   nothing else, and only briefly. Shrinks the blast radius from account
   takeover to device impersonation; does not close the hole.
4. **OS-level peer verification** (`SO_PEERCRED`/`LOCAL_PEERCRED`, or matching
   the connecting pid to a signed binary) before the browser sends anything —
   only possible if the handshake moves out of the browser.

One route that looks appealing and does **not** apply: having an Electron
wrapper read a `0600` handshake file (port + secret) written by the companion
and hand it to the page. `packages/electron-workspace` embeds its own pjsip
stack in its preload (`changeSIP`) and is an alternative to this utility rather
than a host for it, so no deployment pairs the two. It would become viable only
if the wrapper's embedded SIP were retired in favour of the companion.

Until one of these lands, this is an accepted risk of the feature, and it is
the reason the feature should stay opt-in per deployment rather than probing by
default: auto-detection makes the probe itself a signal, telling any local
listener that an agent has just authenticated, and hands over the token without
the operator doing anything.

**Related, not changed.** The workspace retries the loopback connection forever
(the backend socket caps at 10 attempts), and the port is read from
`localStorage['CONFIG']`, which `window._config` overrides at the top of the
config merge in `src/main.ts` — both script-writable on-origin, so the
token-handoff destination is not integrity-protected against an attacker who
already has script execution on the workspace origin. Given the above,
hardening the port source alone buys little.

### F6 — No per-connection call ownership — **Medium — not fixed**

`Softphone.answer`/`hangup` look calls up in the process-global SDK call store
by id, so any connected client can answer or hang up any of the operator's
calls. The set of clients that can reach those commands is now much smaller —
they must connect from the paired origin and complete an accepted hello — which
is why this is left as is;
a proper fix scopes calls to the connection that owns the session and is worth
doing if the protocol ever grows more commands.

### F7 — `state` broadcast leaks the operator's extension — **Medium — not fixed (narrowed)**

`broadcastState` sends `extension`, `platform`, `appVersion` and `lastError` to
every socket that completed a hello. The SIP extension is a stable corporate
identifier, and until pairing landed any drive-by page could collect it.

**Narrowed** — only the paired origin can connect now, and only a connection
whose hello was accepted receives broadcasts. The payload itself is unchanged,
so a paired workspace still receives more than it uses: the workspace renders
none of it, and `getLastState()` has no call sites at all.

### F8 — `asar: false` plus permissive entitlements — **Medium — not fixed (packaging decision)**

`package.json` sets `"asar": false`, and `build/entitlements.mac.plist` grants
`disable-library-validation` and `allow-unsigned-executable-memory` (both
genuinely needed by the unsigned `.node` prebuild). Together with the app's
already-granted microphone consent, anyone who can write into the installed
bundle gets code execution under the notarised identity — a clean persistence
and covert-audio primitive. `nsis.allowToChangeInstallationDirectory: true`
lets a Windows install be redirected out of admin-only Program Files.

Recommended: enable `asar` (the addon can stay unpacked via `asarUnpack`), and
drop `allowToChangeInstallationDirectory` so `perMachine` actually implies an
admin-only location.

### F9 — Windows and Linux artifacts unsigned; no update path — **Medium — not fixed (release decision)**

`.github/workflows/build-electron-softphone-companion.yml` signs and notarises
only the macOS job (`CSC_LINK`, `APPLE_*`); the NSIS installer, the Windows zip
and the Linux AppImage ship unsigned. There is also no auto-update mechanism at
all — no `electron-updater`, no `build.publish` — though electron-builder's
`latest*.yml` metadata is uploaded as an artifact.

For a component that parses SIP/SDP/RTP off the network in C++, "no patch
delivery path" is the more serious half. Recommended: sign the Windows
artifacts, and add an HTTPS update feed with signature verification before this
is deployed widely.

### F13 — pjsip logs SIP digest material regardless of `debug` — **Low — not fixed (addon change)**

`packages/electron-sip/sip_client.cpp` hardcodes `ep_cfg.logConfig.level = 5`,
which dumps full SIP messages — including `Authorization: Digest … response=` —
to stdout. The companion's own `debug` flag does not control it, and
`logger.ts` does not capture it, so it lands wherever stdout goes. Fixing it
means changing the addon and republishing prebuilds; worth doing on the next
addon release. Setting `config.debug: true` additionally puts the SDK in
verbose mode, whose socket frames include the bearer token — treat debug logs
as credential material.

Worth doing in the same pass: escape the destination where the addon builds the
SIP URI (`sip_account.cpp`, `makeCall("sip:" + destination + "@" + ...)`). The
protocol now rejects anything outside `[0-9A-Za-z+*#._-]` before it gets there,
so this is defence in depth rather than an open hole.

### F14 — Dependency and supply-chain notes — **Info — not fixed**

- `axios` is a direct dependency of this package but is never imported from
  `src/` — dead surface, remove it.
- `electron-vite` is pinned to `6.0.0-beta.1` in the build path of a signed,
  notarised, microphone-capable artifact. Pin a stable release.
- `packages/electron-sip/prebuilds/**` are binary blobs committed to the repo,
  and `build/ensureElectronSipPrebuild.js` checks only that a `.node` file
  exists — no checksum, no signature. Anyone who can push to that directory
  ships native code to every operator.
- `electron@43.2.0` and `ws@8.21.1` are current (the latter past
  CVE-2024-37890); no EOL major in the tree.

## Residual risk from the landed hardening

The fixes in the introducing change close the exploitable paths; two gaps in
them are worth carrying forward rather than forgetting.

**Trust on first use.** The workspace endpoint is pinned the first time one
authenticates successfully. On a fresh install, before the operator has ever
logged in, an attacker who wins that race pins *themselves* — and from then on
the legitimate workspace is the one refused. Deployments that care should ship
an explicit `endpointAllowlist` rather than relying on first use.

**`Origin` is forgeable.** Once paired, only the paired workspace's origin may
connect, which keeps other *websites* off the control channel. It is no defence
against a local process, which simply sends whatever `Origin` header it likes,
or none at all. Only F3 addresses that.

## Structurally clean

Verified absent across the package, so future reviews need not re-derive it:

- no `BrowserWindow`, `webPreferences`, preload script, `contextBridge`,
  `ipcMain`/`ipcRenderer`, or `webContents` — the whole class of Electron
  renderer and preload vulnerabilities does not apply;
- no `loadURL`/`loadFile`, no `will-navigate`/`setWindowOpenHandler`, no
  `shell.openExternal` (the two `shell` calls are tray items with constant
  `userData` paths);
- no `child_process`/`exec`/`spawn`, no `eval`/`new Function`, no DOM sinks;
- no `app.commandLine` switches, no `--inspect`/`--remote-debugging-port`, no
  unconditional devtools, no `setCertificateVerifyProc`;
- no custom protocol handler or deep link, so no `argv`-injection surface;
- the WS server binds `127.0.0.1` only, never `0.0.0.0`;
- tokens and SIP credentials are held in memory only, never written to
  `config.json`, and no credential is passed to `logger.*` (which serialises
  whatever it is given — keep it that way);
- `config.dev.json` is gitignored and `devConfig()` returns `null` when
  `app.isPackaged`.

## Follow-up

| | |
|---|---|
| Blocking wide rollout | F3 (route 1 or 2), F9 (signing + update path) |
| Next packaging change | F8 |
| Next `electron-sip` release | F13 |
| Housekeeping | F6, F7, F14 |

F3 route 2 (pairing secret + mutual challenge) is the only one that needs no
backend work, so it is the cheapest way to unblock a wide rollout if route 1 is
not scheduled.

**Adjacent, not audited.** `packages/electron-workspace` — explicitly out of
this review's scope — loads a remote URL into a `BrowserWindow` configured with
`contextIsolation: false`, `nodeIntegration: true` and `enableRemoteModule:
true`, with a preload that assigns `window.ipcRenderer = ipcRenderer`. Whatever
the workspace origin serves therefore runs with full Node access in the
renderer. Noted here only so it is not lost; it deserves its own review.
