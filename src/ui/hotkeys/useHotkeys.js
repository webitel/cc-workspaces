import HotkeyAction from "./HotkeysActiom.enum";

/*
NOTE:
- Ctrl + N is reserved for browser's new tab
 */

// setup subscriber containers
const globalSub = Object.values(HotkeyAction).reduce((acc, event) => {
  acc[event] = [];
  return acc;
}, {});

// setup global listener which will be capturing events and emitting them to subscribers
const globalListener = (event) => {
  // TOGGLE_NEW_CALL
  if (event.altKey && event.code === 'KeyN') {
    globalSub[HotkeyAction.NEW_CALL].forEach((callback) => {
      callback(event);
    });
  }

  // ACCEPT NEW TASK/CALL/TASK
  else if (event.altKey && event.code === 'KeyA') {
    globalSub[HotkeyAction.ACCEPT].forEach((callback) => {
      callback(event);
    });
  }

  // END NEW TASK/CALL/TASK  (alt r is used for opening settings in chrome, but i think we can use it);
  else if (event.altKey && event.code === 'KeyE') {
    globalSub[HotkeyAction.END].forEach((callback) => {
      event.preventDefault();
      callback(event);
    });
  }

  // TRANSFER
  else if (event.altKey && event.code === 'KeyT') {
    globalSub[HotkeyAction.TRANSFER].forEach((callback) => {
      event.preventDefault();
      callback(event);
    });
  }

  // MUTE
  else if (event.altKey && event.code === 'KeyM') {
    globalSub[HotkeyAction.MUTE].forEach((callback) => {
      callback(event);
    });
  }

  // HOLD
  else if (event.altKey && event.code === 'KeyH') {
    globalSub[HotkeyAction.HOLD].forEach((callback) => {
      callback(event);
    });
  }
};

export const useHotkeys = (subscribers) => {
  return subscribers.reduce((
    unsubs,
    {
      root = window,
      event,
      userEvent = 'keydown',
      callback,
    },
  ) => {
    if (!HotkeyAction[event]) {
      throw new Error(`Unknown hotkey event: ${event}`);
    }

    globalSub[HotkeyAction[event]].push(callback);

    root.addEventListener(userEvent, globalListener);

    const unsubscribe = () => {
      globalSub[HotkeyAction[event]] = globalSub[HotkeyAction[event]].filter(cb => cb !== callback);
      root.removeEventListener(userEvent, globalListener);
    };
    return [...unsubs, unsubscribe];
  }, []);
};
