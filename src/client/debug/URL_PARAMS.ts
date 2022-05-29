const params = new URLSearchParams(window.location.search);

export const __VERBOSE__ = !! params.get('verbose');
export const __FLOOR__ = Number(params.get('floor') || 1);
