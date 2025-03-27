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
import { Check, X, Clock } from "lucide-react";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  console.log("walletInfo", walletInfo);

  // Hooks for API calls and navigation
  const getCustomerWalletByPhone = useGetCustomerMobileMoneyWalletByPhone();
  const createCustomerWallet = useCreateCustomerMobileMoneyWallet();
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider");
  const providerUuid = searchParams.get("providerUuid");
  const chain = searchParams.get("chain");
  const token = searchParams.get("token");
  const router = useRouter();

  // Initialize the form with react-hook-form and Zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      amount: "",
    },
  });

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
      getCustomerWalletByPhone
        .mutateAsync({
          providerUuid,
          payload: { phone_number: debouncedPhoneNumber },
        })
        .then(({ data: info }) => {
          const { transactions, ...walletInformation } = info;
          console.log("info", info);

          setWalletInfo(walletInformation);
          setTransactionsByPhone(transactions);
          setIsLoading(false);
        })
        .catch((e) => {
          if (e?.response?.data?.statusCode === 500) {
            setWalletInfo(false);
            setTransactionsByPhone([]);
            setIsLoading(false);
            return;
          }

          setWalletInfo(null);
          setIsLoading(false);
        });
    }
  }, [debouncedPhoneNumber, createCustomerWallet.isSuccess]);

  // Check if there are any pending transactions
  const hasTransactionsPending = transactionByPhone.some(
    (transaction) =>
      transaction.status !== "SUCCESSFUL" && transaction.status !== "CANCELLED"
  );

  // Filter pending transactions
  const pendingTransactions = transactionByPhone.filter(
    (transaction) =>
      transaction.status !== "SUCCESSFUL" && transaction.status !== "CANCELLED"
  );

  // Function to get status icon based on transaction status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUCCESSFUL":
        return <Check className='text-green-500' />;
      case "CANCELLED":
        return <X className='text-red-500' />;
      default:
        return <Clock className='text-yellow-500' />;
    }
  };

  // Function to generate query string for links
  const generateQueryString = (
    referenceId: string,
    includePhone: boolean = false
  ) => {
    const params = new URLSearchParams();
    if (provider) params.append("provider", provider);
    if (providerUuid) params.append("providerUuid", providerUuid);
    if (chain) params.append("chain", chain);
    if (token) params.append("token", token);
    params.append("referenceId", referenceId);
    if (includePhone) params.append("phone_number", phoneNumber);
    return params.toString();
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
        {isLoading && (
          <Alert>
            <AlertTitle>Please Wait...</AlertTitle>
            <AlertDescription>
              <span className='flex text-sm text-blue-700'>
                <Clock className='w-4 h-4 text-blue-500' />
                Checking for wallet for the phone number.
              </span>
            </AlertDescription>
          </Alert>
        )}
        {walletInfo === false && !isLoading && (
          <Alert variant='destructive'>
            <AlertTitle>No Wallet found for this number</AlertTitle>
            <AlertDescription>Please create wallet to proceed</AlertDescription>
          </Alert>
        )}

        {/* Wallet Info and Transaction Display */}
        {walletInfo ? (
          <div className='space-y-4'>
            {/* Wallet Info */}
            <div>
              <h3 className='font-bold text-lg mb-2'>Wallet Info</h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {Object.entries(walletInfo).map(([key, value]) => (
                  <p key={key} className='text-sm text-gray-700'>
                    <span className='font-medium'>
                      {formatCasesToReadable(key)}:
                    </span>{" "}
                    {String(value)}
                  </p>
                ))}
              </div>
            </div>

            {/* Offramp Transaction List */}
            {transactionByPhone.length > 0 && (
              <Accordion
                type='single'
                collapsible
                className='bg-white p-4 rounded-lg shadow'>
                <AccordionItem value='previous-offramps'>
                  <AccordionTrigger className='font-bold text-lg'>
                    Previous Offramps ({transactionByPhone.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className='space-y-4'>
                      {transactionByPhone.map((tx) => (
                        <div
                          key={tx.id}
                          className='p-4 border bg-gray-50 rounded-lg shadow-sm flex flex-col gap-2'>
                          <div className='flex items-center gap-2'>
                            {getStatusIcon(tx.status)}
                            <span className='font-semibold capitalize'>
                              {tx.status.toLowerCase()}
                            </span>
                          </div>
                          <p className='text-sm text-gray-600'>
                            Reference ID: {tx.referenceId}
                          </p>
                          <p className='text-sm text-gray-600'>
                            Created At: {format(new Date(tx.createdAt), "PPp")}
                          </p>

                          {/* Continue Link (only if still in progress) */}
                          {["PENDING", "PROCESSING"].includes(tx.status) && (
                            <Link
                              href={`/send-token?${generateQueryString(
                                tx.referenceId,
                                true
                              )}`}
                              target='_blank'
                              className='text-blue-500 hover:text-blue-700 text-sm border border-blue-500 rounded-md px-3 py-1 text-center'>
                              Continue Transaction
                            </Link>
                          )}

                          {/* Always show View Details */}
                          <Link
                            href={`/status?${generateQueryString(
                              tx.referenceId
                            )}`}
                            target='_blank'
                            className='text-blue-500 hover:text-blue-700 text-sm border border-blue-500 rounded-md px-3 py-1 text-center'>
                            View Details
                          </Link>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        ) : (
          <Button type='button' onClick={() => setIsModalOpen(true)}>
            Create Account
          </Button>
        )}

        {/* Amount Field or Pending Transactions */}
        {!!walletInfo && !hasTransactionsPending && (
          <div>
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
            <Button
              disabled={
                !form.formState.isValid ||
                form.formState.isSubmitting ||
                isLoading
              }
              type='submit'
              className='w-full mt-2'>
              Submit
            </Button>
          </div>
        )}
        {hasTransactionsPending && (
          <div className='mt-4'>
            <p className='text-yellow-600 mb-2'>
              You have pending transactions. Please complete them before
              starting a new one.
            </p>
            <div className='space-y-4'>
              {pendingTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className='flex flex-col p-4 border bg-white rounded-lg shadow'>
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
                    Created At: {format(new Date(transaction.createdAt), "PPp")}
                  </p>
                  {["PENDING", "PROCESSING"].includes(transaction.status) && (
                    <Link
                      href={`/send-token?${generateQueryString(
                        transaction.referenceId,
                        true
                      )}`}
                      target='_blank'
                      className='text-blue-500 hover:text-blue-700 text-sm border border-blue-500 rounded-md px-3 py-1 text-center'>
                      Continue Transaction
                    </Link>
                  )}

                  {/* Always show View Details */}
                  <Link
                    href={`/status?${generateQueryString(
                      transaction.referenceId
                    )}`}
                    target='_blank'
                    className='text-blue-500 hover:text-blue-700 text-sm border border-blue-500 rounded-md px-3 py-1 text-center'>
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Wallet Creation Modal */}
      <KotanipayWalletCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultPhoneNumber={form.getValues("phoneNumber")}
        onSubmit={(data) => {
          return createCustomerWallet
            .mutateAsync({
              providerUuid,
              payload: {
                ...data,
                phone_number: `${data?.phone_code}${data?.phone_number.replace(
                  /\s/g,
                  ""
                )}`,
                country_code: data?.country_code,
                network: data?.network,

                account_name: data?.account_name,
              },
            })
            .then((res) => {
              setWalletInfo(res);
            });
        }}
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
