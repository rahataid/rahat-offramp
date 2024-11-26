export interface ServiceProvider {
  uuid: string;
  name: string;
  logo: string;
  description: string;
  extras: {
    fee: number;
    supportedCurrency: string[];
  };
}

export interface OfframpRequest {
  id?: string;
  providerUuid: string;
  chain: string;
  token: string;
  amount: number;
  senderAddress: string;
}

export interface ProviderAction {
  uuid: string;
  action: string;
  payload?: any;
}

export interface TransactionDetails extends OfframpRequest {
  requestUuid?: string;
}

export interface PaymentFormProps {
  onSubmit: (details: TransactionDetails) => void;
  onBack: () => void;
  onCancel: () => void;
  provider: ServiceProvider;
  providerName: string;
  providerUuid: string;
}

export interface QRDisplayProps {
  transactionDetails: TransactionDetails;
  onComplete: () => void;
  onBack: () => void;
  onCancel: () => void;
  provider: ServiceProvider;
}
