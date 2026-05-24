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
    Search
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState,
    Fragment
} from "react";

interface GinListPageProps {
    type: "putaway" | "flow-through";
}

const PAGE_SIZE = 10;

const GinListPage = ({
    type
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

    const [search, setSearch] =
        useState("");

    const [statusTab, setStatusTab] =
        useState<
            "Pending"
            |
            "Partial"
            |
            "Completed"
        >("Pending");


    const ginType =
        type === "putaway"
            ? 2
            : 1;


    useEffect(() => {

        getHistoryDetails(
            statusTab,
            "PutAwayCollection"
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

                const data =
                    response?.data?.data || [];

                const formattedData =
                    data.map(
                        (row: any) => {

                            let parsed = [];

                            try {

                                parsed =
                                    row.LineData
                                        ?
                                        typeof row.LineData === "string"
                                            ?
                                            JSON.parse(
                                                row.LineData
                                            )
                                            :
                                            row.LineData
                                        :
                                        [];

                            }
                            catch {

                                parsed = [];

                            }

                            return {

                                ...row,

                                LineData:
                                    parsed

                            };

                        }
                    );

                setResponseData(
                    formattedData
                );

            }
            catch (error) {

                console.log(
                    "API Error:",
                    error
                );

            }
            finally {

                setLoading(false);

            }

        };



    /* SEARCH */

    const filteredData =
        useMemo(() => {

            return responseData.filter(
                (row: any) =>

                    Object.values(
                        row
                    )

                        .join(" ")

                        .toLowerCase()

                        .includes(
                            search.toLowerCase()
                        )

            );

        }, [
            responseData,
            search
        ]);


    /* PAGINATION */

    const paginatedData =
        useMemo(() => {

            return filteredData.slice(

                (page - 1)
                *
                PAGE_SIZE,

                page
                *
                PAGE_SIZE

            );

        }, [
            filteredData,
            page
        ]);


    const totalPages =
        Math.ceil(
            filteredData.length
            /
            PAGE_SIZE
        );



    return (

        <div className="space-y-6 pb-10">

            <Card
                className="
border-0
rounded-[32px]
overflow-hidden
shadow-[0_20px_50px_rgba(0,0,0,0.06)]
"
            >

                <CardHeader>

                    <div className="flex justify-between items-center">

                        <Tabs
                            value={statusTab}
                            onValueChange={(value: any) => {

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



                        <div className="flex gap-3">

                            <div className="relative">

                                <Search
                                    className="
absolute
left-3
top-3
h-4
w-4
text-gray-400
"
                                />

                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => {

                                        setSearch(
                                            e.target.value
                                        );

                                        setPage(1);

                                    }}
                                    className="
border
rounded-md
pl-10
pr-3
py-2
w-[250px]
outline-none
"
                                />

                            </div>


                            <Button
                                variant="outline"
                                onClick={() => {

                                    dispatch(
                                        handleFetchGins({
                                            gin_type: ginType,
                                            page,
                                            size: PAGE_SIZE,
                                            is_paginate: true
                                        })
                                    );

                                    getHistoryDetails(
                                        statusTab,
                                        "PutAwayCollection"
                                    );

                                }}
                            >

                                <RefreshCw
                                    className={`mr-2 h-4 w-4 ${loading
                                            ?
                                            "animate-spin"
                                            :
                                            ""
                                        }`}
                                />

                                Refresh

                            </Button>

                        </div>

                    </div>

                </CardHeader>



                <CardContent className="overflow-auto p-0">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-indigo-50">

                                <th className="px-4 py-4">

                                    SL NO

                                </th>

                                {
                                    filteredData.length > 0
                                    &&

                                    Object.keys(
                                        filteredData[0]
                                    )

                                        .filter(
                                            col =>

                                                col !== "LineData"
                                        )

                                        .map(
                                            (column) => (

                                                <th
                                                    key={column}
                                                    className="
px-4
py-4
text-left
"
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
                                            colSpan={50}
                                            className="
text-center
py-20
"
                                        >

                                            <Loader2
                                                className="
animate-spin
mx-auto
"
                                            />

                                        </td>

                                    </tr>

                                    :

                                    paginatedData.length > 0

                                        ?

                                        paginatedData.map(

                                            (
                                                row: any,
                                                index: number
                                            ) => (

                                                <Fragment
                                                    key={index}
                                                >

                                                    <tr

                                                        className="
border-b
hover:bg-slate-50
cursor-pointer
"

                                                        onClick={() => {

                                                            setExpandedRow(

                                                                expandedRow === index
                                                                    ?
                                                                    null
                                                                    :
                                                                    index

                                                            )

                                                        }}

                                                    >

                                                        <td className="px-4 py-4">

                                                            {
                                                                (page - 1)
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
                                                                    ([key]) =>

                                                                        key !== "LineData"
                                                                )

                                                                .map(
                                                                    (
                                                                        [key, value]: any,
                                                                        idx
                                                                    ) => (

                                                                        <td
                                                                            key={idx}
                                                                            className="
px-4
py-4
"
                                                                        >

                                                                            {
                                                                                key === "STATUS"

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
                                                        expandedRow === index
                                                        &&
                                                        row.LineData?.length > 0
                                                        &&

                                                        <tr>

                                                            <td
                                                                colSpan={
                                                                    Object.keys(row)
                                                                        .length
                                                                }
                                                                className="
bg-gray-100
"
                                                            >

                                                                <div className="p-4">

                                                                    <div className="font-bold mb-4">

                                                                        Line Details

                                                                    </div>


                                                                    <div
                                                                        className={`
border
overflow-y-auto
${row.LineData.length > 10
                                                                                ?
                                                                                "max-h-[400px]"
                                                                                :
                                                                                ""
                                                                            }
`}
                                                                    >

                                                                        <table className="w-full">

                                                                            <thead
                                                                                className="
sticky
top-0
bg-gray-200
z-10
"
                                                                            >

                                                                                <tr>

                                                                                    {
                                                                                        Object.keys(
                                                                                            row.LineData[0]
                                                                                        )

                                                                                            .map(
                                                                                                (col) => (

                                                                                                    <th
                                                                                                        key={col}
                                                                                                        className="
border
p-2
"
                                                                                                    >

                                                                                                        {col}

                                                                                                    </th>

                                                                                                ))
                                                                                    }

                                                                                </tr>

                                                                            </thead>


                                                                            <tbody>

                                                                                {
                                                                                    row.LineData.map(
                                                                                        (
                                                                                            line: any,
                                                                                            i: number
                                                                                        ) => (

                                                                                            <tr
                                                                                                key={i}
                                                                                            >

                                                                                                {
                                                                                                    Object.values(
                                                                                                        line
                                                                                                    )

                                                                                                        .map(
                                                                                                            (
                                                                                                                value: any,
                                                                                                                j: number
                                                                                                            ) => (

                                                                                                                <td
                                                                                                                    key={j}
                                                                                                                    className="
border
p-2
"
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
                                                colSpan={50}
                                                className="
text-center
py-20
"
                                            >

                                                <ClipboardCheck
                                                    className="
mx-auto
mb-2
"
                                                />

                                                No Records Found

                                            </td>

                                        </tr>

                            }

                        </tbody>

                    </table>


                    <div className="flex justify-end gap-4 p-5">

                        <Button
                            size="sm"
                            disabled={page === 1}
                            onClick={() =>
                                setPage(
                                    p => p - 1
                                )
                            }
                        >

                            <ChevronLeft />

                        </Button>

                        <span>

                            {page}/
                            {totalPages || 1}

                        </span>

                        <Button
                            size="sm"
                            disabled={
                                page === totalPages
                            }
                            onClick={() =>
                                setPage(
                                    p => p + 1
                                )
                            }
                        >

                            <ChevronRight />

                        </Button>

                    </div>

                </CardContent>

            </Card>

        </div>

    );

};

export default GinListPage;