import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const useDeleteMutation = (queryKey, deleteEndPoint) => {
  const queryClient = useQueryClient(); // this is used to invalidate the query
  const mutation = useMutation({
    mutationFn: async ({ ids, deleteType }) => {
      const { data: response } = await axios({
        url: deleteEndPoint,
        method: deleteType === "PD" ? "DELETE" : "PUT",
        data: { ids, deleteType },
      });
      if (!response?.success) {
        throw new Error(response?.message);
      }
      return response;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
  return mutation;
};

export default useDeleteMutation;
