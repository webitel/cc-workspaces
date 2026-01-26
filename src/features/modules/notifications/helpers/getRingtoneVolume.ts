import { RingtoneType } from '@webitel/ui-sdk/enums';

export function getRingtoneVolume(type: RingtoneType) {
  try {
    const savedVolumeStr = localStorage.getItem('settings/ringtone-volume');
    if (!savedVolumeStr) {
      return 1.0;
    }

    const savedVolumes = JSON.parse(savedVolumeStr);

    // Return the specific type volume, or fallback to 1.0
    return savedVolumes[type] ?? 1.0;
  } catch {
    // If parsing fails, try to get old single value format for backward compatibility
    const oldVolume = parseFloat(localStorage.getItem('settings/ringtone-volume'));
    return isNaN(oldVolume) ? 1.0 : oldVolume;
  }
}
