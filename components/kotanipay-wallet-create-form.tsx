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

const formSchema = z.object({
  phone_number: z.string().min(1, "Phone number is required"),
  country_code: z.string().min(1, "Country code is required"),
  network: z.enum(["MPESA", "MTN", "AIRTEL", "VODAFONE"]),
  account_name: z.string().min(1, "Account name is required"),
  phone_code: z.string().min(1, "Phone code is required"),
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

  const handleCountryChange = (country: string, phoneCode: string) => {
    form.setValue("country_code", country);
    form.setValue("phone_code", phoneCode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'>
            <FormField
              control={form.control}
              name='country_code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const countryData = {
                        KE: "+254",
                        UG: "+256",
                        NG: "+234",
                        TZ: "+255",
                      };
                      handleCountryChange(value, countryData[value]);
                    }}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select country' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='KE'>Kenya (+254)</SelectItem>
                      <SelectItem value='UG'>Uganda (+256)</SelectItem>
                      <SelectItem value='NG'>Nigeria (+234)</SelectItem>
                      <SelectItem value='TZ'>Tanzania (+255)</SelectItem>
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
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='submit'
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
