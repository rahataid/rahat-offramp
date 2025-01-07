"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OfframpLayout } from "@/components/offramp-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ConnectKitButton } from "connectkit";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
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
  const waitForTransaction = useWaitForTransactionReceipt({ hash: txHash });

  const tokenData = token ? TOKENS[token] : null;
  const decimals = tokenData?.decimals || 18;

  const requestData = useGetSingleOfframpRequest({ requestId });
  const sendTokenTransaction = useWriteContract();
  const provider = providerId
    ? getProviderBySlug(providerId, providers.data)
    : null;
  console.log("provider", provider);

  const handleSend = async () => {
    setError(null);
    try {
      if (!tokenData || !requestData?.data?.escrowAddress) {
        setError("Token data or escrow address is missing.");
        return;
      }

      await sendTokenTransaction.writeContractAsync({
        address: tokenData.address,
        abi: erc20Abi,
        functionName: "transfer",
        args: [requestData.data.escrowAddress, parseUnits(amount, decimals)],
      });
    } catch (error) {
      setError("Transaction failed. Please try again.");
      console.error("Transaction failed:", error);
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
    } catch (error) {
      setError(
        error?.response?.data?.meta?.message ||
          "Offramp request failed. Please check your data and try again."
      );
      console.error("Offramp request failed:", error);
    }
  };

  useEffect(() => {
    if (!phoneNumber || !customerWallet) return;

    const fetchWallet = async () => {
      setError(null);
      try {
        const wallet = await customerWallet.mutateAsync({
          providerUuid,
          payload: { phone_number: phoneNumber },
        });

        const country = getCountryByCode(wallet?.country_code);
        setCountryInfo(country);
        setUserWallet(wallet);
      } catch (error) {
        setError("Failed to fetch wallet information. Please try again.");
        console.error("Error fetching wallet:", error);
      }
    };

    fetchWallet();
  }, [phoneNumber, providerUuid]);

  useEffect(() => {
    if (!countryInfo || !fiatWallets?.data) return;

    const fiatWallet = fiatWallets.data.find(
      (w) => w.currency === countryInfo.currency
    );

    if (fiatWallet?.id !== walletToUse?.id) {
      setWalletToUse(fiatWallet || null);
    }
  }, [countryInfo, fiatWallets?.data, walletToUse?.id]);

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

        {error && (
          <Alert>
            <AlertDescription className='text-red-500'>
              {error}
            </AlertDescription>
          </Alert>
        )}

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
                onClick={() =>
                  navigator.clipboard.writeText(
                    requestData?.data?.escrowAddress || ""
                  )
                }>
                {requestData?.data?.escrowAddress || "No address available"}
              </motion.div>

              <div className='space-y-2'>
                <h3 className='font-medium'>Customer Details:</h3>
                {userWallet && (
                  // phone_number, network, account_name, country_code,
                  <>
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
                  </>
                )}
              </div>

              <div className='space-y-2'>
                <h3 className='font-medium'>Wallet Details:</h3>
                {walletToUse && (
                  <>
                    {/* name, type, balance,currency, status */}
                    <p className='text-sm'>
                      <span className='font-medium'>Name:</span>{" "}
                      {walletToUse?.name}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Type:</span>{" "}
                      {walletToUse?.type}
                    </p>
                    {/* <p className='text-sm'>
                      <span className='font-medium'>Balance:</span>{" "}
                      {walletToUse?.balance}
                    </p> */}
                    <p className='text-sm'>
                      <span className='font-medium'>Currency:</span>{" "}
                      {walletToUse?.currency}
                    </p>
                    <p className='text-sm'>
                      <span className='font-medium'>Status:</span>{" "}
                      {walletToUse?.status}
                    </p>
                  </>
                )}
              </div>

              <div className='space-y-2'>
                <h3 className='font-medium'>Offramp Details:</h3>
                {/* provider,chain,token,amount */}
                <p className='text-sm'>
                  <span className='font-medium'>Provider:</span> {provider.name}
                </p>
                <p className='text-sm'>
                  <span className='font-medium'>Chain:</span> {chain}
                </p>
                <p className='text-sm'>
                  <span className='font-medium'>Send: </span>
                  {amount} {token}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className='px-6 py-4'>
            <motion.div
              className='w-full'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              {!txHash ? (
                <Button onClick={handleSend} size='lg' className='w-full'>
                  {waitForTransaction.isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Confirming Transaction
                    </>
                  ) : (
                    "Send Crypto"
                  )}
                </Button>
              ) : (
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
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </OfframpLayout>
  );
}
