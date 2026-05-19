import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  handleFetchGinLine,
  handleUpdateGinHeader,
  handleUpdateGinLine,
  handleSelectGin,
} from "@/app/manager/ginManager";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Separator,
  Badge,
} from "@/components/ui";
import {
  ChevronLeft,
  Save,
  Loader2,
  ClipboardCheck,
  Tag,
  Hash,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

const GinEdit = () => {
  const { headerId, lineId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentHeader, currentLines, loading } = useAppSelector(
    (state) => state.gin,
  );

  const [headerForm, setHeaderForm] = useState({
    gate_pass_number: "",
    grpo_docentry: "",
    card_code: "",
    card_name: "",
  });

  const [lineForm, setLineForm] = useState({
    item_code: "",
    item_desc: "",
    received_qty: 0,
    mrp: 0,
    expiry_date: "",
  });

  const isLineEdit = !!lineId;

  useEffect(() => {
    if (headerId) {
      dispatch(
        handleSelectGin(
          Number(headerId),
          isLineEdit ? Number(lineId) : undefined,
        ),
      );
    }
  }, [dispatch, headerId, lineId, isLineEdit]);

  useEffect(() => {
    if (currentHeader) {
      setHeaderForm({
        gate_pass_number: currentHeader.gate_pass_number || "",
        grpo_docentry: currentHeader.grpo_docentry || "",
        card_code: currentHeader.card_code || "",
        card_name: currentHeader.card_name || "",
      });
    }
    if (currentLines && currentLines[0] && isLineEdit) {
      const line = currentLines[0];
      setLineForm({
        item_code: line.item_code || "",
        item_desc: line.item_desc || "",
        received_qty: line.received_qty || 0,
        mrp: line.mrp || 0,
        expiry_date: line.expiry_date ? line.expiry_date.split("T")[0] : "",
      });
    }
  }, [currentHeader, currentLines, isLineEdit]);

  const handleSaveHeader = async () => {
    if (!currentHeader) return;
    const success = await dispatch(
      handleUpdateGinHeader(currentHeader.id, {
        ...currentHeader,
        ...headerForm,
      }),
    );
    if (success) {
      toast.success("Header updated successfully");
      navigate(-1);
    }
  };

  const handleSaveLine = async () => {
    if (!lineId || !currentLines[0]) return;
    const success = await dispatch(
      handleUpdateGinLine(Number(lineId), {
        ...currentLines[0],
        ...lineForm,
      }),
    );
    if (success) {
      toast.success("Line item updated successfully");
      navigate(-1);
    }
  };

  if (loading && !currentHeader) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="label-bold uppercase tracking-widest text-slate-400">
          Loading Edit Interface...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full bg-white border border-slate-200 h-10 w-10 shadow-md hover:shadow-lg active:scale-95 transition-all"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="heading-section !text-2xl uppercase tracking-widest">
              {isLineEdit ? "Edit Line Item" : "Edit Gate Pass Header"}
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
              {isLineEdit
                ? `Updating Line Details for Header #${headerId}`
                : `Updating Master Information for GP #${currentHeader?.gate_pass_number}`}
            </p>
          </div>
        </div>
      </div>

      {!isLineEdit ? (
        /* HEADER EDIT MODE */
        <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-[40px] overflow-hidden bg-white mx-4">
          <CardHeader className="bg-slate-50 p-10 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-3xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-100">
                <ClipboardCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight text-slate-800">
                  Master Info
                </CardTitle>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                  Supplier & Gate Pass
                </p>
              </div>
            </div>
            <Button
              onClick={handleSaveHeader}
              className="bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-2xl shadow-lg shadow-blue-100 font-bold gap-2 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">
                  Vendor Code
                </Label>
                <Input
                  value={headerForm.card_code}
                  onChange={(e) =>
                    setHeaderForm({ ...headerForm, card_code: e.target.value })
                  }
                  className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-black focus:bg-white transition-all text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">
                  Vendor Name
                </Label>
                <Input
                  value={headerForm.card_name}
                  onChange={(e) =>
                    setHeaderForm({ ...headerForm, card_name: e.target.value })
                  }
                  className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-black focus:bg-white transition-all text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">
                  Gate Pass #
                </Label>
                <Input
                  value={headerForm.gate_pass_number}
                  onChange={(e) =>
                    setHeaderForm({
                      ...headerForm,
                      gate_pass_number: e.target.value,
                    })
                  }
                  className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-black focus:bg-white transition-all text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label className="label-bold uppercase tracking-widest text-[10px] text-slate-400">
                  Doc Entry #
                </Label>
                <Input
                  value={headerForm.grpo_docentry}
                  onChange={(e) =>
                    setHeaderForm({
                      ...headerForm,
                      grpo_docentry: e.target.value,
                    })
                  }
                  className="h-14 rounded-2xl bg-slate-50/50 border-slate-200 font-black focus:bg-white transition-all text-slate-700"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* LINE EDIT MODE */
        <Card className="border-1 shadow-2xl shadow-blue-100 rounded-[40px] overflow-hidden bg-white mx-4">
          <CardHeader className="bg-blue-600 p-6 text-white flex flex-row items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner">
                <Tag className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight text-white">
                  Line Details
                </CardTitle>
                <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mt-0.5">
                  Product & Quantities
                </p>
              </div>
            </div>
            <Button
              onClick={handleSaveLine}
              className="bg-white text-blue-600 hover:bg-blue-50 h-12 px-8 rounded-2xl shadow-lg font-bold gap-2 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" /> Save Line
            </Button>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-4">
              {/* READ-ONLY DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 items-center">
                <div className="space-y-1 md:col-span-3">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Item Code
                  </Label>
                  <div>
                    <Badge
                      variant="outline"
                      className="bg-white border-slate-200 text-slate-600 font-black px-3 py-1 text-sm"
                    >
                      {lineForm.item_code || "N/A"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1 md:col-span-6">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Item Description
                  </Label>
                  <p className="text-sm font-black text-slate-800 line-clamp-1">
                    {lineForm.item_desc || "N/A"}
                  </p>
                </div>
                <div className="space-y-1 md:col-span-3">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    MRP Value
                  </Label>
                  <p className="text-xl font-black text-slate-800">
                    ₹{lineForm.mrp || 0}
                  </p>
                </div>
              </div>

              {/* EDITABLE FIELDS */}
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <Label className="label-bold uppercase tracking-widest text-sm text-slate-500 font-bold">
                    Received Quantity
                  </Label>
                  <Input
                    type="number"
                    value={lineForm.received_qty}
                    onChange={(e) =>
                      setLineForm({
                        ...lineForm,
                        received_qty: Number(e.target.value),
                      })
                    }
                    className="h-16 rounded-2xl bg-blue-50/50 border-blue-100 text-blue-700 font-black focus:bg-white transition-all text-2xl px-6"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="label-bold uppercase tracking-widest text-sm text-slate-500 font-bold">
                    Expiry Date
                  </Label>
                  <Input
                    type="date"
                    value={lineForm.expiry_date}
                    onChange={(e) =>
                      setLineForm({ ...lineForm, expiry_date: e.target.value })
                    }
                    className="h-16 rounded-2xl bg-slate-50/50 border-slate-200 font-black focus:bg-white transition-all text-slate-800 text-xl px-6"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GinEdit;
