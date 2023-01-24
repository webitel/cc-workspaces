import debounce from '@webitel/ui-sdk/src/scripts/debounce';
import Vue from 'vue';

// https://stackoverflow.com/questions/41791193/vuejs-reactive-binding-for-a-plugin-how-to/41801107#41801107
// https://stackoverflow.com/questions/50111231/vue-prototype-not-reactive-when-data-changes

// https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/services/breakpoint/index.ts

const breakpoint = {
  // Breakpoints
  xs: false,
  sm: false,
  md: false,
  lg: false,
  xl: false,

  // Conditionals
  xsOnly: false,
  smOnly: false,
  smAndDown: false,
  smAndUp: false,
  mdOnly: false,
  mdAndDown: false,
  mdAndUp: false,
  lgOnly: false,
  lgAndDown: false,
  lgAndUp: false,
  xlOnly: false,

  // true if screen width < mobileBreakpoint
  mobile: true,

  // Current breakpoint name (e.g. 'md')
  name: 'xs',
  // Dimensions
  height: 0,
  width: 0,
};

const getClientWidth = () => Math.max(
  document.documentElement.clientWidth,
  window.innerWidth || 0,
);

const getClientHeight = () => Math.max(
  document.documentElement.clientHeight,
  window.innerHeight || 0,
);

const thresholds = {
  xs: 600,
  sm: 960,
  md: 1280,
  lg: 1920,
};
const mobileBreakpoint = 'sm';
const scrollBarWidth = 16;

const onResize = () => {
  const height = getClientHeight();
  const width = getClientWidth();

  const xs = width < thresholds.xs;
  const sm = width < thresholds.sm && !xs;
  const md = width < (thresholds.md - scrollBarWidth) && !(sm || xs);
  const lg = width < (thresholds.lg - scrollBarWidth) && !(md || sm || xs);
  const xl = width >= (thresholds.lg - scrollBarWidth);

  breakpoint.height = height;
  breakpoint.width = width;

  breakpoint.xs = xs;
  breakpoint.sm = sm;
  breakpoint.md = md;
  breakpoint.lg = lg;
  breakpoint.xl = xl;

  breakpoint.xsOnly = xs;
  breakpoint.smOnly = sm;
  breakpoint.smAndDown = (xs || sm) && !(md || lg || xl);
  breakpoint.smAndUp = !xs && (sm || md || lg || xl);
  breakpoint.mdOnly = md;
  breakpoint.mdAndDown = (xs || sm || md) && !(lg || xl);
  breakpoint.mdAndUp = !(xs || sm) && (md || lg || xl);
  breakpoint.lgOnly = lg;
  breakpoint.lgAndDown = (xs || sm || md || lg) && !xl;
  breakpoint.lgAndUp = !(xs || sm || md) && (lg || xl);
  breakpoint.xlOnly = xl;

  switch (true) {
    case (xs):
      breakpoint.name = 'xs';
      break;
    case (sm):
      breakpoint.name = 'sm';
      break;
    case (md):
      breakpoint.name = 'md';
      break;
    case (lg):
      breakpoint.name = 'lg';
      break;
    default:
      breakpoint.name = 'xl';
      break;
  }

  if (typeof mobileBreakpoint === 'number') {
    breakpoint.mobile = width < parseInt(mobileBreakpoint, 10);

    return;
  }

  const breakpoints = {
    xs: 0,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
  };

  const current = breakpoints[breakpoint.name];
  const max = breakpoints[mobileBreakpoint];

  breakpoint.mobile = current <= max;
};

window.addEventListener('resize', debounce(onResize), { passive: true });

onResize();

Vue.prototype.$breakpoint = Vue.observable(breakpoint);
