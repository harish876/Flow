import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Database } from "lucide-react";

interface DatabaseStatusSkeletonProps {
  name: string;
  type: "resilientdb" | "mongodb";
}

export default function DatabaseStatusSkeleton({
  name,
  type,
}: DatabaseStatusSkeletonProps) {
  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-white" />
              <span className="text-white">{name} Database</span>
            </CardTitle>
            <div className="text-neutral-400">
              {type.charAt(0).toUpperCase() + type.slice(1)} database connection
            </div>
          </div>
          <div className="flex gap-2">
            {type === "mongodb" && (
              <div className="h-8 w-8 bg-neutral-800 rounded animate-pulse" />
            )}
            <div className="h-8 w-8 bg-neutral-800 rounded animate-pulse" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-neutral-800 animate-pulse" />
            <div className="h-4 w-24 bg-neutral-800 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-neutral-800 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-neutral-800 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
