import prependHttp from 'prepend-http';
import isElectron from 'is-electron';

const openLinkFromVariable = (task) => {
  if (!task.variables?.link) return false;
  if (isElectron()) return false;
  return window.open(prependHttp(task.variables.link), '_blank');
};

export default openLinkFromVariable;
