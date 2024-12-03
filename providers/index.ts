import { OfframpProvider } from '@/types/provider'
import { kotaniPayProvider } from './kotaniPay'
import { rampNetworkProvider } from './rampNetwork'

const providers: OfframpProvider[] = [
  kotaniPayProvider,
  rampNetworkProvider,
]

export function getProviders(): OfframpProvider[] {
  return providers
}

export function getProviderById(id: string): OfframpProvider | undefined {
  return providers.find(provider => provider.id === id)
}

