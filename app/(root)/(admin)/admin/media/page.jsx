"use client";
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import Media from "@/components/application/admin/Media";
import UploadMedia from "@/components/application/admin/UploadMedia";
import ButtonLoading from "@/components/application/ButtonLoading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AdminPanelRoutes";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

let breadCrumbData = [
  { href: ADMIN_DASHBOARD, title: "Dashboard" },
  { href: "#", title: "Media" },
];

const MediaPage = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const trashOf = searchParams?.get("trashof");
  const deleteType = trashOf ? "PD" : "SD";

  const [selectedMedia, setSelectedMedia] = useState([]);

  const [prevDeleteType, setPrevDeleteType] = useState(deleteType);

  if (deleteType !== prevDeleteType) {
    setPrevDeleteType(deleteType);
    setSelectedMedia([]);

  }

  const fetchMedia = async (page, deleteType) => {
    const { data: response } = await axios.get(
      `/api/media?page=${page}&&limit=10&&deleteType=${deleteType}`
    );
    return response;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["media-data", deleteType],
    queryFn: async ({ pageParam }) => await fetchMedia(pageParam, deleteType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length;
      return lastPage.hasMore ? nextPage : null;
    },
  });

  const deleteMutation = useDeleteMutation(["media-data", deleteType], `/api/media/delete`);

  const handleDelete = (selectedMedia, deleteType) => {
    let c = false;
    if (deleteType === "PD") {
      c = confirm("Are you sure you want to delete the data permanently?")
    }
    else if (deleteType === "RSD") {
      c = confirm("Are you sure you want to restore?")
    }
    else if (deleteType === "SD") {
      c = confirm("Are you sure you want to move into trash?")
    }
    if (c) {
      deleteMutation.mutate({ ids: selectedMedia, deleteType })
    }
    setSelectedMedia([]);
  };

  const allIds = data?.pages.flatMap((page) =>
    page.mediaData.map((media) => media._id)
  ) || [];

  const isAllSelected = allIds.length > 0 && allIds.every((id) => selectedMedia.includes(id));

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedMedia(allIds);
    } else {
      setSelectedMedia([]);
    }
  };

  return (
    <div>
      <BreadCrumb data={breadCrumbData} />
      {/* <UploadMedia isMultiple={true} /> */}
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className={"py-2 px-3 border-b [.border-b]:pb-0"}>
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl uppercase">
              {deleteType === "SD" ? "Media" : "Trash Media"}
            </h4>
            <div className="flex items-center gap-5">
              {deleteType === "SD" && <UploadMedia isMultiple={true} queryClient={queryClient} />}
              <div className="flex gap-3">
                {deleteType === "SD" ? (
                  <Button
                    type="button"
                    variant="destructive"
                    className={"cursor-pointer"}
                  >
                    <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>
                      Trash
                    </Link>
                  </Button>
                ) : (
                  <Button type="button" className={"cursor-pointer"}>
                    <Link href={`${ADMIN_MEDIA_SHOW}`}>Back To Media</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedMedia.length > 0 && (
            <div className="py-2 px-3 bg-violet-100 mb-2 rounded flex justify-between items-center">
              <Label>
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  className={"border-primary"}
                />{" "}
                Select All
              </Label>
              <div className="flex gap-2">
                {deleteType === "SD" ? (
                  <Button
                    variant={"destructive"}
                    onClick={() => handleDelete(selectedMedia, deleteType)}
                    className={"cursor-pointer"}
                  >
                    Move Into Trash
                  </Button>
                ) : (
                  <>
                    <Button
                      className={"bg-green-500 hover:bg-green-600 text-white"}
                      onClick={() => handleDelete(selectedMedia, "RSD")}
                    >
                      Restore
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={() => handleDelete(selectedMedia, deleteType)}
                    >
                      Delete Permanently
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {status === "pending" ? (
            <div>Loading...</div>
          ) : status === "error" ? (
            <div className="text-red-500 text-sm">{error.message}</div>
          ) : (
            <>
              {data?.pages?.flatMap(page => page?.mediaData)?.length === 0 && (
                <div className="text-gray-500 text-sm text-center">No Data Found</div>
              )}
              <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5">
                {data?.pages?.map((page, index) => (
                  <React.Fragment key={index}>
                    {page?.mediaData?.map((media, index) => (
                      <Media
                        key={media._id}
                        media={media}
                        handleDelete={handleDelete}
                        deleteType={deleteType}
                        selectedMedia={selectedMedia}
                        setSelectedMedia={setSelectedMedia}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}

          {hasNextPage && (
            <div className="flex justify-center items-center mb-4">
              <ButtonLoading
                type={"button"}
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                text="Load More"
                className={"cursor-pointer"}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaPage;
