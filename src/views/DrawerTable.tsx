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

function DrawerTable({ items }: { items: Item[] }) {
  return (
    <Drawer>
      <DrawerTrigger className="absolute bottom-10" asChild>
        <Button variant="outline">Visualize Data</Button>
      </DrawerTrigger>
      <DrawerContent className="flex">
        <div className="w-[95vw] self-end">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <TableView items={items} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default DrawerTable;
