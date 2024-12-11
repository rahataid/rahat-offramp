"use client";

import { OfframpLayout } from "@/components/offramp-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  useExecuteOfframpRequest,
  useGetCustomerMobileMoneyWalletByPhone,
  useGetFiatWallets,
  useGetSingleOfframpRequest,
  useListOfframpProviders,
} from "@/lib/offramp";
import { getProviderBySlug } from "@/providers";
import { ConnectKitButton } from "connectkit";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";

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

  const requestId = searchParams.get("requestId");
  const providerId = searchParams.get("provider");
  const providerUuid = searchParams.get("providerUuid");
  const amount = searchParams.get("amount") || "0";
  const token = searchParams.get("token");
  const chain = searchParams.get("chain");
  const phoneNumber = searchParams.get("phoneNumber");

  const executeRequest = useExecuteOfframpRequest();
  const sendTransaction = useSendTransaction({});
  const providers = useListOfframpProviders();
  const customerWallet = useGetCustomerMobileMoneyWalletByPhone();
  const fiatWallets = useGetFiatWallets(providerUuid);
  console.log("fiatWallets?.data", fiatWallets?.data);

  const [userWallet, setUserWallet] = useState(null);

  const requestData = useGetSingleOfframpRequest({
    requestId,
  });

  const provider = providerId
    ? getProviderBySlug(providerId, providers.data)
    : null;

  // useEffect(() => {
  //   if (sendTransaction.data) {
  //     setHash(sendTransaction.hash)
  //   }
  // }, [sendTransaction.data, sendTransaction.isPending])

  console.log("sendT", requestData, userWallet);
  // const { data: hash, write } = useContractWrite({
  //   address: '0x...' as `0x${string}`, // Token contract address
  //   abi: ERC20_ABI,
  //   functionName: 'transfer',
  // })

  // const { isLoading, isSuccess } = useWaitForTransaction({ hash })

  const handleSend = async () => {
    // todo: here add create offramp and add
    try {
      sendTransaction.sendTransaction({
        value: BigInt(amount),
        account: address,
        to: requestData?.data?.escrowAddress,
        token: token,
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

  const handleExecuteOfframRequest = async () => {
    if (!fiatWallets?.data?.length) {
      console.error("No fiat wallets found");
      return;
    }
    const walletToUse = fiatWallets?.data?.[0]?.id;
    try {
      executeRequest.mutate({
        chain,
        token,
        providerUuid: provider.uuid,
        transaction_hash: sendTransaction.data as `0x${string}`,
        customer_key: userWallet?.customer_key,
        request_id: requestId,
        wallet_id: walletToUse,
        requestUuid: requestData?.data?.uuid,
      });
    } catch (error) {
      console.error("Offramp request failed:", error);
    }
  };

  useEffect(() => {
    if (!phoneNumber) return;
    const fetchWallet = async () => {
      const wallet = await customerWallet.mutateAsync({
        providerUuid: providerUuid,
        payload: {
          phone_number: phoneNumber,
        },
      });
      setUserWallet(wallet);
    };
    fetchWallet();
  }, [phoneNumber, providerUuid]);

  if (executeRequest.isSuccess) {
    router.push(`/status?referenceId=${123}&providerUuid=${providerUuid}`);
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
              <ConnectKitButton />
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
                {requestData?.data?.escrowAddress}
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
              {sendTransaction.data && (
                <Button
                  onClick={handleExecuteOfframRequest}
                  // onClick={() =>
                  //   router.push(`/status?txHash=${sendTransaction.data?.hash}`)
                  // }
                  size='lg'
                  className='w-full'>
                  Execute Offramp
                </Button>
              )}
              {!sendTransaction.data && (
                <Button
                  onClick={handleSend}
                  // disabled={isLoading}
                  size='lg'
                  className='w-full'>
                  {sendTransaction.isPending ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Confirming Transaction
                    </>
                  ) : (
                    "Send Crypto"
                  )}
                </Button>
              )}
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </OfframpLayout>
  );
}
