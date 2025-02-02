import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { TableView } from "./table/TableView";
import { Item } from "@/type/item";
import { MappedItem } from "@/type/mappedItem";
import { ColumnDef } from "@tanstack/table-core";
import { columnsOptimize } from "@/components/ui/table/columns";
import { Card, CardHeader } from "@/components/ui/card";

export type Reports = {
  fires_addressed: number;
  fires_delayed: number;
  severity_counts_addressed: {
    low: number;
    medium: number;
    high: number;
  };
  severity_counts_delayed: {
    low?: number;
    medium?: number;
    high?: number;
  };
  total_damage_costs: number;
  total_operational_costs: number;
};

type DrawerTableProps = {
  items: Item[];
  reports?: Reports;
  setItems: (items) => void;
  clickedRow;
  isOpen: boolean;
  onClose: () => void;
  onButtonClick: () => void;
  onRowClick: (row) => void;
  column?: ColumnDef<MappedItem>[];
};

function DrawerTable({
  items,
  reports,
  setItems,
  clickedRow,
  isOpen,
  onClose,
  onButtonClick,
  onRowClick,
  column = columnsOptimize,
}: DrawerTableProps) {
  console.log(reports);
  return (
    <>
      <Button
        variant="outline"
        onClick={onButtonClick}
        className="absolute bottom-10"
      >
        Visualize Data
      </Button>
      {reports && (
              <Drawer open={isOpen} onOpenChange={onClose}>
              <DrawerContent className="flex" clickedRow={clickedRow}>
                <div className="w-[95vw] self-end">
                  <DrawerHeader className="flex flex-row">
                    <Card className="w-[14vw] border-grey-500">
                      <CardHeader>
                        <DrawerTitle>Total Cost</DrawerTitle>
                        <DrawerDescription className="text-lg text-black-500">
                          {(
                            reports.total_damage_costs +
                            reports.total_operational_costs
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </DrawerDescription>
                      </CardHeader>
                    </Card>
                    <Card className="w-[14vw] border-green-500">
                      <CardHeader>
                        <DrawerTitle>Fire Addressed</DrawerTitle>
                        <DrawerDescription className="text-green-500 text-lg">
                          {reports.fires_addressed}
                        </DrawerDescription>
                      </CardHeader>
                    </Card>
                    <Card className={`w-[14vw] ${reports.fires_delayed <= 0 ? 'border-green-500' : 'border-red-500'}`}>
                      <CardHeader>
                        <DrawerTitle>Fire Missed</DrawerTitle>
                        <DrawerDescription className={`${reports.fires_delayed <= 0 ? 'text-green-500' : 'text-red-500'} text-lg`}>
                          {reports.fires_delayed}
                        </DrawerDescription>
                      </CardHeader>
                    </Card>
                    <Card className="w-[14vw] border-grey-500">
                      <CardHeader>
                        <DrawerTitle>Operational Cost</DrawerTitle>
                        <DrawerDescription className="text-grey-500 text-lg">
                          {reports.total_operational_costs.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </DrawerDescription>
                      </CardHeader>
                    </Card>
                    <Card className="w-[14vw] border-grey-500">
                      <CardHeader>
                        <DrawerTitle>Damage Cost</DrawerTitle>
                        <DrawerDescription className="text-grey-500 text-lg">
                          {reports.total_damage_costs.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </DrawerDescription>
                      </CardHeader>
                    </Card>
                  </DrawerHeader>
                  <TableView
                    items={items}
                    setItems={setItems}
                    clickedRow={clickedRow}
                    onRowClick={onRowClick}
                    columns={column}
                  />
                </div>
              </DrawerContent>
            </Drawer>
      )}

    </>
  );
}


export default DrawerTable;
