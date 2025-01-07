"use client";

import { OfframpLayout } from "@/components/offramp-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OFFRAMP_NETWORK, OFFRAMP_TOKEN } from "@/config/constants";
import { ConnectKitButton } from "connectkit";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { ArrowRight } from "lucide-react";

export default function NetworkPage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider");
  const providerUuid = searchParams.get("providerUuid");

  const handleContinue = () => {
    router.push(
      `/details?provider=${provider}&chain=${OFFRAMP_NETWORK}&token=${OFFRAMP_TOKEN}&providerUuid=${providerUuid}`
    );
  };

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
              {!isConnected ? (
                <div className='w-full'>
                  <ConnectKitButton.Custom>
                    {({ show }) => (
                      <Button
                        size='lg'
                        onClick={show}
                        className='w-full py-6 text-lg font-semibold'>
                        Connect Wallet
                      </Button>
                    )}
                  </ConnectKitButton.Custom>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='w-full'>
                  <Button
                    size='lg'
                    onClick={handleContinue}
                    className='w-full py-6 text-lg font-semibold'>
                    Continue <ArrowRight className='ml-2 h-5 w-5' />
                  </Button>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </OfframpLayout>
  );
}
