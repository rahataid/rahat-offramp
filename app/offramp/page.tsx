"use client";
import { OfframpStep } from "@/components/offramp-step";
import { useListOfframpProviders } from "@/lib/offramp";
import { ServiceCard } from "@/components/service-card";
import { useRouter } from "next/navigation";

export default function OfframpPage() {
  const { data: providers, isLoading, error } = useListOfframpProviders();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading providers...
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen text-red-500'>
        Error loading providers: {error.message}
      </div>
    );
  }

  return (
    <OfframpStep
      title='Choose Your Offramp Service'
      description='Select a service provider to begin your cryptocurrency-to-fiat transaction.'>
      <div className='space-y-4'>
        {providers?.map((service) => (
          <ServiceCard
            key={service.uuid}
            id={service.uuid}
            name={service.name}
            logo={service.logo}
            description={service.description}
            selected={false}
            onSelect={(uuid) => {
              router.push(
                `/offramp/details?provider=${uuid}&providerName=${service.name}`
              );
              // window.location.href = `/offramp/details?provider=${uuid}`;
            }}
          />
        ))}
      </div>
    </OfframpStep>
  );
}
