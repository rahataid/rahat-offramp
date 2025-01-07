"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { OfframpLayout } from "@/components/offramp-layout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useCheckOfframpStatus } from "@/lib/offramp";
import { formatCasesToReadable } from "@/utils/formatCasesToReadable";

export default function StatusPage() {
  const searchParams = useSearchParams();
  const referenceId = searchParams.get("referenceId");
  const providerUuid = searchParams.get("providerUuid") as string;
  const [statusData, setStatusData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const offRampStatus = useCheckOfframpStatus();

  const listenToOfframpEvent = async (referenceId: string) => {
    try {
      const response = await offRampStatus.mutateAsync({
        providerUuid,
        payload: { referenceId },
      });
      console.log("response", response);
      setStatusData(response.data.data);
    } catch (error) {
      console.error("Error fetching offramp status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (referenceId) {
      listenToOfframpEvent(referenceId);
    }
  }, [providerUuid, referenceId]);

  if (loading) {
    return (
      <OfframpLayout>
        <div className='flex items-center justify-center h-full'>
          <Loader2 className='h-16 w-16 text-primary animate-spin' />
        </div>
      </OfframpLayout>
    );
  }

  if (!statusData) {
    return (
      <OfframpLayout>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-red-500'>
            Status Not Found
          </h2>
        </div>
      </OfframpLayout>
    );
  }

  const { status, rate, ...details } = statusData;

  return (
    <OfframpLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='grid gap-8'>
        <div className='text-center'>
          <h2 className='text-4xl font-semibold mb-4'>Offramp Status</h2>
          <p className='text-muted-foreground'>
            Monitor the progress of your transaction in real-time.
          </p>
        </div>

        <Card className='shadow-lg border border-gray-200 rounded-lg'>
          <CardContent className='p-6'>
            <div className='flex flex-col items-center gap-6'>
              <div className='flex items-center justify-center'>
                {status === "PENDING" && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}>
                    <Loader2 className='h-12 w-12 text-yellow-500' />
                  </motion.div>
                )}
                {status === "PROCESSING" && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}>
                    <div className='h-12 w-12 rounded-full bg-blue-500 shadow-md' />
                  </motion.div>
                )}
                {status === "COMPLETED" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}>
                    <div className='h-12 w-12 rounded-full bg-green-500 shadow-lg' />
                  </motion.div>
                )}
              </div>
              <h3 className='text-2xl font-bold capitalize'>{status}</h3>

              <div className='w-full space-y-6'>
                <div>
                  <h4 className='text-lg font-medium mb-2'>
                    Transaction Details
                  </h4>
                  <div className='grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg'>
                    {Object.entries(details).map(([key, value]) => (
                      <p key={key} className='text-sm'>
                        <span className='font-medium'>
                          {formatCasesToReadable(key)}:
                        </span>{" "}
                        {typeof value === "object"
                          ? JSON.stringify(value, null, 2)
                          : value}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className='text-lg font-medium mb-2'>Rate Information</h4>
                  <div className='grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg'>
                    {Object.entries(rate).map(([key, value]) => (
                      <p key={key} className='text-sm'>
                        <span className='font-medium'>
                          {formatCasesToReadable(key)}:
                        </span>{" "}
                        {value}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {status === "COMPLETED" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className='text-green-600 font-medium text-center mt-4'>
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
