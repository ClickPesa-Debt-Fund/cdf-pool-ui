import { formatErrorMessage } from "@/utils";
import ErrorComponent from "../error-component";
import Spinner from "../spinner";
import { useGetDepositInfo, useGetToml } from "./services";
import BuyForm from "./buy-form";

const Buy = ({ close, open }: { close: () => void; open: boolean }) => {
  const { toml, tomlError, tomlLoading, tomlRefetch, tomlRefetching } =
    useGetToml();

  const {
    depositInfo,
    depositInfoError,
    depositInfoLoading,
    depositInfoRefetch,
    depositInfoRefetching,
  } = useGetDepositInfo();

  if (tomlLoading || tomlRefetching)
    return (
      <div className="flex items-center justify-center h-24">
        <Spinner />
      </div>
    );

  if (tomlError)
    return (
      <ErrorComponent
        message={formatErrorMessage(tomlError)}
        onClick={() => {
          tomlRefetch();
        }}
      />
    );

  if (depositInfoLoading || depositInfoRefetching)
    return (
      <div className="flex items-center justify-center h-24">
        <Spinner />
      </div>
    );

  if (depositInfoError)
    return (
      <ErrorComponent
        message={formatErrorMessage(depositInfoError)}
        onClick={() => {
          depositInfoRefetch();
        }}
      />
    );

  if (!toml && !depositInfo) return null;

  return <BuyForm close={close} open={open} />;
};

export default Buy;
