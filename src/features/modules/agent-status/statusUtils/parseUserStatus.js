import UserStatus from './UserStatus';

const parseUserStatus = (presence) => ({
  [UserStatus.DND]: presence?.status?.includes('dnd'),
  [UserStatus.BUSY]: presence?.status?.includes('dlg'),
  [UserStatus.SIP]: presence?.status?.includes('sip'),
  [UserStatus.WEB]: presence?.status?.includes('sip'),
});

export default parseUserStatus;
