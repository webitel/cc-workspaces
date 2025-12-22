export interface ScreenshotFileItem {
  id: string;
  view_name: string;
}

export interface ScreenshotsOpenGalleriaPayload {
  callId: string;
  screenshotId: string;
  index: number;
}

export interface VideoCallActionOptions {
  onComplete?: () => void;
}

export type VideoCallScreenshotHandler = (
  payload: unknown,
  options?: VideoCallActionOptions,
) => Promise<void> | void;
