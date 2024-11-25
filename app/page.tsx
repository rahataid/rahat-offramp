"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ServiceCard } from "@/components/service-card"
import { KotaniPayForm } from "@/components/kotani-pay-form"
import { TransakForm } from "@/components/transak-form"
import { UnlimitForm } from "@/components/unlimit-form"
import { KotaniPayQR } from "@/components/kotani-pay-qr"
import { TransakQR } from "@/components/transak-qr"
import { UnlimitQR } from "@/components/unlimit-qr"
import type { ServiceProvider, TransactionDetails } from "@/types/offramp"

const services: ServiceProvider[] = [
  {
    id: "kotanipay",
    name: "KotaniPay",
    logo: "/placeholder.svg?height=32&width=32",
    description: "Fast and secure transactions with low fees for African markets",
    PaymentFormComponent: KotaniPayForm,
    QRDisplayComponent: KotaniPayQR,
  },
  {
    id: "transak",
    name: "Transak",
    logo: "/placeholder.svg?height=32&width=32",
    description: "Global fiat-to-crypto payment gateway with wide currency support",
    PaymentFormComponent: TransakForm,
    QRDisplayComponent: TransakQR,
  },
  {
    id: "unlimit",
    name: "Unlimit",
    logo: "/placeholder.svg?height=32&width=32",
    description: "Borderless payments made simple for international transactions",
    PaymentFormComponent: UnlimitForm,
    QRDisplayComponent: UnlimitQR,
  },
]

export default function OfframpFlow() {
  const [step, setStep] = useState(1)
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null)
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null)

  const handleServiceSelect = (id: string) => {
    const provider = services.find((s) => s.id === id)
    if (provider) {
      setSelectedProvider(provider)
      setStep(2)
    }
  }

  const handleTransactionSubmit = (details: TransactionDetails) => {
    setTransactionDetails(details)
    setStep(3)
  }

  const handleComplete = () => {
    setStep(1)
    setSelectedProvider(null)
    setTransactionDetails(null)
  }

  const getStepContent = () => {
    switch (step) {
      case 1:
        return {
          title: "Choose Your Offramp Service",
          description: "Select a service provider to begin your cryptocurrency-to-fiat transaction.",
        }
      case 2:
        return {
          title: "Enter Transaction Details",
          description: "Provide the necessary information to complete your offramp transaction.",
        }
      case 3:
        return {
          title: "Review and Confirm",
          description: "Verify your transaction details and complete the process.",
        }
      default:
        return { title: "", description: "" }
    }
  }

  const { title, description } = getStepContent()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">{title}</h1>
          <p className="text-lg text-gray-600">{description}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  {...service}
                  selected={selectedProvider?.id === service.id}
                  onSelect={handleServiceSelect}
                />
              ))}
            </motion.div>
          )}

          {step === 2 && selectedProvider && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <selectedProvider.PaymentFormComponent onSubmit={handleTransactionSubmit} />
            </motion.div>
          )}

          {step === 3 && selectedProvider && transactionDetails && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <selectedProvider.QRDisplayComponent
                transactionDetails={transactionDetails}
                onComplete={handleComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

