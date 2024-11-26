import React from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const KotaniPayForm = ({
  register,
  setValue,
  errors,
  presetAmounts,
}: {
  register: any;
  setValue: any;
  errors: any;
  presetAmounts: number[];
}) => {
  return (
    <>
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
          <p className='text-red-500 text-sm'>{errors.senderAddress.message}</p>
        )}
      </div>
    </>
  );
};

export default KotaniPayForm;
