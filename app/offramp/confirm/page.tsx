"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { OfframpStep } from "@/components/offramp-step";
import { OfframpQR } from "@/components/offramp-qr";
import { useExecuteOfframpRequest } from "@/lib/offramp";

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const providerUuid = searchParams.get("provider");
  const requestUuid = searchParams.get("request");
  const executeOfframpRequest = useExecuteOfframpRequest();
  const router = useRouter();

  const handleExecuteTransaction = async () => {
    if (providerUuid && requestUuid) {
      try {
        await executeOfframpRequest.mutateAsync({
          providerUuid,
          requestUuid,
          data: {
            chain: "ethereum", // This should be dynamically set based on the user's selection
            token: "ETH", // This should be dynamically set based on the user's selection
            transaction_hash:
              "0x3e9c73530c5fa666a6ccf49296cdbaa5e82084695bce935c888e4bc096734b41", // This should be dynamically generated
            wallet_id: "66f3cdee84e385a32f6fe1b4", // This should be dynamically generated
            request_id: requestUuid,
            customer_key: "QozR5knCfvkdAezXT7rx", // This should be dynamically generated
          },
        });
        router.push(`/offramp/complete`);
        // window.location.href = `/offramp/complete`;
      } catch (error) {
        console.error("Failed to execute offramp request:", error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  return (
    <OfframpStep
      title='Review and Confirm'
      description='Verify your transaction details and execute the offramp request.'>
      <OfframpQR
        transactionDetails={{ requestUuid: requestUuid || "" }}
        onComplete={handleExecuteTransaction}
        onBack={() => window.history.back()}
        onCancel={() => router.push("/offramp")}
        // window.location.href = '/offramp'}
        provider={{ uuid: providerUuid || "" }}
      />
    </OfframpStep>
  );
}
