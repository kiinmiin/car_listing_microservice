import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function ListingCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-44 h-32 bg-muted animate-pulse rounded-lg" />
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
            <div className="flex gap-2">
              <div className="h-8 bg-muted animate-pulse rounded w-20" />
              <div className="h-8 bg-muted animate-pulse rounded w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 bg-muted animate-pulse rounded w-24" />
        <div className="h-4 w-4 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-8 bg-muted animate-pulse rounded w-16 mb-2" />
        <div className="h-3 bg-muted animate-pulse rounded w-20" />
      </CardContent>
    </Card>
  )
}

export function ImageGallerySkeleton() {
  return (
    <div className="space-y-4">
      <div className="aspect-video bg-muted animate-pulse rounded-lg" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-20 h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    </div>
  )
}
