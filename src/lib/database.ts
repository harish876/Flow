// This is a mock implementation - in a real app, you would connect to actual databases

import { encryptMongoUri } from "./encryption";

interface MongoDbConfig {
    database: string;
    collection: string;
    uri: string;
}

export async function checkDatabaseConnection(type: string, config?: MongoDbConfig) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let connected = false
    let details: Record<string, string> = {}

    if (type === "resilientdb") {
        const baseUrl = import.meta.env.VITE_RESDB_PROXY_URL?.replace(/\/populatetable$/, '') || "https://crow.resilientdb.com"
        const origin = `${baseUrl}/populatetable`
        try {
            const response = await fetch(origin)
            const data = await response.json()
            connected = response.ok
            if (connected) {
                details = {
                    "Origin": baseUrl,
                    "Replica Number": data[0].replicaNum.toString(),
                    "Worker Number": data[0].workerNum.toString(),
                    "Transaction Number": data[0].transactionNum.toString(),
                    "Block Number": data[0].blockNum.toString(),
                    "Chain Age": data[0].chainAge.toString()
                }
            }
        } catch (error) {
            console.error("Failed to connect to ResilientDB:", error)
            connected = false
        }
    } else if (type === "mongodb") {
        // Use provided config or defaults
        const mongoConfig = config || {
            uri: "",
            database: "",
            collection: "",
        }
        try {
            const { encryptedUri, iv } = await encryptMongoUri(mongoConfig.uri);
            const mongoUrl = import.meta.env.VITE_MONGODB_PROXY_URL
            const response = await fetch(mongoUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mongoDbName: config?.database,
                    mongoCollectionName: config?.collection,
                    mongoUri: config?.uri,
                    uri: encryptedUri,
                    iv,
                })
            })

            if (response.ok) {
                const data = await response.json()
                connected = true
                details = {
                    "Database": mongoConfig.database,
                    "Collection": mongoConfig.collection,
                    "Collection Exists": data?.collectionExists ? "Yes" : "No",
                }
            } else {
                connected = false
            }
        } catch (error) {
            console.error("Failed to connect to MongoDB:", error)
            connected = false
        }
    }

    return { connected, details }
}
