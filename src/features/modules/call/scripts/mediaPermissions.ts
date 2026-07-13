async function isMediaAllowed(
	constraints: MediaStreamConstraints,
): Promise<boolean> {
	try {
		const stream = await navigator.mediaDevices.getUserMedia(constraints);
		stream.getTracks().forEach((track) => {
			track.stop();
		});
		return true;
	} catch {
		return false;
	}
}

export function isMicrophoneAllowed() {
	return isMediaAllowed({
		audio: true,
	});
}

export function isCameraAllowed() {
	return isMediaAllowed({
		video: true,
	});
}
