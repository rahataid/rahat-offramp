"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentFormProps, TransactionDetails } from "@/types/offramp";

const offrampSchema = z.object({
  chain: z.string().min(1, "Chain is required"),
  token: z.string().min(1, "Token is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  senderAddress: z.string().min(1, "Sender address is required"),
});

export function OfframpForm({
  onSubmit,
  onBack,
  onCancel,
  provider,
}: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TransactionDetails>({
    resolver: zodResolver(offrampSchema),
    defaultValues: {
      providerUuid: provider.uuid,
      chain: "CELO",
      token: "CUSD",
    },
  });

  const amount = watch("amount");
  const token = watch("token");

  const onValidSubmit = (data: TransactionDetails) => {
    onSubmit(data);
  };

  console.log("first", provider);

  const presetAmounts = [50, 100, 200, 500];

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>
          {provider.name} Offramp
        </CardTitle>
        <CardDescription>
          Enter the transaction details to create an offramp request
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onValidSubmit)} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='chain'>Chain</Label>
            <Select
              defaultValue='CELO'
              onValueChange={(value) => setValue("chain", value)}>
              <SelectTrigger>
                <SelectValue placeholder='Select chain' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='CELO'>CELO</SelectItem>
                {/* Add more chains as needed */}
              </SelectContent>
            </Select>
            {errors.chain && (
              <p className='text-red-500 text-sm'>{errors.chain.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='token'>Token</Label>
            <Select
              defaultValue='CUSD'
              onValueChange={(value) => setValue("token", value)}>
              <SelectTrigger>
                <SelectValue placeholder='Select token' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='CUSD'>CUSD</SelectItem>
                {/* Add more tokens as needed */}
              </SelectContent>
            </Select>
            {errors.token && (
              <p className='text-red-500 text-sm'>{errors.token.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='amount'>Amount</Label>
            <Input
              id='amount'
              type='number'
              step='0.01'
              placeholder='Enter amount'
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className='text-red-500 text-sm'>{errors.amount.message}</p>
            )}
          </div>

          <div className='flex justify-between'>
            {presetAmounts.map((preset) => (
              <Button
                key={preset}
                type='button'
                variant='outline'
                onClick={() => setValue("amount", preset)}
                className='flex-1 mx-1'>
                {preset}
              </Button>
            ))}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='senderAddress'>Sender Address</Label>
            <Input
              id='senderAddress'
              placeholder='Enter sender address'
              {...register("senderAddress")}
            />
            {errors.senderAddress && (
              <p className='text-red-500 text-sm'>
                {errors.senderAddress.message}
              </p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className='flex flex-col space-y-4'>
        <Button
          onClick={handleSubmit(onValidSubmit)}
          className='w-full bg-primary hover:bg-primary/90 text-white'>
          Create Offramp Request
        </Button>
        <div className='flex justify-between w-full'>
          <Button variant='outline' onClick={onBack}>
            Back
          </Button>
          <Button variant='ghost' onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
