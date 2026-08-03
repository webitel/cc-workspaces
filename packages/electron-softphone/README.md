# Webitel Softphone (companion utility)

Tray-only Electron app that acts as the operator's **native SIP endpoint**
(pjsip over UDP via the `electron-sip` addon) while the **web workspace stays
the call-control UI**. Unlike `packages/electron-workspace`, it does not wrap
the web app — the browser keeps its own websocket for call state and control;
only the operations that require a local SIP device go through this utility.

## How it works

```
┌─ Browser ──────────────────┐         ┌─ Webitel Softphone ───────────────┐
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

## Enabling in the web workspace

In the workspace's `config.json` (or any layer of its config merge):

```json
{
	"CLI": {
		"externalSoftphone": {
			"enabled": true,
			"port": 10029
		}
	}
}
```

With the flag on, the browser skips the microphone probe, never registers the
web SIP device, and probes `ws://127.0.0.1:<port>` with backoff until the
utility appears. The answer button lights up only while the utility reports
`sipRegistered: true` (existing `isPhoneReg` flow).

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
| `originAllowlist` | `[]` | non-empty restricts allowed web origins; the hello token is always validated against the backend regardless |
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
