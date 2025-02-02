import { CustomChart } from "@/components/ui/area-chart";

export const Reports = () => {
  return (
    <div
      className={
        "flex flex-col items-center h-[calc(100vh-6)] bg-white pl-16 pt-6 w-full"
      }
    >
      <CustomChart />
    </div>
  );
};
