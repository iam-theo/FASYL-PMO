export default function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>

        <p className="mt-2 text-slate-500">{description}</p>
      </div>

      {action}
    </div>
  );
}
