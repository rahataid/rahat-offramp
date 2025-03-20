import { KotanipayWalletCreationModal } from "@/components/kotanipay-wallet-create-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useCreateCustomerMobileMoneyWallet,
  useGetCustomerMobileMoneyWalletByPhone,
} from "@/lib/offramp";
import { OfframpFormProps, OfframpProvider } from "@/types/provider";
import { formatCasesToReadable } from "@/utils/formatCasesToReadable";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { z } from "zod";
import { Check, X, Clock } from "lucide-react"; // For status icons
import { format } from "date-fns"; // For date formatting
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

// Define the form schema using Zod for validation
const formSchema = z.object({
  phoneNumber: z.string().min(10, "Valid phone number required"),
  amount: z.string().min(1, "Amount must be greater than 0"),
});

function KotaniPayForm({ onSubmit }: OfframpFormProps) {
  // State management
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionByPhone, setTransactionsByPhone] = useState([]);

  // Hooks for API calls and navigation
  const getCustomerWalletByPhone = useGetCustomerMobileMoneyWalletByPhone();
  const createCustomerWallet = useCreateCustomerMobileMoneyWallet();
  const searchParams = useSearchParams();
  const providerUuid = searchParams.get("providerUuid");
  const chain = searchParams.get("chain");
  const router = useRouter();

  // Initialize the form with react-hook-form and Zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      amount: "",
    },
  });

  // Function to check wallet info by phone number
  async function checkWalletInfo(phoneNumber: string) {
    const walletInfo = await getCustomerWalletByPhone.mutateAsync({
      providerUuid,
      payload: {
        phone_number: phoneNumber,
      },
    });
    console.log("w", walletInfo);
    return walletInfo;
  }

  // Function to create a new account
  async function createAccount(data: z.infer<typeof formSchema>) {
    await createCustomerWallet.mutateAsync({
      providerUuid,
      payload: {
        phone_number: data.phone_code + data.phone_number,
        country_code: data.country_code,
        network: data.network,
        account_name: data.account_name,
      },
    });
  }

  // Watch phone number input and debounce it
  const phoneNumber = form.watch("phoneNumber");
  const [debouncedPhoneNumber] = useDebounce(
    phoneNumber?.replace(/\s/g, ""),
    100
  );

  // Effect to check wallet info when phone number changes
  useEffect(() => {
    if (debouncedPhoneNumber) {
      setIsLoading(true);
      checkWalletInfo(debouncedPhoneNumber)
        .then((info) => {
          console.log("info", info);
          setWalletInfo(info.data);
          setTransactionsByPhone(info.transaction);
          setIsLoading(false);
        })
        .catch(() => {
          setWalletInfo(null);
          setIsLoading(false);
        });
    }
  }, [debouncedPhoneNumber]);

  // Handle account creation
  const handleCreateAccount = async (data: z.infer<typeof formSchema>) => {
    try {
      await createAccount(data).then((res) => {
        setWalletInfo(res);
        setIsModalOpen(false);
      });
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  // Check if there are any pending transactions
  const hasTransactionsPending = transactionByPhone.some(
    (transaction) =>
      transaction.status !== "COMPLETED" && transaction.status !== "CANCELLED"
  );

  // Function to get status icon based on transaction status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Check className='text-green-500' />;
      case "CANCELLED":
        return <X className='text-red-500' />;
      default:
        return <Clock className='text-yellow-500' />;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((d) => onSubmit({ ...d, walletInfo }))}
        className='space-y-6'>
        {/* Phone Number Field */}
        <FormField
          control={form.control}
          name='phoneNumber'
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

        {/* Loading Indicator */}
        {isLoading && <p>Checking wallet info...</p>}

        {/* Wallet Info Display */}
        {walletInfo ? (
          <div>
            <h3 className='font-bold'>Wallet Info</h3>
            {walletInfo &&
              Object.keys(walletInfo).map((key) => (
                <p key={key}>
                  {formatCasesToReadable(key)}: {walletInfo[key]}
                </p>
              ))}

            {/* Enhanced Transaction List Display */}
            {transactionByPhone.length > 0 && (
              <div className='bg-white p-4 rounded-lg shadow'>
                <Accordion type='single' collapsible className='space-y-2'>
                  <AccordionItem value='previous-offramps'>
                    <AccordionTrigger className='font-bold text-lg'>
                      Previous Offramps
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className='space-y-4'>
                        {transactionByPhone.map((transaction) => (
                          <div
                            key={transaction.id}
                            className='flex flex-col p-4 border-b bg-gray-50 rounded-lg'>
                            <div className='flex items-center gap-2 mb-2'>
                              {getStatusIcon(transaction.status)}
                              <span className='font-medium capitalize'>
                                {transaction.status.toLowerCase()}
                              </span>
                            </div>
                            <p className='text-sm text-gray-600'>
                              Reference ID: {transaction.referenceId}
                            </p>
                            <p className='text-sm text-gray-600'>
                              Created At:{" "}
                              {format(new Date(transaction.createdAt), "PPp")}
                            </p>
                            <Link
                              target='_blank'
                              // like outlined button
                              className='mt-2 inline-block text-blue-500 hover:text-blue-700 px-2 py-1 border border-blue-500 rounded-lg w-full text-center'
                              href={`/status?referenceId=${transaction.referenceId}&providerUuid=${providerUuid}`}>
                              Detail
                            </Link>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </div>
        ) : (
          <Button type='button' onClick={() => setIsModalOpen(true)}>
            Create Account
          </Button>
        )}

        {/* Amount Field (shown only if no pending transactions) */}
        {!hasTransactionsPending && (
          <FormField
            control={form.control}
            name='amount'
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
        )}

        {/* Submit Button */}
        <Button type='submit' className='w-full mt-2'>
          Submit
        </Button>
      </form>

      {/* Wallet Creation Modal */}
      <KotanipayWalletCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAccount}
      />
    </Form>
  );
}

// Export the provider configuration
export const kotanipayProvider: OfframpProvider = {
  id: "kotanipayProvider",
  name: "Kotani Pay",
  icon: "/placeholder.svg?height=40&width=40",
  supportedChains: [1, 137], // Ethereum and Polygon
  supportedTokens: ["USDC", "USDT"],
  FormComponent: KotaniPayForm,
};
