import { Kbd } from "@/components/ui/kbd";
import Footer from "../landing-page/footer";

// const apps = [
//   {
//     link: "keybase.io",
//     steps: [
//       "navigate to your wallet’s settings",
//       `select "manage trustlines"`,
//       "search using the token’s code",
//     ],
//   },
//   {
//     link: "lobstr.co",
//     steps: [
//       "navigate to “assets”",
//       `select “add asset”`,
//       `search using the token’s Stellarmint subdomain “[name you choose].stellarmint.io”`,
//     ],
//   },
//   {
//     link: "litemint.io",
//     steps: [
//       `navigate to “assets”`,
//       `select the “+” sign"`,
//       `search using the token’s Stellarmint subdomain “[name you choose].stellarmint.io”`,
//     ],
//   },
//   {
//     link: "solarwallet.io ",
//     steps: [
//       `navigate to “Assets & Balances”`,
//       `select “+ Add Asset To Your Account”`,
//       `select “+ Add Custom Asset”`,
//       `input the token code as well as the Issuing Account address.`,
//     ],
//   },
// ];

const laboratory_steps = [
  `Select “public” or "testnet at the top of the page to build a public transaction`,
  `Select “Build Transaction” in the navigation menu.`,
  `Enter your Stellar wallet address in the “Source Account” field.`,
  `Select the “Fetch next sequence number for account starting” button to automatically populate the Transaction Sequence Number.`,
  `Select “Change Trust” from the “Operation Type” drop down menu.`,
  `Select “Alphanumeric 4” if your token code is 4 or less characters long or select “Alphanumeric 12” if your token code is 5 to 12 characters long.`,
  `Enter the token code in the “Asset Code” field. ---- <b class="font-bold text-font-bold">CPYT</b>`,
  `Input the Issuing Account address in the “Issuer Account ID” field. ---- <b class="font-bold text-font-bold">GAH572DYUPXZDOKBI76H54WRKMIHDXZFLOFVFBDPKL3WIUTPGGHCQ5K7</b>`,
  `Select “Sign in Transaction Signer” and sign the transaction. A Ledger wallet can be used to sign by selecting “Sign with BIP Path”.`,
];

const Trustline = () => {
  return (
    <div className="md:space-y-[100px] space-y-[50px] md:py-[100px] py-[50px] container max-w-[1270px] min-h-full">
      <div className="bg-white md:rounded-2xl rounded-lg p-6 md:p-8 space-y-4">
        <div>
          <h1 className="font-bold text-font-bold [font-size:_clamp(20px,5vw,24px)]">
            How do I accept a CPYT token’s trustline?
          </h1>
          <p>
            In order to send or receive a Stellar network token you must
            establish a trustline. Most Stellar wallets make this easy to do.
            CPYT token can easily be found by searching by token code or the
            token?s subdomain. On testnet CPYT subdomain is&nbsp;
            <Kbd>sandbox.connect.clickpesa.com</Kbd> and live is&nbsp;
            <Kbd>connect.clickpesa.com</Kbd>
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="font-bold text-font-bold">
            If accepting your token’s trustline through the Stellar Laboratory:
          </h2>
          <ol className="space-y-2 list-decimal	ml-8">
            {laboratory_steps.map((step, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: step }} />
            ))}
          </ol>
        </div>
        {/* <ul>
          {apps.map(({ link, steps }) => (
            <li key={link}>
              In a <a href={`https://${link}`}>{link}</a> wallet
              <ul className="ml-4">
                {steps?.map((step) => (
                  <li>{step}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul> */}
      </div>
      <Footer />
    </div>
  );
};

export default Trustline;
