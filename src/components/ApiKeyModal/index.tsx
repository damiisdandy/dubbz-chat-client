import { FormEventHandler, useState } from "react";
import { toast } from "react-hot-toast";

type Props = {
  setToken: (token: string) => void;
  onClose: () => void;
  apiKey: string;
};

export default function ApiKeyModal({ setToken, onClose, apiKey }: Props) {
  const [text, setText] = useState("");

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setToken(text);
    setText("");
    onClose();
    toast.success("Api key successfully set 🔑");
  };

  const handleClose = () => {
    setText("");
    onClose();
  };

  return (
    <div className="flex items-center justify-center fixed w-full h-full bg-[rgba(0,0,0,0.5)] z-10  top-0 left-0">
      <form
        onSubmit={onSubmit}
        className="max-w-4xl w-[80%] bg-white rounded-lg overflow-hidden p-5"
      >
        <p className="">🔐 Set your API key before deleting messages</p>
        {apiKey && (
          <p className="text-red-600">
            API key: <span className="font-bold">{apiKey}</span> doesn't appear
            to be valid
          </p>
        )}
        <input
          className="w-full bg-gray-200 mt-5 px-2 py-1 rounded-md required:"
          placeholder="Enter token"
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex mt-4 gap-4 items-center justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="px-3 py-1  font-bold rounded-md transform hover:scale-105 active:scale-95 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-slate-700 px-3 py-1 text-white font-bold rounded-md transform hover:scale-105 active:scale-95 transition"
          >
            Enter
          </button>
        </div>
      </form>
    </div>
  );
}
