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
import { erc20Abi, parseUnits } from "viem";
import {
  useAccount,
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

const TOKENS = {
  USDC: {
    address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Example: USDC contract address
    decimals: 6,
  },
  USDT: {
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7", // Example: USDT contract address
    decimals: 6,
  },
  DAI: {
    address: "0x6b175474e89094c44da98b954eedeac495271d0f", // Example: DAI contract address
    decimals: 18,
  },
};

export default function SendPage() {
  const [userWallet, setUserWallet] = useState(null);
  const [txHash, setTxHash] = useState<`0x${string}`>();

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
  const chainId = useChainId();
  const waitFroTransaction = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  console.log("waitFroTransaction", waitFroTransaction.data);

  const tokenData = token ? TOKENS[token] : null;
  const decimals = tokenData?.decimals || 18;

  const requestData = useGetSingleOfframpRequest({
    requestId,
  });

  const sendTokenTransaction = useWriteContract();
  const provider = providerId
    ? getProviderBySlug(providerId, providers.data)
    : null;

  const handleSend = async () => {
    // todo: here add create offramp and add
    try {
      const d = {
        address: tokenData?.address,
        abi: erc20Abi,
        functionName: "transfer",
        args: [
          requestData?.data?.escrowAddress, // Replace with the recipient address
          // amount,
          parseUnits(amount, decimals),
        ],
      };
      console.log("d", d);
      await sendTokenTransaction.writeContractAsync(d);
      // sendTransaction.sendTransaction({
      //   value: parseEther(amount),
      //   account: address,
      //   to: requestData?.data?.escrowAddress,
      //   token: "USDC",
      // });
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
        transaction_hash: waitFroTransaction.data
          ?.transactionHash as `0x${string}`,
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

  useEffect(() => {
    if (!sendTokenTransaction.data) return;
    setTxHash(sendTokenTransaction.data);
  }, [sendTokenTransaction.data, sendTransaction.data]);

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
              {waitFroTransaction.data && (
                <Button
                  onClick={handleExecuteOfframRequest}
                  // onClick={() =>
                  //   router.push(`/status?txHash=${sendTransaction.data?.hash}`)
                  // }
                  size='lg'
                  className='w-full'>
                  {executeRequest.isPending ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Executing Offramp
                    </>
                  ) : (
                    "Execute Offramp"
                  )}
                </Button>
              )}
              {!sendTransaction.data && (
                <Button
                  onClick={handleSend}
                  // disabled={isLoading}
                  size='lg'
                  className='w-full'>
                  {waitFroTransaction.isLoading || sendTransaction.isPending ? (
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
