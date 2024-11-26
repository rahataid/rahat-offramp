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
import KotaniPayForm from "./kotani-pay-form";

const offrampSchema = z.object({
  chain: z.string().min(1, "Chain is required"),
  token: z.string().min(1, "Token is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  senderAddress: z.string().min(1, "Sender address is required"),
  providerUuid: z.string().min(1, "Provider is required"),
});

export function OfframpForm({
  onSubmit,
  onBack,
  onCancel,
  provider,
  providerName,
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
      providerUuid: provider?.uuid,
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

  const renderForm = () => {
    switch (providerName) {
      case "Kotani Pay":
        return (
          <KotaniPayForm
            setValue={setValue}
            register={register}
            errors={errors}
            presetAmounts={presetAmounts}
            key={provider.uuid}
          />
        );

      default:
        return (
          <div className='space-y-2'>
            No additional fields required for {providerName}
          </div>
        );
    }
  };

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
          {renderForm()}
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
