import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/classname.util";

export type UITimelineItem_MiddleType = "base" | "check";

export type UITimelineItem = {
  start?: ReactNode;
  middle?: UITimelineItem_MiddleType;
  end?: ReactNode;
  isPrimary?: boolean;
};

interface UITimelineProps extends DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement> {
  items: UITimelineItem[];
  dispEdge?: boolean;
}

const UITimeline: FC<UITimelineProps> = ({ items, dispEdge, ...props }) => {
  return (
    <ul {...props} className={cn("timeline timeline-vertical timeline-compact", props.className)}>
      {items.map((item, i) => {
        return (
          <li key={i}>
            {(dispEdge || i !== 0) && <hr className={item.isPrimary ? "bg-primary" : ""} />}
            {item.start && <div className="timeline-start">{item.start}</div>}
            <div className={cn("timeline-middle", item.isPrimary ? "text-primary" : "")}>
              {(!item.middle || item.middle == "base") && <div className="w-3 h-3 rounded-full bg-base-content" />}
              {item.middle == "check" && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            {item.end && <div className="timeline-end timeline-box">{item.end}</div>}
            {(dispEdge || i !== items.length - 1) && <hr className={item.isPrimary ? "bg-primary" : ""} />}
          </li>
        );
      })}
    </ul>
  );
};

export default UITimeline;
