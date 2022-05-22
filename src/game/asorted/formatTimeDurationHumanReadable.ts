import prettyMilliseconds from "pretty-ms";

export function formatTimeDurationHumanReadable(seconds: number) {
  if (isNaN(seconds)) return "--";
  if (!isFinite(seconds)) return "--";

  const milliseconds = seconds * 1000;
  if (milliseconds < 3600_000) {
    return prettyMilliseconds(milliseconds, { compact: true });
  } else {
    return prettyMilliseconds(milliseconds, {
      keepDecimalsOnWholeSeconds: true,
      unitCount: 2,
    });
  }
}
