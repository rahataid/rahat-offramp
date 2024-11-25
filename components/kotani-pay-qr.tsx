"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Copy, RefreshCw, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useExecuteOfframpRequest } from "@/lib/hooks/offramp"
import { QRDisplayProps } from "@/types/offramp"

interface ExtendedQRDisplayProps extends QRDisplayProps {
  onBack: () => void
  onCancel: () => void
}

export function KotaniPayQR({ transactionDetails, onComplete, onBack, onCancel }: ExtendedQRDisplayProps) {
  const [copied, setCopied] = useState(false)
  const executeRequest = useExecuteOfframpRequest()

  useEffect(() => {
    if (transactionDetails.id) {
      executeRequest.mutate(transactionDetails.id)
    }
  }, [transactionDetails.id])

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(transactionDetails))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative aspect-square w-64">
              <div className="h-full w-full rounded-lg bg-secondary" />
              <AnimatePresence>
                {executeRequest.isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button variant="outline" onClick={handleCopy}>
              {copied ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy KotaniPay Data"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <AnimatePresence mode="wait">
            {!executeRequest.isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center space-y-4 w-full"
              >
                {executeRequest.isSuccess ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="rounded-full bg-green-100 p-3"
                    >
                      <Check className="h-6 w-6 text-green-600" />
                    </motion.div>
                    <h3 className="text-lg font-medium text-green-600">KotaniPay Transaction Complete!</h3>
                    <Button onClick={onComplete} className="w-full">Done</Button>
                  </>
                ) : executeRequest.isError ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="rounded-full bg-red-100 p-3"
                    >
                      <XCircle className="h-6 w-6 text-red-600" />
                    </motion.div>
                    <h3 className="text-lg font-medium text-red-600">KotaniPay Transaction Failed</h3>
                    <Button variant="outline" onClick={() => executeRequest.mutate(transactionDetails.id)} className="w-full">
                      Retry
                    </Button>
                  </>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

