"use client";

import { OfframpLayout } from "@/components/offramp-layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  useCreateOfframpRequest,
  useListOfframpProviders,
} from "@/lib/offramp";
import { getProviderBySlug } from "@/providers";
import { ProviderFormData } from "@/types/provider";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function DetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const providerId = searchParams.get("provider");
  const providerUuid = searchParams.get("providerUuid");
  const chain = searchParams.get("chain");
  const token = searchParams.get("token");
  const providers = useListOfframpProviders();
  const createOfframpRequest = useCreateOfframpRequest();
  const account = useAccount();

  const [formData, setFormData] = useState<ProviderFormData | null>(null);

  const provider = providerId
    ? getProviderBySlug(providerId, providers.data)
    : null;
  console.log("provider", provider);

  if (!provider) {
    return <div>Invalid provider</div>;
  }

  const handleSubmit = async (data: ProviderFormData) => {
    setFormData(data);
    const params = new URLSearchParams(searchParams);
    try {
      await createOfframpRequest
        .mutateAsync({
          providerUuid,
          chain,
          token,
          amount: data.amount,
          senderAddress: account.address,
        })
        .then((res) => {
          Object.entries({ ...data, requestId: res?.data?.requestId }).forEach(
            ([key, value]) => {
              params.append(key, value);
            }
          );
          router.push(`/send?${params.toString()}`);
        });
    } catch (error) {
      console.log("error", error);
    }
    console.log("params", params, data);
  };

  const FormComponent = provider.FormComponent;

  return (
    <OfframpLayout>
      <div className='grid gap-6'>
        <div className='text-center'>
          <h2 className='text-2xl font-light mb-2'>Fill Offramp Details</h2>
          <p className='text-muted-foreground'>
            Enter your details for {provider.name}
          </p>
        </div>

        <Card>
          <CardContent className='p-6'>
            <FormComponent onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      </div>
    </OfframpLayout>
  );
}
