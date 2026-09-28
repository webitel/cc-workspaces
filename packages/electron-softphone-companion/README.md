# Webitel Softphone Companion

Tray-only Electron app that acts as the operator's **native SIP endpoint**
(pjsip over UDP via the `electron-sip` addon) while the **web workspace stays
the call-control UI**. Unlike `packages/electron-workspace`, it does not wrap
the web app — the browser keeps its own websocket for call state and control;
only the operations that require a local SIP device go through this utility.

## How it works

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

- `answer` is the only call operation with no websocket action — the ringing
  SIP device itself must send the 200 OK. The web app forwards `answer` (and,
  by preference, outbound `call`) to this utility over a loopback WebSocket;
  everything else is unchanged websocket call control.
- The web app hands its access token over on connect (`hello`); the utility
  opens its own webitel socket with it (`application_name=softphone`), fetches
  SIP credentials via `user_default_device { name: 'sip' }` and registers.
  Tokens are kept in memory only.
- Audio is routed natively by pjsip to the OS default input/output devices.

## Detection in the web workspace

**Auto by default**: at every client creation (login, reload, reconnect) the
workspace probes `ws://127.0.0.1:<port>`. A running utility answers within
milliseconds → the browser switches to external mode (skips the microphone
probe, never registers the web SIP device, reuses the probe socket). No
utility → instant connection-refused → the usual web phone. Start the utility
and reload the page to switch modes.

`CONFIG.CLI.externalSoftphone` (workspace `config.json` or any layer of its
config merge) refines this:

```json
{
	"CLI": {
		"externalSoftphone": {
			"port": 10029,
			"enabled": true
		}
	}
}
```

- `enabled` absent → **auto** (probe, default)
- `enabled: true` → **forced**: always external, never a web device; the
  manager keeps probing for the utility with backoff
- `enabled: false` → **disabled**: never probe, always the web phone

In every external mode the answer button lights up only while the utility
reports `sipRegistered: true` (existing `isPhoneReg` flow). In Safari the
probe is blocked (mixed content) and auto mode falls back to the web phone.

## Pairing

The local WebSocket is the utility's whole trust boundary, and it is reachable
by anything running on the machine — WebSocket connections are not subject to
the same-origin policy, so any page in any tab can open one too. A `hello`
names the backend this utility authenticates against and pulls SIP credentials
from, so an unconstrained one would be enough to re-point the operator's SIP
device at someone else's server.

So the first endpoint that authenticates successfully is **pinned**: it is
written to `pairedWorkspace` in `config.json` together with the browser origin
it arrived from, and after that

- a `hello` naming a different endpoint is refused with `endpoint_not_allowed`
  and the connection is closed;
- connections from a different origin are refused with `origin_not_allowed`.

Tray → **Unpair workspace** clears the pairing and suspends the session; the
next workspace to connect becomes the paired one. Deployments that prefer not
to rely on first-use can set `endpointAllowlist` (and/or `originAllowlist`)
explicitly instead — a non-empty list always wins over the pin.

Note that pairing does not authenticate the *browser* to the utility, nor the
utility to the browser: the workspace still hands its access token to whatever
answers the loopback port. See `docs/security-review-2026-09.md`.

## Admin prerequisites

- The user must have a **SIP device provisioned** in Webitel so that
  `user_default_device { name: 'sip' }` returns credentials
  (`extension/auth/password/domain/proxy`). Otherwise the tray shows
  `register_failed`.
- Disable the user's *webrtc* phone setting so other browsers/hosts don't also
  register a web device for the same extension.

## Configuration (utility)

`config.json` in the Electron `userData` dir (created on first run):

| key | default | meaning |
|---|---|---|
| `port` | `10029` | loopback WebSocket port |
| `originAllowlist` | `[]` | non-empty restricts allowed web origins; when empty the allowed origin comes from `pairedWorkspace` instead (see [Pairing](#pairing)) |
| `endpointAllowlist` | `[]` | non-empty restricts which webitel endpoints a `hello` may point this utility at; when empty the endpoint is pinned on first use |
| `pairedWorkspace` | `null` | `{ endpoint, origin }`, written on the first successful pairing; clear it from the tray to move to another workspace |
| `sipRegisterSec` | `90` | SIP registration expiry |
| `codecs` | opus, G722, PCMA, PCMU | codec priority list |
| `nat` | `""` | pjsip NAT mode; `auto` enables STUN+ICE |
| `debug` | `false` | verbose SDK + pjsip logging |
| `workspaceLingerSec` | `30` | after the last workspace connection drops, the session (SIP registration + SDK socket) is suspended once this window passes with no reconnect and no active call; a page reload reconnects well within it |

Logs: `userData/logs/softphone.log` (also "Open logs" in the tray menu).

## Local WS protocol (v1)

JSON frames, envelope `{ v: 1, seq?, type, ... }`. First message must be
`hello`, otherwise the socket closes with 4001. Commands are acked with
`{ type: 'ack', seq, ok, error? }`.

A connection gets command rights only once its `hello` is **accepted**: a
refused one is acked with the reason and the socket is closed (4002
`hello_failed`, or 4003 `origin_not_allowed` at connect time, or 4008
`too_many_hellos`). `endpoint` must be a `wss:` URL — `ws:` is accepted only
towards a loopback host, for dev proxies — and `call.destination` must match
`[0-9A-Za-z+*#._-]{1,128}`, because it is concatenated into a SIP URI by the
native addon. Frames are capped at 64 KiB.

| dir | type | payload |
|---|---|---|
| web → utility | `hello` | `{ token, endpoint, protocolVersion }` |
| web → utility | `token` | `{ token }` (refresh, used on next reconnect) |
| web → utility | `answer` | `{ callId }` |
| web → utility | `call` | `{ destination, params? }` |
| web → utility | `hangup` | `{ callId }` (fallback; web normally hangs up via its own socket) |
| web → utility | `ping` | `{}` |
| utility → web | `state` | `{ state, sdkConnected, sipRegistered, extension, appVersion, protocolVersion, platform, lastError? }` |
| utility → web | `ack` / `pong` | |

## Development

```bash
# one-time: the linked native addon carries its own deps
(cd ../electron-sip && npm ci)
npm install
cp config.dev.example.json config.dev.json   # endpoint + token for standalone runs
npm run dev
```

With `config.dev.json` present (non-packaged runs only), the utility starts a
session immediately without waiting for a web workspace `hello` — useful for
testing SIP registration and inbound calls in isolation.

## Known limitations

- **Safari** blocks `ws://127.0.0.1` from https pages (mixed content); use
  Chrome/Edge/Firefox for external softphone mode.
- Audio only: the pjsip addon has no video path; the web app forces
  `video: false` in this mode. Audio meters / local recording UI that depend
  on browser `MediaStream`s stay inert (server-side recording is unaffected).
- The addon uses UDP transport only, a hardcoded DNS resolver (8.8.8.8), the
  OS default audio devices, and `maxCalls = 5`.
- One utility instance per machine (single-instance lock + fixed loopback
  port); multi-session terminal servers are unsupported.
- If the web tab closes mid-call, the call keeps running on the device;
  reopening the workspace restores it. Hanging up from the tray is not yet
  implemented.

## Packaging

`npm run dist` / `distl` / `distm` (electron-builder, `asar: false` because of
the native addon; mac builds are hardened+notarized and declare
`NSMicrophoneUsageDescription`). CI: `.github/workflows/build-electron-softphone.yml`
(manual trigger), which expects committed `electron-sip` prebuilds like the
electron-workspace build.
