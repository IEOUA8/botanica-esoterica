export function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl bg-white shadow-card">
      <div className="aspect-[4/3] bg-ritual" />
      <div className="p-5">
        <div className="flex justify-between">
          <div className="h-2 w-16 rounded-full bg-ritual" />
          <div className="h-2 w-12 rounded-full bg-ritual" />
        </div>
        <div className="mt-3.5 h-5 w-3/4 rounded-full bg-ritual" />
        <div className="mt-2.5 h-2.5 w-full rounded-full bg-ritual" />
        <div className="mt-1.5 h-2.5 w-2/3 rounded-full bg-ritual" />
        <div className="mt-5 flex items-center justify-between">
          <div className="h-5 w-20 rounded-full bg-ritual" />
          <div className="size-10 rounded-full bg-ritual" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6, cols = 3 }) {
  const colClass = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[cols] ?? 'sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={`grid gap-6 ${colClass}`}>
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
