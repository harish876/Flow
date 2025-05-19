import { Card, CardContent } from "./ui/card";

export default function MongoConfigSkeleton() {
  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-16 bg-neutral-800 rounded animate-pulse" />
          <div className="h-10 w-full bg-neutral-800 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-neutral-800 rounded animate-pulse" />
          <div className="h-10 w-full bg-neutral-800 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-neutral-800 rounded animate-pulse" />
          <div className="h-10 w-full bg-neutral-800 rounded animate-pulse" />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <div className="h-9 w-20 bg-neutral-800 rounded animate-pulse" />
          <div className="h-9 w-32 bg-neutral-800 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
