export default function LeftPlaceholder() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-5 rounded bg-gray-200 dark:bg-gray-700" />
      ))}
    </div>
  );
}
