import { findTransactionActionTrace } from "@sdk-integration/contracts/utils/findTransactionActionTrace";
import { SignTransactionResponse } from "universal-authenticator-library";

export function digRewardAmmountFromTransactionResult(result: SignTransactionResponse) {
  const trace_Transfer = findTransactionActionTrace.byName(result.transaction, "transfer");
  const trace_TransferData = trace_Transfer?.act.data as { memo: string; quantity: string } | null;
  return trace_TransferData?.quantity || null;
}
