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
      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200">
        Super User
      </Badge>
    );
  return (
    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
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
    dispatch(handleFetchUsers(1)); // companyid: 1 for now
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    try {
      const response = await api.post("/api/users/delete_user", { id });
      if (response.data.status) {
        toast.success("User deleted successfully");
        dispatch(handleFetchUsers(1));
      } else {
        toast.error(response.data.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      u.userid.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || u.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-3 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-2/5 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={config.strings.searchPlaceholder}
              className="pl-11 h-12 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all text-sm font-medium w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-end w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-500 whitespace-nowrap hidden sm:block">
                {config.strings.statusLabel}
              </span>
              <Select defaultValue="all" onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] h-12 rounded-xl bg-slate-50/50 border-slate-200 font-bold text-slate-700">
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
              className="rounded-xl h-12 px-5 font-bold flex items-center gap-2 border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <Upload className="h-4 w-4" />{" "}
              <span className="hidden sm:inline">
                {config.strings.importBtn}
              </span>
            </Button>
            <Button
              className="rounded-xl bg-blue-600 hover:bg-blue-700 h-12 px-6 font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"
              onClick={() => navigate("/masters/users/create")}
            >
              <UserPlus className="h-4 w-4" /> {config.strings.addUserBtn}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20 backdrop-blur-[1px]">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        )}
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                <TableHead className="font-bold text-slate-900 pl-6 h-12 uppercase text-[11px] tracking-wider">
                  {config.strings.table.id}
                </TableHead>
                <TableHead className="font-bold text-slate-900 h-12 uppercase text-[11px] tracking-wider">
                  {config.strings.table.username}
                </TableHead>
                <TableHead className="font-bold text-slate-900 h-12 uppercase text-[11px] tracking-wider">
                  {config.strings.table.contact}
                </TableHead>
                <TableHead className="font-bold text-slate-900 h-12 uppercase text-[11px] tracking-wider">
                  {config.strings.table.role}
                </TableHead>
                <TableHead className="font-bold text-slate-900 h-12 uppercase text-[11px] tracking-wider">
                  {config.strings.table.device}
                </TableHead>
                <TableHead className="font-bold text-slate-900 h-12 uppercase text-[11px] tracking-wider">
                  {config.strings.table.outlet}
                </TableHead>
                <TableHead className="font-bold text-slate-900 h-12 uppercase text-[11px] tracking-wider">
                  {config.strings.table.status}
                </TableHead>
                <TableHead className="font-bold text-slate-900 h-12 text-right pr-6 uppercase text-[11px] tracking-wider">
                  {config.strings.table.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 && !loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-60 text-center text-slate-400 font-medium"
                  >
                    {users.length === 0 
                      ? config.strings.noUsersFound 
                      : config.strings.noResultsFound || "No users match your filters"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group"
                  >
                    <TableCell className="font-bold text-slate-600 pl-6">
                      {user.userid}
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-slate-900 leading-none">
                        {user.username}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-slate-600 truncate max-w-[150px]">
                        {user.email_id || "-"}
                      </p>
                      <p className="text-[12px] text-slate-500 font-bold">
                        {user.mobile_number || "-"}
                      </p>
                    </TableCell>
                    <TableCell>{getRoleBadge(Number(user.role))}</TableCell>
                    <TableCell className="font-medium text-slate-600">
                      {user.device_id || "None"}
                    </TableCell>
                    <TableCell className="font-medium text-slate-600">
                      {user.warehouse_id || "None"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-lg px-2 py-0.5 border-0 font-bold ${user.status === "Active" ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-600"}`}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => navigate(`/masters/users/${user.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-amber-600 hover:bg-amber-50"
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
                              className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl border-0 shadow-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl font-black text-slate-900">
                                {config.strings.deleteDialog.title}
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-500 font-medium pt-2">
                                {config.strings.deleteDialog.descriptionTemplate.replace(
                                  "{username}",
                                  user.username,
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="pt-4 mt-4 border-t border-slate-100">
                              <AlertDialogCancel className="rounded-xl border-slate-200 font-bold">
                                {config.strings.deleteDialog.cancelBtn}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl px-8"
                                onClick={() => handleDelete(user.id)}
                              >
                                {config.strings.deleteDialog.confirmBtn}
                              </AlertDialogAction>
                            </AlertDialogFooter>
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
        <p className="text-sm font-medium text-slate-400 italic">
          {config.strings.totalUsersLabel}{" "}
          <span className="text-slate-900 font-black tracking-tight">
            {totalCount}
          </span>
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl px-4 font-bold border-slate-200"
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />{" "}
            {config.strings.pagination.prev}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl px-4 font-bold border-slate-200"
            disabled={page * PAGE_SIZE >= totalCount || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            {config.strings.pagination.next}{" "}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
