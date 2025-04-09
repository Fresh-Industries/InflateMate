import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingBookings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Bookings</h1>
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
} 