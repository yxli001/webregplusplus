export default function CenterPlaceholder() {
  return (
    <div className="grid grid-cols-3 gap-4 p-8">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="h-40 rounded bg-gray-200 dark:bg-gray-700" />
      ))}
    </div>
  );
}
