'use client'
import BreadCrumb from '@/components/application/admin/BreadCrumb'
import ButtonLoading from '@/components/application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { categorySchema } from '@/lib/schemas/schemas'
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from '@/routes/AdminPanelRoutes'
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation'
import slugify from 'slugify'
import axios from 'axios'
import { toast } from 'sonner'

const breadCrumbData = [
    {
        label: "Home",
        href: ADMIN_DASHBOARD,
    },
    {
        label: "Category",
        href: ADMIN_CATEGORY_SHOW,
    },
    {
        label: "Add Category",
        href: "#",
    },
]
const AddCategory = () => {

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            slug: "",
        }
    })

    const name = form.watch("name");

    useEffect(() => {
        if (name) {
            form.setValue("slug", slugify(name, { lower: true }));
        }
    }, [name, form]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const { data: response } = await axios.post(
                "/api/category/create",
                data
            );

            if (!response.success) {
                throw new Error(response.message);
            }
            toast.success(response.message);
            form.reset();
            router.push(ADMIN_CATEGORY_SHOW);
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message || error.message)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <BreadCrumb data={breadCrumbData} />
            <Card className="py-0 rounded shadow-sm mt-3">
                <CardHeader className={"py-2 px-3 border-b [.border-b]:pb-0"}>
                    <h4 className="font-semibold text-xl uppercase">Add Category</h4>
                </CardHeader>
                <CardContent className="pb-5">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel> Name </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter Category Name"
                                                type="text"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter Category Slug"
                                                type="text"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <ButtonLoading
                                text="Add Category"
                                type="submit"
                                loading={isLoading}
                                className="w-full cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-yellow-950 disabled:opacity-50 disabled:cursor-not-allowed"
                            />

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddCategory