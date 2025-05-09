# Rahat Offramp

![Rahat Offramp](https://via.placeholder.com/800x400?text=Rahat+Offramp)

Rahat Offramp is a modern web application that provides a seamless interface for converting cryptocurrency to fiat currency (cash or mobile money) through various payment providers. It serves as a critical component of the Rahat ecosystem, enabling beneficiaries and users to easily cash out their digital assets.

## 🌟 Features

- **Multiple Payment Providers**: Support for various offramp providers (KotaniPay, Ramp Network, etc.)
- **Blockchain Integration**: Connect your wallet and send tokens directly through the interface
- **Mobile Money Support**: Convert crypto to mobile money in supported regions
- **Transaction Tracking**: Monitor the status of your offramp requests
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Extensible Architecture**: Easily add new payment providers

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm (recommended) or npm
- Access to a compatible blockchain wallet

### Installation

1. Clone the repository

```bash
git clone https://github.com/rahataid/rahat-offramp.git
cd rahat-offramp
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration values.

4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3003](http://localhost:3003) with your browser to see the application.

## 🏗️ Architecture

Rahat Offramp is built with the following technologies:

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI components
- **State Management**: React Query, React Hook Form
- **Web3**: Wagmi, Viem, ConnectKit
- **API Integration**: Axios

## 🔌 Provider System

Rahat Offramp uses a modular provider system to integrate with different payment services. This section explains how providers work and how to add new ones.

### Provider Architecture

Each provider in the system:

- Implements a common interface defined in `types/provider.ts`
- Has its own form component for collecting user input
- Handles provider-specific API calls and validation
- Is registered in the central providers registry

### Provider Interface

All providers must implement the `OfframpProvider` interface:

```typescript
export interface OfframpProvider {
  id: string                                  // Unique identifier
  name: string                                // Display name
  icon: string                                // Path to provider icon
  supportedChains: number[]                   // Chain IDs supported by provider
  supportedTokens: string[]                   // Token types supported
  FormComponent: React.ComponentType<OfframpFormProps>  // The form UI component
}
```

### Adding a New Provider

To add a new payment provider:

1. **Create Provider File**: Create a new file in the `providers` directory (e.g., `newProvider.tsx`)

2. **Implement Form Component**: Create a form component using React Hook Form and Zod for validation:

```tsx
import { OfframpProvider, OfframpFormProps } from '@/types/provider'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// Define form schema
const formSchema = z.object({
  // Define fields specific to your provider
  field1: z.string().min(2, "Field 1 is required"),
  field2: z.string().email("Valid email required"),
})

// Create form component
function NewProviderForm({ onSubmit }: OfframpFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      field1: "",
      field2: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Form fields */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

3. **Export Provider Configuration**: Define and export the provider configuration:

```tsx
export const newProvider: OfframpProvider = {
  id: 'newProvider',
  name: 'New Provider',
  icon: '/placeholder.svg?height=40&width=40',
  supportedChains: [1, 137], // Ethereum and Polygon
  supportedTokens: ['USDC', 'USDT'],
  FormComponent: NewProviderForm,
}
```

4. **Register Provider**: Add your provider to the registry in `providers/index.ts`:

```typescript
import { OfframpProvider } from "@/types/provider";
import { kotanipayProvider } from "./kotaniPay";
import { newProvider } from "./newProvider";

export const providers: OfframpProvider[] = [
  kotanipayProvider,
  newProvider,
];
```

### Provider-Specific API Integration

If your provider requires specific API calls:

1. Add any necessary endpoints to `lib/api.ts`
2. Create custom hooks in `lib/offramp.ts` for provider operations
3. Use these hooks in your provider's form component

### Testing Your Provider

Test your provider by:

1. Running the application locally
2. Navigating to the providers page
3. Selecting your new provider
4. Testing the form submission and integration

See existing providers (KotaniPay, Ramp Network) for complete implementation examples.

### Provider Implementation Examples

#### Mobile Money Provider

Mobile money providers (like KotaniPay) typically require phone number validation and wallet creation:

```tsx
// Form schema for mobile money provider
const formSchema = z.object({
  phoneNumber: z.string().min(10, "Valid phone number required"),
  amount: z.string().min(1, "Amount must be greater than 0"),
});

function MobileMoneyProviderForm({ onSubmit }: OfframpFormProps) {
  // State for wallet information
  const [walletInfo, setWalletInfo] = useState<any>(null);
  
  // API hooks
  const getWalletByPhone = useGetWalletByPhone();
  const createWallet = useCreateWallet();
  
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      amount: "",
    },
  });
  
  // Watch phone number for validation
  const phoneNumber = form.watch("phoneNumber");
  const [debouncedPhoneNumber] = useDebounce(phoneNumber, 500);
  
  // Check if wallet exists when phone number changes
  useEffect(() => {
    if (debouncedPhoneNumber?.length >= 10) {
      getWalletByPhone.mutate(
        { phoneNumber: debouncedPhoneNumber },
        {
          onSuccess: (data) => setWalletInfo(data),
          onError: () => setWalletInfo(null),
        }
      );
    }
  }, [debouncedPhoneNumber]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit({...data, walletInfo}))}>
        {/* Phone number field */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="+1234567890" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Amount field */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Wallet creation button (if wallet doesn't exist) */}
        {!walletInfo && debouncedPhoneNumber?.length >= 10 && (
          <Button 
            type="button" 
            onClick={() => createWallet.mutate({ phoneNumber: debouncedPhoneNumber })}
          >
            Create Wallet
          </Button>
        )}
        
        <Button type="submit" disabled={!walletInfo}>Submit</Button>
      </form>
    </Form>
  );
}
```

#### Bank Transfer Provider

Bank transfer providers typically require banking details:

```tsx
// Form schema for bank transfer provider
const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  accountNumber: z.string().min(8, "Valid account number required"),
  bankCode: z.string().min(3, "Bank code is required"),
  amount: z.string().min(1, "Amount must be greater than 0"),
});

function BankTransferProviderForm({ onSubmit }: OfframpFormProps) {
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      accountNumber: "",
      bankCode: "",
      amount: "",
    },
  });
  
  // Bank options
  const bankOptions = [
    { value: "001", label: "Bank A" },
    { value: "002", label: "Bank B" },
    { value: "003", label: "Bank C" },
  ];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Full name field */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Account number field */}
        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Bank selection */}
        <FormField
          control={form.control}
          name="bankCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bank" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bankOptions.map((bank) => (
                    <SelectItem key={bank.value} value={bank.value}>
                      {bank.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Amount field */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### Debugging Provider Integration

When implementing or troubleshooting providers, consider these debugging tips:

#### 1. API Integration Debugging

```tsx
// Add logging to API calls
const getWalletByPhone = useGetWalletByPhone();

useEffect(() => {
  if (debouncedPhoneNumber) {
    console.log('Fetching wallet for:', debouncedPhoneNumber);
    getWalletByPhone.mutate(
      { phoneNumber: debouncedPhoneNumber },
      {
        onSuccess: (data) => {
          console.log('Wallet data received:', data);
          setWalletInfo(data);
        },
        onError: (error) => {
          console.error('Wallet fetch error:', error);
          setWalletInfo(null);
        },
      }
    );
  }
}, [debouncedPhoneNumber]);
```

#### 2. Form Validation Testing

Test form validation with different input scenarios:

```tsx
// Add form debugging
const formState = form.formState;
console.log('Form errors:', formState.errors);
console.log('Form values:', form.getValues());
```

#### 3. Component Lifecycle Monitoring

Use React DevTools and effect cleanup to track component lifecycle:

```tsx
useEffect(() => {
  console.log('Provider form mounted');
  
  return () => {
    console.log('Provider form unmounted');
  };
}, []);
```

#### 4. Network Request Inspection

Use browser developer tools to inspect network requests:

- Check request payloads for correct formatting
- Verify authentication headers are being sent
- Examine response data for error messages

#### 5. Common Provider Integration Issues

- **CORS Issues**: Ensure the backend API has proper CORS headers
- **Authentication Failures**: Check if API keys and tokens are correctly configured
- **Data Format Mismatches**: Verify the data structure matches what the API expects
- **Rate Limiting**: Some provider APIs have rate limits that can cause failures
- **Network Connectivity**: Test with different network conditions

#### 6. Testing with Mock Data

Create mock implementations for testing:

```tsx
// Mock API hooks for testing
const useGetWalletByPhoneMock = () => ({
  mutate: (data, callbacks) => {
    // Simulate API call
    setTimeout(() => {
      callbacks.onSuccess({
        account_name: 'Test User',
        phone_number: data.phoneNumber,
        network: 'Test Network',
        country_code: 'US',
        customer_key: 'test-key-123',
      });
    }, 500);
  },
  isLoading: false,
});
```

## 🔄 Offramp Flow

1. **Provider Selection**: Choose your preferred payment provider
2. **Network & Token**: Review the network and token for offramp
3. **Connect Wallet**: Connect your blockchain wallet
4. **Enter Details**: Provide recipient details (phone number, account info)
5. **Send Tokens**: Transfer tokens to the escrow address
6. **Track Status**: Monitor the status of your offramp request

## 🐳 Docker Deployment

Rahat Offramp can be deployed using Docker:

```bash
# Build the Docker image
docker build -t rahat-offramp .

# Run the container
docker run -p 3003:3003 rahat-offramp
```

For standalone deployment, use `Dockerfile.standalone`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🔧 Configuration

### Environment Variables

The following environment variables can be configured in your `.env.local` file:

```
# API Configuration
NEXT_PUBLIC_HOST_API=http://localhost:5500/v1  # Backend API endpoint

# Blockchain Configuration
NEXT_PUBLIC_USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e  # USDC token address

# Additional configuration options can be added here
```

### Supported Networks and Tokens

Currently, the application supports the following:

- **Networks**: Polygon, Ethereum
- **Tokens**: USDC, USDT, DAI

To modify supported networks or tokens, update the constants in `config/constants.ts`.

## 🧪 Testing

To run tests:

```bash
pnpm test
```

## 🔍 Troubleshooting

### Common Issues

1. **Wallet Connection Issues**

   - Ensure you're using a supported wallet (MetaMask, WalletConnect, etc.)
   - Verify you're connected to the correct network

2. **Transaction Failures**

   - Check that you have sufficient token balance
   - Ensure you have enough native currency for gas fees

3. **API Connection Errors**
   - Verify the backend API is running and accessible
   - Check your NEXT_PUBLIC_HOST_API environment variable

## 📋 API Documentation

The Offramp application interacts with a backend API with the following endpoints:

- `GET /offramps/providers` - List available offramp providers
- `POST /offramps` - Create a new offramp request
- `POST /offramps/execute` - Execute an offramp request
- `POST /offramps/providers/actions` - Perform provider-specific actions

For detailed API documentation, refer to the backend repository.

## 🌐 Related Projects

- [Rahat Platform](https://github.com/rahataid/rahat-platform) - Main Rahat platform
- [Rahat C2C](https://github.com/rahataid/rahat-project-c2c) - Mobile application for Rahat

## 📞 Support

For support, please contact the Rahat team or open an issue in this repository.

## 🔮 Roadmap

- Add support for additional payment providers
- Implement multi-language support
- Enhance transaction history and reporting
- Improve mobile experience
- Add offline capabilities for low-connectivity regions
