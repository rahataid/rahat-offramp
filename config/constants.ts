export const OFFRAMP_NETWORK = process.env.NEXT_PUBLIC_CHAIN_NAME || "";
export const OFFRAMP_TOKEN = process.env.NEXT_PUBLIC_OFFRAMP_TOKEN || "";
export const TOKEN_DECIMALS = process.env.NEXT_PUBLIC_TOKEN_DECIMALS || 6;
export const CHAIN_URL = process.env.NEXT_PUBLIC_CHAIN_URL || "";
export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || "";

//   KE: "+254",
// UG: "+256",
// NG: "+234",
// TZ: "+255",
export const supportedCountries = [
  {
    name: "Kenya",
    code: "KE",
    dial_code: "+254",
    currency: "KES",
  },
  {
    name: "Uganda",
    code: "UG",
    dial_code: "+256",
    currency: "UGX",
  },
  {
    name: "Nigeria",
    code: "NG",
    dial_code: "+234",
    currency: "NGN",
  },
  {
    name: "Tanzania",
    code: "TZ",
    dial_code: "+255",
    currency: "TZS",
  },
];
