import React from "react";
import loading from "@/public/assets/images/loading.svg";
import Image from "next/image";
const Loading = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Image src={loading} height={80} width={80} alt="loading" />
    </div>
  );
};

export default Loading;
