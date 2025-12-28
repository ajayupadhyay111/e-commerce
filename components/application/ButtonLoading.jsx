import { cn } from "@/lib/server/utils";
import { Loader2 } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const ButtonLoading = ({
  type,
  loading,
  text,
  className,
  onClick,
  ...props
}) => {
  return (
    <Button
      type={type}
      disabled={loading}
      onClick={onClick}
      className={cn("", className)}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" />}
      {text}
    </Button>
  );
};

export default ButtonLoading;
