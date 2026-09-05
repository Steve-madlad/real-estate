export default function Header({ title, subTitle }: { title: string; subTitle: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-xl font-semibold capitalize">{title}</h1>
      <p className="mt-1 text-sm text-gray-500 capitalize">{subTitle}</p>
    </div>
  );
}
