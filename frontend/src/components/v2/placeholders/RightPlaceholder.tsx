export default function RightPlaceholder() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-14 rounded bg-gray-200 dark:bg-gray-700" />
      ))}
    </div>
  );
}
