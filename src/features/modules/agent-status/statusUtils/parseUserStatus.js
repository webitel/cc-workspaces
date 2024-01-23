import UserStatus from './UserStatus';

const parseUserStatus = (presence) => ({
  [UserStatus.DND]: presence?.includes('dnd'),
  [UserStatus.BUSY]: presence?.includes('dlg'),
  [UserStatus.SIP]: presence?.includes('sip'),
  [UserStatus.WEB]: presence?.includes('web'),
});

export default parseUserStatus;
