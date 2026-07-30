import { EventEmitter } from 'ee-ts';
import type {
	Answer,
	AudioProcessingConfig,
	CallSession,
	Outbound,
	SipClient,
	SipClientEvents,
	SipConfiguration,
} from 'webitel-sdk';

export type SendCommand = (
	type: string,
	payload?: Record<string, unknown>,
) => void;

export type FindCallIdBySession = (session: CallSession) => string | null;

/**
 * Stub session in the ExternalClient pattern (webitel_sdk/src/sip/external):
 * it exists so Call.answer()/allowAnswer work, but the actual 200 OK is sent
 * by the softphone utility. The owning call id is resolved at answer time
 * because the SDK may create sessions via sipSessionBySipId (sip_id), not
 * only via sipSessionByCallId (call id).
 */
class RemoteSession implements CallSession {
	callId: string;
	incoming = false;
	instanceId = 'external';

	constructor(
		private readonly phone: RemotePhone,
		id: string,
	) {
		this.callId = id;
	}

	get id(): string {
		return this.callId;
	}

	getLocalMedia(): MediaStream[] {
		return [];
	}

	getPeerMedia(): MediaStream[] {
		return [];
	}

	answer(_params: object): Promise<Error> {
		return new Promise<Error>((resolve) => {
			this.phone.answerSession(this);
			// mirrors ExternalClient's session: resolves with no error
			resolve(undefined as unknown as Error);
		});
	}
}

/**
 * SipClient implementation that proxies answer/call to the local softphone
 * utility over its loopback WebSocket. All other call control stays on the
 * web app's own webitel socket. Attach with `cli.phone = remotePhone;
 * cli.subscribePhone(remotePhone)` — NOT registerCallClient(), which would
 * fetch SIP credentials into the browser.
 */
export class RemotePhone
	extends EventEmitter<SipClientEvents>
	implements SipClient
{
	readonly type = 'external';
	#send: SendCommand;
	#findCallIdBySession: FindCallIdBySession;
	#registered = false;

	constructor(send: SendCommand, findCallIdBySession: FindCallIdBySession) {
		super();
		this.#send = send;
		this.#findCallIdBySession = findCallIdBySession;
	}

	async callOption(req: Answer): Promise<object | Error> {
		return req;
	}

	async register(_sipConf: SipConfiguration): Promise<Error | undefined> {
		return;
	}

	async unregister(): Promise<undefined | Error> {
		return;
	}

	async call(req: Outbound): Promise<undefined | Error> {
		if (!req.destination) return;
		this.#send('call', {
			destination: req.destination,
			params: req.params,
		});
	}

	answerSession(session: RemoteSession): void {
		const callId = this.#findCallIdBySession(session) ?? session.callId;
		this.#send('answer', {
			callId,
		});
	}

	isRegistered(): boolean {
		return this.#registered;
	}

	/** Driven by `state` messages from the utility; emitting registered /
	 * unregistered lets subscribePhone() feed the existing phone_registered →
	 * isPhoneReg store flow untouched. */
	setRegistered(registered: boolean): void {
		if (this.#registered === registered) return;
		this.#registered = registered;
		registered ? this.emit('registered') : this.emit('unregistered');
	}

	setAudioProcessing(_processing: AudioProcessingConfig): void {}

	sipSessionByCallId(id: string): CallSession | null {
		return new RemoteSession(this, id);
	}

	sipSessionBySipId(id: string): CallSession | null {
		return new RemoteSession(this, id);
	}
}
