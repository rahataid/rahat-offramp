import { useState, useEffect } from "react";
import { OfframpProvider, OfframpFormProps } from "@/types/provider";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "use-debounce";
import { AccountCreationModal } from "./AccountCreationModal";

const formSchema = z.object({
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z.string().min(10, "Valid phone number required"),
  amount: z.string().min(1, "Amount must be greater than 0"),
});

async function checkWalletInfo(countryCode: string, phoneNumber: string) {
  // Replace this with your actual API call
  const response = await fetch(`/api/check-wallet?countryCode=${countryCode}&phoneNumber=${phoneNumber}`);
  if (!response.ok) {
    throw new Error("Wallet not found");
  }
  return response.json();
}

async function createAccount(data: z.infer<typeof formSchema>) {
  // Replace this with your actual API call
  const response = await fetch("/api/create-account", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create account");
  }
  return response.json();
}

function KotaniPayForm({ onSubmit }: OfframpFormProps) {
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      countryCode: "",
      phoneNumber: "",
      amount: "",
    },
  });

  const countryCode = form.watch("countryCode");
  const phoneNumber = form.watch("phoneNumber");
  const [debouncedCountryCode] = useDebounce(countryCode, 500);
  const [debouncedPhoneNumber] = useDebounce(phoneNumber, 500);

  useEffect(() => {
    if (debouncedCountryCode && debouncedPhoneNumber) {
      setIsLoading(true);
      checkWalletInfo(debouncedCountryCode, debouncedPhoneNumber)
        .then((info) => {
          setWalletInfo(info);
          setIsLoading(false);
        })
        .catch(() => {
          setWalletInfo(null);
          setIsLoading(false);
        });
    }
  }, [debouncedCountryCode, debouncedPhoneNumber]);

  const handleCreateAccount = async (data: z.infer<typeof formSchema>) => {
    try {
      const newAccount = await createAccount(data);
      setWalletInfo(newAccount);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="countryCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country Code</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country code" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="GHA">Ghana (+233)</SelectItem>
                  {/* Add more country codes as needed */}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isLoading && <p>Checking wallet info...</p>}
        {walletInfo ? (
          <div>
            <h3>Wallet Info</h3>
            <p>Account Name: {walletInfo.accountName}</p>
            <p>Balance: {walletInfo.balance}</p>
          </div>
        ) : (
          <Button type="button" onClick={() => setIsModalOpen(true)}>
            Create Account
          </Button>
        )}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount to send</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-2">
          Submit
        </Button>
      </form>
      <AccountCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAccount}
      />
    </Form>
  );
}

export const kotanipayProvider: OfframpProvider = {
  id: "kotanipayProvider",
  name: "Kotani Pay",
  icon: "/placeholder.svg?height=40&width=40",
  supportedChains: [1, 137], // Ethereum and Polygon
  supportedTokens: ["USDC", "USDT"],
  FormComponent: KotaniPayForm,
};

