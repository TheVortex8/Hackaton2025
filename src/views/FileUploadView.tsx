import { upload } from "@/api/backendService";
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";

export function FileUploadView({
  onChange,
}: {
  onChange?: (files: File[], responseData?: any[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = async (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    
    const data = await upload(newFiles[0])
    if (onChange) {
      onChange(newFiles, data);
    }
  };

  return (
    <div
      className={
        !(files.length > 0)
          ? "p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col justify-center gap-2 flex-1 w-full h-full"
          : "absolute left-0 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 w-[95vw] border-none"
      }
    >
      <div
        className={
          files.length > 0
            ? "text-neutral-700 dark:text-neutral-200 text-center"
            : "w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-background border-neutral-200 dark:border-neutral-800 rounded-lg"
        }
      >
        <FileUpload onChange={handleFileUpload} />
      </div>
    </div>
  );
}
