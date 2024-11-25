"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PaymentFormProps, TransactionDetails } from "@/types/offramp";

export function KotaniPayForm({ onSubmit }: PaymentFormProps) {
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const details: TransactionDetails = {
      provider: "kotanipay",
      amount: parseFloat(amount),
      currency: "KES",
      walletAddress: phoneNumber,
      phoneNumber,
    };
    onSubmit(details);
  };

  const presetAmounts = [50, 100, 200, 500];

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>
          KotaniPay Transaction
        </CardTitle>
        <CardDescription>
          Enter the amount and your phone number to proceed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='amount' className='text-lg font-medium'>
              Amount (KES)
            </Label>
            <div className='relative'>
              <Input
                id='amount'
                type='number'
                placeholder='Enter amount'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className='text-xl font-bold h-16 text-center'
              />
              <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                <span className='text-2xl text-gray-500'>KES</span>
              </div>
            </div>
            <div className='text-sm text-gray-500 text-center'>
              ~ {(parseFloat(amount) * 0.0067).toFixed(2)} USD
            </div>
          </div>
          <div className='flex justify-between'>
            {presetAmounts.map((preset) => (
              <Button
                key={preset}
                type='button'
                variant='outline'
                onClick={() => setAmount(preset.toString())}
                className='flex-1 mx-1'>
                {preset}
              </Button>
            ))}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='phone' className='text-lg font-medium'>
              Phone Number
            </Label>
            <div className='relative'>
              <Input
                id='phone'
                type='tel'
                placeholder='Enter your phone number'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className='pl-10'
              />
              <Wallet className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          className='w-full bg-primary hover:bg-primary/90 text-white'
          disabled={!amount || !phoneNumber}>
          <QrCode className='mr-2 h-5 w-5' />
          Preview K $$ Buy
        </Button>
      </CardFooter>
    </Card>
  );
}
