import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { handleFetchDispatchDetail } from "@/app/manager/dispatchManager";
import { handleFetchPutawayDetail } from "@/app/manager/putawayManager";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");
  const reqType = queryParams.get("reqType");
  const isDispatch = type === "dispatch";
  const isRequest = type === "request";

  const { currentDetail, loading: dispatchLoading } = useAppSelector(
    (state) => state.dispatch,
  );
  const { inward: inwardReqs, outward: outwardReqs } = useAppSelector(
    (state) => state.request,
  );
  const {
    inward: inwardHist,
    outward: outwardHist,
    currentDetail: putawayDetailWrapper,
  } = useAppSelector((state) => state.putaway);

  const putawayDetail = putawayDetailWrapper?.data;
  const putawayLoading = putawayDetailWrapper?.loading;

  useEffect(() => {
    if (isDispatch && id) {
      dispatch(handleFetchDispatchDetail(id));
    }
    if (type === "putaway" && id) {
      dispatch(handleFetchPutawayDetail(parseInt(id)));
    }
  }, [id, isDispatch, type, dispatch]);

  const loading = isDispatch ? dispatchLoading : putawayLoading;

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="label-bold !text-slate-400">
          Loading Transaction Details...
        </p>
      </div>
    );
  }

  // Find the detail from the appropriate slice
  let activeItem: any = null;
  if (isDispatch) {
    activeItem = currentDetail;
  } else if (isRequest) {
    const list = reqType === "inward" ? inwardReqs.data : outwardReqs.data;
    activeItem = list.find((item: any) => item.id?.toString() === id);
  } else if (type === "putaway") {
    // Priority: use the specific detail if fetched, otherwise find in list
    activeItem =
      putawayDetail?.id?.toString() === id
        ? putawayDetail
        : (reqType === "inward" ? inwardHist.data : outwardHist.data).find(
            (item: any) => item.id?.toString() === id,
          );
  }

  const displayLines = activeItem
    ? [
        {
          id: activeItem.id,
          docEntry:
            activeItem.doc_entry ||
            activeItem.inwardheader?.docentry ||
            activeItem.outwardheader?.docentry,
          docNum:
            activeItem.docnum ||
            activeItem.inwardheader?.docnum ||
            activeItem.outwardheader?.docnum,
          putawayType:
            activeItem.putaway_type === 1 || reqType === "inward"
              ? "Inward"
              : activeItem.putaway_type === 2 || reqType === "outward"
                ? "Outward"
                : "N/A",
          lineId: activeItem.lineid,
          itemCode: activeItem.item_code || activeItem.itemcode,
          itemDesc: activeItem.item_description || activeItem.name,
          batchNum: activeItem.batch_number || activeItem.batchnumber,
          cardCode:
            activeItem.cardcode ||
            activeItem.inwardheader?.cardcode ||
            activeItem.outwardheader?.cardcode,
          cardName:
            activeItem.cardname ||
            activeItem.inwardheader?.cardname ||
            activeItem.outwardheader?.cardname,
          docDate:
            activeItem.docdate ||
            activeItem.inwardheader?.docdate ||
            activeItem.outwardheader?.docdate,
          whsCode: activeItem.whscode || activeItem.whs_code,
          totalQty: activeItem.total_quntity || activeItem.quantity,
          filledQty:
            activeItem.filled_quntity ||
            activeItem.putQty ||
            activeItem.pickQty ||
            0,
          remainingQty:
            activeItem.remaining_quntity !== undefined
              ? activeItem.remaining_quntity
              : activeItem.quantity - (activeItem.putQty || 0),
          barcode: activeItem.box_barcode || activeItem.barcode || "N/A",
          branch: activeItem.branchname || "Default",
          userName: activeItem.name || "System",
        },
      ]
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          className="h-10 px-6 rounded-lg bg-white shadow-sm border-slate-200 font-bold text-slate-900 hover:bg-slate-50"
          onClick={() => navigate(-1)}
        >
          <div className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </div>
        </Button>
      </div>

      {/* Primary Info Strip */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-2 text-left">
          <span className="text-[15px] font-black text-slate-900">Type:</span>
          <Badge
            className={`label-bold !tracking-wide px-4 py-1.5 rounded-xl border transition-all hover:scale-105 duration-300 ${
              activeItem?.putaway_type === 1 || reqType === "inward"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200/50 shadow-sm hover:bg-blue-500 hover:text-white shadow-emerald-100/50"
                : activeItem?.putaway_type === 2 || reqType === "outward"
                  ? "bg-blue-50 text-blue-700 border-blue-200/50 shadow-sm hover:bg-blue-500 hover:text-white shadow-blue-100/50"
                  : "bg-slate-50 text-slate-700 hover:bg-blue-500 hover:text-white border-slate-200/50"
            }`}
          >
            {isDispatch
              ? activeItem?.putaway_type === 1
                ? "INWARD"
                : "OUTWARD"
              : isRequest
                ? reqType === "inward"
                  ? "INWARD REQUEST"
                  : "OUTWARD REQUEST"
                : reqType === "inward"
                  ? "INWARD HISTORY"
                  : "OUTWARD HISTORY"}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-left">
          <span className="text-[15px] font-black text-slate-900">
            {isDispatch ? "Doc Num:" : "Created At:"}
          </span>
          <span className="text-[15px] font-bold text-slate-500">
            {activeItem?.docnum ||
              activeItem?.inwardheader?.docnum ||
              activeItem?.outwardheader?.docnum ||
              "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-left">
          <span className="text-[15px] font-black text-slate-900">
            {isDispatch ? "Branch/Warehouse:" : "Facility/User:"}
          </span>
          <span className="text-[15px] font-bold text-slate-500">
            {isDispatch
              ? `${activeItem?.branchname} (${activeItem?.whscode})`
              : `${activeItem?.whscode || "Main"} / ${activeItem?.cardname || "Admin"}`}
          </span>
        </div>
      </div>

      {/* Tabs Layout */}
      <Card className="border shadow-sm rounded-3xl overflow-hidden bg-white mt-4">
        <CardContent className="p-0">
          <div className="flex border-b border-slate-100">
            <button className="px-8 py-4 text-sm font-black text-slate-900 border-b-2 border-slate-900 transition-all">
              Full Document Values
            </button>
          </div>

          <div className="overflow-x-auto scrollbar-premium scrollbar-thin scrollbar-thumb-slate-200">
            <Table className="min-w-[2400px]">
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                  <TableHead className="label-bold px-4 py-5 text-[13px] tracking-tight text-left whitespace-nowrap">
                    DocNum
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-[13px] tracking-tight text-left whitespace-nowrap">
                    DocEntry
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-[13px] tracking-tight text-left whitespace-nowrap">
                    Type
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-[13px] tracking-tight text-left whitespace-nowrap">
                    CardCode
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-[13px] tracking-tight text-left whitespace-nowrap">
                    CardName
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-[13px] tracking-tight text-left whitespace-nowrap">
                    DocDate
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-[13px] tracking-tight text-left whitespace-nowrap">
                    ItemCode
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-[13px] tracking-tight text-left whitespace-nowrap">
                    Description
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-[13px] tracking-tight text-left whitespace-nowrap">
                    BatchNum
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-[13px] tracking-tight text-left whitespace-nowrap">
                    Barcode
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-[13px] tracking-tight text-left whitespace-nowrap">
                    Branch
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-[13px] tracking-tight text-left whitespace-nowrap">
                    Warehouse
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-[13px] tracking-tight text-left whitespace-nowrap">
                    User
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-[13px] tracking-tight text-left whitespace-nowrap">
                    Total Qty
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-[13px] tracking-tight text-left whitespace-nowrap">
                    Filled Qty
                  </TableHead>
                  <TableHead className="label-bold px-4 py-5 text-[13px] tracking-tight text-left pr-6 whitespace-nowrap">
                    Remaining
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayLines.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={17}
                      className="h-40 text-center text-left"
                    >
                      <div className="flex flex-col items-center justify-center gap-2 opacity-20">
                        <Package className="h-10 w-10 text-slate-400" />
                        <p className="text-sm font-bold text-slate-400 uppercase">
                          No Data Available
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  displayLines.map((row, idx) => (
                    <TableRow
                      key={idx}
                      className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0 transition-colors text-left"
                    >
                      <td className="px-4 py-5 text-sm font-bold text-blue-600 text-left whitespace-nowrap">
                        {row.docNum}
                      </td>
                      <td className="px-4 py-5 text-sm font-bold text-slate-600 text-left whitespace-nowrap">
                        {row.docEntry}
                      </td>
                      <td className="px-4 py-5 text-sm font-bold text-left whitespace-nowrap">
                        <Badge
                          className={`label-bold px-3 py-1 rounded-lg border transition-all ${
                            row.putawayType === "Inward"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm hover:bg-blue-500 hover:text-white"
                              : "bg-blue-50 text-blue-600 border-blue-100 shadow-sm hover:bg-blue-500 hover:text-white"
                          }`}
                        >
                          {row.putawayType.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-5 text-sm font-bold text-slate-500 text-left whitespace-nowrap">
                        {row.cardCode}
                      </td>
                      <td className="px-4 py-5 text-sm font-black text-slate-800 text-left whitespace-nowrap">
                        {row.cardName}
                      </td>
                      <td className="px-4 py-5 text-sm font-bold text-slate-500 text-left whitespace-nowrap">
                        {row.docDate}
                      </td>
                      <td className="px-4 py-5 text-sm font-black text-blue-600 tabular-nums uppercase text-left whitespace-nowrap">
                        {row.itemCode}
                      </td>
                      <td className="px-4 py-5 text-sm font-bold text-slate-700 text-left whitespace-nowrap">
                        {row.itemDesc}
                      </td>
                      <td className="px-4 py-5 text-sm font-black text-slate-600 text-left whitespace-nowrap">
                        {row.batchNum}
                      </td>
                      <td className="px-4 py-5 text-sm font-bold text-slate-900 font-mono text-left whitespace-nowrap">
                        {row.barcode}
                      </td>
                      <td className="px-4 py-5 text-sm font-bold text-slate-600 text-left whitespace-nowrap">
                        {row.branch}
                      </td>
                      <td className="px-4 py-5 text-sm font-bold text-slate-500 text-left whitespace-nowrap">
                        {row.whsCode}
                      </td>
                      <td className="px-4 py-5 text-sm font-bold text-slate-600 text-left whitespace-nowrap">
                        {row.userName}
                      </td>
                      <td className="px-4 py-5 text-sm font-black text-slate-900 text-left tabular-nums whitespace-nowrap">
                        {row.totalQty}
                      </td>
                      <td className="px-4 py-5 text-sm font-black text-emerald-600 text-left tabular-nums whitespace-nowrap">
                        {row.filledQty}
                      </td>
                      <td className="px-4 py-5 text-sm font-black text-rose-400 text-left tabular-nums pr-6 whitespace-nowrap">
                        {row.remainingQty}
                      </td>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDetail;
