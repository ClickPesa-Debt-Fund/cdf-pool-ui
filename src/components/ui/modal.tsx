import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Modal = ({
  open,
  close,
  title,
  description,
  footer,
  children,
}: {
  open: boolean;
  close: () => void;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}) => {
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-[700px] w-[90%] rounded overflow-y-auto max-h-[calc(100dvh-30px)]">
        <DialogHeader>
          {title && (
            <DialogTitle className="flex justify-between items-center gap-3">
              {title}
            </DialogTitle>
          )}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
