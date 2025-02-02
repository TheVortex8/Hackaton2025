import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Item, TableView } from "./TableView";

type DrawerTableProps = {
  items: Item[];
  clickedRow: any;
  isOpen: boolean;
  onClose: () => void;
  onButtonClick: () => void;
  onRowClick: (row: any) => void;
};

function DrawerTable({
  items,
  clickedRow,
  isOpen,
  onClose,
  onButtonClick,
  onRowClick,
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
              clickedRow={clickedRow}
              onRowClick={onRowClick}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default DrawerTable;
