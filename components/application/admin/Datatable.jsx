import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
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
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: initialPageSize,
    });
    const deleteMutation = useDeleteMutation(queryKey, deleteEndPoint)
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
            url.searchParams.set("globalFilter", globalFilter);
            url.searchParams.set("sorting", JSON.stringify(sorting ?? []));

            const { data: response } = await axios.get(url.href);
            return response;
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
        rowCount: data?.meta?.totalRowCount ?? 0,
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
        renderRowActionMenuItems: ({ row }) => createAction(row, deleteType, handleDelete)
    });
    return <div></div>;
};
export default Datatable;
