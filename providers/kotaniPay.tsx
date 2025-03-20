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
import router from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { z } from "zod";

const formSchema = z.object({
  // countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z.string().min(10, "Valid phone number required"),
  amount: z.string().min(1, "Amount must be greater than 0"),
});

function KotaniPayForm({ onSubmit }: OfframpFormProps) {
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionByPhone, setTransactionsByPhone] = useState([]);
  const getCustomerWalletByPhone = useGetCustomerMobileMoneyWalletByPhone();
  const createCustomerWallet = useCreateCustomerMobileMoneyWallet();
  const searchParams = useSearchParams();
  const providerUuid = searchParams.get("providerUuid");
  const chain = searchParams.get("chain");

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // countryCode: "",
      phoneNumber: "",
      amount: "",
    },
  });

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
  async function createAccount(data: z.infer<typeof formSchema>) {
    // Replace this with your actual API call
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

  const countryCode = form.watch("countryCode");
  const phoneNumber = form.watch("phoneNumber");
  const [debouncedPhoneNumber] = useDebounce(
    phoneNumber?.replace(/\s/g, ""),
    100
  );

  console.log("first", form.formState.errors);

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

  const hasTransactionsPending = transactionByPhone.some(
    (transaction) =>
      transaction.status !== "COMPLETED" && transaction.status !== "CANCELLED"
  );
  console.log("first", hasTransactionsPending, transactionByPhone);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((d) =>
          onSubmit({
            ...d,
            walletInfo,
          })
        )}
        className='space-y-6'>
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
        {isLoading && <p>Checking wallet info...</p>}
        {walletInfo ? (
          <div>
            <h3 className='font-bold'>Wallet Info</h3>
            {walletInfo &&
              Object.keys(walletInfo).map((key) => (
                <p key={key}>
                  {formatCasesToReadable(key)}: {walletInfo[key]}
                </p>
              ))}
          </div>
        ) : (
          <Button type='button' onClick={() => setIsModalOpen(true)}>
            Create Account
          </Button>
        )}

        {hasTransactionsPending ? (
          <>
            You already have pending transactions
            <Button
              onClick={() =>
                router.push(
                  `/status?referenceId=${transactionByPhone[0]?.referenceId}&providerUuid=${providerUuid}`
                )
              }>
              View Status
            </Button>
          </>
        ) : (
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
        <Button type='submit' className='w-full mt-2'>
          Submit
        </Button>
      </form>
      <KotanipayWalletCreationModal
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
