import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supportedCountries } from "@/config/constants";
import { motion } from "framer-motion";
import { Loader2, CreditCard } from "lucide-react";

const formSchema = z.object({
  phone_number: z.string().min(1, "Phone number is required"),
  country_code: z.string().min(1, "Country code is required"),
  network: z.enum(["MPESA", "MTN", "AIRTEL", "VODAFONE"]),
  account_name: z.string().min(1, "Account name is required"),
  phone_code: z.string().min(1, "Phone code is required"),
  currency: z.string().min(1, "Currency is required"),
});

type AccountCreationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
};

export function KotanipayWalletCreationModal({
  isOpen,
  onClose,
  onSubmit,
}: AccountCreationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone_number: "",
      country_code: "",
      network: "MPESA",
      account_name: "",
      phone_code: "",
      currency: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Error creating account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountryChange = (
    country: string,
    phoneCode: string,
    currency: string
  ) => {
    form.setValue("country_code", country);
    form.setValue("phone_code", phoneCode);
    form.setValue("currency", currency);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold flex items-center gap-2'>
            <CreditCard className='w-6 h-6' />
            Create Kotanipay Wallet
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'>
            <FormField
              control={form.control}
              name='country_code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const countryData = supportedCountries.find(
                        (country) => country.code === value
                      );
                      handleCountryChange(
                        value,
                        countryData?.dial_code as string,
                        countryData?.currency as string
                      );
                    }}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select country' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {supportedCountries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone_number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter phone number'
                      value={
                        form.getValues("phone_code")
                          ? `${form.getValues("phone_code")}${field.value}`
                          : field.value
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.replace(
                            form.getValues("phone_code"),
                            ""
                          )
                        )
                      }
                      className='w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='network'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select network' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='MPESA'>MPESA</SelectItem>
                      <SelectItem value='MTN'>MTN</SelectItem>
                      <SelectItem value='AIRTEL'>AIRTEL</SelectItem>
                      <SelectItem value='VODAFONE'>VODAFONE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='account_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter account name'
                      className='w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='w-full'>
            <Button
              type='submit'
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isLoading}
              className='w-full py-6 text-lg font-semibold'>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
