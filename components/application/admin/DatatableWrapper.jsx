'use client'
import { ThemeProvider } from "@mui/material";
import Datatable from "./Datatable";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { darkTheme, lightTheme } from "@/lib/materialTheme";

const DatatableWrapper = ({
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

    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null;

    return <ThemeProvider theme={resolvedTheme === 'dark' ? darkTheme : lightTheme}>
        <Datatable
            queryKey={queryKey}
            fetchUrl={fetchUrl}
            columnConfig={columnConfig}
            initialPageSize={initialPageSize}
            exportEndPoint={exportEndPoint}
            deleteEndPoint={deleteEndPoint}
            deleteType={deleteType}
            trashView={trashView}
            createAction={createAction}

        />
    </ThemeProvider>;
};
export default DatatableWrapper;
