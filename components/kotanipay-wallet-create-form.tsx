import { useEffect, useState } from "react";
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

// Validation schema
const formSchema = z.object({
  phone_number: z.string().min(1, "Phone number is required"),
  country_code: z.string().min(1, "Country is required"),
  network: z.enum(["MPESA", "MTN", "AIRTEL", "VODAFONE"]),
  account_name: z.string().min(1, "Account name is required"),
  phone_code: z.string().min(1, "Phone code is required"),
  currency: z.string().min(1, "Currency is required"),
});

type AccountCreationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
  defaultPhoneNumber?: string; // Optional prop to pre-fill phone
};

export function KotanipayWalletCreationModal({
  isOpen,
  onClose,
  onSubmit,
  defaultPhoneNumber = "",
}: AccountCreationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone_number: defaultPhoneNumber.replace(/^\+\d{1,4}/, ""),
      country_code: "",
      network: "MPESA",
      account_name: "",
      phone_code: "",
      currency: "",
    },
  });

  useEffect(() => {
    if (defaultPhoneNumber) {
      const found = supportedCountries.find((c) =>
        defaultPhoneNumber.startsWith(c.dial_code)
      );
      if (found) {
        form.setValue("phone_code", found.dial_code);
        form.setValue(
          "phone_number",
          defaultPhoneNumber.replace(found.dial_code, "")
        );
        form.setValue("country_code", found.code);
        form.setValue("currency", found.currency);
      }
    }
  }, [defaultPhoneNumber]);

  const handleCountryChange = (
    country: string,
    phoneCode: string,
    currency: string
  ) => {
    form.setValue("country_code", country);
    form.setValue("phone_code", phoneCode);
    form.setValue("currency", currency);
    form.setValue("phone_number", ""); // Clear input to prevent mismatch
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      setErrorMessage("Failed to create wallet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) onClose();
      }}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold flex items-center gap-2'>
            <CreditCard className='w-5 h-5' />
            Create Kotanipay Wallet
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'>
            {/* Country */}
            <FormField
              control={form.control}
              name='country_code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const country = supportedCountries.find(
                        (c) => c.code === value
                      );
                      if (country) {
                        handleCountryChange(
                          value,
                          country.dial_code,
                          country.currency
                        );
                      }
                    }}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
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

            {/* Phone */}
            <FormField
              control={form.control}
              name='phone_number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      placeholder='Enter phone number'
                      {...field}
                      value={`${form.getValues("phone_code")}${field.value}`}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.replace(
                            form.getValues("phone_code"),
                            ""
                          )
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Network */}
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
                      <SelectTrigger>
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

            {/* Account Name */}
            <FormField
              control={form.control}
              name='account_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter account name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error */}
            {errorMessage && (
              <p className='text-sm text-red-500'>{errorMessage}</p>
            )}
          </form>
        </Form>

        <DialogFooter className='mt-4'>
          <motion.div
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            className='w-full'>
            <Button
              type='submit'
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isLoading || !form.formState.isValid}
              className='w-full py-5 text-base'>
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
