import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Database } from "lucide-react";

interface DatabaseStatusPlaceholderProps {
  name: string;
}

export default function DatabaseStatusPlaceholder({
  name,
}: DatabaseStatusPlaceholderProps) {
  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          {name} Database
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-4">
          <div className="h-3 w-3 rounded-full bg-neutral-700" />
          <div className="space-y-2">
            <div className="h-2 w-24 bg-neutral-700 rounded" />
            <div className="h-2 w-32 bg-neutral-700 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
