export interface Chain {
  id: number
  name: string
  icon: string
}

export interface Token {
  address: string
  symbol: string
  decimals: number
  chainId: number
  icon: string
}

export interface OfframpProvider {
  id: string
  name: string
  icon: string
  supportedChains: number[]
  supportedTokens: string[]
}

export interface OfframpDetails {
  amount: string
  recipientName: string
  recipientPhone: string
  recipientEmail: string
  bankDetails: {
    accountNumber: string
    bankName: string
    swiftCode?: string
  }
}

