"use client";
import { OfframpLayout } from "@/components/offramp-layout";
import { Card, CardContent } from "@/components/ui/card";
import { useListOfframpProviders } from "@/lib/offramp";
import Link from "next/link";

export default function ProvidersPage() {
  const providers = useListOfframpProviders();

  if (providers.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <OfframpLayout>
      <div className='grid gap-6'>
        <div className='text-center'>
          <h2 className='text-2xl font-light mb-2'>Select Offramp Provider</h2>
          <p className='text-muted-foreground'>
            Choose your preferred way to cash out crypto
          </p>
        </div>
        <div className='grid gap-4'>
          {providers.data.map((provider) => (
            <Link
              key={provider.id}
              href={`/network?provider=${provider.slug}&providerName=${provider?.name}&providerUuid=${provider.uuid}`}>
              <Card className='hover:bg-muted/50 transition-colors'>
                <CardContent className='flex items-center gap-4 p-6'>
                  {/* <Image
                    src={provider.icon}
                    alt={provider.name}
                    width={40}
                    height={40}
                    className='rounded-lg'
                  /> */}
                  <div>
                    <h3 className='font-medium'>{provider.name}</h3>
                    <p className='text-sm text-muted-foreground'>
                      {provider.description} <br />
                      Supports {provider.extras?.supportedCurrency.join(
                        ", "
                      )}{" "}
                      on {provider.extras?.supportedCurrency.length} chains
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </OfframpLayout>
  );
}
