// https://stackoverflow.com/a/57920600
const isOnPWA = () => {
  return ['fullscreen', 'standalone', 'minimal-ui'].some(
    (displayMode) => window.matchMedia('(display-mode: ' + displayMode +
      ')').matches,
  );
};

export default isOnPWA;
