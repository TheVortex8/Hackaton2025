import { useState, useCallback, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import {
  FlameIcon,
  LayoutDashboard,
  MapIcon,
  ReceiptTextIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { FileUploadView } from "./FileUploadView";
import MapView from "./MapView";
import DrawerTable from "./DrawerTable";
import { Item } from "@/type/item";

export function SidebarLayout() {
  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Prediction",
      href: "/prediction",
      icon: (
        <MapIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

export const Logo = () => {
  return (
    <Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <FlameIcon className="text-red-500 h-5 w-5 flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Fire Watch
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <FlameIcon className="text-red-500 h-5 w-5 flex-shrink-0" />
    </Link>
  );
};

// Dummy dashboard component with content
export const Dashboard = ({ onReportChange }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [responseData, setResponseData] = useState<{ result: Item[], report? }>();
  const [clickedRow, setClickedRow] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleFileUpload = (files: File[], data) => {
    setUploadedFiles(files);
    setResponseData(data);
  };

  const handleRowClick = useCallback((row) => {
    console.log(clickedRow);
    setClickedRow(row);
    setIsDrawerOpen(true);
    console.log("Row clicked in Dashboard:", row);
  }, []);

  const handleRowClickFromTable = useCallback((row) => {
    console.log(clickedRow);
    setClickedRow(row);
    setIsDrawerOpen(false);
    console.log("Row clicked in Dashboard:", row);
  }, []);

  const handleButtonClick = () => {
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    if (responseData.result) {
      onReportChange(responseData.result);
    }
  }, [responseData.result, onReportChange]);

  return (
    <div
      className={
        uploadedFiles.length > 0
          ? "flex flex-col items-center h-[calc(100vh-6)] bg-white pl-16 pt-6 w-full"
          : "flex flex-col w-full pl-6"
      }
    >
      <FileUploadView onChange={handleFileUpload} />
      {uploadedFiles.length > 0 && (
        <>
          <MapView
            table={responseData?.result}
            onRowClick={handleRowClick}
            clickedRow={clickedRow}
          />
          <DrawerTable
            items={responseData.result}
            reports={responseData.report}
            setItems={(items) => setResponseData({ result: items })}
            clickedRow={clickedRow}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onButtonClick={handleButtonClick}
            onRowClick={handleRowClickFromTable}
          />
        </>
      )}
    </div>
  );
};
