import { useEffect } from "react";

export type UseKeyActionEffectProps = {
  onCtrlS?: (ev: KeyboardEvent) => void;
};

export function useKeyActionEffect(config: UseKeyActionEffectProps) {
  useEffect(() => {
    function keyAction(ev: KeyboardEvent) {
      if (config.onCtrlS && ev.ctrlKey && ev.key == "s") {
        ev.preventDefault();
        ev.stopPropagation();
        config.onCtrlS(ev);
      }
    }
    document.addEventListener("keydown", keyAction);
    return () => {
      document.removeEventListener("keydown", keyAction);
    };
  }, [config]);
}
