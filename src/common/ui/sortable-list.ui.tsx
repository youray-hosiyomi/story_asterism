import {
  DetailedHTMLProps,
  Dispatch,
  FC,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DraggableAttributes,
  KeyboardSensor,
  MouseSensor,
  // PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

export interface UISortableListItemRenderProps<S> {
  id: string;
  item: S;
  sortDisabled?: boolean;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
}

interface UISortableListItemProps<S> extends UISortableListItemRenderProps<S> {
  RenderItem: FC<UISortableListItemRenderProps<S>>;
}

function UISortableListItem<S>({ id, item, RenderItem }: UISortableListItemProps<S>): ReactNode {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
    >
      <RenderItem id={id} item={item} attributes={attributes} listeners={listeners} />
    </div>
  );
}

export type UISortableListData2ID<S> = (data: S) => string;

export interface UISortableListProps<S> extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  disabled?: boolean;
  items: S[];
  setItems: Dispatch<SetStateAction<S[]>>;
  item2id: UISortableListData2ID<S>;
  RenderItem: FC<UISortableListItemRenderProps<S>>;
}

function makeSortedList<S>(prev: S[], item2id: UISortableListData2ID<S>, activeId: string, overId: string): S[] {
  const activeIndex = prev.findIndex((data) => item2id(data) == activeId);
  const overIndex = prev.findIndex((data) => item2id(data) == overId);
  return arrayMove(prev, activeIndex, overIndex);
}

function UISortableList<S>({
  items,
  setItems,
  item2id,
  RenderItem,
  disabled,
  ...props
}: UISortableListProps<S>): ReactNode {
  const [activeId, setActiveId] = useState<string>();
  const activeItem = useMemo(() => items.find((item) => item2id(item) == activeId) ?? null, [items, item2id, activeId]);
  const sensors = useSensors(
    // useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 50,
        tolerance: 5,
      },
    }),
  );
  const handleDragStart = useCallback((ev: DragStartEvent): void => {
    const activeId = ev.active.id.toString();
    setActiveId(activeId);
  }, []);
  const handleDragOver = useCallback(
    (ev: DragOverEvent): void => {
      const activeId = ev.active.id.toString();
      const overId = ev.over?.id.toString();
      if (!overId) return;
      setItems((prev) => makeSortedList<S>(prev, item2id, activeId, overId));
    },
    [item2id, setItems],
  );
  const handleDragEnd = useCallback(
    (ev: DragEndEvent): void => {
      const activeId = ev.active.id.toString();
      const overId = ev.over?.id.toString();
      if (!overId) return;
      setItems((prev) => makeSortedList<S>(prev, item2id, activeId, overId));
    },
    [item2id, setItems],
  );
  if (disabled) {
    return (
      <div {...props}>
        {items.map((item, index) => {
          const id = item2id(item);
          return <RenderItem key={index} id={id} item={item} sortDisabled={disabled} />;
        })}
      </div>
    );
  }
  return (
    <div {...props}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map(item2id)}>
          {items.map((item, index) => {
            const id = item2id(item);
            return <UISortableListItem key={index} id={id} item={item} RenderItem={RenderItem} />;
          })}
        </SortableContext>
        <DragOverlay>{activeId && activeItem ? <RenderItem id={activeId} item={activeItem} /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}

export default UISortableList;
