import UserStatus from './UserStatus';

const parseUserStatus = (item) => ({
  [UserStatus.DND]: item?.presence?.includes('dnd'),
  [UserStatus.BUSY]: item?.presence?.includes('dlg'),
  [UserStatus.SIP]: item?.presence?.includes('sip'),
  [UserStatus.WEB]: item?.presence?.includes('web'),
});

export default parseUserStatus;
