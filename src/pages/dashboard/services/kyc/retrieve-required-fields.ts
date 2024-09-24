import axios from "axios";

const retrieveKYCInfo = async ({
  publicKey,
  kycServer,
}: {
  publicKey: string;
  kycServer: string;
}) => {
  const { data } = await axios.get<{
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    country: string;
    city: string;
    physical_address: string;
    id: string;
    is_business: boolean;
    is_sep24_merchant: boolean;
  }>(`${kycServer}/merchant/sep24/${publicKey}`);
  return data;
};

export default retrieveKYCInfo;
