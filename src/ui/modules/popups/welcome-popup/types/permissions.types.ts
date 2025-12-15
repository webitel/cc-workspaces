export enum PermissionId {
  Mic = 'mic',
  Notifications = 'notifications',
  Camera = 'camera',
}

export enum PermissionMessage {
  None = '',
  Denied = 'denied',
  NotFound = 'notFound',
}

export type Permission = {
  id: PermissionId;
  status: boolean;
  message: PermissionMessage;
  icon: string;
  disabled?: boolean;
  toggle?: boolean;
  enabled?: boolean;
  handleToggle?: (value: boolean) => void | Promise<void>;
};
