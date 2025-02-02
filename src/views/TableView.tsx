import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useId, useMemo, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

export type Item = {
  id: string;
  location: Array<number>;
  severity: Array<"high" | "medium" | "low">;
  estimated_fire_start_time: string;
  reported_time: string;
  deploy_time: number;
  cost: number;
};

type MappedItem = {
  id: string;
  location: Array<number>;
  severity: Array<"high" | "medium" | "low">;
  estFireStartTime: string;
  timeOfReport: string;
  estFireDelayTime: number;
  estCost: number;
};

const columns: ColumnDef<MappedItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate") ||
          false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    header: "Location",
    accessorKey: "location",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("location")}</div>
    ),
  },
  {
    header: "Severity",
    accessorKey: "severity",
    cell: ({ row }) => {
      const severity = row.getValue("severity") as string;
      return (
        <div className="flex gap-1">
          <div
            className={cn(
              "flex h-5 items-center justify-center rounded px-2 text-xs font-medium",
              {
                high: "bg-red-400/20 text-red-500",
                medium: "bg-yellow-400/20 text-yellow-500",
                low: "bg-green-400/20 text-green-500",
              }[severity]
            )}
          >
            {severity}
          </div>
        </div>
      );
    },
    enableSorting: true,
    meta: {
      filterVariant: "select",
    },
    sortingFn: (rowA, rowB, columnId) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      const a = priorityOrder[rowA.getValue(columnId) as keyof typeof priorityOrder] ?? 999;
      const b = priorityOrder[rowB.getValue(columnId) as keyof typeof priorityOrder] ?? 999;
      return a - b;
    },
    },
    {
    header: "Est. Fire Start Time",
    accessorKey: "estFireStartTime",
    cell: ({ row }) => {
      return new Date(row.getValue("estFireStartTime")).toLocaleString(
        "en-US",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      );
    },
    meta: {
      filterVariant: "range",
    },
  },
  {
    header: "Time of Report",
    accessorKey: "timeOfReport",
    cell: ({ row }) => {
      return new Date(row.getValue("timeOfReport")).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
    meta: {
      filterVariant: "range",
    },
  },
  {
    header: "Estimated Fire Delay Time",
    accessorKey: "estFireDelayTime",
    cell: ({ row }) => {
      const estFireStartTime = new Date(row.getValue("estFireStartTime"));
      const timeOfReport = new Date(row.getValue("timeOfReport"));
      const estFireDelayTime = Math.abs(
        timeOfReport.getTime() - estFireStartTime.getTime()
      );
      const minutes = Math.floor(estFireDelayTime / (1000 * 60));
      return `${minutes} minutes`;
    },
    meta: {
      filterVariant: "range",
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const estFireDelayTimeA = Math.abs(
        new Date(rowA.getValue("timeOfReport")).getTime() -
          new Date(rowA.getValue("estFireStartTime")).getTime()
      );
      const estFireDelayTimeB = Math.abs(
        new Date(rowB.getValue("timeOfReport")).getTime() -
          new Date(rowB.getValue("estFireStartTime")).getTime()
      );
      return estFireDelayTimeA - estFireDelayTimeB;
    },
  },
  {
    header: "Estimated Cost",
    accessorKey: "estCost",
    cell: ({ row }) => {
      return `$${(row.getValue("estCost") as number).toFixed(2)}`;
    },
    meta: {
      filterVariant: "range",
    },
  },
];

function TableView({ items }: { items: Item[] }) {
  console.log(items);
  const mappedItemsList = items.map((item) => ({
    id: item.id,
    location: item.location,
    severity: item.severity,
    estFireStartTime: item.estimated_fire_start_time,
    timeOfReport: item.reported_time,
    estFireDelayTime: item.deploy_time,
    estCost: item.cost,
  }));
  const [mappedItems] = useState<MappedItem[]>(mappedItemsList);
  console.log(mappedItems);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "location",
      desc: false,
    },
  ]);

  const table = useReactTable<MappedItem>({
    data: mappedItems,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client-side filtering
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(), // client-side faceting
    getFacetedUniqueValues: getFacetedUniqueValues(), // generate unique values for select filter/autocomplete
    getFacetedMinMaxValues: getFacetedMinMaxValues(), // generate min/max values for range filter
    onSortingChange: setSorting,
    enableSortingRemoval: false,
  });

  return (
    <div className="space-y-6 bg-background p-6 h-[200px] w-full">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Search input */}
        <div className="w-44">
          <Filter column={table.getColumn("location")!} />
        </div>
        {/* Intents select */}
        <div className="w-36">
          <Filter column={table.getColumn("severity")!} />
        </div>
        {/* Volume inputs */}
        <div className="w-36">
          <Filter column={table.getColumn("estFireStartTime")!} />
        </div>
        {/* CPC inputs */}
        <div className="w-36">
          <Filter column={table.getColumn("timeOfReport")!} />
        </div>
        {/* Traffic inputs */}
        <div className="w-36">
          <Filter column={table.getColumn("estFireDelayTime")!} />
        </div>
        {/* CPC inputs */}
        <div className="w-36">
          <Filter column={table.getColumn("estCost")!} />
        </div>
      </div>

      <Table className="max-h-[100px]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="relative h-10 select-none border-t"
                    aria-sort={
                      header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                        ? "descending"
                        : "none"
                    }
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className={cn(
                          header.column.getCanSort() &&
                            "flex h-full cursor-pointer select-none items-center justify-between gap-2"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                          // Enhanced keyboard handling for sorting
                          if (
                            header.column.getCanSort() &&
                            (e.key === "Enter" || e.key === " ")
                          ) {
                            e.preventDefault();
                            header.column.getToggleSortingHandler()?.(e);
                          }
                        }}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: (
                            <ChevronUp
                              className="shrink-0 opacity-60"
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          ),
                          desc: (
                            <ChevronDown
                              className="shrink-0 opacity-60"
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? (
                          <span className="size-4" aria-hidden="true" />
                        )}
                      </div>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function Filter({ column }: { column: Column<any, unknown> }) {
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
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                e.target.value ? Number(e.target.value) : undefined,
                old?.[1],
              ])
            }
            placeholder="Min"
            type="number"
            aria-label={`${columnHeader} min`}
          />
          <Input
            id={`${id}-range-2`}
            className="-ms-px flex-1 rounded-s-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            value={(columnFilterValue as [number, number])?.[1] ?? ""}
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                e.target.value ? Number(e.target.value) : undefined,
              ])
            }
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
            column.setFilterValue(value === "all" ? undefined : value);
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
          onChange={(e) => column.setFilterValue(e.target.value)}
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

export { TableView };
