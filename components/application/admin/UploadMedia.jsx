"use client";
import React, { useRef, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

const UploadMedia = ({ isMultiple, queryClient }) => {
  const uploadedFilesRef = useRef([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleSaveToDB = async (files) => {
    const uploadedFiles = files.map((file) => ({
      asset_id: file.asset_id,
      public_id: file.public_id,
      secure_url: file.secure_url,
      path: file.path,
      thumbnail_url: file.thumbnail_url,
    }));
    if (uploadedFiles.length > 0) {
      try {
        const { data: mediaUploadResponse } = await axios.post(
          "/api/media/create",
          uploadedFiles
        );
        if (!mediaUploadResponse.success) {
          throw new Error(mediaUploadResponse.message);
        }
        queryClient.invalidateQueries(['media-data']);
        toast.success(mediaUploadResponse.message);
      } catch (error) {
        toast.error(error.response.data.message || error.message);
      }
    }
  };

  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary-signature"
      options={{ multiple: isMultiple, sources: ["local", "url", "unsplash"] }}
      onSuccess={(result) => {
        uploadedFilesRef.current.push(result.info);
      }}
      onQueuesEnd={async (_, { widget }) => {
        await handleSaveToDB(uploadedFilesRef.current);
        widget.close();
        setIsUploading(false);
      }}
      onError={(err) => {
        console.error(err);
        setIsUploading(false);
      }}
    >
      {({ open }) => (
        <Button
          className={"cursor-pointer"}
          disabled={isUploading}
          onClick={() => {
            uploadedFilesRef.current = []; // reset safely
            setIsUploading(true);
            open();
          }}
        >
          Upload Image
        </Button>
      )}
    </CldUploadWidget>
  );
};

export default UploadMedia;
