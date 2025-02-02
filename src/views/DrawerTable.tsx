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

type DrawerTableProps = {
  items: Item[];
  setItems: () => void;
  clickedRow: any;
  isOpen: boolean;
  onClose: () => void;
  onButtonClick: () => void;
  onRowClick: (row: any) => void;
  column?: ColumnDef<MappedItem>[]
};

function DrawerTable({
  items,
  setItems,
  clickedRow,
  isOpen,
  onClose,
  onButtonClick,
  onRowClick,
  column = columnsOptimize,
}: DrawerTableProps) {
  console.log(clickedRow);
  return (
    <>
      <Button
        variant="outline"
        onClick={onButtonClick}
        className="absolute bottom-10"
      >
        Visualize Data
      </Button>
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="flex" clickedRow={clickedRow}>
          <div className="w-[95vw] self-end">
            <DrawerHeader>
              <DrawerTitle>Move Goal</DrawerTitle>
              <DrawerDescription>
                Set your daily activity goal.
              </DrawerDescription>
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
    </>
  );
}

export default DrawerTable;
