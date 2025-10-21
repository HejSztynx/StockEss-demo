import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface SelectableListProps<T> {
  items: T[];
  selectedItem: T | null;
  onSelectItem: (item: T) => void;
  format: (item: T) => string;
  renderExtra?: (item: T) => React.ReactNode | null;
}

export default function SelectableList<T>(
    { items, selectedItem, onSelectItem, format, renderExtra }: SelectableListProps<T>
) {
    return (
        <ul className="space-y-1 mt-2 overflow-y-auto">
            {items.map((item, index) => (
            <li key={index} className="text-center">
                <Button
                variant="ghost"
                className={cn(
                    "w-full justify-center text-sm py-1 rounded-md transition-colors",
                    item === selectedItem
                    ? "bg-gray-200 font-semibold"
                    : "hover:bg-gray-100"
                )}
                onClick={() => onSelectItem(item)}
                >
                {format(item)}
                {renderExtra && renderExtra(item)}
                </Button>
            </li>
            ))}
        </ul>
    )
}