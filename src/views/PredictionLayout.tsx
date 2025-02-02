import { useCallback, useEffect, useState } from "react";
import DrawerTable from "./DrawerTable";
import MapView from "./MapView";
import { predict } from "@/api/backendService";
import { Item } from "@/type/item";

export const Prediction = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  // const [data, setData] = useState<{result: Item[]}>({result: []});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [clickedRow, setClickedRow] = useState<any>(null);
  const [data, setData] = useState<{ result: Item[] }>({ result: [] });

  useEffect(() => {
    const fetchData = async () => {
      const result = await predict(true);
      setData(result);
    };
    if (data.result.length === 0) {
      fetchData();
    }
  }, []);

  //   const data = await predict(true);

  //   console.log(data);
  const handleRowClick = useCallback((row: any) => {
    setClickedRow(row);
    setIsDrawerOpen(true);
    console.log("Row clicked in Dashboard:", row);
  }, []);

  const handleButtonClick = () => {
    setIsDrawerOpen(true);
  };

  const handleRowClickFromTable = useCallback((row: any) => {
    console.log(clickedRow);
    setClickedRow(row);
    setIsDrawerOpen(false);
    console.log("Row clicked in Dashboard:", row);
  }, []);

  return (
    <div
      className={
        uploadedFiles.length > 0
          ? "flex flex-col items-center h-[calc(100vh-6)] bg-white pl-16 pt-6 w-full"
          : "flex flex-col w-full pl-6"
      }
    >
      <MapView
        table={data?.result}
        onRowClick={handleRowClick}
        clickedRow={clickedRow}
      />
      {data.result.length > 0 && (
        <DrawerTable
          items={data.result}
          setItems={(items) => setData({ result: items })}
          clickedRow={clickedRow}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onButtonClick={handleButtonClick}
          onRowClick={handleRowClickFromTable}
        />
      )}
    </div>
  );
};
