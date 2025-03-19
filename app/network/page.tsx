"use client";

import { OfframpLayout } from "@/components/offramp-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OFFRAMP_NETWORK, OFFRAMP_TOKEN } from "@/config/constants";
import { ConnectKitButton } from "connectkit";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export default function NetworkPage() {
  // Get connection status from useAccount at the top level
  const { isConnected } = useAccount();
  const router = useRouter();
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider");
  const providerUuid = searchParams.get("providerUuid");
  const reloaded = searchParams.get("reloaded"); // Check if page was already reloaded

  // Handle navigation to the details page
  const handleContinue = () => {
    router.push(
      `/details?provider=${provider}&chain=${OFFRAMP_NETWORK}&token=${OFFRAMP_TOKEN}&providerUuid=${providerUuid}`
    );
  };

  // Effect to reload the page after connection
  useEffect(() => {
    if (isConnected && !reloaded) {
      // Add 'reloaded' parameter to prevent infinite reloads
      const newUrl = `${
        window.location.pathname
      }?${searchParams.toString()}&reloaded=true`;
      window.location.href = newUrl; // Reloads the page
    }
  }, [isConnected, reloaded, searchParams]);

  return (
    <OfframpLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-2xl mx-auto px-4 py-8 space-y-8'>
        <div className='text-center space-y-4'>
          <h2 className='text-4xl font-bold'>Network & Token</h2>
          <p className='text-xl text-muted-foreground'>
            Review your offramp network and token
          </p>
        </div>

        <Card className='shadow-lg'>
          <CardContent className='p-8 space-y-8'>
            <div className='space-y-6'>
              <div>
                <h3 className='text-2xl font-semibold mb-4'>Network</h3>
                <div className='bg-muted rounded-lg p-4'>
                  <p className='text-lg font-medium'>{OFFRAMP_NETWORK}</p>
                  <p className='text-sm text-muted-foreground'>
                    Selected Network
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}>
                <h3 className='text-2xl font-semibold mb-4'>Token</h3>
                <div className='bg-muted rounded-lg p-4'>
                  <p className='text-lg font-medium'>{OFFRAMP_TOKEN}</p>
                  <p className='text-sm text-muted-foreground'>
                    Selected Token
                  </p>
                </div>
              </motion.div>
            </div>

            <div className='flex flex-col items-center gap-4 pt-4'>
              <ConnectKitButton.Custom>
                {({ isConnecting, show }) => (
                  <AnimatePresence mode='wait'>
                    {!isConnected ? (
                      <motion.div
                        key='connect'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className='w-full'>
                        <Button
                          size='lg'
                          onClick={show}
                          disabled={isConnecting}
                          className='w-full py-6 text-lg font-semibold'>
                          {isConnecting ? "Connecting..." : "Connect Wallet"}
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key='continue'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className='w-full'>
                        <Button
                          size='lg'
                          onClick={handleContinue}
                          className='w-full py-6 text-lg font-semibold'>
                          Continue <ArrowRight className='ml-2 h-5 w-5' />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </ConnectKitButton.Custom>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </OfframpLayout>
  );
}
