import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="px-6 py-3 bg-slate-800">
        <h1 className="text-lg text-white font-bold">Chat App 💬</h1>
      </div>
      <div className="flex flex-col gap-6 items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}
