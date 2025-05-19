import React, { Suspense } from "react";
import DatabaseStatusPlaceholder from "../components/DatabaseStatusPlaceholder";

// Layout & Loader
import { Layout } from "../components/Layout";
import DatabaseStatus from "../components/DatabaseStatus";

// ====================== HELPER FUNCTIONS ======================

// ====================== HOME COMPONENT ======================
export function Home() {
  // ====================== RETURN ======================
  return (
    <Layout>
      <>
        {/* 3) Main content once config is loaded */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Suspense fallback={<DatabaseStatusPlaceholder name="Source" />}>
              <DatabaseStatus name="Source" type="resilientdb" />
            </Suspense>
            <Suspense fallback={<DatabaseStatusPlaceholder name="Target" />}>
              <DatabaseStatus name="Target" type="mongodb" />
            </Suspense>
          </div>

          {/* Contribution Graph */}
        </div>
      </>
    </Layout>
  );
}
