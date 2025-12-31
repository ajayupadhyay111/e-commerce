'use client'
import BreadCrumb from '@/components/application/admin/BreadCrumb'
import DatatableWrapper from '@/components/application/admin/DatatableWrapper'
import DeleteAction from '@/components/application/admin/DeleteAction'
import EditAction from '@/components/application/admin/EditAction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DT_CATEGORY_COLUMNS } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunction'
import { ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_EDIT, ADMIN_DASHBOARD, ADMIN_TRASH_SHOW } from '@/routes/AdminPanelRoutes'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo } from 'react'
import { FiEdit, FiPlus, FiTrash } from 'react-icons/fi'

const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_TRASH_SHOW, label: "Trash" }
]

const TrashConfig = {
    category: {
        title: "Category Trash",
        columns: DT_CATEGORY_COLUMNS,
        fetchUrl: '/api/category',
        exportUrl: '/api/category/export',
        deleteUrl: '/api/category/delete'
    }
}

const Trash = () => {
    const searchParams = useSearchParams();
    const trashOf = searchParams.get("trashOf");
    const config = TrashConfig[trashOf];

    const columns = useMemo(() => {
        return columnConfig(config?.columns, false, false, true)
    }, [])
    const action = useCallback((row, deleteType, handleDelete) => {
        let actionMenu = []
        actionMenu.push(<DeleteAction key={'delete'} handleDelete={handleDelete} row={row} deleteType={deleteType} />)
        return actionMenu;
    }, [])
    return (
        <div>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            <Card className={"py-0 rounded shadow-sm gap-0"}>
                <CardHeader className={"pt-3 px-3 border-b [.border-b]:pb-2"}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">{config.title}</h2>
                    </div>
                </CardHeader>
                <CardContent className={"pb-0"}>
                    <DatatableWrapper
                        queryKey={`${trashOf}-data-deleted`}
                        fetchUrl={config?.fetchUrl}
                        initialPageSize={10}
                        columnConfig={columns}
                        exportEndPoint={config?.exportUrl}
                        deleteEndPoint={config?.deleteUrl}
                        deleteType='PD'
                        createAction={action}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default Trash