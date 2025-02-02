import { useCallback, useEffect, useState } from "react";
import DrawerTable from "./DrawerTable";
import MapView from "./MapView";
import { predict } from "@/api/backendService";
import { Item } from "@/type/item";
import { columnsPrediction } from "@/components/ui/table/columnsPrediction";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export const Prediction = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [clickedRow, setClickedRow] = useState(null);
  const [data, setData] = useState<{ result: Item[] }>({ result: [] });
    
  const fetchData = async (regenerate:boolean = false) => {
    try {
      const result = await predict(regenerate);
      console.log(result);
      setData(result);
    } catch (error) {
      console.error("Error in fetchData:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRowClick = useCallback((row) => {
    setClickedRow(row);
    setIsDrawerOpen(true);
    console.log("Row clicked in Dashboard:", row);
  }, []);

  const handleButtonClick = () => {
    setIsDrawerOpen(true);
  };

  const handleRowClickFromTable = useCallback((row) => {
    console.log(clickedRow);
    setClickedRow(row);
    setIsDrawerOpen(false);
    console.log("Row clicked in Dashboard:", row);
  }, []);

  const regenerateData = async () => {
    await fetchData(true);
  }


  return (
    <div
      className={
        data.result.length > 0
          ? "flex flex-col items-center h-[calc(100vh-6)] bg-white pl-16 pt-6 w-full"
          : "flex flex-col items-center h-[calc(100vh-6)] bg-white pl-16 pt-6 w-full"
      }
    >
      <Button
        variant="outline"
        onClick={regenerateData}
        style={{zIndex: 10, position: "absolute", bottom: "80%", right: "9%", scale: "2"}}
      >
        <RefreshCcw />
      </Button>
      <MapView
        table={data?.result}
        onRowClick={handleRowClick}
        clickedRow={clickedRow}
      />
      {data.result.length > 0 && (
        <DrawerTable
          items={data?.result}
          setItems={(items) => setData({ result: items })}
          clickedRow={clickedRow}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onButtonClick={handleButtonClick}
          onRowClick={handleRowClickFromTable}
          column={columnsPrediction}
        />
      )}
    </div>
  );
};
