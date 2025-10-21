import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { COLOR_PALETTE } from "@/constants/constants";

export interface Pattern {
  name: string;
  color: string;
}

export default function PatternSelector({
  availablePatterns,
  selectedPatterns,
  setSelectedPatterns,
}: {
  availablePatterns: string[];
  selectedPatterns: Pattern[];
  setSelectedPatterns: React.Dispatch<React.SetStateAction<Pattern[]>>;
}) {
  
  const togglePattern = (patternName: string) => {
    const exists = selectedPatterns.find(p => p.name === patternName);
    if (exists) {
      setSelectedPatterns(selectedPatterns.filter(p => p.name !== patternName));
    } else {
      if (selectedPatterns.length >= COLOR_PALETTE.length) return;
      
      const usedColors = selectedPatterns.map(p => p.color);
      const color = COLOR_PALETTE.find(c => !usedColors.includes(c));
      if (!color) return;

      setSelectedPatterns([...selectedPatterns, { name: patternName, color }]);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-md font-semibold mb-2">Highlight candlestick patterns:</h2>

      <Select
        value=""
        onValueChange={togglePattern}
      >
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Select candlestick patterns" />
        </SelectTrigger>
        <SelectContent>
          {availablePatterns.map((pattern) => (
            <SelectItem key={pattern} value={pattern}>
              {pattern}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedPatterns.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedPatterns.map((pattern) => (
            <Badge
              key={pattern.name}
              className="cursor-pointer"
              style={{ backgroundColor: pattern.color }}
              onClick={() => setSelectedPatterns((prev) => prev.filter((p) => p.name !== pattern.name))}
            >
              {pattern.name} ✕
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
