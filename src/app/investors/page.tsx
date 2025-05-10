"use client";

import React, { useState } from "react";

export default function InvestorsPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/investor-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status === 200) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "investor-memo.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else if (res.status === 401) {
        setError("Incorrect password. Please try again.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-wcn-primary py-12">
      <div className="relative bg-wcn-accent2 max-w-md w-full rounded-lg shadow-lg p-8 overflow-hidden">
        <h1 className="text-3xl font-bold text-wcn-primary mb-4 tracking-tight">Investor Memo Access</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-wcn-primary font-medium" htmlFor="password">Enter password to download the investor memo PDF:</label>
          <input
            id="password"
            type="password"
            className="border border-wcn-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-wcn-accent1"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-wcn-accent1 text-white font-bold py-2 px-4 rounded hover:bg-wcn-primary transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Checking..." : "Download PDF"}
          </button>
          {error && <div className="text-red-600 font-medium mt-2">{error}</div>}
        </form>
      </div>
    </main>
  );
} 