"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Copy, QrCode } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { QRDisplayProps } from "@/types/offramp"

export function OfframpQR({ transactionDetails, onComplete, onBack, onCancel, provider }: QRDisplayProps) {
  const [copied, setCopied] = useState(false)

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
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{provider.name} Offramp Request</CardTitle>
          <CardDescription>Review your transaction details and execute the offramp request</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative aspect-square w-64">
              <div className="h-full w-full rounded-lg bg-secondary flex items-center justify-center">
                <QrCode className="h-32 w-32 text-primary" />
              </div>
            </div>
            <Button variant="outline" onClick={handleCopy}>
              {copied ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy Transaction Details"}
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            <p><strong>Chain:</strong> {transactionDetails.chain}</p>
            <p><strong>Token:</strong> {transactionDetails.token}</p>
            <p><strong>Amount:</strong> {transactionDetails.amount}</p>
            <p><strong>Sender Address:</strong> {transactionDetails.senderAddress}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            onClick={onComplete}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            Execute Offramp Request
          </Button>
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

