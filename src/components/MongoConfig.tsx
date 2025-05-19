"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import MongoConfigSkeleton from "./MongoConfigSkeleton";
import { toast } from "sonner";

interface MongoDbConfigProps {
  onSave: () => void;
  onCancel: () => void;
}

interface MongoDbConfig {
  host: string;
  database: string;
  collection: string;
}

export default function MongoDbConfig({
  onSave,
  onCancel,
}: MongoDbConfigProps) {
  const [config, setConfig] = useState<MongoDbConfig>({
    host: "",
    database: "",
    collection: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved config from localStorage
    try {
      const savedConfig = localStorage.getItem("mongodbConfig");
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      } else {
        // Default values if nothing is saved
        setConfig({
          host: "mongo.example.com",
          database: "documents_db",
          collection: "sync_data",
        });
      }
    } catch (error) {
      console.error("Failed to load MongoDB config:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Validate inputs
    if (!config.host || !config.database || !config.collection) {
      toast.error("All fields are required");
      return;
    }

    // Save to localStorage
    try {
      localStorage.setItem("mongodbConfig", JSON.stringify(config));
      toast.success("MongoDB connection settings have been updated");
      onSave();
    } catch (error) {
      toast.error("Failed to save configuration");
    }
  };

  if (isLoading) {
    return <MongoConfigSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="host" className="text-white">
          Host
        </Label>
        <Input
          id="host"
          name="host"
          value={config.host}
          onChange={handleChange}
          placeholder="e.g., mongodb.example.com:27017"
          className="bg-neutral-800 border-neutral-700 focus-visible:ring-neutral-500 text-white"
        />
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
