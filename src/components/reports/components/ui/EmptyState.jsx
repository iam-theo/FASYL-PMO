import { Inbox } from "lucide-react";

export default function EmptyState({ title, description, button, icon }) {
  const Icon = icon || Inbox;

  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-8 py-20 text-center">
      <div className="rounded-full bg-slate-100 p-5">
        <Icon size={42} className="text-slate-400" />
      </div>

      <h2 className="mt-6 text-2xl font-semibold">{title}</h2>

      <p className="mt-3 max-w-md text-slate-500">{description}</p>

      {button && <div className="mt-8">{button}</div>}
    </div>
  );
}
