"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { QrCode, Wallet } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PaymentFormProps, TransactionDetails } from "@/types/offramp"

interface ExtendedPaymentFormProps extends PaymentFormProps {
  onBack: () => void
  onCancel: () => void
}

export function UnlimitForm({ onSubmit, onBack, onCancel }: ExtendedPaymentFormProps) {
  const [amount, setAmount] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [bankDetails, setBankDetails] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const details: TransactionDetails = {
      provider: "unlimit",
      amount: parseFloat(amount),
      currency: "USD",
      walletAddress: accountNumber,
      bankDetails
    }
    onSubmit(details)
  }

  const presetAmounts = [50, 100, 200, 500]

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Unlimit Transaction</CardTitle>
        <CardDescription>Enter the amount, account number, and bank details to proceed</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-lg font-medium">Amount (USD)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-4xl font-bold h-16 text-center"
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <span className="text-2xl text-gray-500">USD</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            {presetAmounts.map((preset) => (
              <Button
                key={preset}
                type="button"
                variant="outline"
                onClick={() => setAmount(preset.toString())}
                className="flex-1 mx-1"
              >
                {preset}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="account" className="text-lg font-medium">Account Number</Label>
            <div className="relative">
              <Input
                id="account"
                placeholder="Enter your account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="pl-10"
              />
              <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankDetails" className="text-lg font-medium">Bank Details</Label>
            <Textarea
              id="bankDetails"
              placeholder="Enter your bank details"
              value={bankDetails}
              onChange={(e) => setBankDetails(e.target.value)}
              rows={3}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button 
          onClick={handleSubmit} 
          className="w-full bg-primary hover:bg-primary/90 text-white"
          disabled={!amount || !accountNumber || !bankDetails}
        >
          <QrCode className="mr-2 h-5 w-5" />
          Preview USD Buy
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
  )
}

