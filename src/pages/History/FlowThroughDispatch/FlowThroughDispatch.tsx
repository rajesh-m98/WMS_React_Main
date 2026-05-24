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
  Input,
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

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [responseData, setResponseData] =
    useState<any[]>([]);

  const [expandedRow, setExpandedRow] =
    useState<number | null>(null);

  const [searchText, setSearchText] =
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
      "FlowThroughDispatch"
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
            payload,
            {
              headers: {
                "Content-Type":
                  "application/json"
              }
            }
          );

        const formattedData =
          (response?.data?.data || [])
            .map((item: any) => ({

              ...item,

              LINEDATA:
                item.LINEDATA
                  ? JSON.parse(
                    item.LINEDATA
                  )
                  : []

            }));

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


  /* Search */

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
              searchText.toLowerCase()
            )
      );

    }, [
      responseData,
      searchText
    ]);


  /* Pagination */

  const paginatedData =
    useMemo(() => {

      return filteredData.slice(
        (page - 1) *
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

      <Card className="rounded-[32px] overflow-hidden">

        <CardHeader>

          <div className="flex flex-wrap justify-between gap-4">

            {/* Tabs */}

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


            {/* Search + Refresh */}

            <div className="flex gap-3">

              <div className="relative">

                <Search
                  className="
absolute
left-3
top-3
h-4
w-4
text-gray-400"
                />

                <Input
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) =>
                    setSearchText(
                      e.target.value
                    )
                  }
                  className="pl-10"
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
                    "FlowThroughDispatch"
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

                <th className="px-5 py-4">

                  SL NO

                </th>

                {
                  responseData.length > 0 &&

                  Object.keys(
                    responseData[0]
                  )

                    .filter(
                      col =>

                        col.toUpperCase()
                        !== "LINEDATA"
                    )

                    .map(
                      column => (

                        <th
                          key={column}
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
                loading

                  ?

                  <tr>

                    <td
                      colSpan={100}
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
cursor-pointer
hover:bg-slate-50
border-b
"

                            onClick={() => {

                              setExpandedRow(

                                expandedRow === index
                                  ?
                                  null
                                  :
                                  index

                              );

                            }}

                          >

                            <td className="px-5 py-5">

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

                                    key.toUpperCase()
                                    !== "LINEDATA"
                                )

                                .map(
                                  (
                                    [key, value]: any,
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

                                          <Badge
                                            className={
                                              value === "Completed"
                                                ?
                                                "bg-green-600"

                                                :
                                                value === "Partial"
                                                  ?
                                                  "bg-blue-500"

                                                  :
                                                  "bg-yellow-500"
                                            }
                                          >

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
                            row.LINEDATA?.length > 0

                            &&

                            <tr>

                              <td
                                colSpan={
                                  Object.keys(
                                    row
                                  )
                                    .filter(
                                      x =>
                                        x.toUpperCase()
                                        !== "LINEDATA"
                                    )
                                    .length + 1
                                }
                                className="bg-slate-100"
                              >

                                <div className="p-5">

                                  <div className="font-bold mb-4">

                                    Line Details

                                  </div>


                                  {/* Scroll after 10 rows */}

                                  <div
                                    className={`
border
rounded-lg
overflow-auto
${row.LINEDATA.length > 10
                                        ?
                                        "max-h-[400px]"
                                        :
                                        ""
                                      }
`}
                                  >

                                    <table className="w-full">

                                      <thead className="sticky top-0 bg-slate-200">

                                        <tr>

                                          {
                                            Object.keys(
                                              row.LINEDATA[0]
                                            )
                                              .map(
                                                (col: any) => (

                                                  <th
                                                    key={col}
                                                    className="
px-4
py-3
text-left
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
                                          row.LINEDATA.map(
                                            (
                                              item: any,
                                              i: number
                                            ) => (

                                              <tr
                                                key={i}
                                                className="border-b"
                                              >

                                                {
                                                  Object.values(
                                                    item
                                                  )
                                                    .map(
                                                      (
                                                        value: any,
                                                        j: number
                                                      ) => (

                                                        <td
                                                          key={j}
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

                      ))

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
mb-2
"
                        />

                        No Records Found

                      </td>

                    </tr>

              }

            </tbody>

          </table>


          {/* Pagination */}

          <div className="flex justify-end gap-3 p-5">

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