import { OfframpProvider } from "@/types/provider";
import { kotanipayProvider } from "./kotaniPay";
import { rampNetworkProvider } from "./rampNetwork";
import api, { endpoints } from "@/lib/api";

export const providers: OfframpProvider[] = [
  kotanipayProvider,
  rampNetworkProvider,
];

export const joinLocalAndApiProviders = (apiProviders: OfframpProvider[]) => {
  return providers.map((localProvider) => {
    console.log("localProvider", localProvider);
    const apiProvider = apiProviders.find((p) => p.slug === localProvider.id);
    console.log("apiProvider", apiProvider);
    return {
      ...localProvider,
      ...apiProvider,
    };
  });
};

export async function getProviders(): Promise<OfframpProvider[]> {
  const prov = await fetch(`http://localhost:5500/v1/offramps/providers`); // api.get(endpoints.offramps.providers.list);
  const provs = prov.json();
  console.log("prov", provs);

  return providers;
}

export function getProviderById(id: string): OfframpProvider | undefined {
  return providers.find((provider) => provider.id === id);
}

export function getProviderBySlug(
  slug: string,
  providers: any[] = []
): OfframpProvider | undefined {
  return providers.find((provider) => provider.slug === slug);
}
