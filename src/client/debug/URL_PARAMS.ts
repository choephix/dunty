const params = new URLSearchParams(window.location.search);

export const __VERBOSE__ = !! params.get('verbose');
export const __FLOOR__ = Number(params.get('floor') || Number(/\/(\d+)/ig.exec(location.pathname)?.[1]) || 1);
