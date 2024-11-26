import { z } from "zod";

export const transactionSchema = z.object({
  provider: z.string().min(1, "Provider is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  currency: z.string().min(1, "Currency is required"),
  walletAddress: z.string().min(1, "Wallet address is required"),
});

export const kotaniPaySchema = transactionSchema.extend({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

export const transakSchema = transactionSchema.extend({
  // Add any Transak-specific fields here
});

export const unlimitSchema = transactionSchema.extend({
  accountNumber: z.string().min(1, "Account number is required"),
  bankDetails: z.string().min(1, "Bank details are required"),
});

export type TransactionDetails = z.infer<typeof transactionSchema>;
export type KotaniPayDetails = z.infer<typeof kotaniPaySchema>;
export type TransakDetails = z.infer<typeof transakSchema>;
export type UnlimitDetails = z.infer<typeof unlimitSchema>;
