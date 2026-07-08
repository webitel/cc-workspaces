export async function isMicrophoneAllowed() {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
		});
		stream.getTracks().forEach((track) => track.stop());
		return true;
	} catch {
		return false;
	}
}

export async function isCameraAllowed() {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
		});
		stream.getTracks().forEach((track) => track.stop());
		return true;
	} catch {
		return false;
	}
}
