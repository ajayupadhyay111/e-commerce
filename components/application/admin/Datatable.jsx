import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
    MaterialReactTable,
    MRT_ShowHideColumnsButton,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleFullScreenButton,
    MRT_ToggleGlobalFilterButton,
    useMaterialReactTable,
} from "material-react-table";
import { IconButton, Tooltip } from "@mui/material";
import Link from "next/link";
import RecyclingIcon from "@mui/icons-material/Recycling";
import DeleteIcon from "@mui/icons-material/Delete";
import { DeleteForever, RestoreFromTrash } from "@mui/icons-material";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import ButtonLoading from "../ButtonLoading";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { toast } from "sonner";
import { download, generateCsv, mkConfig } from "export-to-csv";
const Datatable = ({
    queryKey,
    fetchUrl,
    columnConfig,
    initialPageSize = 10,
    exportEndPoint,
    deleteEndPoint,
    deleteType,
    trashView,
    createAction,
}) => {
    const [columnFilter, setColumnFilter] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [rowSelection, setRowSelection] = useState({});
    const [sorting, setSorting] = useState([]);
    const [exportLoading, setExportLoading] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: initialPageSize,
    });
    const deleteMutation = useDeleteMutation(queryKey, deleteEndPoint)

    // delete method
    const handleDelete = (ids, deleteType) => {
        let c = false;
        if (deleteType === "PD") {
            c = confirm("Are you sure you want to delete the data permanently?")
        }
        else if (deleteType === "SD") {
            c = confirm("Are you sure you want to move into trash?")
        }
        if (c) {
            deleteMutation.mutate({ ids, deleteType })
        }
        setRowSelection({});
    };

    // export method
    const handleExport = async (selectedRows) => {
        setExportLoading(true)
        try {
            const csvConfig = mkConfig({
                fieldSeparator: ",",
                decimalSeparator: ".",
                useKeysAsHeaders: true,
                filename: "csv-data",
            })

            let csv;

            if (Object.keys(rowSelection).length > 0) {
                // export only selected rows
                const rowData = selectedRows.map((row) => row.original)
                csv = generateCsv(csvConfig, rowData)
            }
            else {
                // export all rows
                const { data: response } = await axios.get(exportEndPoint)
                if (!response.success) {
                    throw new Error(response.message)
                }
                csv = generateCsv(csvConfig, response.data)
            }
            download(csvConfig)(csv)
        } catch (error) {
            console.log(error)
            toast.error(error.message || "Something went wrong")
        } finally {
            setExportLoading(false)
        }
    }

    const {
        data: { data = [], meta } = {},
        isError,
        isRefetching,
        isLoading,
    } = useQuery({
        queryKey: [queryKey, { pagination, columnFilter, globalFilter, sorting }],
        queryFn: async () => {
            const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL);
            url.searchParams.set("page", pagination.pageIndex * pagination.pageSize);
            url.searchParams.set("limit", pagination.pageSize);
            url.searchParams.set("filter", JSON.stringify(columnFilter ?? []));
            url.searchParams.set("globalFilter", globalFilter || "");
            url.searchParams.set("sorting", JSON.stringify(sorting ?? []));
            url.searchParams.set("deleteType", deleteType)
            const { data: response } = await axios.get(url.href);
            return response.data;
        },

        placeholderData: keepPreviousData,
    });

    // initialize table
    const table = useMaterialReactTable({
        columns: columnConfig,
        data,
        enableRowSelection: true,
        columnFilterDisplayMode: "popover",
        paginationDisplayMode: "pages",
        enableColumnOrdering: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        initialState: { showColumnFilters: true },
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        muiToolbarAlertBannerProps: isError
            ? {
                color: "error",
                children: "Error loading data",
            }
            : undefined,
        onColumnFiltersChange: setColumnFilter,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        rowCount: meta?.totalRowCount ?? 0,
        onRowSelectionChange: setRowSelection,
        state: {
            columnFilter,
            globalFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            sorting,
            rowSelection,
        },
        getRowId: (originalRow) => originalRow._id,
        renderToolbarInternalActions: ({ table }) => (
            <>
                <MRT_ToggleGlobalFilterButton table={table} />
                <MRT_ShowHideColumnsButton table={table} />
                <MRT_ToggleFullScreenButton table={table} />
                <MRT_ToggleDensePaddingButton table={table} />
                {deleteType !== "PD" && (
                    <Tooltip title="Recycle Bin">
                        <Link href={trashView}>
                            <IconButton>
                                <RecyclingIcon />
                            </IconButton>
                        </Link>
                    </Tooltip>
                )}
                {deleteType === "SD" && (
                    <Tooltip title="Delete All">
                        <IconButton
                            disabled={
                                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                            }
                            onClick={() =>
                                handleDelete(Object.keys(rowSelection), deleteType)
                            }
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )}
                {deleteType === "PD" && (
                    <>
                        <Tooltip title="Restore Data">
                            <IconButton
                                disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                                onClick={() =>
                                    handleDelete(Object.keys(rowSelection), 'RSD')
                                }
                            >
                                <RestoreFromTrash />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Permanently Delete Data">
                            <IconButton
                                disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                                onClick={() =>
                                    handleDelete(Object.keys(rowSelection), 'PD')
                                }
                            >
                                <DeleteForever />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </>
        ),
        enableRowActions: true,
        positionActionsColumn: 'last',
        renderRowActionMenuItems: ({ row }) => createAction(row, deleteType, handleDelete),
        renderTopToolbarCustomActions: ({ table }) => (
            <Tooltip>
                <ButtonLoading
                    type="button"
                    text={<><SaveAltIcon fontSize={"20"} />Export</>}
                    loading={exportLoading}
                    onClick={() => handleExport(table.getSelectedRowModel().rows)}
                />
            </Tooltip>
        )
    });
    return <MaterialReactTable table={table}></MaterialReactTable>;
};
export default Datatable;
