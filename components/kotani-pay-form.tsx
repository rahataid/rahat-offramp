"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { QrCode, Wallet } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PaymentFormProps, KotaniPayDetails } from "@/types/offramp"
import { kotaniPaySchema } from "@/lib/schemas"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function KotaniPayForm({ onSubmit, onBack, onCancel, supportedCurrencies }: PaymentFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<KotaniPayDetails>({
    resolver: zodResolver(kotaniPaySchema),
    defaultValues: {
      provider: "kotanipay",
      currency: supportedCurrencies[0] || "KES",
    },
  })

  const amount = watch("amount")
  const currency = watch("currency")

  const onValidSubmit = (data: KotaniPayDetails) => {
    onSubmit(data)
  }

  const presetAmounts = [50, 100, 200, 500]

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">KotaniPay Transaction</CardTitle>
        <CardDescription>Enter the amount and your phone number to proceed</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="amount" className="text-lg font-medium">Amount</Label>
              <Select value={currency} onValueChange={(value) => setValue("currency", value)}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {supportedCurrencies.map((curr) => (
                    <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                {...register("amount", { valueAsNumber: true })}
                className="text-4xl font-bold h-16 text-center"
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <span className="text-2xl text-gray-500">{currency}</span>
              </div>
            </div>
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
          </div>
          <div className="flex justify-between">
            {presetAmounts.map((preset) => (
              <Button
                key={preset}
                type="button"
                variant="outline"
                onClick={() => setValue("amount", preset)}
                className="flex-1 mx-1"
              >
                {preset}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-lg font-medium">Phone Number</Label>
            <div className="relative">
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                {...register("phoneNumber")}
                className="pl-10"
              />
              <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button 
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white"
          disabled={!amount || !currency}
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

