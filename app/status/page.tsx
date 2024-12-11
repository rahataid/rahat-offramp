"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { OfframpLayout } from "@/components/offramp-layout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useCheckOfframpStatus } from "@/lib/offramp";
import { formatCasesToReadable } from "@/utils/formatCasesToReadable";

// This is a mock function. In a real application, you would implement
// actual blockchain event listening logic here.

export default function StatusPage() {
  const searchParams = useSearchParams();
  const referenceId = searchParams.get("referenceId");
  const providerUuid = searchParams.get("providerUuid") as string;
  const [status, setStatus] = useState("pending");

  const offRampStatus = useCheckOfframpStatus();

  const listenToOfframpEvent = async (
    referenceId: string,
    callback: (status: string) => void
  ) => {
    try {
      const response = await offRampStatus.mutateAsync({
        providerUuid,
        payload: { request_id: referenceId },
      });
      callback(response.status);
    } catch (error) {
      console.error("Error fetching offramp status:", error);
    }
  };

  useEffect(() => {
    if (referenceId) {
      listenToOfframpEvent(referenceId, setStatus);
    }
  }, [providerUuid, referenceId]);

  return (
    <OfframpLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='grid gap-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-light mb-2'>Offramp Status</h2>
          <p className='text-muted-foreground'>
            Track the status of your offramp request
          </p>
        </div>

        <Card>
          <CardContent className='p-6'>
            <div className='flex flex-col items-center gap-4'>
              {status === "pending" && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}>
                  <Loader2 className='h-12 w-12 text-primary' />
                </motion.div>
              )}
              {status === "processing" && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  <div className='h-12 w-12 rounded-full bg-yellow-500' />
                </motion.div>
              )}
              {status === "completed" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}>
                  <div className='h-12 w-12 rounded-full bg-green-500' />
                </motion.div>
              )}
              <h3 className='text-2xl font-medium capitalize'>{status}</h3>
              <p className='text-muted-foreground'>
                {offRampStatus.isSuccess &&
                  Object.keys(offRampStatus.data).map((key) => (
                    <p key={key}>
                      {formatCasesToReadable(key)}: {offRampStatus.data[key]}
                    </p>
                  ))}
                {JSON.stringify(offRampStatus.data, null, 2)}
              </p>
              {status === "completed" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className='text-green-600 font-medium'>
                  Your offramp request has been successfully processed!
                </motion.p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </OfframpLayout>
  );
}
