import { supportedCountries } from "@/config/constants";

export const getCountryByCode = (code: string) => {
  return supportedCountries.find((country) => country.code === code);
};
