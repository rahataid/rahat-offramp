"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { OfframpLayout } from "@/components/offramp-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

import {
  useExecuteOfframpRequest,
  useGetCustomerMobileMoneyWalletByPhone,
  useGetFiatWallets,
  useListOfframpProviders,
} from "@/lib/offramp";
import { getProviderBySlug } from "@/providers";
import { ProviderFormData } from "@/types/provider";
import { getCountryByCode } from "@/utils/misc";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function DetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const providerId = searchParams.get("provider");
  const providerUuid = searchParams.get("providerUuid");
  const chain = searchParams.get("chain");
  const token = searchParams.get("token");
  const { toast } = useToast();

  const [formData, setFormData] = useState<ProviderFormData | null>(null);
  const [uiError, setUiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const isMountedRef = useRef(true);
  const { address } = useAccount();

  const listProviders = useListOfframpProviders();
  const executeOfframp = useExecuteOfframpRequest();
  const customerWallet = useGetCustomerMobileMoneyWalletByPhone();
  const fiatWallets = useGetFiatWallets(providerUuid);

  let provider = null;
  if (providerId && listProviders.data) {
    provider = getProviderBySlug(providerId, listProviders.data);
  }

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const buildQueryString = (referenceId: string, phoneNumber?: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("referenceId", referenceId);
    if (phoneNumber) params.set("phone_number", phoneNumber);
    return params.toString();
  };

  const handleSubmit = async (data: ProviderFormData) => {
    setUiError(null);
    setFormData(data);

    const ctry = getCountryByCode(data?.walletInfo?.country_code);
    if (!ctry) return setUiError("Could not identify country from phone info.");

    console.log("data", data);
    try {
      const { data: walletCheck } = await customerWallet.mutateAsync({
        providerUuid: providerUuid || "",
        payload: {
          phone_number: data?.walletInfo?.phone_number?.replace(/\s/g, ""),
        },
      });
      console.log("first", walletCheck);

      if (!walletCheck) throw new Error("Wallet not found for this number.");

      const foundFiatWallet = fiatWallets.data?.find(
        (w) => w.currency === ctry.currency
      );
      if (!foundFiatWallet)
        throw new Error("No fiat wallet for selected currency.");

      const executionData = {
        data: {
          mobileMoneyReceiver: {
            accountName: data?.walletInfo?.account_name,
            networkProvider: data?.walletInfo?.network,
            phoneNumber: data?.walletInfo?.phone_number,
          },
          senderAddress: address,
          token,
          chain,
          cryptoAmount: data?.amount,
          currency: ctry.currency,
          wallet_id: foundFiatWallet.id,
          customer_key: data?.walletInfo.customer_key,
        },
        providerUuid: provider?.uuid || "",
      };

      const result = await executeOfframp.mutateAsync(executionData);

      const referenceId =
        result?.data?.kotaniPayResponse?.referenceId ||
        result?.data?.kotaniPayResponse?.reference_id;
      if (!referenceId) throw new Error("No reference ID returned.");

      toast({ title: "Offramp request created successfully!" });
      setIsSuccess(true);

      const finalQs = buildQueryString(referenceId, data.phoneNumber);
      router.push(`/send-token?${finalQs}`);
    } catch (err: any) {
      if (!isMountedRef.current) return;
      console.error("Execute Error:", err);
      setUiError(
        err?.response?.data?.message ||
          err.message ||
          "Unexpected error occurred."
      );
    }
  };

  const FormComponent = provider?.FormComponent;

  if (!provider) {
    return (
      <OfframpLayout>
        <div className='flex items-center justify-center h-full'>
          <Alert>
            <AlertDescription>
              {listProviders.isLoading
                ? "Verifying provider..."
                : "Invalid provider. Please check your URL."}
            </AlertDescription>
          </Alert>
        </div>
      </OfframpLayout>
    );
  }

  if (!address) {
    return (
      <OfframpLayout>
        <div className='flex items-center justify-center h-full'>
          <Alert variant='destructive'>
            <AlertDescription>
              Please connect your wallet to proceed.
            </AlertDescription>
          </Alert>
        </div>
      </OfframpLayout>
    );
  }

  return (
    <OfframpLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-2xl mx-auto px-4 py-8 space-y-8'>
        <div className='text-center space-y-4'>
          <h2 className='text-4xl font-bold'>Fill Offramp Details</h2>
          <p className='text-xl text-muted-foreground'>
            Enter your details for{" "}
            <span className='font-semibold'>{provider.name}</span>
          </p>
        </div>

        {uiError && (
          <Alert variant='destructive'>
            <AlertDescription>{uiError}</AlertDescription>
          </Alert>
        )}

        {isSuccess && (
          <Alert variant='default'>
            <AlertDescription>
              ✅ Success! You will be redirected shortly...
            </AlertDescription>
          </Alert>
        )}

        <Card className='shadow-lg relative'>
          {executeOfframp.isPending && (
            <div className='absolute inset-0 bg-white/70 flex justify-center items-center z-10'>
              <Loader2 className='h-6 w-6 animate-spin text-primary' />
            </div>
          )}
          <CardContent className='p-8'>
            {FormComponent && <FormComponent onSubmit={handleSubmit} />}
          </CardContent>
        </Card>
      </motion.div>
    </OfframpLayout>
  );
}
