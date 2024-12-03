import { ReactNode } from 'react'

export interface OfframpProvider {
  id: string
  name: string
  icon: string
  supportedChains: number[]
  supportedTokens: string[]
  FormComponent: React.ComponentType<OfframpFormProps>
}

export interface OfframpFormProps {
  onSubmit: (data: any) => void
}

export interface ProviderFormData {
  [key: string]: any
}

