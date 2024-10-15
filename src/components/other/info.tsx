import { ReactNode, useState } from "react";
import Popover from "antd/lib/popover";
import { InfoIcon } from "lucide-react";

const Info = ({ message, icon }: { message?: string; icon?: ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      content={message}
      open={open}
      onOpenChange={setOpen}
      trigger={"hover"}
    >
      {icon || <InfoIcon className="text-primary min-w-4" size={14} />}
    </Popover>
  );
};

export default Info;
