import { Card, CardContent } from "@/components/ui";
import { Truck } from "lucide-react";

export const DispatchHistory = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Dispatch History
        </h1>
        <p className="text-slate-500 font-medium">
          View and track all outbound dispatch records
        </p>
      </div>

      <Card className="border-0 shadow-2xl rounded-[3rem] bg-white overflow-hidden min-h-[400px] flex items-center justify-center">
        <CardContent className="p-0 text-center">
          <div className="flex flex-col items-center gap-4 opacity-20">
            <Truck className="h-20 w-20 text-slate-400" />
            <p className="text-xl font-black text-slate-400 uppercase ">
              No Dispatch Records Yet
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DispatchHistory;
