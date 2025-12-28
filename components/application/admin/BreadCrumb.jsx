import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

const BreadCrumb = ({ data }) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {data.length > 0 &&
                    data.map((item, index) => (

                        <BreadcrumbItem key={index}>
                            <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                            {index < data.length - 1 && (
                                <BreadcrumbSeparator />
                            )}
                        </BreadcrumbItem>
                    ))
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadCrumb