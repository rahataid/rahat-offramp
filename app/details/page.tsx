"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { OfframpLayout } from "@/components/offramp-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  useCreateOfframpRequest,
  useExecuteOfframpRequest,
  useGetCustomerMobileMoneyWalletByPhone,
  useGetFiatWallets,
  useListOfframpProviders,
} from "@/lib/offramp";
import { getProviderBySlug } from "@/providers";
import { ProviderFormData } from "@/types/provider";
import { getCountryByCode } from "@/utils/misc";

export default function DetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const providerId = searchParams.get("provider");
  const providerUuid = searchParams.get("providerUuid");
  const chain = searchParams.get("chain");
  const token = searchParams.get("token");
  const providers = useListOfframpProviders();
  const executeOfframp = useExecuteOfframpRequest();
  const account = useAccount();
  const customerWallet = useGetCustomerMobileMoneyWalletByPhone();
  const fiatWallets = useGetFiatWallets(providerUuid);

  const [formData, setFormData] = useState<ProviderFormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const provider = providerId
    ? getProviderBySlug(providerId, providers.data)
    : null;

  if (!provider) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Alert variant='default'>
          <AlertDescription>
            Verifying Provider... Please wait.
            {/* Invalid provider. Please check the URL and try again. */}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSubmit = async (data: ProviderFormData) => {
    setFormData(data);
    setError(null);
    const params = new URLSearchParams(searchParams);
    const ctry = getCountryByCode(data?.walletInfo?.country_code);
    const { data: wallet } = await customerWallet.mutateAsync({
      providerUuid,
      payload: {
        phone_number: data?.walletInfo?.phone_number?.replace(/\s/g, ""),
      },
    });
    const foundFiatWallet = fiatWallets.data.find(
      (w) => w.currency === ctry.currency
    );
    const executionData = {
      data: {
        mobileMoneyReceiver: {
          accountName: data?.walletInfo?.account_name,
          networkProvider: data?.walletInfo?.network,
          phoneNumber: data?.walletInfo?.phone_number,
        },
        senderAddress: account.address,
        token,
        chain,
        cryptoAmount: data?.amount,
        currency: ctry.currency,
        wallet_id: foundFiatWallet.id,
        // requestUuid: requestData.data.uuid,
        customer_key: data?.walletInfo.customer_key,
      },
      providerUuid: provider?.uuid || "",
      // requestUuid: requestData.data.uuid,
    };
    console.log("ctry", ctry, executionData, data);
    try {
      const {
        data: { kotaniPayResponse },
      } = await executeOfframp.mutateAsync(executionData);

      params.append(
        "referenceId",
        kotaniPayResponse?.referenceId || kotaniPayResponse?.reference_id
      );

      params.append("phone_number", data.phoneNumber);

      router.push(`/send-token?${params.toString()}`);
    } catch (error) {
      console.error("Error creating offramp request:", error);
      setError("Failed to create offramp request. Please try again.");
    }
  };

  const FormComponent = provider.FormComponent;

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

        {error && (
          <Alert variant='destructive'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className='shadow-lg'>
          <CardContent className='p-8'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}>
              <FormComponent onSubmit={handleSubmit} />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </OfframpLayout>
  );
}
