import { ReactNode } from 'react'
import { TransactionDetails, KotaniPayDetails, TransakDetails, UnlimitDetails } from '@/lib/schemas'

export interface ServiceProvider {
  id: number;
  uuid: string;
  name: string;
  logo: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  extras: {
    fee: number;
    supportedCurrency: string[];
  };
}

export interface PaymentFormProps {
  onSubmit: (details: TransactionDetails) => void;
  onBack: () => void;
  onCancel: () => void;
  supportedCurrencies: string[];
}

export interface QRDisplayProps {
  transactionDetails: TransactionDetails;
  onComplete: () => void;
  onBack: () => void;
  onCancel: () => void;
}

export type { TransactionDetails, KotaniPayDetails, TransakDetails, UnlimitDetails }

