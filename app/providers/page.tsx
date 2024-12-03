import { Card, CardContent } from "@/components/ui/card"
import { OfframpLayout } from "@/components/offramp-layout"
import Image from "next/image"
import Link from "next/link"
import { getProviders } from "@/providers"

export default function ProvidersPage() {
  const providers = getProviders()

  return (
    <OfframpLayout>
      <div className="grid gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-light mb-2">Select Offramp Provider</h2>
          <p className="text-muted-foreground">Choose your preferred way to cash out crypto</p>
        </div>
        <div className="grid gap-4">
          {providers.map(provider => (
            <Link key={provider.id} href={`/network?provider=${provider.id}`}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardContent className="flex items-center gap-4 p-6">
                  <Image
                    src={provider.icon}
                    alt={provider.name}
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                  <div>
                    <h3 className="font-medium">{provider.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Supports {provider.supportedTokens.join(', ')} on {provider.supportedChains.length} chains
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </OfframpLayout>
  )
}

