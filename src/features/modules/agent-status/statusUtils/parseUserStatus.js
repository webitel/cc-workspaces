import UserStatus from './UserStatus';

const parseUserStatus = (presence) => ({
  [UserStatus.DND]: presence?.status?.includes('dnd'),
  [UserStatus.BUSY]: presence?.status?.includes('dlg'),
  [UserStatus.WEB]: presence?.status?.includes('sip'),
  [UserStatus.WEB]: presence?.status?.includes('web'),
});

export default parseUserStatus;
