import { watch, type Ref } from 'vue';
import { Permission, PermissionMessage } from '../types/permissions.types';

type PermissionPayload = {
  status: boolean;
  message?: PermissionMessage;
};

type SetPermissionArgs = {
  target: Ref<Permission>;
  payload: PermissionPayload;
};

type MediaPermissionPayload = {
  state: PermissionState;
  hasDevices: boolean;
};

type ApplyMediaPermissionArgs = {
  target: Ref<Permission>;
  payload: MediaPermissionPayload;
};

type SetupMediaPermissionWatchArgs = {
  permissionState: Ref<PermissionState | undefined>;
  permissionGranted: Ref<boolean>;
  devices: Ref<MediaDeviceInfo[]>;
  target: Ref<Permission>;
  withToggle?: boolean;
};

type ApplyNotificationPermissionArgs = {
  target: Ref<Permission>;
  state: NotificationPermission | null | undefined;
};

type ApplyToggleStateArgs = {
  target: Ref<Permission>;
  enabled: boolean;
};

export function usePermissionDevice() {
  const setPermission = ({ target, payload }: SetPermissionArgs): void => {
    target.value.status = payload.status;
    target.value.message = payload.message ?? PermissionMessage.None;
  };

  const applyMediaPermissionState = ({
     target,
     payload,
   }: ApplyMediaPermissionArgs): void => {
    const { state, hasDevices } = payload;

    const isGranted = state === 'granted';
    const isDenied = state === 'denied';

    let message: PermissionMessage | undefined;

    if (isDenied) {
      message = PermissionMessage.Denied;
    } else if (isGranted && !hasDevices) {
      message = PermissionMessage.NotFound;
    }

    const status = isGranted && hasDevices;

    setPermission({
      target,
      payload: { status, message },
    });
  };

const setupMediaPermissionWatch = ({
 permissionState,
 permissionGranted,
 devices,
 target,
 withToggle = false,
}: SetupMediaPermissionWatchArgs): void => {
    watch(
      [permissionState, permissionGranted, devices],
      ([state, granted, inputs]) => {
        if (!state) return;

        const hasDevices = granted || inputs.length > 0;

        if (withToggle) {
          const isKnownState = state === 'granted' || state === 'denied';
          target.value.enabled = isKnownState;
          target.value.disabled = !target.value.enabled;
        }

        applyMediaPermissionState({
          target,
          payload: { state, hasDevices },
        });
      },
      { immediate: true },
    );
  };

  const applyNotificationPermissionState = ({
    target,
    state,
  }: ApplyNotificationPermissionArgs): void => {
    if (state === 'denied') {
      setPermission({
        target,
        payload: { status: false, message: PermissionMessage.Denied },
      });
      return;
    }

    setPermission({ target, payload: { status: state === 'granted' }});
  };

  const applyToggleState = ({ target, enabled }: ApplyToggleStateArgs): void => {
    target.value.enabled = enabled;
    target.value.disabled = !enabled;
  };


  return {
    setupMediaPermissionWatch,
    setPermission,
    applyMediaPermissionState,
    applyNotificationPermissionState,
    applyToggleState
  };
}
