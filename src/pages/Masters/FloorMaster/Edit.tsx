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
import { handleCreateOrUpdateFloor, handleFetchFloorById } from "@/app/manager/floorManager";
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
  const { currentFloor, formLoading, loading } = useAppSelector((state) => state.floor);

  const [formData, setFormData] = useState({
    warehouse_id: 1,
    floor1: "",
    floor2: "",
    floor3: "",
    floor4: "",
    floor5: "",
    floor6: "",
    barcode: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(handleFetchFloorById(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentFloor) {
      setFormData({
        warehouse_id: currentFloor.warehouse_id,
        floor1: currentFloor.floor1 || "",
        floor2: currentFloor.floor2 || "",
        floor3: currentFloor.floor3 || "",
        floor4: currentFloor.floor4 || "",
        floor5: currentFloor.floor5 || "",
        floor6: currentFloor.floor6 || "",
        barcode: currentFloor.barcode || "",
      });
    }
  }, [currentFloor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.floor1 || !formData.barcode) {
      toast.error("Please fill in at least Level 1 and Barcode");
      return;
    }

    const success = await dispatch(handleCreateOrUpdateFloor(formData, Number(id)));

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
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center gap-4 mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/masters/floors")}
          className="rounded-full hover:bg-slate-100 h-10 w-10 transition-all border border-slate-100 bg-white"
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
          <Card className="md:col-span-2 border-0 shadow-lg shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-8">
              <CardTitle className="caption-small !text-slate-500 flex items-center gap-2">
                <Layers className="icon-sm" /> Floor Hierarchy Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <LevelInput
                  id="floor1"
                  label="Level 1 Name"
                  placeholder="e.g. Ground Floor"
                  value={formData.floor1}
                  onChange={(e: any) =>
                    setFormData({ ...formData, floor1: e.target.value })
                  }
                />
                <LevelInput
                  id="floor2"
                  label="Level 2 Name"
                  placeholder="e.g. Zone A"
                  value={formData.floor2}
                  onChange={(e: any) =>
                    setFormData({ ...formData, floor2: e.target.value })
                  }
                />
                <LevelInput
                  id="floor3"
                  label="Level 3 Name"
                  placeholder="e.g. Aisle 1"
                  value={formData.floor3}
                  onChange={(e: any) =>
                    setFormData({ ...formData, floor3: e.target.value })
                  }
                />
                <LevelInput
                  id="floor4"
                  label="Level 4 Name"
                  placeholder="e.g. Rack 1"
                  value={formData.floor4}
                  onChange={(e: any) =>
                    setFormData({ ...formData, floor4: e.target.value })
                  }
                />
                <LevelInput
                  id="floor5"
                  label="Level 5 Name"
                  placeholder="e.g. Shelf 1"
                  value={formData.floor5}
                  onChange={(e: any) =>
                    setFormData({ ...formData, floor5: e.target.value })
                  }
                />
                <LevelInput
                  id="floor6"
                  label="Level 6 Name"
                  placeholder="e.g. Bin 1"
                  value={formData.floor6}
                  onChange={(e: any) =>
                    setFormData({ ...formData, floor6: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg shadow-blue-100/50 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-blue-50/50 border-b border-blue-100/30 py-4 px-8">
                <CardTitle className="caption-small !text-blue-600 flex items-center gap-2">
                  <BarcodeIcon className="icon-sm" /> Identification
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label className="label-bold !text-blue-600 uppercase text-[10px]">
                    Unique Barcode
                  </Label>
                  <Input
                    required
                    placeholder="FLR-G-001"
                    className="rounded-xl h-12 bg-blue-50/20 border-blue-100 body-strong !text-blue-900 font-mono focus:ring-4 focus:ring-blue-100 transition-all"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  />
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="body-main !text-xs !text-slate-500 leading-relaxed italic">
                    ID: <span className="font-bold">{id}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
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
