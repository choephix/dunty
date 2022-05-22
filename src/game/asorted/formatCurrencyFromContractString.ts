import { FontIcon } from "@game/constants/FontIcon";
import { formatToMaxDecimals } from "@sdk-ui/utils/formatToMaxDecimals";

export function formatCurrencyFromContractString(contractString: string) {
  const [amount, currency] = contractString.split(" ");

  const icon = { TOCIUM: FontIcon.Tocium }[currency] || "";

  return `${icon}${formatToMaxDecimals(amount, 4, true)}`;
}
