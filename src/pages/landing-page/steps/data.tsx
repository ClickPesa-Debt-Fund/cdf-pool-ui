import { COLLATERAL_ASSET_CODE } from "@/constants";

export const steps = [
  {
    title: "Prepare your wallet to receive ClickPesa Debt Fund Token",
    description: `Establish a Trustline with ${COLLATERAL_ASSET_CODE} on your Stellar wallet to allow receiving tokens in your wallet`,
    imgSrc: "/images/step-1.svg",
    link: "/trustline",
  },
  {
    title: "Browse list of available Pools on the dashboard",
    description:
      "Review the various funding Pools available to find the one that best suits your needs.",
    imgSrc: "/images/step-2.svg",
  },
  {
    title: "Select Pool and Buy it's ClickPesa Yield Token",
    description: `Send USDC to designated address and receive equivalent ${COLLATERAL_ASSET_CODE} tokens in your wallet.`,
    imgSrc: "/images/step-3.svg",
  },
  {
    title: "Keep track of your Earnings",
    description: `Monitor your Pools ${COLLATERAL_ASSET_CODE} Earnings in real-time on the dashboard.`,
    imgSrc: "/images/step-4.svg",
  },
  {
    title: "Withdraw your Earnings",
    description:
      "Easily withdraw your Earnings whenever you choose, directly on the dashboard.",
    imgSrc: "/images/step-5.svg",
  },
];
