import axios from "axios";

const submitCollectedKYCFields = async ({
  publicKey,
  kycServer,
  collectedFields,
}: {
  publicKey: string;
  kycServer: string;
  collectedFields: any;
}) => {
  const body: { [key: string]: string } = {
    sep24_account: publicKey,
    is_business: false,
    is_sep24_merchant: true,
    ...collectedFields,
  };
  const { data } = await axios.post<{
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    country: string;
    city: string;
    physical_address: string;
    is_business: boolean;
    is_sep24_merchant: boolean;
    id: string;
  }>(`${kycServer}/merchant/sep24`, body);
  return data;
};

export default submitCollectedKYCFields;
