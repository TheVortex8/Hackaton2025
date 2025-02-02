import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useId, useRef, useState } from "react";

import { Label } from "@/components/ui/label";
import {
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
import { CalendarIcon, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RangeCalendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { RangeValue } from "@react-types/shared";
import { DateRange, DateValue } from "@react-types/calendar";
import { getLocalTimeZone, fromDate } from "@internationalized/date";
import { columns as columnOptimize} from "@/components/ui/table/columns";
import { MappedItem } from "@/type/mappedItem";
import { Item } from "@/type/item";

const itemsMapper = (item: Item) => ({
  id: item.id,
  location: item.location,
  severity: item.severity,
  estFireStartTime: item.estimated_fire_start_time,
  timeOfReport: item.reported_time,
  estFireDelayTime: item.deploy_time,
  estCost: item.cost,
});

function TableView({
  items,
  setItems,
  clickedRow,
  onRowClick,
  columns,
}: {
  items: Item[];
  setItems: (items: Item[]) => void;
  clickedRow: any;
  onRowClick: (row: MappedItem) => void; 
  columns: ColumnDef<MappedItem>[] ;
}) {
  const id = useId();
  const rowRefs = useRef<Map<number, HTMLTableRowElement>>(new Map());
  const [_highlightedRow, setHighlightedRow] = useState<number | null>(null);

  useEffect(() => {
    if (clickedRow && rowRefs.current.has(clickedRow.id)) {
      const rowElement = rowRefs.current.get(clickedRow.id);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedRow(clickedRow.id);
        setTimeout(() => {
          setHighlightedRow(null);
        }, 5000);
      }
    }
  }, [clickedRow]);
  const mappedItemsList = items.map(itemsMapper);
  const [mappedItems, setMappedItems] = useState<MappedItem[]>(mappedItemsList);
  const [date, setDate] = useState<DateRange | null>({
    start: fromDate(
      new Date(
        mappedItemsList.reduce((prev, curr) =>
          new Date(curr.timeOfReport) < new Date(prev.timeOfReport)
            ? curr
            : prev
        ).timeOfReport
      ),
      getLocalTimeZone()
    ),
    end: fromDate(
      new Date(
        mappedItemsList.reduce((prev, curr) =>
          new Date(curr.timeOfReport) > new Date(prev.timeOfReport)
            ? curr
            : prev
        ).timeOfReport
      ),
      getLocalTimeZone()
    ),
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "location",
      desc: false,
    },
  ]);
  const [severity, setSeverity] = useState<string | undefined>(undefined);

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

  const onDateChange = (value: RangeValue<DateValue>) => {
    setDate(value);
    if (value?.start && value?.end) {
      const startDate = value.start.toDate("America/Montreal");
      const endDate = value.end.toDate("America/Montreal");
      const filtered = mappedItemsList.filter((item) => {
        const itemDate = new Date(item.estFireStartTime);
        return itemDate >= startDate && itemDate <= endDate;
      });
      setMappedItems(filtered);
      setItems(
        filtered.map((item) => ({
          id: item.id,
          location: item.location,
          severity: item.severity,
          estimated_fire_start_time: item.estFireStartTime,
          reported_time: item.timeOfReport,
          deploy_time: item.estFireDelayTime,
          cost: item.estCost,
        }))
      );
    } else {
      setMappedItems(mappedItemsList);
    }
  };

  const onSeverityChange = (value: string | undefined) => {
    setSeverity(value);
    filterItems(date, value);
  };

  const filterItems = (
    date: RangeValue<DateValue> | null,
    severity: string | undefined
  ) => {
    let filtered = mappedItemsList;

    if (severity) {
      filtered = filtered.filter((item) => item.severity.includes(severity));
    }

    setMappedItems(filtered);
    setItems(
      filtered.map((item) => ({
        id: item.id,
        location: item.location,
        severity: item.severity,
        estimated_fire_start_time: item.estFireStartTime,
        reported_time: item.timeOfReport,
        deploy_time: item.estFireDelayTime,
        cost: item.estCost,
      }))
    );
  };

  return (
    <div className="space-y-6 bg-background p-6 h-[200px] w-full">
      <div className="flex flex-row gap-3">
        <div className="w-36">
          <Filter
            column={table.getColumn("severity")!}
            onChange={onSeverityChange}
          />
        </div>
        <Popover>
          <div className="space-y-2 w-64">
            <Label htmlFor={`${id}-label`}>Date Range</Label>
            <PopoverTrigger asChild>
              <Button
                id={`${id}-label`}
                variant={"outline"}
                className={cn(
                  "group w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20",
                  !date && "text-muted-foreground"
                )}
              >
                <span
                  className={cn("truncate", !date && "text-muted-foreground")}
                >
                  {date?.start ? (
                    date.end ? (
                      <>
                        {format(
                          date.start.toDate("America/Montreal"),
                          "LLL dd, y"
                        )}{" "}
                        -{" "}
                        {format(
                          date.end.toDate("America/Montreal"),
                          "LLL dd, y"
                        )}
                      </>
                    ) : (
                      format(date.start.toDate("America/Montreal"), "LLL dd, y")
                    )
                  ) : (
                    "Pick a date range"
                  )}
                </span>
                <CalendarIcon
                  size={16}
                  strokeWidth={2}
                  className="shrink-0 text-muted-foreground/80 transition-colors group-hover:text-foreground"
                  aria-hidden="true"
                />
              </Button>
            </PopoverTrigger>
          </div>
          <PopoverContent className="w-auto p-2" align="start">
            <RangeCalendar value={date} onChange={onDateChange} />
          </PopoverContent>
        </Popover>
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
                ref={(el) => el && rowRefs.current.set(row.original.id, el)}
                data-state={row.getIsSelected() && "selected"}
                className={cn(
                  row.original.id === clickedRow?.id ? "fade-in-out" : "",
                  row.getIsSelected() && "bg-yellow-500"
                )}
                onClick={() => onRowClick(row.original)}
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

export { TableView };
