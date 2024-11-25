import { ReactNode } from 'react'

export interface ServiceProvider {
  id: string
  name: string
  logo: string
  description: string
  PaymentFormComponent: React.ComponentType<PaymentFormProps>
  QRDisplayComponent: React.ComponentType<QRDisplayProps>
}

export interface PaymentFormProps {
  onSubmit: (details: TransactionDetails) => void
}

export interface QRDisplayProps {
  transactionDetails: TransactionDetails
  onComplete: () => void
}

export interface TransactionDetails {
  provider: string
  amount: number
  currency: string
  walletAddress: string
  [key: string]: any // Allow for additional custom fields
}

