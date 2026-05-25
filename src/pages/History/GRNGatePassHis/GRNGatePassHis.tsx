import { handleFetchGins } from "@/app/manager/ginManager";
import { useAppDispatch } from "@/app/store";

import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui";

import axios from "axios";

import {
    ChevronLeft,
    ChevronRight,
    ClipboardCheck,
    Loader2,
    RefreshCw,
    Search,
} from "lucide-react";

import {
    Fragment,
    useEffect,
    useMemo,
    useState,
} from "react";

interface GinListPageProps {
    type: "putaway" | "flow-through";
}

const PAGE_SIZE = 10;

const GinListPage = ({
    type,
}: GinListPageProps) => {

    const dispatch =
        useAppDispatch();

    const [page, setPage] =
        useState(1);

    const [loading, setLoading] =
        useState(false);

    const [responseData, setResponseData] =
        useState<any[]>([]);

    const [expandedRow, setExpandedRow] =
        useState<number | null>(null);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [statusTab, setStatusTab] =
        useState<
            "Pending" |
            "Partial" |
            "Completed"
        >("Pending");

    const ginType =
        type === "putaway"
            ? 2
            : 1;


    useEffect(() => {

        getHistoryDetails(
            statusTab,
            "GRNGatePass"
        );

    }, [statusTab]);


    const getHistoryDetails =
        async (
            status: string,
            screenName: string
        ) => {

            try {

                setLoading(true);

                const payload = {
                    type: status,
                    screenName
                };

                const response =
                    await axios.post(
                        "http://115.244.101.29:9096/api/v1/users/get_history_details",
                        payload
                    );

                const formattedData =
                    (response?.data?.data || [])
                    .map((item:any)=>{

                        let parsedLineData=[];

                        try{

                            parsedLineData=
                            item.LINEDATA
                            ?
                            JSON.parse(
                                item.LINEDATA
                            )
                            :
                            [];

                        }
                        catch{

                            parsedLineData=[];

                        }

                        return{

                            ...item,

                            LINEDATA:
                            parsedLineData

                        }

                    });

                setResponseData(
                    formattedData
                );

            }

            catch(error){

                console.log(
                    error
                );

            }

            finally{

                setLoading(false);

            }

        };



    const filteredData =
        useMemo(()=>{

            return responseData.filter(
                (row:any)=>

                Object.values(row)
                .join(" ")
                .toLowerCase()
                .includes(
                    searchTerm.toLowerCase()
                )

            );

        },[
            responseData,
            searchTerm
        ]);


    const paginatedData =
        useMemo(()=>{

            return filteredData.slice(

                (page-1)
                *
                PAGE_SIZE,

                page
                *
                PAGE_SIZE

            );

        },[
            filteredData,
            page
        ]);


    const totalPages=
        Math.ceil(
            filteredData.length
            /
            PAGE_SIZE
        );


return(

<div className="space-y-6 pb-10">

<Card className="rounded-[32px]">

<CardHeader>

<div className="flex justify-between gap-5">

<div className="flex gap-5">

<Tabs
value={statusTab}
onValueChange={(value:any)=>{

setStatusTab(value);

setPage(1);

}}
>

<TabsList>

<TabsTrigger value="Pending">
Pending
</TabsTrigger>

<TabsTrigger value="Partial">
Partial
</TabsTrigger>

<TabsTrigger value="Completed">
Completed
</TabsTrigger>

</TabsList>

</Tabs>


<div className="relative">

<Search
className="absolute left-3 top-3 w-4 h-4 text-gray-400"
/>

<input
value={searchTerm}
onChange={(e)=>{

setSearchTerm(
e.target.value
);

setPage(1);

}}
placeholder="Search..."
className="border rounded-lg pl-10 pr-3 py-2"
/>

</div>

</div>


<Button
variant="outline"
onClick={()=>{

dispatch(
handleFetchGins({

gin_type:ginType,

page,

size:PAGE_SIZE,

is_paginate:true

})
);

getHistoryDetails(
statusTab,
"GRNGatePass"
);

}}
>

<RefreshCw
className={`mr-2 h-4 w-4 ${
loading
?
"animate-spin"
:
""
}`}
/>

Refresh

</Button>

</div>

</CardHeader>


<CardContent className="overflow-auto p-0">

<table className="w-full">

<thead>

<tr className="bg-indigo-50">

<th className="px-6 py-4">
SL NO
</th>

{
responseData.length>0 &&

Object.keys(
responseData[0]
)

.filter(
column=>

column.toUpperCase()
!=="LINEDATA"
)

.map(
(column)=>(

<th
key={column}
className="px-6 py-4 text-left"
>

{
column.replace(
/_/g,
" "
)
}

</th>

))
}

</tr>

</thead>


<tbody>

{

loading

?

<tr>

<td
colSpan={100}
className="text-center py-20"
>

<Loader2
className="animate-spin mx-auto"
/>

</td>

</tr>

:

paginatedData.length>0

?

paginatedData.map(
(
row:any,
index:number
)=>(

<Fragment
key={index}
>

<tr
className="border-b cursor-pointer hover:bg-slate-50"
onClick={()=>{

setExpandedRow(

expandedRow===index

?

null

:

index

)

}}
>

<td className="px-6 py-5">

{
(page-1)
*
PAGE_SIZE
+
index
+
1
}

</td>

{
Object.entries(row)

.filter(
([key])=>

key.toUpperCase()
!=="LINEDATA"
)

.map(
(
[key,value]:any,
idx
)=>(

<td
key={idx}
className="px-6 py-5"
>

{
key==="STATUS"

?

<Badge>
{value}
</Badge>

:

String(
value
??
"---"
)

}

</td>

))
}

</tr>


{
expandedRow===index
&&
row.LINEDATA?.length>0
&&

<tr>

<td
colSpan={
Object.keys(row)
.length
}
className="bg-slate-100"
>

<div className="p-5">

<div className="font-bold mb-3">

Line Details

</div>


<div className={`border rounded-lg overflow-y-auto ${
row.LINEDATA.length>10
?
"max-h-[400px]"
:
""
}`}>

<table className="w-full">

<thead className="sticky top-0 bg-slate-200 z-10">

<tr>

{
Object.keys(
row.LINEDATA[0]
)

.map(
(col:any)=>(

<th
key={col}
className="p-3 text-left"
>

{col}

</th>

))
}

</tr>

</thead>

<tbody>

{
row.LINEDATA.map(
(
line:any,
lineIndex:number
)=>(

<tr
key={lineIndex}
className="border-b"
>

{
Object.values(line)
.map(
(
value:any,
i:number
)=>(

<td
key={i}
className="p-3"
>

{
String(
value
??
"---"
)
}

</td>

))
}

</tr>

))
}

</tbody>

</table>

</div>

</div>

</td>

</tr>

}

</Fragment>

))

:

<tr>

<td
colSpan={100}
className="text-center py-20"
>

<ClipboardCheck
className="mx-auto mb-3"
/>

No Records Found

</td>

</tr>

}

</tbody>

</table>


<div className="flex justify-end gap-3 p-5">

<Button
size="sm"
disabled={page===1}
onClick={()=>setPage(
p=>p-1
)}
>

<ChevronLeft/>

</Button>

<span>

{page}/
{totalPages||1}

</span>

<Button
size="sm"
disabled={
page===totalPages
}
onClick={()=>setPage(
p=>p+1
)}
>

<ChevronRight/>

</Button>

</div>

</CardContent>

</Card>

</div>

)

};

export default GinListPage;