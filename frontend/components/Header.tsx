export default function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-xl font-semibold capitalize">{title}</h1>
      <p className="mt-1 text-sm text-gray-500 capitalize">{subtitle}</p>
    </div>
  );
}
