"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { OfframpLayout } from "@/components/offramp-layout";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import { parseUnits } from "viem";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { getProviderById } from "@/providers";
import { motion } from "framer-motion";

const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
];

export default function SendPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address } = useAccount();

  const providerId = searchParams.get("provider");
  const provider = providerId ? getProviderById(providerId) : null;
  const amount = searchParams.get("amount") || "0";
  const token = searchParams.get("token");

  // const { data: hash, write } = useContractWrite({
  //   address: '0x...' as `0x${string}`, // Token contract address
  //   abi: ERC20_ABI,
  //   functionName: 'transfer',
  // })

  // const { isLoading, isSuccess } = useWaitForTransaction({ hash })

  const handleSend = async () => {
    // todo: here add create offramp and add
    try {
      console.log("Sending transaction...", {
        providerId,
        amount,
        token,
        address,
      });

      // write({
      //   args: [
      //     '0x...', // Recipient address
      //     parseUnits(amount, 6), // Assuming USDC/USDT with 6 decimals
      //   ],
      // })
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  if (true) {
    router.push(`/status?txHash=${123}`);
  }

  if (!provider) {
    return <div>Invalid provider</div>;
  }

  return (
    <OfframpLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='grid gap-6'>
        <div className='text-center'>
          <h2 className='text-3xl font-light mb-2'>Send Crypto</h2>
          <p className='text-muted-foreground'>
            Transfer {amount} {token} to complete your {provider.name} offramp
          </p>
        </div>

        <Card>
          <CardContent className='p-6'>
            <div className='grid gap-4'>
              <Alert>
                <AlertDescription>
                  Please send exactly {amount} {token} to the following address
                  to process your offramp request
                </AlertDescription>
              </Alert>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className='p-4 bg-muted rounded-lg break-all text-center cursor-pointer'
                onClick={() => navigator.clipboard.writeText("0x...")}>
                0x... {/* Recipient address */}
              </motion.div>

              <div className='space-y-2'>
                <h3 className='font-medium'>Offramp Details:</h3>
                {Array.from(searchParams.entries()).map(([key, value]) => (
                  <p key={key} className='text-sm'>
                    <span className='font-medium'>{key}:</span> {value}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className='px-6 py-4'>
            <motion.div
              className='w-full'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSend}
                // disabled={isLoading}
                size='lg'
                className='w-full'>
                {/* {isLoading ? ( */}
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Confirming Transaction
                </>
                {/* </>
                ) : (
                  "Send Crypto"
                )} */}
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </OfframpLayout>
  );
}
