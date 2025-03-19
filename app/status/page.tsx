"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { OfframpLayout } from "@/components/offramp-layout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useCheckOfframpStatus } from "@/lib/offramp";
import { formatCasesToReadable } from "@/utils/formatCasesToReadable";
import { Button } from "@/components/ui/button";

export default function StatusPage() {
  const searchParams = useSearchParams();
  const referenceId = searchParams.get("referenceId");
  const providerUuid = searchParams.get("providerUuid") as string;

  const [statusData, setStatusData] = useState<any>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState<number>(10);
  const [isFetching, setIsFetching] = useState(false);

  const offRampStatus = useCheckOfframpStatus();

  const fetchOfframpStatus = async () => {
    if (!referenceId) return;
    try {
      setIsFetching(true);
      const response = await offRampStatus.mutateAsync({
        providerUuid,
        payload: { referenceId },
      });
      setStatusData(response);
    } catch (err) {
      console.error("Failed to fetch Offramp Status:", err);
    } finally {
      setIsFetching(false);
      setHasFetched(true);
    }
  };

  useEffect(() => {
    if (referenceId) {
      fetchOfframpStatus();
    }
  }, [referenceId]);

  useEffect(() => {
    if (!referenceId) return;

    const intervalId = setInterval(() => {
      setRefreshCounter((prev) => {
        if (prev <= 1) {
          fetchOfframpStatus();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    if (statusData?.status === "SUCCESSFUL") {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [referenceId, statusData]);

  // Helper function to determine BaseScan URL based on key
  const getExplorerLink = (key: string, value: string) => {
    if (typeof value !== "string" || !value.startsWith("0x")) {
      return null;
    }
    if (key === "transactionHash") {
      return `https://basescan.org/tx/${value}`;
    } else if (key.toLowerCase().includes("address")) {
      return `https://basescan.org/address/${value}`;
    }
    return null;
  };

  if (!hasFetched && !statusData) {
    return (
      <OfframpLayout>
        <div className='max-w-2xl mx-auto p-6 text-center space-y-6'>
          <h2 className='text-xl font-semibold'>Loading Offramp Status...</h2>
          <Loader2 className='h-12 w-12 text-primary animate-spin mx-auto' />
        </div>
      </OfframpLayout>
    );
  }

  if (hasFetched && !statusData) {
    return (
      <OfframpLayout>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-red-500'>
            Status Not Found
          </h2>
          <p className='text-sm text-muted-foreground'>
            Reference ID: {referenceId}
          </p>
        </div>
      </OfframpLayout>
    );
  }

  const { status, rate, ...details } = statusData || {};
  return (
    <OfframpLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='grid gap-4'>
        <div className='text-center space-y-2'>
          <h2 className='text-3xl font-semibold'>Offramp Status</h2>
          <p className='text-sm text-muted-foreground'>
            Reference ID: {referenceId}
          </p>
          <p className='text-sm text-gray-500'>
            {isFetching ? (
              <span className='flex items-center justify-center gap-1'>
                <Loader2 className='h-4 w-4 animate-spin' />
                Refreshing now...
              </span>
            ) : (
              <>Next refresh in {refreshCounter}s</>
            )}
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
                {status === "INITIATED" && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}>
                    <div className='h-12 w-12 rounded-full bg-blue-500 shadow-md' />
                  </motion.div>
                )}
                {status === "SUCCESSFUL" && (
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

              <h3 className='text-2xl font-bold capitalize'>
                {status || "UNKNOWN"}
              </h3>

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
                        {typeof value === "object" ? (
                          JSON.stringify(value, null, 2)
                        ) : typeof value === "string" &&
                          value.startsWith("0x") ? (
                          getExplorerLink(key, value) ? (
                            <a
                              href={getExplorerLink(key, value)}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-600 hover:underline'>
                              {value.slice(0, 6)}...{value.slice(-4)}
                            </a>
                          ) : (
                            value
                          )
                        ) : (
                          String(value)
                        )}
                      </p>
                    ))}
                  </div>
                </div>

                {rate && (
                  <div>
                    <h4 className='text-lg font-medium mb-2'>
                      Rate Information
                    </h4>
                    <div className='grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg'>
                      {Object.entries(rate).map(([key, value]) => (
                        <p key={key} className='text-sm'>
                          <span className='font-medium'>
                            {formatCasesToReadable(key)}:
                          </span>{" "}
                          {typeof value === "string" &&
                          value.startsWith("0x") ? (
                            getExplorerLink(key, value) ? (
                              <a
                                href={getExplorerLink(key, value)}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-600 hover:underline'>
                                {value.slice(0, 6)}...{value.slice(-4)}
                              </a>
                            ) : (
                              value
                            )
                          ) : (
                            String(value)
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {status === "SUCCESSFUL" && (
                  <>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className='text-green-600 font-medium text-center mt-4'>
                      Your offramp request has been successfully processed!
                    </motion.p>
                    <Button
                      variant='outline'
                      className='mt-4 w-full'
                      onClick={() => {
                        window.location.href = "/";
                      }}>
                      Offramp Again
                      <span className='ml-2'>→</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </OfframpLayout>
  );
}
