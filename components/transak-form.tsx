"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { QrCode, Wallet } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PaymentFormProps, TransactionDetails } from "@/types/offramp"

interface ExtendedPaymentFormProps extends PaymentFormProps {
  onBack: () => void
  onCancel: () => void
}

export function TransakForm({ onSubmit, onBack, onCancel }: ExtendedPaymentFormProps) {
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [walletAddress, setWalletAddress] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const details: TransactionDetails = {
      provider: "transak",
      amount: parseFloat(amount),
      currency,
      walletAddress
    }
    onSubmit(details)
  }

  const presetAmounts = [50, 100, 200, 500]

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Transak Transaction</CardTitle>
        <CardDescription>Enter the amount, currency, and wallet address to proceed</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="amount" className="text-lg font-medium">Amount</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                <span className="text-2xl text-gray-500">{currency}</span>
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
            <Label htmlFor="wallet" className="text-lg font-medium">Wallet Address</Label>
            <div className="relative">
              <Input
                id="wallet"
                placeholder="Enter wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="pl-10"
              />
              <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button 
          onClick={handleSubmit} 
          className="w-full bg-primary hover:bg-primary/90 text-white"
          disabled={!amount || !currency || !walletAddress}
        >
          <QrCode className="mr-2 h-5 w-5" />
          Preview {currency} Buy
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

