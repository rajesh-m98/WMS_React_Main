import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { handleFetchGinHeader } from "@/app/manager/ginManager";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
} from "@/components/ui";
import { ArrowLeft, Save, Loader2, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";

const GinHeaderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentHeader, loading } = useAppSelector((state) => state.gin);

  const [formData, setFormData] = useState({
    gate_pass_number: "",
    grpo_docentry: "",
    card_code: "",
    card_name: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(handleFetchGinHeader(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentHeader) {
      setFormData({
        gate_pass_number: currentHeader.gate_pass_number || "",
        grpo_docentry: currentHeader.grpo_docentry || "",
        card_code: currentHeader.card_code || "",
        card_name: currentHeader.card_name || "",
      });
    }
  }, [currentHeader]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const success = await dispatch(handleUpdateGinHeader(Number(id), formData));
    if (success) {
      toast.success("Header updated successfully");
      navigate(-1);
    }
  };

  if (loading && !currentHeader) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-xl"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="heading-section !text-2xl">Edit GIN Header</h1>
      </div>

      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100">
              <ClipboardCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-black text-slate-800">
                Header Information
              </CardTitle>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                Transaction ID: #{id}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">
                  Gate Pass Number
                </Label>
                <Input
                  value={formData.gate_pass_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gate_pass_number: e.target.value,
                    })
                  }
                  className="rounded-xl h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">
                  GRPO DocEntry
                </Label>
                <Input
                  value={formData.grpo_docentry}
                  onChange={(e) =>
                    setFormData({ ...formData, grpo_docentry: e.target.value })
                  }
                  className="rounded-xl h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">
                  Card Code
                </Label>
                <Input
                  value={formData.card_code}
                  onChange={(e) =>
                    setFormData({ ...formData, card_code: e.target.value })
                  }
                  className="rounded-xl h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">
                  Vendor Name
                </Label>
                <Input
                  value={formData.card_name}
                  onChange={(e) =>
                    setFormData({ ...formData, card_name: e.target.value })
                  }
                  className="rounded-xl h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
                className="rounded-xl h-12 px-8 font-bold text-slate-400"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 rounded-xl h-12 px-8 font-bold shadow-lg shadow-blue-100 gap-2"
              >
                <Save className="h-4 w-4" />
                Save Header Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GinHeaderEdit;
function handleUpdateGinHeader(
  arg0: number,
  formData: {
    gate_pass_number: string;
    grpo_docentry: string;
    card_code: string;
    card_name: string;
  },
): any {
  throw new Error("Function not implemented.");
}
