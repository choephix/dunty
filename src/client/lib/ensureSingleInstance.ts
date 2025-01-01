const __window__ = window as any;

export function ensureSingleInstance() {
  if (__window__.__DUNTY_INITIALIZED__) {
    throw new Error(`An instance of the game already exists.`);
  }

  __window__.__DUNTY_INITIALIZED__ = true;
}
