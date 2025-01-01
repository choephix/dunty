const params = new URLSearchParams(window.location.search);

export const launcherKey = params.get("launch") as string | null;
