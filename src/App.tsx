import dayjs from "dayjs";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import ApiKeyModal from "./components/ApiKeyModal";
import Layout from "./components/Layout";
import Messages, { MessageType } from "./components/Messages";
import useDisclosure from "./hooks/useDisclosure";
import { createMessage, deleteAllMessages, getUserIPAddress } from "./utils";

function App() {
  const [apiKey, setApiKey] = useState("");
  const { isOpen, onClose, onOpen } = useDisclosure();

  const queryClient = useQueryClient();
  const mutation = useMutation(createMessage, {
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
        return [
          ...old,
          {
            id: Math.random() * 100,
            text: data.text,
            created_at: dayjs().toDate().toISOString(),
          },
        ];
      });

      // Return a context object with the snapshotted value
      return { previousMessages };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newMessages, context) => {
      queryClient.setQueryData("messages", context?.previousMessages);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries("messages");
    },
  });

  const deleteAllMutation = useMutation(deleteAllMessages, {
    onMutate: async (data) => {
      await queryClient.cancelQueries("messages");
      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData("messages");

      // Optimistically update to the new value
      queryClient.setQueryData<MessageType[]>("messages", () => []);

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

  const deleteAll = async () => {
    try {
      await deleteAllMutation.mutateAsync({
        apiKey,
      });
    } catch (err: any) {
      if (err.response) {
        const responseError = err.response.data;
        if (responseError.message) {
          toast.error(responseError.message);
        } else {
          onOpen();
        }
      } else {
        toast.error("Problem deleting all messages");
      }
    }
  };

  const [message, setMessage] = useState("");
  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    // prevent page refresh
    e.preventDefault();
    try {
      const ipAddress = await getUserIPAddress();
      await mutation.mutateAsync({
        text: message,
        source: ipAddress,
      });
      setMessage("");
    } catch (err: any) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Problem creating a message");
      }
    }
  };

  const onMessageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setMessage(e.target.value);
  };

  return (
    <Layout>
      {isOpen && (
        <ApiKeyModal apiKey={apiKey} setToken={setApiKey} onClose={onClose} />
      )}
      <div className="w-[100%] md:w-[50%]">
        <div className="flex gap-2 w-full flex-col items-center justify-center">
          <p className="font-bold">Type a message and hit send :)</p>
          <button
            onClick={onOpen}
            className="bg-green-600 px-3 py-1 text-white text-sm font-bold rounded-md transform hover:scale-105 active:scale-95 transition"
          >
            Set API key
          </button>
          <form
            className="flex items-center justify-center gap-4 w-full"
            onSubmit={onSubmit}
          >
            <input
              value={message}
              onChange={onMessageChange}
              className="bg-gray-200 w-[50%] px-2 py-1 rounded-md"
              placeholder="Type message ..."
              maxLength={200}
              minLength={2}
              required
            />
            <button
              type="submit"
              className="bg-slate-700 px-3 py-1 text-white font-bold rounded-md transform hover:scale-105 active:scale-95 transition"
            >
              Send
            </button>
            <button
              onClick={deleteAll}
              type="button"
              className="flex-nowrap bg-red-500 px-3 py-1 text-white font-bold rounded-md transform hover:scale-105 active:scale-95 transition"
            >
              Delete All
            </button>
          </form>
        </div>
      </div>
      <Messages apiKey={apiKey} onOpen={onOpen} />
    </Layout>
  );
}

export default App;
