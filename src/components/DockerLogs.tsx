import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Terminal,
  Play,
  RefreshCw,
  AlertTriangle,
  History,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface DockerLogsProps {
  containerName: string;
  imageName: string;
}

// Mock data for demonstration
const mockHistoryLogs = [
  {
    id: "sync-122",
    date: "2024-03-20 09:30:00",
    status: "completed",
    summary: "Synced 1500 records successfully",
  },
  {
    id: "sync-121",
    date: "2024-03-19 15:45:00",
    status: "failed",
    summary: "Connection timeout after 500 records",
  },
  {
    id: "sync-120",
    date: "2024-03-19 10:20:00",
    status: "completed",
    summary: "Synced 2000 records successfully",
  },
];

export default function DockerLogs({
  containerName,
  imageName,
}: DockerLogsProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const runCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://api.codapi.org/v1/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sandbox: "python",
          command: "run",
          files: {
            "": `print("Starting ${containerName}...")
print("Running with image: ${imageName}")
print("Container status: Running")
print("Logs will appear here...")`,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to run code");
      }

      const data = await response.json();
      setLogs(data.stdout.split("\n").filter((line: string) => line.trim()));
      setIsRunning(true);
    } catch (error) {
      console.error("Error running code:", error);
      setLogs(["Error: Failed to run code"]);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCode = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setLogs((prev) => [...prev, "⚠️ Execution stopped by user"]);
    setIsRunning(false);
    toast.info("Code execution stopped");
  };

  const fetchLogs = async () => {
    if (!isRunning) return;

    try {
      const response = await fetch("https://api.codapi.org/v1/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sandbox: "python",
          command: "run",
          files: {
            "": `import time
print(f"[{time.strftime('%H:%M:%S')}] Container is running...")
print(f"[{time.strftime('%H:%M:%S')}] Processing data...")`,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }

      const data = await response.json();
      const newLogs = data.stdout
        .split("\n")
        .filter((line: string) => line.trim());
      setLogs((prev) => [...prev, ...newLogs].slice(-100)); // Keep last 100 lines
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    if (isRunning) {
      fetchLogs();
      intervalRef.current = setInterval(fetchLogs, 5000); // Fetch logs every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-white" />
            <span className="text-white text-lg">{containerName}</span>
          </CardTitle>
          <div className="flex gap-2">
            {!isRunning ? (
              <Button
                onClick={runCode}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4" />
                Start
              </Button>
            ) : (
              <Button
                onClick={stopCode}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Stop Execution
              </Button>
            )}
            <Button
              onClick={() => {
                if (!isRunning && !isLoading) {
                  setLogs([]);
                } else {
                  fetchLogs();
                }
              }}
              disabled={isLoading}
              variant="outline"
              className="border-neutral-700 bg-neutral-800 hover:bg-neutral-700"
            >
              <RefreshCw className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="bg-neutral-800">
            <TabsTrigger
              value="current"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white hover:text-white"
            >
              <Terminal className="h-4 w-4 text-white" />
              Current Job
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-violet-600 data-[state=active]:text-white text-white hover:text-white"
            >
              <History className="h-4 w-4 text-white" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-4">
            <div className="bg-black rounded-lg p-4 h-[300px] overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-neutral-500">No logs available</div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`${
                      log.includes("⚠️") ? "text-yellow-400" : "text-green-400"
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="space-y-4">
              {mockHistoryLogs.map((job) => (
                <Card
                  key={job.id}
                  className="border-neutral-800 bg-neutral-800"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-white">{job.id}</div>
                        <div className="text-sm text-neutral-400">
                          {job.date}
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs ${
                          job.status === "completed"
                            ? "bg-green-900 text-green-400"
                            : "bg-red-900 text-red-400"
                        }`}
                      >
                        {job.status}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-neutral-300">
                      {job.summary}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
