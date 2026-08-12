import { useState } from "react";
import { BarChart3, RefreshCw, Download, ExternalLink } from "lucide-react";

// ==========================================================
// CONFIG — pull from .env
// ==========================================================
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const SHEET_EMBED_URL = `${import.meta.env.VITE_GOOGLE_SHEET_EMBED_URL}?widget=true&headers=false`;
const SHEET_DOWNLOAD_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=xlsx`;
const SHEET_VIEW_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;
const BACKEND_SYNC_URL = `${import.meta.env.VITE_API_URL}/api/analytics/sync-sheet`;
const Analytics = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);
  // cache-busting key so the iframe actually reloads after a sync
  const [iframeKey, setIframeKey] = useState(Date.now());

  const handleRefresh = async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const res = await fetch(BACKEND_SYNC_URL, { method: "GET" });
      const data = await res.json();

      if (!data.success) throw new Error(data.error || "Sync failed");

      setLastSynced(new Date());
      // force the iframe to reload with fresh data
      setIframeKey(Date.now());
    } catch (err) {
      console.error("Sync failed:", err);
      setSyncError("Couldn't refresh data. Try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownload = () => {
    window.open(SHEET_DOWNLOAD_URL, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                <BarChart3
                  size={24}
                  className="text-emerald-600"
                  strokeWidth={2}
                />
              </div>
              <h1 className="text-3xl font-black text-gray-900">Analytics</h1>
            </div>
            <p className="text-gray-500">
              Track your food donation impact and platform activity.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RefreshCw
                size={16}
                strokeWidth={2.2}
                className={isSyncing ? "animate-spin" : ""}
              />
              {isSyncing ? "Syncing..." : "Refresh Data"}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
            >
              <Download size={16} strokeWidth={2.2} />
              Download
            </button>

            <a
              href={SHEET_VIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
            >
              <ExternalLink size={16} strokeWidth={2.2} />
              Open in Sheets
            </a>
          </div>
        </div>

        {/* Status row */}
        <div className="mb-4 flex items-center gap-3 text-sm">
          {syncError && (
            <span className="text-red-600 font-medium">{syncError}</span>
          )}
          {!syncError && lastSynced && (
            <span className="text-gray-400">
              Last synced: {lastSynced.toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Sheet embed */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px] relative">
          {isSyncing && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw
                  size={28}
                  className="text-emerald-600 animate-spin"
                />
                <p className="text-sm font-medium text-gray-600">
                  Syncing latest data...
                </p>
              </div>
            </div>
          )}

          {SHEET_ID ? (
            <iframe
              key={iframeKey}
              src={SHEET_EMBED_URL}
              title="Analytics Dashboard"
              width="100%"
              height="700"
              frameBorder="0"
              className="w-full"
            />
          ) : (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                <BarChart3
                  size={32}
                  className="text-emerald-600"
                  strokeWidth={1.8}
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Sheet not configured
              </h2>
              <p className="max-w-md text-gray-500">
                Add VITE_GOOGLE_SHEET_ID to your .env file to display the
                dashboard.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
