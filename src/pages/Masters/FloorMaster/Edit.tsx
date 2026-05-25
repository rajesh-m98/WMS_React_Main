import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import {
  ChevronLeft,
  Save,
  Layers,
  Loader2,
  Barcode as BarcodeIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  handleCreateOrUpdateFloor,
  handleFetchFloorById,
} from "@/app/manager/floorManager";
import config from "./FloorConfig.json";

const LevelInput = ({ id, label, placeholder, value, onChange }: any) => (
  <div className="space-y-2">
    <Label className="label-bold !text-slate-400 uppercase text-[10px]">
      {label}
    </Label>
    <Input
      placeholder={placeholder}
      className="rounded-xl h-11 bg-slate-50/50 border-slate-200 body-strong !text-slate-900 transition-all focus:bg-white focus:ring-4 focus:ring-blue-50"
      value={value}
      onChange={onChange}
    />
  </div>
);

const FloorEdit = () => {
  const { id } = useParams();
  const strings = config.strings.edit;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentFloor, formLoading, loading } = useAppSelector(
    (state) => state.floor,
  );

  const [formData, setFormData] = useState({
    warehouse_Id: 1,
    floor_Name: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(handleFetchFloorById(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentFloor) {
      setFormData({
        warehouse_Id: currentFloor.warehouse_id,
        floor_Name: currentFloor.floor_Name || "",
      });
    }
  }, [currentFloor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.floor_Name) {
      toast.error("Please fill in Floor Name");
      return;
    }

    const success = await dispatch(
      handleCreateOrUpdateFloor(formData, Number(id)),
    );

    if (success) {
      navigate("/masters/floors");
    }
  };

  if (loading && !currentFloor) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="label-bold !text-slate-400">Loading Floor Details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
      <div className="flex items-center gap-4 mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/masters/floors")}
          className="rounded-full hover:bg-slate-100 shadow-lg shadow-slate-500/50 h-10 w-10 transition-all border border-slate-100 bg-white"
        >
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </Button>
        <div>
          <h2 className="heading-section !text-2xl">{strings.title}</h2>
          <p className="label-bold !text-slate-400 italic">
            {strings.subtitle.toUpperCase()}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-2 border-0 shadow-lg shadow-slate-500/50 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-8">
              <CardTitle className="caption-small !text-slate-500 flex items-center gap-2">
                <Layers className="icon-sm" /> Floor Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="label-bold !text-slate-400 uppercase text-[10px]">
                    Floor Name / Identifier
                  </Label>
                  <Input
                    placeholder="e.g. Ground Floor Main"
                    className="rounded-xl h-12 bg-slate-50/50 border-slate-200 body-strong !text-slate-900 transition-all focus:bg-white focus:ring-4 focus:ring-blue-50"
                    value={formData.floor_Name}
                    onChange={(e) =>
                      setFormData({ ...formData, floor_Name: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/masters/floors")}
            className="rounded-xl px-10 transition-all body-strong uppercase tracking-widest text-xs h-12 hover:bg-slate-100"
          >
            {strings.discardBtn}
          </Button>
          <Button
            type="submit"
            className="px-12 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xl shadow-blue-200 body-strong text-white uppercase text-xs h-12 transition-all active:scale-95"
            disabled={formLoading}
          >
            {formLoading ? (
              <Loader2 className="animate-spin icon-sm" />
            ) : (
              <>
                <Save className="icon-base mr-3" /> {strings.saveBtn}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FloorEdit;
