import type React from "react";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface MongoDbConfigProps {
  onSave: (config: MongoDbConfig) => void;
  onCancel: () => void;
  initialConfig?: MongoDbConfig;
}

interface MongoDbConfig {
  database: string;
  collection: string;
  uri: string;
}

export default function MongoDbConfig({
  onSave,
  onCancel,
  initialConfig,
}: MongoDbConfigProps) {
  const [config, setConfig] = useState<MongoDbConfig>(
    initialConfig || {
      database: "",
      collection: "",
      uri: "",
    }
  );
  const [showUri, setShowUri] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Validate inputs
    if (!config.database || !config.collection || !config.uri) {
      toast.error("All fields are required");
      return;
    }

    onSave(config);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="uri" className="text-white">
          Connection URI
        </Label>
        <div className="relative">
          <Input
            id="uri"
            name="uri"
            type={showUri ? "text" : "password"}
            value={config.uri}
            onChange={handleChange}
            placeholder="mongodb://username:password@host:port/database"
            className="bg-neutral-800 border-neutral-700 focus-visible:ring-neutral-500 text-white pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-neutral-700"
            onClick={() => setShowUri(!showUri)}
          >
            {showUri ? (
              <EyeOff className="h-4 w-4 text-white" />
            ) : (
              <Eye className="h-4 w-4 text-white" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="database" className="text-white">
          Database Name
        </Label>
        <Input
          id="database"
          name="database"
          value={config.database}
          onChange={handleChange}
          placeholder="e.g., my_database"
          className="bg-neutral-800 border-neutral-700 focus-visible:ring-neutral-500 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="collection" className="text-white">
          Collection
        </Label>
        <Input
          id="collection"
          name="collection"
          value={config.collection}
          onChange={handleChange}
          placeholder="e.g., users"
          className="bg-neutral-800 border-neutral-700 focus-visible:ring-neutral-500 text-white"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-neutral-700 bg-neutral-800 text-white"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="bg-violet-600 hover:bg-violet-700"
        >
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
