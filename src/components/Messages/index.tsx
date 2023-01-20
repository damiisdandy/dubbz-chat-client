import dayjs from "dayjs";
import { useQuery } from "react-query";
import { getMessages } from "../../utils";

export type MessageType = {
  id: number;
  text: string;
  created_at: string;
};

export default function Messages() {
  const { isLoading, error, data } = useQuery<MessageType[]>(
    "messages",
    getMessages
  );
  if (isLoading) return <p>Loading messages...</p>;
  if (error) return <p className="text-red-500">Error Fetching Messages</p>;
  return (
    <div className="w-full">
      {data?.map(({ id, created_at, text }) => (
        <div key={id} className="border-b-2 pb-4 pt-2">
          <div className="flex items-center gap-2">
            <p className="font-bold">💬 ~anonymous</p>
            <p className="text-xs text-gray-500">
              {dayjs(created_at).format("- h:mm A, D MMM YYYY")}
            </p>
            <button className="bg-red-500 font-bold text-white text-xs px-2 py-1 rounded-md transform hover:scale-105 active:scale-95 transition">
              Delete
            </button>
          </div>
          <p className="px-2 text-gray-600">{text}</p>
        </div>
      ))}
    </div>
  );
}
