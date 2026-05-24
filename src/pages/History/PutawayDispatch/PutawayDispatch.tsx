
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

    const dispatch = useAppDispatch();

    const [page, setPage] =
        useState(1);

    const [loading, setLoading] =
        useState(false);

    const [searchText, setSearchText] =
        useState("");

    const [responseData, setResponseData] =
        useState<any[]>([]);

    const [expandedRow, setExpandedRow] =
        useState<number | string | null>(
            null
        );

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
            "PutAwayDispatch"
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
                    screenName,
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

                            let parsedLineData = [];

                            try {

                                const lineData =
                                    row.LineData ||
                                    row.LINEDATA;

                                parsedLineData =
                                    lineData
                                        ? typeof lineData ===
                                            "string"
                                            ? JSON.parse(
                                                lineData
                                            )
                                            : lineData
                                        : [];

                            }
                            catch {

                                parsedLineData = [];

                            }

                            return {

                                ...row,

                                LineData:
                                    parsedLineData,

                            };

                        }
                    );

                setResponseData(
                    formattedData
                );

            }
            catch (
            error
            ) {

                console.log(
                    "API Error:",
                    error
                );

            }
            finally {

                setLoading(false);

            }

        };


    /* Search */

    const filteredData =
        useMemo(() => {

            return responseData.filter(
                (
                    item
                ) => {

                    if (
                        !searchText
                    )
                        return true;

                    return Object.values(
                        item
                    )

                        .join(" ")

                        .toLowerCase()

                        .includes(
                            searchText.toLowerCase()
                        );

                }
            );

        }, [
            responseData,
            searchText
        ]);


    /* Pagination */

    const paginatedData =
        useMemo(() => {

            return filteredData.slice(

                (
                    page - 1
                )
                *
                PAGE_SIZE,

                page *
                PAGE_SIZE

            );

        }, [

            filteredData,
            page

        ]);


    const totalPages =
        Math.ceil(
            filteredData.length /
            PAGE_SIZE
        );


    return (

        <div className="space-y-6 pb-10">

            <Card
                className="
border-0
rounded-[32px]
overflow-hidden
shadow-lg
"
            >

                <CardHeader>

                    <div className="flex justify-between items-center">

                        <div className="flex gap-4 items-center">

                            <Tabs
                                value={statusTab}
                                onValueChange={(
                                    value: any
                                ) => {

                                    setStatusTab(
                                        value
                                    );

                                    setPage(
                                        1
                                    );

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


                            <div
                                className="
flex
items-center
border
rounded-md
px-3
"
                            >

                                <Search
                                    className="
w-4
h-4
mr-2
"
                                />

                                <input

                                    placeholder="Search..."

                                    value={
                                        searchText
                                    }

                                    onChange={(
                                        e
                                    ) => {

                                        setSearchText(
                                            e.target.value
                                        );

                                        setPage(
                                            1
                                        );

                                    }}

                                    className="
outline-none
py-2
"

                                />

                            </div>

                        </div>



                        <Button
                            variant="outline"
                            onClick={() => {

                                dispatch(
                                    handleFetchGins({

                                        gin_type:
                                            ginType,

                                        page,

                                        size:
                                            PAGE_SIZE,

                                        is_paginate:
                                            true

                                    })
                                );

                                getHistoryDetails(

                                    statusTab,

                                    "PutAwayDispatch"

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

                </CardHeader>



                <CardContent
                    className="
overflow-auto
p-0
"
                >

                    <table
                        className="
w-full
"
                    >

                        <thead>

                            <tr
                                className="
bg-indigo-50
"
                            >

                                <th
                                    className="
px-5
py-4
"
                                >

                                    SL NO

                                </th>

                                {
                                    responseData.length > 0 &&

                                    Object.keys(
                                        responseData[0]
                                    )

                                        .filter(
                                            col =>

                                                col !== "LineData"
                                                &&
                                                col !== "LINEDATA"
                                        )

                                        .map(
                                            column => (

                                                <th

                                                    key={
                                                        column
                                                    }

                                                    className="
px-5
py-4
text-left
uppercase
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

                                loading ?

                                    <tr>

                                        <td
                                            colSpan={100}
                                            className="
py-20
text-center
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

                                    paginatedData.length > 0 ?

                                        paginatedData.map(

                                            (
                                                row: any,
                                                index: number
                                            ) => {

                                                const rowId =

                                                    row.ID
                                                    ||
                                                    row.Dispatch_ID
                                                    ||
                                                    index;


                                                return (

                                                    <Fragment
                                                        key={
                                                            rowId
                                                        }
                                                    >

                                                        <tr

                                                            className="
border-b
cursor-pointer
hover:bg-slate-50
"

                                                            onClick={() => {

                                                                setExpandedRow(

                                                                    expandedRow === rowId

                                                                        ?

                                                                        null

                                                                        :

                                                                        rowId

                                                                )

                                                            }}

                                                        >

                                                            <td
                                                                className="
px-5
py-5
"
                                                            >

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
                                                                Object.entries(
                                                                    row
                                                                )

                                                                    .filter(
                                                                        ([key]) =>

                                                                            key !== "LineData"
                                                                            &&
                                                                            key !== "LINEDATA"
                                                                    )

                                                                    .map(
                                                                        (
                                                                            [
                                                                                key,
                                                                                value
                                                                            ]: any,
                                                                            idx
                                                                        ) => (

                                                                            <td
                                                                                key={idx}
                                                                                className="
px-5
py-5
"
                                                                            >

                                                                                {

                                                                                    key === "STATUS"

                                                                                        ?

                                                                                        <Badge>

                                                                                            {
                                                                                                value
                                                                                            }

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

                                                            expandedRow === rowId

                                                            &&

                                                            row.LineData
                                                                ?.length > 0

                                                            &&

                                                            <tr>

                                                                <td

                                                                    colSpan={

                                                                        Object.keys(
                                                                            row
                                                                        )

                                                                            .filter(
                                                                                x =>

                                                                                    x !== "LineData"

                                                                                    &&

                                                                                    x !== "LINEDATA"
                                                                            )

                                                                            .length + 1

                                                                    }

                                                                    className="
bg-slate-100
"

                                                                >

                                                                    <div
                                                                        className="
p-5
"
                                                                    >

                                                                        <div
                                                                            className="
font-bold
mb-3
"
                                                                        >

                                                                            Line Details

                                                                        </div>


                                                                        <div
                                                                            className="
max-h-[400px]
overflow-y-auto
border
"
                                                                        >

                                                                            <table
                                                                                className="
w-full
bg-white
"
                                                                            >

                                                                                <thead
                                                                                    className="
sticky
top-0
bg-gray-200
"
                                                                                >

                                                                                    <tr>

                                                                                        {

                                                                                            Object.keys(
                                                                                                row.LineData[0]
                                                                                            )

                                                                                                .map(
                                                                                                    (
                                                                                                        column
                                                                                                    ) => (

                                                                                                        <th

                                                                                                            key={
                                                                                                                column
                                                                                                            }

                                                                                                            className="
px-4
py-3
"

                                                                                                        >

                                                                                                            {
                                                                                                                column
                                                                                                            }

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
                                                                                                lineIndex: number
                                                                                            ) => (

                                                                                                <tr
                                                                                                    key={
                                                                                                        lineIndex
                                                                                                    }
                                                                                                    className="
border-b
"
                                                                                                >

                                                                                                    {

                                                                                                        Object.values(
                                                                                                            line
                                                                                                        )

                                                                                                            .map(

                                                                                                                (
                                                                                                                    value: any,
                                                                                                                    i
                                                                                                                ) => (

                                                                                                                    <td

                                                                                                                        key={i}

                                                                                                                        className="
px-4
py-3
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

                                                )

                                            })

                                        :

                                        <tr>

                                            <td
                                                colSpan={100}
                                                className="
text-center
py-20
"
                                            >

                                                <ClipboardCheck
                                                    className="
mx-auto
mb-3
"
                                                />

                                                No Records Found

                                            </td>

                                        </tr>

                            }

                        </tbody>

                    </table>


                    <div
                        className="
flex
justify-end
gap-3
p-5
border-t
"
                    >

                        <Button
                            size="sm"
                            disabled={
                                page === 1
                            }
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