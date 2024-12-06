import { watchPendingTransactions } from "wagmi/core";

export const useWatchPendingTransaction = () => {
  const unwatch = watchPendingTransactions;
};
