import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Checkbox } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { Label } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  UserPlus,
  ClipboardList,
  CheckCircle2,
  Clock,
  Users,
} from "lucide-react";
import { toast } from "sonner";

const statusMap: Record<
  number,
  { label: string; className: string; icon: any }
> = {
  1: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-100",
    icon: Clock,
  },
  2: {
    label: "Assigned",
    className: "bg-blue-50 text-blue-700 border-blue-100",
    icon: Users,
  },
  3: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    icon: CheckCircle2,
  },
};

const inwardPicklists = [
  {
    id: 1,
    picklistid: "PL-IN-001",
    docentry: "1001",
    items: 5,
    status: 1,
    createdAt: "20-03-2026",
  },
  {
    id: 2,
    picklistid: "PL-IN-002",
    docentry: "1002",
    items: 3,
    status: 2,
    createdAt: "21-03-2026",
  },
  {
    id: 3,
    picklistid: "PL-IN-003",
    docentry: "1003",
    items: 8,
    status: 3,
    createdAt: "22-03-2026",
  },
  {
    id: 4,
    picklistid: "PL-IN-004",
    docentry: "1004",
    items: 2,
    status: 1,
    createdAt: "23-03-2026",
  },
];

const outwardPicklists = [
  {
    id: 5,
    picklistid: "PL-OUT-001",
    docentry: "5001",
    items: 4,
    status: 3,
    createdAt: "20-03-2026",
  },
  {
    id: 6,
    picklistid: "PL-OUT-002",
    docentry: "Multiple",
    items: 6,
    status: 2,
    createdAt: "21-03-2026",
  },
  {
    id: 7,
    picklistid: "PL-OUT-003",
    docentry: "5003",
    items: 1,
    status: 1,
    createdAt: "22-03-2026",
  },
];

const PicklistTable = ({
  data,
  type,
  selected,
  toggleRow,
  toggleAll,
}: {
  data: any[];
  type: string;
  selected: Set<number>;
  toggleRow: (id: number) => void;
  toggleAll: () => void;
}) => (
  <Table>
    <TableHeader>
      <TableRow className="bg-slate-50/50">
        <TableHead className="w-14 text-center">
          <Checkbox
            checked={data.length > 0 && selected.size === data.length}
            onCheckedChange={toggleAll}
          />
        </TableHead>
        <TableHead className="font-bold text-slate-900">Picklist No</TableHead>
        <TableHead className="font-bold text-slate-900">Type</TableHead>
        <TableHead className="font-bold text-slate-900">Doc Entry</TableHead>
        <TableHead className="text-center font-bold text-slate-900">
          Items
        </TableHead>
        <TableHead className="font-bold text-slate-900">Status</TableHead>
        <TableHead className="font-bold text-slate-900">Created At</TableHead>
        <TableHead className="text-right pr-6 font-bold text-slate-900">
          Actions
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((row) => {
        const s = statusMap[row.status];
        const Icon = s.icon;
        return (
          <TableRow
            key={row.picklistid}
            className={
              selected.has(row.id) ? "bg-blue-50/30" : "hover:bg-slate-50/30"
            }
          >
            <TableCell className="text-center">
              <Checkbox
                checked={selected.has(row.id)}
                onCheckedChange={() => toggleRow(row.id)}
              />
            </TableCell>
            <TableCell className="font-bold text-blue-700">
              {row.picklistid}
            </TableCell>
            <TableCell className="text-slate-600 font-medium">{type}</TableCell>
            <TableCell className="text-slate-600">{row.docentry}</TableCell>
            <TableCell className="text-center">
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-700 font-bold"
              >
                {row.items}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={`flex items-center w-fit gap-1.5 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${s.className}`}
              >
                <Icon className="w-3 h-3" />
                {s.label}
              </Badge>
            </TableCell>
            <TableCell className="text-slate-500 font-medium text-xs">
              {row.createdAt}
            </TableCell>
            <TableCell className="text-right pr-4">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold"
              >
                Details
              </Button>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
);

const PickList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "inward";
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  const currentData = tab === "inward" ? inwardPicklists : outwardPicklists;

  const toggleRow = (id: number) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === currentData.length) setSelected(new Set());
    else setSelected(new Set(currentData.map((r) => r.id)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pick Lists</h1>
          <p className="text-sm text-muted-foreground">
            Manage generated inward and outward picklists
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={selected.size === 0}
                className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-blue-200/50 shadow-lg px-5"
              >
                <UserPlus className="h-4 w-4" />
                Assign Selected ({selected.size})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Picker/Worker</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    {selected.size}
                  </div>
                  <p className="text-sm font-medium text-blue-800">
                    Assigning {selected.size} picklists to worker
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Select User (Searchable)</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-50">
                      <SelectValue placeholder="Search and select worker..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="w1">Rahul Sharma (Picker)</SelectItem>
                      <SelectItem value="w2">Amit Kumar (Picker)</SelectItem>
                      <SelectItem value="w3">
                        Priya Singh (Super User)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Select Work Type</Label>
                  <Select defaultValue="manual">
                    <SelectTrigger className="bg-slate-50">
                      <SelectValue placeholder="Choose task type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Picking</SelectItem>
                      <SelectItem value="scanner">Barcode Assisted</SelectItem>
                      <SelectItem value="bulk">Bulk Move</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="ghost"
                    onClick={() => setIsAssignOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 px-8"
                    onClick={() => {
                      toast.success("Picklists assigned successfully");
                      setIsAssignOpen(false);
                      setSelected(new Set());
                    }}
                  >
                    Assign
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => {
          setSearchParams({ tab: v });
          setSelected(new Set());
        }}
        className="w-full"
      >
        <TabsList className="bg-slate-100/50 p-1 mb-2">
          <TabsTrigger
            value="inward"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-8 gap-2"
          >
            <ClipboardList className="w-4 h-4" />
            Inward Picklists
          </TabsTrigger>
          <TabsTrigger
            value="outward"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-8 gap-2"
          >
            <ClipboardList className="w-4 h-4 rotate-180" />
            Outward Picklists
          </TabsTrigger>
        </TabsList>
        <TabsContent value="inward">
          <Card className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-0 overflow-x-auto">
              <PicklistTable
                data={inwardPicklists}
                type="Inward"
                selected={selected}
                toggleRow={toggleRow}
                toggleAll={toggleAll}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="outward">
          <Card className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-0 overflow-x-auto">
              <PicklistTable
                data={outwardPicklists}
                type="Outward"
                selected={selected}
                toggleRow={toggleRow}
                toggleAll={toggleAll}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PickList;
