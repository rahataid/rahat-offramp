"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { OfframpStep } from "@/components/offramp-step";
import { OfframpForm } from "@/components/offramp-form";
import { useCreateOfframpRequest } from "@/lib/offramp";
import type { TransactionDetails } from "@/types/offramp";

export default function DetailsPage() {
  const searchParams = useSearchParams();
  const providerUuid = searchParams.get("provider");
  const createOfframpRequest = useCreateOfframpRequest();
  const router = useRouter();

  const handleTransactionSubmit = async (details: TransactionDetails) => {
    try {
      const result = await createOfframpRequest.mutateAsync(details);
      router.push(
        `/offramp/confirm?provider=${providerUuid}&request=${
          result?.data?.requestId as string
        }`
      );
      // window.location.href = `/offramp/confirm?provider=${providerUuid}&request=${result.id}`
    } catch (error) {
      console.error("Failed to create offramp request:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <OfframpStep
      title='Enter Transaction Details'
      description='Provide the necessary information to create your offramp request.'>
      <OfframpForm
        onSubmit={handleTransactionSubmit}
        onBack={() => window.history.back()}
        onCancel={() => router.push("/offramp")}
        provider={{ uuid: providerUuid || "" }}
      />
    </OfframpStep>
  );
}
