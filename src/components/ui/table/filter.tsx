import { SelectTrigger, SelectContent, SelectItem } from "@radix-ui/react-select";
import { Search } from "lucide-react";
import { useId, useMemo } from "react";
import { Label, Input, Select, SelectValue } from "react-aria-components";
import { Column } from "react-stately";

export function Filter({
    column,
    onChange,
  }: {
    column: Column<any, unknown>;
    onChange: (value: string | undefined) => void;
  }) {
    const id = useId();
    const columnFilterValue = column.getFilterValue();
    const { filterVariant } = column.columnDef.meta ?? {};
    const columnHeader =
      typeof column.columnDef.header === "string" ? column.columnDef.header : "";
    const sortedUniqueValues = useMemo(() => {
      if (filterVariant === "range") return [];
  
      // Get all unique values from the column
      const values = Array.from(column.getFacetedUniqueValues().keys());
  
      // If the values are arrays, flatten them and get unique items
      const flattenedValues = values.reduce((acc: string[], curr) => {
        if (Array.isArray(curr)) {
          return [...acc, ...curr];
        }
        return [...acc, curr];
      }, []);
  
      // Get unique values and sort them
      return Array.from(new Set(flattenedValues)).sort();
    }, [column.getFacetedUniqueValues(), filterVariant]);
  
    if (filterVariant === "range") {
      return (
        <div className="space-y-2">
          <Label>{columnHeader}</Label>
          <div className="flex">
            <Input
              id={`${id}-range-1`}
              className="flex-1 rounded-e-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
              value={(columnFilterValue as [number, number])?.[0] ?? ""}
              onChange={(e) => {
                const newValue = [
                  e.target.value ? Number(e.target.value) : undefined,
                  (columnFilterValue as [number, number])?.[1],
                ];
                column.setFilterValue(newValue);
                onChange(newValue.toString());
              }}
              placeholder="Min"
              type="number"
              aria-label={`${columnHeader} min`}
            />
            <Input
              id={`${id}-range-2`}
              className="-ms-px flex-1 rounded-s-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
              value={(columnFilterValue as [number, number])?.[1] ?? ""}
              onChange={(e) => {
                const newValue = [
                  (columnFilterValue as [number, number])?.[0],
                  e.target.value ? Number(e.target.value) : undefined,
                ];
                column.setFilterValue(newValue);
                onChange(newValue.toString());
              }}
              placeholder="Max"
              type="number"
              aria-label={`${columnHeader} max`}
            />
          </div>
        </div>
      );
    }
  
    if (filterVariant === "select") {
      return (
        <div className="space-y-2">
          <Label htmlFor={`${id}-select`}>{columnHeader}</Label>
          <Select
            value={columnFilterValue?.toString() ?? "all"}
            onValueChange={(value) => {
              const newValue = value === "all" ? undefined : value;
              column.setFilterValue(newValue);
              onChange(newValue);
            }}
          >
            <SelectTrigger id={`${id}-select`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {sortedUniqueValues.map((value) => (
                <SelectItem key={String(value)} value={String(value)}>
                  {String(value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
  
    return (
      <div className="space-y-2">
        <Label htmlFor={`${id}-input`}>{columnHeader}</Label>
        <div className="relative">
          <Input
            id={`${id}-input`}
            className="peer ps-9"
            value={(columnFilterValue ?? "") as string}
            onChange={(e) => {
              const newValue = e.target.value;
              column.setFilterValue(newValue);
              onChange(newValue);
            }}
            placeholder={`Search ${columnHeader.toLowerCase()}`}
            type="text"
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
            <Search size={16} strokeWidth={2} />
          </div>
        </div>
      </div>
    );
  }