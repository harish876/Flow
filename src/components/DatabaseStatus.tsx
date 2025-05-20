import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Database, RefreshCw, Edit2 } from "lucide-react";
import { checkDatabaseConnection } from "../lib/database";
import MongoDbConfig from "./MongoConfig";
import DatabaseStatusSkeleton from "./DatabaseStatusSkeleton";

interface DatabaseStatusProps {
  name: string;
  type: "resilientdb" | "mongodb";
}

interface MongoConfig {
  database: string;
  collection: string;
  uri: string;
}

export default function DatabaseStatus({ name, type }: DatabaseStatusProps) {
  const [status, setStatus] = useState<
    "connected" | "disconnected" | "checking"
  >("checking");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [details, setDetails] = useState<Record<string, string>>({});
  const [showConfig, setShowConfig] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mongoConfig, setMongoConfig] = useState<MongoConfig>(() => {
    // Load initial config from localStorage
    const savedConfig = localStorage.getItem("mongoConfig");
    return savedConfig
      ? JSON.parse(savedConfig)
      : {
          database: "",
          collection: "",
          uri: "",
        };
  });
  const [configVersion, setConfigVersion] = useState(0);

  useEffect(() => {
    checkConnection();
  }, [configVersion]);

  const checkConnection = async () => {
    setIsRefreshing(true);
    setStatus("checking");

    try {
      const config = type === "mongodb" ? mongoConfig : undefined;
      const result = await checkDatabaseConnection(type, config);
      setStatus(result.connected ? "connected" : "disconnected");
      setDetails(result.details);
    } catch (error) {
      setStatus("disconnected");
      console.error("Failed to check connection:", error);
    } finally {
      setLastChecked(new Date());
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  const handleConfigSaved = async (newConfig: MongoConfig) => {
    // Save to localStorage
    localStorage.setItem("mongoConfig", JSON.stringify(newConfig));
    setMongoConfig(newConfig);
    setShowConfig(false);
    setConfigVersion((prev) => prev + 1);
  };

  if (isLoading) {
    return <DatabaseStatusSkeleton name={name} type={type} />;
  }

  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-white" />
              <span className="text-white">{name} Database</span>
            </CardTitle>
            <CardDescription className="text-neutral-400">
              {type.charAt(0).toUpperCase() + type.slice(1)} database connection
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {type === "mongodb" && (
              <Button
                variant="outline"
                size="icon"
                className="border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
                onClick={() => setShowConfig(!showConfig)}
              >
                <Edit2 className="h-4 w-4 text-white" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              className="border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
              onClick={checkConnection}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 text-white ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {type === "mongodb" && showConfig ? (
          <MongoDbConfig
            onSave={handleConfigSaved}
            onCancel={() => setShowConfig(false)}
            initialConfig={mongoConfig}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  status === "connected"
                    ? "bg-green-500"
                    : status === "disconnected"
                    ? "bg-red-500"
                    : "bg-yellow-500 animate-pulse"
                }`}
              />
              <span className="font-medium text-white">
                {status === "connected"
                  ? "Connected"
                  : status === "disconnected"
                  ? "Disconnected"
                  : "Checking..."}
              </span>
            </div>

            {status !== "checking" && (
              <div className="space-y-2 text-sm">
                {Object.entries(details).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-neutral-400">{key}:</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
                {lastChecked && (
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Last checked:</span>
                    <span className="text-white">
                      {lastChecked.toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
