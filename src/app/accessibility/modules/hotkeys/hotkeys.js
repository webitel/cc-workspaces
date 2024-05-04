class HotkeyManager {
  constructor() {
    this.hotkeys = {};
    this.init();
  }

  init() {
    document.addEventListener('keydown', (event) => {
      const key = event.key.toLowerCase();
      const modifiers = [];  

      if (event.ctrlKey) modifiers.push('ctrl');
      if (event.shiftKey) modifiers.push('shift');
      if (event.altKey) modifiers.push('alt');
      if (event.metaKey) modifiers.push('meta');
      
      const modifierString = modifiers.join('+');
      const combination = `${modifierString}+${key}`;

      if (this.hotkeys[combination]) {
        event.preventDefault();
        this.hotkeys[combination]();
      } else if (this.hotkeys[key]) {
        event.preventDefault();
        this.hotkeys[key]();
      }
    });
  }

  static addHotkey(combination, callback) {
    combination = combination.toLowerCase();
    this.hotkeys[combination] = callback;
  }

  static removeHotkey(combination) {
    combination = combination.toLowerCase();
    delete this.hotkeys[combination];
  }
};

export default HotkeyManager