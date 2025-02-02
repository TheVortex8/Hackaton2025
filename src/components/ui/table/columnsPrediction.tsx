import { cn } from "@/lib/utils";
import { MappedItem } from "@/type/mappedItem";
import { ColumnDef } from "@tanstack/table-core";
import { Checkbox } from "react-aria-components";

export const columnsPrediction: ColumnDef<MappedItem>[] = [
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
                  medium: "bg-orange-400/20 text-orange-500",
                  low: "bg-yellow-400/20 text-yellow-500",
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
        const a =
          priorityOrder[rowA.getValue(columnId) as keyof typeof priorityOrder] ??
          999;
        const b =
          priorityOrder[rowB.getValue(columnId) as keyof typeof priorityOrder] ??
          999;
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
  ];