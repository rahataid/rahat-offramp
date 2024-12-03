"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { OfframpStep } from "@/components/offramp-step";
import { OfframpQR } from "@/components/offramp-qr";
import {
  useExecuteOfframpRequest,
  useGetSingleOfframpRequest,
  useProviderAction,
} from "@/lib/offramp";
import { useEffect, useState } from "react";

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const providerUuid = searchParams.get("provider");
  const requestUuid = searchParams.get("request");
  const executeOfframpRequest = useExecuteOfframpRequest();
  const [status, setStatus] = useState("pending");

  const router = useRouter();
  const singleOfframpRequest = useGetSingleOfframpRequest({
    requestId: requestUuid as string,
  });

  const providerAction = useProviderAction();

  // useEffect(() => {
  //   const checkStatus = async () => {
  //     try {
  //       const result = await providerAction.mutateAsync({
  //         uuid: providerUuid,
  //         action: "check-offramp-status",
  //         payload: { requestUuid },
  //       });
  //       setStatus(result.status);
  //       // if (result.status === "completed") {
  //       //   router.push("/offramp/complete");
  //       // }
  //     } catch (error) {
  //       console.error("Failed to get request status:", error);
  //     }
  //   };

  //   const intervalId = setInterval(checkStatus, 5000);
  //   return () => clearInterval(intervalId);
  // }, [providerUuid, requestUuid, router, providerAction]);

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

  if (singleOfframpRequest.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <OfframpStep
      title='Review and Confirm'
      description='Verify your transaction details and execute the offramp request.'>
      <OfframpQR
        transactionDetails={{
          requestUuid: requestUuid || "",
          ...singleOfframpRequest?.data,
        }}
        onComplete={handleExecuteTransaction}
        onBack={() => window.history.back()}
        onCancel={() => router.push("/offramp")}
        // window.location.href = '/offramp'}
        provider={{ uuid: providerUuid || "" }}
        qrCodeValue={singleOfframpRequest?.data?.escrowAddress || ""}
      />
    </OfframpStep>
  );
}
