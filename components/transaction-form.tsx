"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { QrCode, Wallet } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TransactionDetails, ServiceProvider } from "@/types/offramp"

interface TransactionFormProps {
  provider: ServiceProvider
  onSubmit: (details: TransactionDetails) => void
}

export function TransactionForm({ provider, onSubmit }: TransactionFormProps) {
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [walletAddress, setWalletAddress] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      provider,
      amount: parseFloat(amount),
      currency,
      walletAddress,
    })
  }

  const isValid = amount && currency && walletAddress

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="flex gap-2">
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1"
            />
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="wallet">Wallet Address</Label>
          <div className="relative">
            <Input
              id="wallet"
              placeholder="Enter wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="pr-10"
            />
            <Wallet className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={!isValid}>
        <QrCode className="mr-2 h-4 w-4" />
        Generate QR Code
      </Button>
    </motion.form>
  )
}

