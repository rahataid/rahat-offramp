import * as React from "react"
import { AnimatePresence } from "framer-motion"

import { LandingScreen } from "./landing-screen"
import { CreateOfframpRequest } from "./create-offramp-request"
import { ConfirmTransaction } from "./confirm-transaction"
import { TransactionStatus } from "./transaction-status"
import { TransactionConfirmed } from "./transaction-confirmed"

type Step = "landing" | "create" | "confirm" | "status" | "confirmed"

export function OfframpFlow() {
  const [step, setStep] = React.useState<Step>("landing")
  const [transactionDetails, setTransactionDetails] = React.useState<any>(null)

  const handleStartNewTransaction = () => {
    setStep("create")
  }

  const handleCreateOfframpRequest = (data: any) => {
    setTransactionDetails(data)
    setStep("confirm")
  }

  const handleConfirmTransaction = () => {
    setStep("status")
  }

  const handleTransactionComplete = () => {
    setStep("confirmed")
  }

  const handleClose = () => {
    setStep("landing")
    setTransactionDetails(null)
  }

  return (
    <AnimatePresence mode="wait">
      {step === "landing" && (
        <LandingScreen key="landing" onStartNewTransaction={handleStartNewTransaction} />
      )}
      {step === "create" && (
        <CreateOfframpRequest key="create" onNext={handleCreateOfframpRequest} />
      )}
      {step === "confirm" && (
        <ConfirmTransaction
          key="confirm"
          details={transactionDetails}
          onConfirm={handleConfirmTransaction}
          onEdit={() => setStep("create")}
        />
      )}
      {step === "status" && (
        <TransactionStatus key="status" onComplete={handleTransactionComplete} />
      )}
      {step === "confirmed" && (
        <TransactionConfirmed key="confirmed" details={transactionDetails} onClose={handleClose} />
      )}
    </AnimatePresence>
  )
}

