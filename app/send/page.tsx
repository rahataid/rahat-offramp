"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OfframpLayout } from "@/components/offramp-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ConnectKitButton } from "connectkit";
import { motion } from "framer-motion";
import { Copy, Loader2 } from "lucide-react";
import {
  useExecuteOfframpRequest,
  useGetCustomerMobileMoneyWalletByPhone,
  useGetFiatWallets,
  useGetSingleOfframpRequest,
  useListOfframpProviders,
} from "@/lib/offramp";
import { getProviderBySlug } from "@/providers";
import { getCountryByCode } from "@/utils/misc";
import { erc20Abi, parseUnits } from "viem";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

const TOKENS = {
  USDC: { address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", decimals: 6 },
  USDT: { address: "0xdac17f958d2ee523a2206206994597c13d831ec7", decimals: 6 },
  DAI: { address: "0x6b175474e89094c44da98b954eedeac495271d0f", decimals: 18 },
};

type WalletInfo = {
  account_name: string;
  network: string;
  phone_number: string;
  country_code: string;
  customer_key: string;
};

type CountryInfo = {
  name: string;
  currency: string;
};

export default function SendPage() {
  const [userWallet, setUserWallet] = useState<WalletInfo | null>(null);
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletToUse, setWalletToUse] = useState<any>(null);

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

  const tokenData = token ? TOKENS[token] : null;
  const decimals = tokenData?.decimals || 18;
  const requestData = useGetSingleOfframpRequest({ requestId });
  const sendTokenTransaction = useWriteContract();

  const waitForTransaction = useWaitForTransactionReceipt({ hash: txHash });

  const provider = providerId
    ? getProviderBySlug(providerId, providers.data)
    : null;

  console.log("txHash", txHash);

  const isTransactionSent = !!txHash;
  const isTransactionLoading = waitForTransaction.isLoading;
  const isTransactionSuccess = waitForTransaction.isSuccess;
  const isTransactionError = waitForTransaction.isError;

  console.log("first", {
    isTransactionError,
    isTransactionLoading,
    isTransactionSent,
    isTransactionSuccess,
    txHash,
  });

  const handleSend = async () => {
    setError(null);
    try {
      if (!tokenData || !requestData?.data?.escrowAddress) {
        setError("Token data or escrow address is missing.");
        return;
      }
      const txResponse = await sendTokenTransaction.writeContractAsync({
        address: tokenData.address,
        abi: erc20Abi,
        functionName: "transfer",
        args: [requestData.data.escrowAddress, parseUnits(amount, decimals)],
      });
      if (txResponse) {
        setTxHash(txResponse);
      }
    } catch (err) {
      setError("Transaction failed. Please try again.");
      console.error(err);
    }
  };

  const handleExecuteOfframpRequest = async () => {
    setError(null);
    if (
      !fiatWallets?.data?.length ||
      !userWallet ||
      !countryInfo ||
      !requestData?.data
    ) {
      setError("Missing required data for executing the offramp request.");
      return;
    }
    try {
      await executeRequest.mutateAsync({
        data: {
          mobileMoneyReceiver: {
            accountName: userWallet.account_name,
            networkProvider: userWallet.network,
            phoneNumber: userWallet.phone_number,
          },
          senderAddress: address,
          token,
          chain,
          cryptoAmount: amount,
          currency: countryInfo.currency,
          wallet_id: walletToUse?.id,
          requestUuid: requestData.data.uuid,
          customer_key: userWallet.customer_key,
        },
        providerUuid: provider?.uuid || "",
        requestUuid: requestData.data.uuid,
      });
    } catch (err) {
      setError(
        err?.response?.data?.meta?.message ||
          "Offramp request failed. Please check your data and try again."
      );
      console.error(err);
    }
  };

  const fetchWallet = useCallback(async () => {
    if (!phoneNumber) return;
    setError(null);
    try {
      const wallet = await customerWallet.mutateAsync({
        providerUuid,
        payload: { phone_number: phoneNumber },
      });
      if (wallet) {
        const country = getCountryByCode(wallet.country_code);
        setCountryInfo(country);
        setUserWallet(wallet);
      }
    } catch (err) {
      setError("Failed to fetch wallet information. Please try again.");
      console.error(err);
    }
  }, [phoneNumber, providerUuid, customerWallet]);

  useEffect(() => {
    if (!phoneNumber || userWallet) return;
    fetchWallet();
  }, [phoneNumber, userWallet, fetchWallet]);

  useEffect(() => {
    if (!countryInfo || !fiatWallets?.data) return;
    const fiatWallet = fiatWallets.data.find(
      (w) => w.currency === countryInfo.currency
    );
    if (fiatWallet && fiatWallet.id !== walletToUse?.id) {
      setWalletToUse(fiatWallet);
    }
  }, [countryInfo, fiatWallets?.data, walletToUse?.id]);

  if (!provider) {
    return (
      <div className='text-center text-2xl font-semibold text-red-500'>
        Invalid provider
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
          <h2 className='text-4xl font-bold'>Send Crypto</h2>
          <p className='text-xl text-muted-foreground'>
            Transfer{" "}
            <span className='font-semibold'>
              {amount} {token}
            </span>{" "}
            to complete your{" "}
            <span className='font-semibold'>{provider.name}</span> offramp
          </p>
        </div>

        {error && (
          <Alert variant='destructive'>
            <AlertDescription className='text-sm font-medium'>
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Card className='shadow-lg'>
          <CardContent className='p-8 space-y-8'>
            <div className='flex justify-center'>
              <ConnectKitButton />
            </div>

            <Alert variant='info' className='bg-blue-50 border-blue-200'>
              <AlertDescription className='text-center font-medium'>
                Please send exactly{" "}
                <span className='font-bold'>
                  {amount} {token}
                </span>{" "}
                to the following address to process your offramp request:
              </AlertDescription>
            </Alert>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className='p-4 bg-gray-100 rounded-lg break-all text-center cursor-pointer relative overflow-hidden group'
              onClick={() =>
                navigator.clipboard.writeText(
                  requestData?.data?.escrowAddress || ""
                )
              }>
              <span className='text-sm font-medium'>
                {requestData?.data?.escrowAddress || "No address available"}
              </span>
              <span className='absolute inset-0 flex items-center justify-center bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <Copy className='w-5 h-5 mr-2' /> Click to copy
              </span>
            </motion.div>

            <div className='space-y-4'>
              <h3 className='text-xl font-semibold'>Offramp Details</h3>
              <div className='grid grid-cols-3 gap-4'>
                <div className='bg-gray-100 p-4 rounded-lg text-center'>
                  <p className='text-sm font-medium'>Provider</p>
                  <p className='text-lg'>{provider.name}</p>
                </div>
                <div className='bg-gray-100 p-4 rounded-lg text-center'>
                  <p className='text-sm font-medium'>Chain</p>
                  <p className='text-lg'>{chain}</p>
                </div>
                <div className='bg-gray-100 p-4 rounded-lg text-center'>
                  <p className='text-sm font-medium'>Amount</p>
                  <p className='text-lg'>
                    {amount} {token}
                  </p>
                </div>
              </div>
            </div>

            <div className='grid md:grid-cols-2 gap-8'>
              <div className='space-y-4'>
                <h3 className='text-xl font-semibold'>Customer Details</h3>
                {userWallet && (
                  <div className='space-y-2'>
                    <p className='text-sm'>
                      <span className='font-medium'>Phone Number:</span>{" "}
                      {userWallet.phone_number}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Network:</span>{" "}
                      {userWallet.network}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Account Name:</span>{" "}
                      {userWallet.account_name}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Country:</span>{" "}
                      {getCountryByCode(userWallet.country_code)?.name || ""}
                    </p>
                  </div>
                )}
              </div>

              <div className='space-y-4'>
                <h3 className='text-xl font-semibold'>Wallet Details</h3>
                {walletToUse && (
                  <div className='space-y-2'>
                    <p className='text-sm'>
                      <span className='font-medium'>Name:</span>{" "}
                      {walletToUse.name}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Type:</span>{" "}
                      {walletToUse.type}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Currency:</span>{" "}
                      {walletToUse.currency}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Status:</span>{" "}
                      {walletToUse.status}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className='px-6 py-4'>
            <motion.div
              className='w-full'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              {!isTransactionSent && (
                <Button onClick={handleSend} size='lg' className='w-full'>
                  {isTransactionLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Confirming Transaction
                    </>
                  ) : (
                    "Send Crypto"
                  )}
                </Button>
              )}

              {isTransactionSent && isTransactionLoading && (
                <Button disabled size='lg' className='w-full'>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Confirming Transaction
                </Button>
              )}

              {isTransactionSent && isTransactionSuccess && (
                <Button
                  onClick={handleExecuteOfframpRequest}
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

              {isTransactionSent && isTransactionError && (
                <Button
                  onClick={() => setTxHash(null)}
                  size='lg'
                  className='w-full'>
                  Retry Send Crypto
                </Button>
              )}
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </OfframpLayout>
  );
}
