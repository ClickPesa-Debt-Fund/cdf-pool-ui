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
  const { data } = await axios.post(`${kycServer}/merchant/sep24`, body);
  return data;
};

export default submitCollectedKYCFields;
