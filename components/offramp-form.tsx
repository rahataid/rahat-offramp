"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  Loader2,
  DollarSign,
  Building,
  CreditCard,
  Coins,
  ArrowRight,
  AlertCircle,
  Users,
  QrCode,
  ArrowLeftRight,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import QRCode from "qrcode.react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  provider: z.string().min(1, "Provider is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  currency: z.string().min(1, "Currency is required"),
  isGroupOffering: z.boolean().default(false),
});

const providers = [
  { id: "kotanipay", name: "KotaniPay", balance: "384,595.20 USD" },
  { id: "transak", name: "Transak", balance: "34,874.15 GBP" },
  { id: "wise", name: "Wise", balance: "447,256.13 USD" },
  { id: "unlimit", name: "Unlimit", balance: "236,564.00 EUR" },
];

export function OfframpForm() {
  const [step, setStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [showQR, setShowQR] = React.useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    React.useState(false);
  // const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      provider: "",
      accountNumber: "",
      currency: "",
      isGroupOffering: false,
    },
  });

  React.useEffect(() => {
    setProgress((step / 4) * 100);
  }, [step]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(25);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(50);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(75);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(100);

      setIsConfirmationDialogOpen(true);
    } catch (error) {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: "Something went wrong. Please try again.",
      // })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className='w-full max-w-4xl mx-auto bg-white dark:bg-gray-950'>
      <CardHeader className='border-b'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-2xl font-bold'>
              Offramp Request
            </CardTitle>
            <CardDescription>Convert crypto to mobile money</CardDescription>
          </div>
          <Tabs defaultValue='send' className='w-[400px]'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='send'>Send</TabsTrigger>
              <TabsTrigger value='receive'>Receive</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className='mt-6'>
          <Progress value={progress} className='h-1' />
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className='p-6'>
            <AnimatePresence mode='wait'>
              {step === 1 && (
                <motion.div
                  key='step1'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className='grid gap-6 md:grid-cols-2'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-lg font-medium'>Send</h3>
                      <Button variant='ghost' size='sm'>
                        <ArrowLeftRight className='h-4 w-4 mr-2' />
                        Swap
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name='amount'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className='relative'>
                              <Input
                                placeholder='0.00'
                                className='text-3xl h-16 font-medium'
                                {...field}
                              />
                              <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                                <Select>
                                  <SelectTrigger className='w-[100px] border-0 bg-transparent'>
                                    <SelectValue placeholder='BTC' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value='btc'>BTC</SelectItem>
                                    <SelectItem value='eth'>ETH</SelectItem>
                                    <SelectItem value='usdc'>USDC</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='space-y-4'>
                    <h3 className='text-lg font-medium'>Get</h3>
                    <div className='relative'>
                      <Input
                        readOnly
                        value={(
                          parseFloat(form.watch("amount") || "0") * 1.25
                        ).toFixed(2)}
                        className='text-3xl h-16 font-medium bg-muted'
                      />
                      <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                        <Select>
                          <SelectTrigger className='w-[100px] border-0 bg-transparent'>
                            <SelectValue placeholder='USD' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='usd'>USD</SelectItem>
                            <SelectItem value='eur'>EUR</SelectItem>
                            <SelectItem value='gbp'>GBP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key='step2'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className='space-y-6'>
                  <div className='grid gap-6'>
                    <FormField
                      control={form.control}
                      name='provider'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Provider</FormLabel>
                          <div className='grid gap-4'>
                            {providers.map((provider) => (
                              <Card
                                key={provider.id}
                                className={`cursor-pointer transition-colors ${
                                  field.value === provider.id
                                    ? "border-primary"
                                    : "hover:bg-muted/50"
                                }`}
                                onClick={() =>
                                  form.setValue("provider", provider.id)
                                }>
                                <CardContent className='flex items-center justify-between p-4'>
                                  <div className='flex items-center space-x-4'>
                                    <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                                      <Building className='w-5 h-5' />
                                    </div>
                                    <div>
                                      <p className='font-medium'>
                                        {provider.name}
                                      </p>
                                      <p className='text-sm text-muted-foreground'>
                                        Balance: {provider.balance}
                                      </p>
                                    </div>
                                  </div>
                                  {field.value === provider.id && (
                                    <Check className='w-5 h-5 text-primary' />
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div
                  key='step3'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className='space-y-6'>
                  <div className='rounded-lg border p-6 space-y-4 bg-muted/50'>
                    <h3 className='text-lg font-semibold mb-4'>
                      Transaction Summary
                    </h3>
                    <div className='flex justify-between items-center'>
                      <span className='text-muted-foreground flex items-center'>
                        <DollarSign className='w-5 h-5 mr-2' />
                        Amount:
                      </span>
                      <span className='font-medium'>
                        {form.getValues("amount")} BTC
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-muted-foreground flex items-center'>
                        <Building className='w-5 h-5 mr-2' />
                        Provider:
                      </span>
                      <span className='font-medium'>
                        {form.getValues("provider")}
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-muted-foreground flex items-center'>
                        <CreditCard className='w-5 h-5 mr-2' />
                        Account:
                      </span>
                      <span className='font-medium'>
                        {form.getValues("accountNumber")}
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-muted-foreground flex items-center'>
                        <Coins className='w-5 h-5 mr-2' />
                        You'll receive:
                      </span>
                      <span className='font-medium text-xl'>
                        {(
                          parseFloat(form.getValues("amount") || "0") * 1.25
                        ).toFixed(2)}{" "}
                        USD
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center p-4 bg-yellow-100 rounded-lg'>
                    <AlertCircle className='w-6 h-6 text-yellow-600 mr-3' />
                    <p className='text-sm text-yellow-700'>
                      Please review your transaction details carefully before
                      submitting.
                    </p>
                  </div>
                </motion.div>
              )}
              {step === 4 && (
                <motion.div
                  key='step4'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className='space-y-6'>
                  <div className='flex flex-col items-center justify-center py-12'>
                    <Loader2 className='w-12 h-12 animate-spin text-primary mb-4' />
                    <h3 className='text-lg font-semibold mb-2'>
                      Processing Transaction
                    </h3>
                    <p className='text-center text-muted-foreground'>
                      Please wait while we confirm your transaction. This may
                      take a few moments.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter className='border-t p-6'>
            <div className='flex justify-between w-full'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1 || isLoading}>
                Previous
              </Button>
              <Button
                type={step === 3 ? "submit" : "button"}
                onClick={() => {
                  if (step < 4) {
                    setStep((s) => Math.min(4, s + 1));
                  }
                }}
                disabled={isLoading || step === 4}
                className='bg-[#696FFF] hover:bg-[#5158FF]'>
                {isLoading ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Processing
                  </>
                ) : step === 3 ? (
                  <>
                    Exchange Now
                    <ArrowRight className='w-4 h-4 ml-2' />
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className='w-4 h-4 ml-2' />
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to transfer the account details.
            </DialogDescription>
          </DialogHeader>
          <div className='flex justify-center py-4'>
            <QRCode value={JSON.stringify(form.getValues())} size={200} />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Confirmed</DialogTitle>
            <DialogDescription>
              Your offramp request has been successfully processed and
              confirmed.
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col items-center justify-center py-4'>
            <Check className='w-12 h-12 text-green-500 mb-4' />
            <p className='text-center text-muted-foreground'>
              Transaction ID:{" "}
              {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
          <Button
            onClick={() => {
              setIsConfirmationDialogOpen(false);
              setStep(1);
              form.reset();
            }}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
