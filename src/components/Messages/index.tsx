import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteMessage as deleteMessageQuery, getMessages } from "../../utils";

export type MessageType = {
  id: number;
  text: string;
  created_at: string;
};

type Props = {
  onOpen: () => void;
  apiKey: string;
};

export default function Messages({ onOpen, apiKey }: Props) {
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery<MessageType[]>(
    "messages",
    getMessages
  );
  const mutation = useMutation(deleteMessageQuery, {
    // optimistic update
    onMutate: async (data) => {
      await queryClient.cancelQueries("messages");
      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData("messages");

      // Optimistically update to the new value
      queryClient.setQueryData<MessageType[]>("messages", (old) => {
        if (!old) {
          return [];
        }
        return [...old.filter((message) => message.id !== data.id)];
      });

      // Return a context object with the snapshotted value
      return { previousMessages };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_, __, context) => {
      queryClient.setQueryData("messages", context?.previousMessages);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries("messages");
    },
  });

  const deleteMessage = async (id: number) => {
    try {
      await mutation.mutateAsync({ id, apiKey });
    } catch (err: any) {
      if (err.response) {
        const responseError = err.response.data;
        if (responseError.message) {
          toast.error(responseError.message);
        } else {
          onOpen();
        }
      } else {
        toast.error("Problem deleting message");
      }
    }
  };

  if (isLoading) return <p>Loading messages...</p>;
  if (error) return <p className="text-red-500">Error Fetching Messages</p>;

  return (
    <div className="w-full px-2 xl:px-[25%]">
      {data?.map(({ id, created_at, text }) => (
        <div key={id} className="border-b-2 pb-4 pt-2">
          <div className="flex w-full items-center justify-between">
            <div className="flex w-full items-center gap-2">
              <p className="font-bold">💬 ~anonymous</p>
              <p className="text-xs text-gray-500">
                {dayjs(created_at).format("- h:mm A, D MMM YYYY")}
              </p>
            </div>
            <button
              onClick={() => deleteMessage(id)}
              className="justify-end bg-red-500 font-bold text-white text-xs px-2 py-1 rounded-md transform hover:scale-105 active:scale-95 transition"
            >
              Delete
            </button>
          </div>
          <p className="px-2 text-gray-600">{text}</p>
        </div>
      ))}
    </div>
  );
}
