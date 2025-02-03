import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DownloadCloudIcon, UploadCloud, UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    const newFile = newFiles[0];
    setFile(newFile);
    if (onChange) {
      onChange([newFile]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <>
      <div className="w-full" {...getRootProps()}>
        
    <div className="flex justify-end mb-4">
      <button
        onClick={() => {
          const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(`
    timestamp,fire_start_time,location,severity
    2024-01-03 02:00:00,2024-01-03 01:53:00,"44.5917,-72.7931",low
    2024-01-03 10:00:00,2024-01-03 09:29:00,"44.5963,-72.3298",high
    2024-01-13 03:00:00,2024-01-13 02:04:00,"44.0596,-72.3365",medium
    2024-01-18 07:00:00,2024-01-18 06:54:00,"45.8991,-72.4297",low
    2024-01-29 11:00:00,2024-01-29 10:11:00,"45.3772,-72.4617",high
    2024-02-07 23:00:00,2024-02-07 22:38:00,"45.2376,-72.7731",low
    2024-02-13 14:00:00,2024-02-13 13:05:00,"45.5061,-73.5626",medium
    2024-03-17 04:00:00,2024-03-17 03:58:00,"44.7745,-72.3508",medium
    2024-03-17 08:00:00,2024-03-17 07:10:00,"44.7544,-73.6241",low
    2024-03-29 08:00:00,2024-03-29 07:29:00,"44.5771,-73.4983",high
    2024-04-04 05:00:00,2024-04-04 04:37:00,"44.8483,-73.7878",low
    2024-04-04 20:00:00,2024-04-04 19:17:00,"45.237,-72.3099",low
    2024-06-06 02:00:00,2024-06-06 01:22:00,"45.0448,-72.7419",low
    2024-06-14 23:00:00,2024-06-14 22:23:00,"44.5355,-73.697",high
    2024-06-19 03:00:00,2024-06-19 02:25:00,"45.8497,-72.3991",medium
    2024-07-08 11:00:00,2024-07-08 10:06:00,"45.4207,-73.5608",medium
    2024-07-26 18:00:00,2024-07-26 17:55:00,"45.1636,-72.7738",medium
    2024-08-11 17:00:00,2024-08-11 16:03:00,"44.422,-73.8217",low
    2024-08-15 16:00:00,2024-08-15 15:10:00,"44.9893,-72.9472",high
    2024-08-26 04:00:00,2024-08-26 03:03:00,"44.4875,-73.9055",medium
    2024-09-04 08:00:00,2024-09-04 07:08:00,"45.9548,-72.0209",low
    2024-09-04 23:00:00,2024-09-04 22:16:00,"45.0288,-73.4796",low
    2024-09-08 13:00:00,2024-09-08 12:46:00,"45.1302,-73.0222",low
    2024-09-23 19:00:00,2024-09-23 18:27:00,"44.0927,-73.8376",low
    2024-09-28 18:00:00,2024-09-28 17:54:00,"45.532,-72.0069",medium
    2024-10-16 14:00:00,2024-10-16 13:23:00,"44.7212,-73.1703",medium
    2024-10-27 07:00:00,2024-10-27 06:44:00,"44.0144,-73.8114",medium
    2024-11-14 06:00:00,2024-11-14 05:40:00,"44.4543,-73.5505",medium
    2024-11-18 20:00:00,2024-11-18 19:57:00,"45.1862,-72.7336",low
    2024-12-16 20:00:00,2024-12-16 19:01:00,"45.2517,-73.3938",high
    2024-12-23 03:00:00,2024-12-23 02:50:00,"44.6085,-73.0306",high
    `);
          const link = document.createElement("a");
          link.setAttribute("href", csvContent);
          link.setAttribute("download", "test_dataset.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        className="px-4 py-2 bg-green-500 text-white rounded flex items-center"
      >
        Download Test Wildfire Dataset
        <DownloadCloudIcon className="h-4 w-4 bg-green-500 text-neutral-600 dark:text-neutral-400 ml-2" />
      </button>
    </div>
        <motion.div
          onClick={handleClick}
          whileHover="animate"
          className={
            file
              ? "pt-10 pb-10 block rounded-lg cursor-pointer relative overflow-hidden"
              : "p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
          }
        >
          <input
            ref={fileInputRef}
            id="file-upload-handle"
            type="file"
            onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
            className="hidden"
          />
          {!file && (
            <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
              <GridPattern />
            </div>
          )}
          <div className="flex flex-col items-end justify-center">
            {!file && (
              <>
                <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
                  Upload file
                </p>
                <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
                  Drag or drop your file here or click to upload
                </p>
              </>
            )}
            <div
              className={
                file
                  ? "relative w-full max-w-[4.5vw]"
                  : "relative w-full mt-10 max-w-xl mx-auto"
              }
            >
              {file && (
                <motion.div
                  key={"file"}
                  layoutId="file-upload"
                  className={cn(
                    "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-center justify-center md:h-16 w-full mx-auto rounded-md",
                    "shadow-sm"
                  )}
                >
                  <div className="flex justify-center w-full h-full items-center gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.3 }}
                      layout
                      className="text-base text-neutral-700 dark:text-neutral-300 w-full h-full truncate max-w-xs flex items-center justify-center"
                    >
                      <UploadCloud
                        size={30}
                        className=" text-neutral-600 dark:text-neutral-300"
                      />
                    </motion.p>
                  </div>
                </motion.div>
              )}
              {!file && (
                <motion.div
                  layoutId="file-upload"
                  variants={mainVariant}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className={cn(
                    "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                    "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                  )}
                >
                  {isDragActive ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-neutral-600 flex flex-col items-center"
                    >
                      Drop it
                      <UploadIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                    </motion.p>
                  ) : (
                    <UploadIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                  )}
                </motion.div>
              )}

              {!file && (
                <motion.div
                  variants={secondaryVariant}
                  className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
                ></motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
