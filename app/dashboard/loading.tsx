import { Skeleton } from "@/components/ui/skeleton"
import DashboardLayout from "@/components/dashboard-layout"

export default function DashboardLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[250px] w-full" />
          <Skeleton className="h-[250px] w-full" />
          <Skeleton className="h-[250px] w-full" />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    </DashboardLayout>
  )
}
