'use client'
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import ButtonLoading from "@/components/application/ButtonLoading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFetch } from "@/hooks/useFetch";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AdminPanelRoutes";
import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mediaSchema } from "@/lib/schemas/schemas";
import Image from "next/image";
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import { toast } from "sonner";
import axios from "axios";

import { useRouter } from "next/navigation";

const breadCrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home"
  },
  {
    href: ADMIN_MEDIA_SHOW,
    label: "Media"
  },
  {
    href: "#",
    label: "Edit Media"
  }
]

const EditMedia = ({ params }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = use(params);
  const router = useRouter();
  const { data: mediaData } = useFetch(`/api/media/get/${id}`);
  const formSchema = mediaSchema.pick({
    _id: true,
    alt: true,
    title: true
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: mediaData?.data?._id || "",
      alt: mediaData?.data?.alt || "",
      title: mediaData?.data?.title || ""
    },
  });

  useEffect(() => {
    if (mediaData && mediaData.success) {
      form.reset({
        _id: mediaData?.data?._id || "",
        alt: mediaData?.data?.alt || "",
        title: mediaData?.data?.title || ""
      })
    }
  }, [mediaData])

  async function onSubmit(data) {
    setIsLoading(true);
    try {
      const { data: response } = await axios.put(
        "/api/media/update",
        data
      );

      if (!response.success) {
        throw new Error(response.message);
      }
      toast.success(response.message);
      form.reset();
      router.push(ADMIN_MEDIA_SHOW);
    } catch (error) {
      console.log(error)
      toast.error(
        error instanceof Error
          ? error.response.data.message
          : "Login failed. Please try again."
      );

      form.setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Login failed",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return <div>
    <BreadCrumb data={breadCrumbData} />
    <Card className="py-0 rounded shadow-sm mt-3">
      <CardHeader className={"py-2 px-3 border-b [.border-b]:pb-0"}>
        <h4 className="font-semibold text-xl uppercase">Edit Media</h4>
      </CardHeader>
      <CardContent className="pb-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <Image src={mediaData?.data?.secure_url || imgPlaceholder} alt={mediaData?.data?.alt || "Image"} width={200} height={150} />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Title"
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
              name="alt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alt</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Alt"
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
              text="Update"
              type="submit"
              loading={isLoading}
              className="w-full cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-yellow-950 disabled:opacity-50 disabled:cursor-not-allowed"
            />

          </form>
        </Form>
      </CardContent>
    </Card>
  </div>;
};

export default EditMedia;
