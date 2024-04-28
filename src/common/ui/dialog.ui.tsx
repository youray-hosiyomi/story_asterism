import {
  DetailedHTMLProps,
  DialogHTMLAttributes,
  // ForwardRefExoticComponent,
  // ForwardRefRenderFunction,
  // RefAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { cn } from "../utils/classname.util";

interface UIDialogProps extends DetailedHTMLProps<DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement> {
  isOpen?: boolean;
  onChangeIsOpen?: (currentIsOpen: boolean) => void;
}

export type UIDialogHandler = {
  dialog: HTMLDialogElement | null;
  close(): void;
  open(): void;
};

const UIDialog = forwardRef<UIDialogHandler, UIDialogProps>(
  ({ className, children, isOpen, onChangeIsOpen, ...props }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const close = useCallback(() => {
      const dialog = dialogRef.current;
      if (dialog) {
        dialog.close();
        onChangeIsOpen && onChangeIsOpen(false);
      }
    }, [onChangeIsOpen]);
    const open = useCallback(() => {
      const dialog = dialogRef.current;
      if (dialog) {
        dialog.showModal();
        onChangeIsOpen && onChangeIsOpen(true);
      }
    }, [onChangeIsOpen]);
    useEffect(() => {
      const dialog = dialogRef.current;
      if (dialog) {
        if (!dialog.open && isOpen) {
          open();
        } else if (dialog.open && !isOpen) {
          close();
        }
      }
    }, [close, isOpen, open]);
    useImperativeHandle(
      ref,
      () => {
        const dialog = dialogRef.current;
        return {
          dialog,
          close,
          open,
        };
      },
      [dialogRef, close, open],
    );
    return (
      <>
        <dialog
          {...props}
          ref={dialogRef}
          className={cn("modal", className)}
          onClose={(ev) => {
            ev.stopPropagation();
            onChangeIsOpen && onChangeIsOpen(false);
          }}
        >
          <div className="modal-box">{children}</div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </>
    );
  },
);

export default UIDialog;
