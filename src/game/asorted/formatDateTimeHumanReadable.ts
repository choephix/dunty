const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});
export function formatDateTimeHumanReadable(datetime: Date | number) {
  return dateTimeFormatter.format(datetime);
}

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
export function formatShortDateHumanReadable(datetime: Date | number) {
  return shortDateFormatter.format(datetime);
}
