import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui";
import { Input } from "@/components/ui";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  UserPlus,
  Upload,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui";
import { useDebounce } from "@/hooks/use-debounce";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { handleFetchUsers } from "@/app/manager/masterManager";
import api from "@/lib/api";
import config from "./UserConfig.json";

const PAGE_SIZE = 10;

const getRoleBadge = (role: number) => {
  if (role === 2)
    return (
      <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 border-purple-100 transition-colors">
        Super User
      </Badge>
    );
  return (
    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-100 transition-colors">
      User
    </Badge>
  );
};

export const UserManagement = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    data: users,
    loading,
    totalCount,
  } = useAppSelector((state) => state.master.users);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(
      handleFetchUsers({
        companyid: 1,
        search: debouncedSearch,
        page: page,
        size: PAGE_SIZE,
      }),
    );
  }, [dispatch, debouncedSearch, page]);

  const handleDelete = async (id: number) => {
    try {
      const response = await api.post("/api/users/delete_user", { id });
      if (response.data.status) {
        toast.success("User deleted successfully");
        dispatch(handleFetchUsers({ companyid: 1 }));
      } else {
        toast.error(response.data.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const displayUsers = users; // Now using server-side filtered data

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-3 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-2/5 shrink-0">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 icon-sm text-slate-400" />
            <Input
              placeholder={config.strings.searchPlaceholder}
              className="pl-12 h-12 rounded-xl bg-slate-50/50 border-slate-200 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all body-main !text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-end w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <span className="caption-small whitespace-nowrap hidden sm:block">
                {config.strings.statusLabel}
              </span>
              <Select defaultValue="all" onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] h-12 rounded-xl bg-slate-50/50 border-slate-200 body-strong !text-slate-700">
                  <SelectValue placeholder={config.strings.allUsers} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">{config.strings.allUsers}</SelectItem>
                  <SelectItem value="active">
                    {config.strings.active}
                  </SelectItem>
                  <SelectItem value="inactive">
                    {config.strings.inactive}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              className="rounded-xl h-12 px-5 body-strong flex items-center gap-2 border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <Upload className="icon-sm" />{" "}
              <span className="hidden sm:inline">
                {config.strings.importBtn}
              </span>
            </Button>
            <Button
              className="rounded-xl bg-blue-600 hover:bg-blue-700 h-12 px-6 body-strong text-white flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"
              onClick={() => navigate("/masters/users/create")}
            >
              <UserPlus className="icon-sm" /> {config.strings.addUserBtn}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md shadow-slate-200 rounded-2xl overflow-hidden bg-white relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20 backdrop-blur-[1px]">
            <Loader2 className="icon-xl text-blue-600 animate-spin" />
          </div>
        )}
        <CardContent className="p-0 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
          <Table className="min-w-[1000px]">
            <TableHeader className="p-4">
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-b-2 border-slate-200">
                <TableHead className="table-header-font pl-6">
                  {config.strings.table.id}
                </TableHead>
                <TableHead className="table-header-font">
                  {config.strings.table.username}
                </TableHead>
                <TableHead className="table-header-font">
                  {config.strings.table.contact}
                </TableHead>
                <TableHead className="table-header-font">
                  {config.strings.table.role}
                </TableHead>
                <TableHead className="table-header-font">
                  {config.strings.table.device}
                </TableHead>
                <TableHead className="table-header-font">
                  {config.strings.table.outlet}
                </TableHead>
                <TableHead className="table-header-font">
                  {config.strings.table.status}
                </TableHead>
                <TableHead className="table-header-font text-right pr-6">
                  {config.strings.table.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayUsers.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-60 text-center body-main">
                    {users.length === 0
                      ? config.strings.noUsersFound
                      : config.strings.noResultsFound ||
                        "No users match your filters"}
                  </TableCell>
                </TableRow>
              ) : (
                displayUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-b border-slate-50 even:bg-slate-50/30 hover:bg-blue-50/50 transition-colors group"
                  >
                    <TableCell className="table-id-font pl-6">
                      {user.userid}
                    </TableCell>
                    <TableCell>
                      <span className="body-strong leading-none">
                        {user.username}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="body-main !text-sm truncate max-w-[150px]">
                        {user.email_id || "-"}
                      </p>
                      <p className="caption-medium text-slate-500">
                        {user.mobile_number || "-"}
                      </p>
                    </TableCell>
                    <TableCell>{getRoleBadge(Number(user.role))}</TableCell>
                    <TableCell className="body-main">
                      {user.device_id || "None"}
                    </TableCell>
                    <TableCell className="body-main">
                      {user.warehouse_id || "None"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-lg px-2 py-0.5 border-0 caption-small transition-colors ${
                          user.status === "Active"
                            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-600"
                        }`}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl bg-slate-50/80 shadow-lg shadow-slate-300 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                          onClick={() => navigate(`/masters/users/${user.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl bg-slate-50/80 text-slate-400 shadow-lg shadow-slate-300 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                          onClick={() =>
                            navigate(`/masters/users/${user.id}/edit`)
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-xl bg-slate-50/80 text-slate-400 shadow-lg shadow-slate-300 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-100/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2rem] border-0 shadow-2xl p-0 overflow-hidden bg-white">
                            <div className="bg-rose-600 py-8 w-full flex items-center justify-center gap-2 shadow-inner relative overflow-hidden">
                              <Trash2 className="icon-xl text-white animate-in zoom-in-50 duration-500 relative z-10" />
                              <AlertDialogTitle className="text-2xl font-black text-white tracking-tight relative z-10">
                                {config.strings.deleteDialog.title}
                              </AlertDialogTitle>
                            </div>
                            <div className="p-10 text-center flex flex-col items-center">
                              <AlertDialogHeader>
                                <AlertDialogDescription className="body-strong text-slate-500 pt-2 text-[15px] leading-relaxed  mx-auto">
                                  {config.strings.deleteDialog.descriptionTemplate.replace(
                                    "{username}",
                                    user.username,
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="flex gap-4 w-full mt-10">
                                <AlertDialogCancel className="rounded-xl border-slate-200 body-strong flex-1 h-12 text-slate-600 hover:bg-slate-50">
                                  {config.strings.deleteDialog.cancelBtn}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-rose-600 hover:bg-rose-700 body-strong rounded-xl px-10 flex-1 h-12 text-white shadow-lg shadow-rose-100 transition-all active:scale-95"
                                  onClick={() => handleDelete(user.id)}
                                >
                                  {config.strings.deleteDialog.confirmBtn}
                                </AlertDialogAction>
                              </div>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between px-2 pt-2">
        <p className="body-main !text-sm italic">
          {config.strings.totalUsersLabel}{" "}
          <span className="body-strong !text-slate-900 tracking-tight">
            {totalCount}
          </span>
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl px-4 body-strong border-slate-200"
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="icon-sm mr-1" />{" "}
            {config.strings.pagination.prev}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl px-4 body-strong border-slate-200"
            disabled={page * PAGE_SIZE >= totalCount || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            {config.strings.pagination.next}{" "}
            <ChevronRight className="icon-sm ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
