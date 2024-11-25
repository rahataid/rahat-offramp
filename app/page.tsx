"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ServiceCard } from "@/components/service-card";
import { OfframpForm } from "@/components/offramp-form";
import { OfframpQR } from "@/components/offramp-qr";
import { Button } from "@/components/ui/button";
import type { ServiceProvider, TransactionDetails } from "@/types/offramp";
import {
  useCreateOfframpRequest,
  useExecuteOfframpRequest,
  useListOfframpProviders,
} from "@/lib/offramp";

export default function OfframpFlow() {
  const [step, setStep] = useState(1);
  const [selectedProvider, setSelectedProvider] =
    useState<ServiceProvider | null>(null);
  const [transactionDetails, setTransactionDetails] =
    useState<TransactionDetails | null>(null);

  const { data: providers, isLoading, error } = useListOfframpProviders();
  const createOfframpRequest = useCreateOfframpRequest();
  const executeOfframpRequest = useExecuteOfframpRequest();

  const handleServiceSelect = (uuid: string) => {
    const provider = providers?.find((p: ServiceProvider) => p.uuid === uuid);
    if (provider) {
      setSelectedProvider(provider);
      setStep(2);
    }
  };

  const handleTransactionSubmit = async (details: TransactionDetails) => {
    try {
      const result = await createOfframpRequest.mutateAsync(details);
      setTransactionDetails({ ...details, requestUuid: result.id });
      setStep(3);
    } catch (error) {
      console.error("Failed to create offramp request:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleExecuteTransaction = async () => {
    if (transactionDetails && selectedProvider) {
      console.log("selectedProvider", selectedProvider);
      try {
        await executeOfframpRequest.mutateAsync({
          providerUuid: selectedProvider.uuid,
          requestUuid: transactionDetails.requestUuid!,
          data: {
            chain: transactionDetails.chain,
            token: transactionDetails.token,
            transaction_hash:
              "0x3e9c73530c5fa666a6ccf49296cdbaa5e82084695bce935c888e4bc096734b41", // This should be dynamically generated
            wallet_id: "66f3cdee84e385a32f6fe1b4", // This should be dynamically generated
            request_id: transactionDetails.requestUuid,
            customer_key: "QozR5knCfvkdAezXT7rx", // This should be dynamically generated
          },
        });
        setStep(4);
      } catch (error) {
        console.error("Failed to execute offramp request:", error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  const handleComplete = () => {
    setStep(1);
    setSelectedProvider(null);
    setTransactionDetails(null);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCancel = () => {
    setStep(1);
    setSelectedProvider(null);
    setTransactionDetails(null);
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return {
          title: "Choose Your Offramp Service",
          description:
            "Select a service provider to begin your cryptocurrency-to-fiat transaction.",
        };
      case 2:
        return {
          title: "Enter Transaction Details",
          description:
            "Provide the necessary information to create your offramp request.",
        };
      case 3:
        return {
          title: "Review and Confirm",
          description:
            "Verify your transaction details and execute the offramp request.",
        };
      case 4:
        return {
          title: "Transaction Complete",
          description: "Your offramp request has been executed successfully.",
        };
      default:
        return { title: "", description: "" };
    }
  };

  const { title, description } = getStepContent();

  if (isLoading)
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading providers...
      </div>
    );
  if (error)
    return (
      <div className='flex justify-center items-center h-screen text-red-500'>
        Error loading providers: {error.message}
      </div>
    );

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50'>
      <div className='mx-auto max-w-2xl px-4 py-16'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8 text-center'>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900 mb-2'>
            {title}
          </h1>
          <p className='text-lg text-gray-600'>{description}</p>
        </motion.div>

        <AnimatePresence mode='wait'>
          {step === 1 && (
            <motion.div
              key='step1'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className='space-y-4'>
              {providers?.map((service: ServiceProvider) => (
                <ServiceCard
                  key={service.uuid}
                  id={service.uuid}
                  name={service.name}
                  logo={service.logo}
                  description={service.description}
                  selected={selectedProvider?.uuid === service.uuid}
                  onSelect={handleServiceSelect}
                />
              ))}
            </motion.div>
          )}

          {step === 2 && selectedProvider && (
            <motion.div
              key='step2'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}>
              <OfframpForm
                onSubmit={handleTransactionSubmit}
                onBack={handleBack}
                onCancel={handleCancel}
                provider={selectedProvider}
              />
            </motion.div>
          )}

          {step === 3 && selectedProvider && transactionDetails && (
            <motion.div
              key='step3'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}>
              <OfframpQR
                transactionDetails={transactionDetails}
                onComplete={handleExecuteTransaction}
                onBack={handleBack}
                onCancel={handleCancel}
                provider={selectedProvider}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key='step4'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className='text-center'>
              <h2 className='text-2xl font-bold mb-4'>
                Transaction Completed Successfully!
              </h2>
              <Button onClick={handleComplete}>Start New Transaction</Button>
            </motion.div>
          )}
        </AnimatePresence>

        {step > 1 && step < 4 && (
          <div className='mt-8 flex justify-between'>
            <Button variant='outline' onClick={handleBack}>
              Back
            </Button>
            <Button variant='ghost' onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
