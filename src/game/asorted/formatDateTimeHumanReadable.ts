const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});
export function formatDateTimeHumanReadable(datetime: Date | number) {
  return dateTimeFormatter.format(datetime);
}
