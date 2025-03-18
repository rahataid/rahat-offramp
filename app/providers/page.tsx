"use client";

import { useState } from "react";
import { OfframpLayout } from "@/components/offramp-layout";
import { Card, CardContent } from "@/components/ui/card";
import { useListOfframpProviders } from "@/lib/offramp";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Loader2 } from "lucide-react";

export default function ProvidersPage() {
  const providers = useListOfframpProviders();
  const [hoveredProvider, setHoveredProvider] = useState<string | null>(null);

  if (providers.isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <OfframpLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-4xl mx-auto px-4 py-8 space-y-8'>
        <div className='text-center space-y-4'>
          <h2 className='text-4xl font-bold'>Select Offramp Provider</h2>
          <p className='text-xl text-muted-foreground'>
            Choose your preferred way to cash out crypto
          </p>
        </div>
        <motion.div
          className='grid gap-4'
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial='hidden'
          animate='show'>
          {
            // Add a fallback UI for when there are no providers
            !providers.data.length && (
              <div className='text-center text-muted-foreground'>
                No providers available
              </div>
            )
          }
          {providers.data.map((provider) => (
            <motion.div
              key={provider.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}>
              <Link
                href={`/network?provider=${provider.slug}&providerName=${provider?.name}&providerUuid=${provider.uuid}`}>
                <Card
                  className='hover:bg-muted/50 transition-all duration-300 transform hover:scale-[1.02]'
                  onMouseEnter={() => setHoveredProvider(provider.id)}
                  onMouseLeave={() => setHoveredProvider(null)}>
                  <CardContent className='flex items-center gap-4 p-6'>
                    <div className='flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center'>
                      {/* Replace with actual icon component when available */}
                      <span className='text-2xl font-bold text-primary'>
                        {provider.name[0]}
                      </span>
                    </div>
                    <div className='flex-grow'>
                      <h3 className='text-xl font-semibold mb-2'>
                        {provider.name}
                      </h3>
                      <p className='text-sm text-muted-foreground'>
                        {provider.description}
                      </p>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Supports {provider.extras?.supportedCurrency.join(", ")}{" "}
                        on {provider.extras?.supportedCurrency.length} chains
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-6 h-6 text-muted-foreground transition-transform duration-300 ${
                        hoveredProvider === provider.id ? "translate-x-2" : ""
                      }`}
                    />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </OfframpLayout>
  );
}
