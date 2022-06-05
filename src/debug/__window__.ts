
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export const __window__ = Object.assign(window as any as Record<string, any> & Window, {
  __MIDDLE_MOUSE_BUTTON__: false,
});
