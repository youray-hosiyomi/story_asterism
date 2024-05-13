import { DetailedHTMLProps, FC, InputHTMLAttributes, useEffect, useRef } from "react";
import { cn } from "@shadcn/lib/utils";

interface UICheckboxProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  indeterminate?: boolean;
}

const UICheckbox: FC<UICheckboxProps> = ({ indeterminate, ...props }) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate ?? false;
  }, [ref, indeterminate]);
  return (
    <>
      <input ref={ref} {...props} className={cn("checkbox", props.className)} type="checkbox" />
    </>
  );
};

export default UICheckbox;
