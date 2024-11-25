"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ServiceCard } from "@/components/service-card";
import { KotaniPayForm } from "@/components/kotani-pay-form";
import { TransakForm } from "@/components/transak-form";
import { UnlimitForm } from "@/components/unlimit-form";
import { KotaniPayQR } from "@/components/kotani-pay-qr";
import { TransakQR } from "@/components/transak-qr";
import { UnlimitQR } from "@/components/unlimit-qr";
import { Button } from "@/components/ui/button";
import type { ServiceProvider, TransactionDetails } from "@/types/offramp";
import {
  useCreateOfframpRequest,
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

  const handleServiceSelect = (id: string) => {
    const provider = providers?.find((p: ServiceProvider) => p.uuid === id);
    if (provider) {
      setSelectedProvider(provider);
      setStep(2);
    }
  };

  const handleTransactionSubmit = async (details: TransactionDetails) => {
    try {
      const result = await createOfframpRequest.mutateAsync(details);
      setTransactionDetails(result);
      setStep(3);
    } catch (error) {
      console.error("Failed to create offramp request:", error);
      // Handle error (e.g., show error message to user)
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
            "Provide the necessary information to complete your offramp transaction.",
        };
      case 3:
        return {
          title: "Review and Confirm",
          description:
            "Verify your transaction details and complete the process.",
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

  const getProviderForm = (provider: ServiceProvider) => {
    const supportedCurrencies = provider.extras.supportedCurrency;
    switch (provider.name.toLowerCase()) {
      case "kotani pay":
        return (
          <KotaniPayForm
            onSubmit={handleTransactionSubmit}
            onBack={handleBack}
            onCancel={handleCancel}
            supportedCurrencies={supportedCurrencies}
          />
        );
      case "transak":
        return (
          <TransakForm
            onSubmit={handleTransactionSubmit}
            onBack={handleBack}
            onCancel={handleCancel}
            supportedCurrencies={supportedCurrencies}
          />
        );
      case "unlimit":
        return (
          <UnlimitForm
            onSubmit={handleTransactionSubmit}
            onBack={handleBack}
            onCancel={handleCancel}
            supportedCurrencies={supportedCurrencies}
          />
        );
      default:
        return <div>Unsupported provider</div>;
    }
  };

  const getProviderQR = (provider: ServiceProvider) => {
    switch (provider.name.toLowerCase()) {
      case "kotani pay":
        return (
          <KotaniPayQR
            transactionDetails={transactionDetails!}
            onComplete={handleComplete}
            onBack={handleBack}
            onCancel={handleCancel}
          />
        );
      case "transak":
        return (
          <TransakQR
            transactionDetails={transactionDetails!}
            onComplete={handleComplete}
            onBack={handleBack}
            onCancel={handleCancel}
          />
        );
      case "unlimit":
        return (
          <UnlimitQR
            transactionDetails={transactionDetails!}
            onComplete={handleComplete}
            onBack={handleBack}
            onCancel={handleCancel}
          />
        );
      default:
        return <div>Unsupported provider</div>;
    }
  };

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
              {Array.isArray(providers) && providers.length > 0 ? (
                providers.map((service: ServiceProvider) => (
                  <ServiceCard
                    key={service.uuid}
                    id={service.uuid}
                    name={service.name}
                    logo={service.logo}
                    description={service.description}
                    selected={selectedProvider?.uuid === service.uuid}
                    onSelect={handleServiceSelect}
                  />
                ))
              ) : (
                <div className='text-center text-gray-500'>
                  No offramp providers available at the moment.
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && selectedProvider && (
            <motion.div
              key='step2'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}>
              {getProviderForm(selectedProvider)}
            </motion.div>
          )}

          {step === 3 && selectedProvider && transactionDetails && (
            <motion.div
              key='step3'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}>
              {getProviderQR(selectedProvider)}
            </motion.div>
          )}
        </AnimatePresence>

        {step > 1 && (
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
