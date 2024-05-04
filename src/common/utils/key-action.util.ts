import { useEffect } from "react";

export type UseKeyActionEffectProps = {
  onCtrlS?: (ev: KeyboardEvent) => void;
  onCtrlE?: (ev: KeyboardEvent) => void;
  onEscape?: (ev: KeyboardEvent) => void;
  func?: (ev: KeyboardEvent) => void;
};

export function useKeyActionEffect(config: UseKeyActionEffectProps) {
  useEffect(() => {
    function keyAction(ev: KeyboardEvent) {
      if (config.onCtrlS && ev.ctrlKey && ev.key == "s") {
        ev.preventDefault();
        config.onCtrlS(ev);
      }
      if (config.onCtrlE && ev.ctrlKey && ev.key == "e") {
        ev.preventDefault();
        config.onCtrlE(ev);
      }
      if (config.onEscape && ev.key == "Escape") {
        ev.preventDefault();
        config.onEscape(ev);
      }
      if (config.func) config.func(ev);
    }
    document.addEventListener("keydown", keyAction);
    return () => {
      document.removeEventListener("keydown", keyAction);
    };
  }, [config]);
}
