/* eslint-disable react-refresh/only-export-components */
import { FC, ReactNode, createContext, useCallback, useContext, useState } from "react";
import UIDialog, { UIDialogClassName } from "./dialog.ui";
import { ThemeColor } from "../utils/color.util";
import { BellIcon } from "lucide-react";
import { cn } from "@shadcn/lib/utils";

export type UIConfirm_RenderContentProps = {
  confirm: (props: UIConfirm_FuncProps) => void;
  baseConfirm: (props: UIConfirm_BaseFuncProps) => void;
  ok: () => void;
  cancel: () => void;
};

export type UIConfirm_FuncProps = {
  className?: UIDialogClassName;
  RenderContent: FC<UIConfirm_RenderContentProps>;
  okFunc?: () => Promise<void>;
  onOk?: () => void;
  onCancel?: () => void;
};

export type UIConfirm_BaseFuncProps = UIConfirm_BaseRenderContentFuncProps & {
  okFunc?: () => Promise<void>;
  onOk?: () => void;
  onCancel?: () => void;
};

export const UIConfirm_Context = createContext<{
  confirm: (props: UIConfirm_FuncProps) => void;
  baseConfirm: (props: UIConfirm_BaseFuncProps) => void;
}>({
  confirm() {},
  baseConfirm() {},
});

export const useConfirm = () => useContext(UIConfirm_Context);

// interface UIConfirmDialogNodeProps {
//   confirm: (props: UIConfirm_FuncProps) => void;
//   baseConfirm: (props: UIConfirm_BaseFuncProps) => void;
//   index?: number;
//   propsList: UIConfirm_FuncProps[];
//   setPropsList: (handler: (prev: UIConfirm_FuncProps[]) => UIConfirm_FuncProps[]) => void;
// }

// const UIConfirmDialogList: FC<UIConfirmDialogNodeProps> = ({
//   confirm,
//   baseConfirm,
//   propsList,
//   setPropsList,
//   index = 0,
// }) => {
//   const [props, ...leastProps] = propsList;
//   function close() {
//     setPropsList((prev) => prev.filter((_, i) => i < index));
//   }
//   function ok() {
//     const process = props.okFunc ? props.okFunc() : Promise.resolve();
//     process.then(() => {
//       if (props?.onOk) {
//         props.onOk();
//       }
//       close();
//     });
//   }
//   function cancel() {
//     if (props?.onCancel) {
//       props.onCancel();
//     }
//     close();
//   }
//   return (
//     <UIDialog
//       isOpen={!!props}
//       onChangeIsOpen={(isOpen) => {
//         if (!isOpen) {
//           cancel();
//         }
//       }}
//     >
//       {props && (
//         <>
//           <props.RenderContent ok={ok} cancel={cancel} confirm={confirm} baseConfirm={baseConfirm} />
//           <UIConfirmDialogList
//             confirm={confirm}
//             baseConfirm={baseConfirm}
//             propsList={leastProps}
//             setPropsList={(handler) =>
//               setPropsList((prev) => {
//                 const [prevProps, ...prevLeastPropsList] = prev;
//                 return [prevProps].concat(...handler(prevLeastPropsList));
//               })
//             }
//           />
//         </>
//       )}
//     </UIDialog>
//   );
// };

const defaultZIndex: number = 999;

export const UIConfirm_Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const [propsList, setPropsList] = useState<UIConfirm_FuncProps[]>([]);
  const confirm = useCallback((p: UIConfirm_FuncProps) => {
    setPropsList((prev) => prev.concat(p));
  }, []);
  const baseConfirm = useCallback(({ onOk, onCancel, okFunc, ...baseProps }: UIConfirm_BaseFuncProps) => {
    setPropsList((prev) =>
      prev.concat({
        RenderContent: makeBaseRenderContent(baseProps),
        okFunc,
        onOk,
        onCancel,
      }),
    );
  }, []);
  return (
    <>
      <UIConfirm_Context.Provider
        value={{
          confirm,
          baseConfirm,
        }}
      >
        {children}
        {propsList.map((props, index) => {
          const z = defaultZIndex + index;
          function close() {
            setPropsList((prev) => prev.filter((_, i) => i < index));
          }
          function ok() {
            const process = props.okFunc ? props.okFunc() : Promise.resolve();
            process.then(() => {
              if (props?.onOk) {
                props.onOk();
              }
              close();
            });
          }
          function cancel() {
            if (props?.onCancel) {
              props.onCancel();
            }
            close();
          }
          return (
            <UIDialog
              style={{ zIndex: z }}
              isOpen={!!props}
              onChangeIsOpen={(isOpen) => {
                if (!isOpen) {
                  cancel();
                }
              }}
            >
              <props.RenderContent ok={ok} cancel={cancel} confirm={confirm} baseConfirm={baseConfirm} />
            </UIDialog>
          );
        })}
        {/* <UIConfirmDialogList
          propsList={propsList}
          setPropsList={(handler) => setPropsList(handler)}
          confirm={confirm}
          baseConfirm={baseConfirm}
        /> */}
      </UIConfirm_Context.Provider>
    </>
  );
};

export type UIConfirm_BaseRenderContentFuncProps = {
  message: string;
  themeColor?: ThemeColor;
  description?: ReactNode;
  submitBtnText?: string;
};

export const makeBaseRenderContent =
  ({
    message,
    description,
    themeColor = "neutral",
    submitBtnText = "実行",
  }: UIConfirm_BaseRenderContentFuncProps): FC<UIConfirm_RenderContentProps> =>
  ({ ok, cancel }) => {
    return (
      <div className="space-y-5">
        <div className="flex space-x-3 items-center">
          <span
            className={cn(
              "badge badge-outline h-14 w-14",
              (() => {
                switch (themeColor) {
                  case "primary":
                    return "badge-primary";
                  case "info":
                    return "badge-info";
                  case "success":
                    return "badge-success";
                  case "warning":
                    return "badge-warning";
                  case "error":
                    return "badge-error";
                  case "neutral":
                    return "badge-neutral";
                }
              })(),
            )}
          >
            <BellIcon className="w-12 h-12" />
          </span>
          <span
            className={cn(
              "font-semibold text-lg",
              (() => {
                switch (themeColor) {
                  case "primary":
                    return "text-primary";
                  case "info":
                    return "text-info";
                  case "success":
                    return "text-success";
                  case "warning":
                    return "text-warning";
                  case "error":
                    return "text-error";
                  case "neutral":
                    return "text-neutral";
                }
              })(),
            )}
          >
            {message}
          </span>
        </div>
        {description && (
          <div className="p-2">
            <span className="text-sm">{description}</span>
          </div>
        )}
        <div className="flex items-center justify-end space-x-2">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => {
              cancel();
            }}
          >
            キャンセル
          </button>
          <button
            type="button"
            className={cn(
              "btn btn-outline btn-sm",
              (() => {
                switch (themeColor) {
                  case "primary":
                    return "btn-primary";
                  case "info":
                    return "btn-info";
                  case "success":
                    return "btn-success";
                  case "warning":
                    return "btn-warning";
                  case "error":
                    return "btn-error";
                  case "neutral":
                    return "btn-neutral";
                }
              })(),
            )}
            onClick={() => {
              ok();
            }}
          >
            {submitBtnText}
          </button>
        </div>
      </div>
    );
  };
