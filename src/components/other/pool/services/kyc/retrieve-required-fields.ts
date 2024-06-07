import axios from "axios";

const retrieveKYCInfo = async ({
  publicKey,
  kycServer,
}: {
  publicKey: string;
  kycServer: string;
}) => {
  const { data } = await axios.get(`${kycServer}/merchant/sep24/${publicKey}`);
  return data;
};

export default retrieveKYCInfo;
