import { predict } from "@/api/backendService";
import { Button } from "@/components/ui/button";
import { columnsPrediction } from "@/components/ui/table/columnsPrediction";
import { Item } from "@/type/item";
import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import DrawerTable from "./DrawerTable";
import MapView from "./MapView";

export const Prediction = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [clickedRow, setClickedRow] = useState(null);
  const [data, setData] = useState<{ result: Item[] }>({ result: [] });
  const [isLoading, setIsLoading] = useState<boolean>(false);
    
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
    setIsLoading(true);
    await fetchData(true);
    setIsLoading(false);
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
        disabled={isLoading}
      data-loading={isLoading}
      className="group disabled:opacity-100 z-10 absolute top-[5.5vh] right-[4vw] scale-1.5"
        
      >
        <span className="group-data-[loading=true]:text-transparent">Regenerate Data</span>
        {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          Renerating...&nbsp;
          <LoaderCircle className="animate-spin" size={16} strokeWidth={2} aria-hidden="true" />
        </div>
      )}
      </Button>
      <MapView
        loading={isLoading}
        table={data?.result}
        onRowClick={handleRowClick}
        clickedRow={clickedRow}
      />
      <DrawerTable
        items={data?.result}
        loading={isLoading}
        setItems={(items) => setData({ result: items })}
        clickedRow={clickedRow}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onButtonClick={handleButtonClick}
        onRowClick={handleRowClickFromTable}
        column={columnsPrediction}
      />
    </div>
  );
};
