import UserStatus from './UserStatus';

export const parseUserStatus = (presence) => ({
  [UserStatus.DND]: presence?.status?.includes('dnd'),
  [UserStatus.BUSY]: presence?.status?.includes('dlg'),
  [UserStatus.WEB]: presence?.status?.includes('sip'),
  [UserStatus.WEB]: presence?.status?.includes('web'),
});

export const parseUserPresence = (item) => ({
  [UserStatus.DND]: item?.presence?.includes('dnd'),
  [UserStatus.BUSY]: item?.presence?.includes('dlg'),
  [UserStatus.SIP]: item?.presence?.includes('sip'),
  [UserStatus.WEB]: item?.presence?.includes('web'),
});
