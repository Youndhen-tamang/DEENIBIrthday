"use client";

import { useState, useEffect } from "react";

interface RsvpEntry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  guestCount: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const [secret, setSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);
  const [count, setCount] = useState(0);
  const [totalGuests, setTotalGuests] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Notification States
  const [smsText, setSmsText] = useState("👑 Royal Announcement: Hello {name}, please remember that Princess Deeni's 3rd birthday is coming up on Saturday, Aug 8 at 6:00 PM! Venue: 5 Star Banquet Hall.");
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyStatus, setNotifyStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Read secret from sessionStorage on mount
  useEffect(() => {
    const savedSecret = sessionStorage.getItem("admin_secret");
    if (savedSecret) {
      setSecret(savedSecret);
      fetchRsvps(savedSecret);
    }
  }, []);

  async function fetchRsvps(adminSecret: string) {
    setLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/rsvp", {
        headers: {
          "x-admin-secret": adminSecret,
        },
      });
      if (!res.ok) {
        throw new Error("Invalid admin secret or unauthorized access.");
      }
      const data = await res.json();
      setRsvps(data.rsvps || []);
      setCount(data.count || 0);
      setTotalGuests(data.totalGuests || 0);
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_secret", adminSecret);
    } catch (err: any) {
      setAuthError(err.message || "Failed to load RSVPs.");
      setIsAuthenticated(false);
      sessionStorage.removeItem("admin_secret");
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!secret.trim()) {
      setAuthError("Please enter your admin secret.");
      return;
    }
    fetchRsvps(secret);
  }

  async function handleSendBroadcast(e: React.FormEvent) {
    e.preventDefault();
    if (!smsText.trim()) return;
    
    const confirmSend = window.confirm(
      `Are you sure you want to send this SMS to all ${count} RSVP'd families?`
    );
    if (!confirmSend) return;

    setNotifyLoading(true);
    setNotifyStatus(null);

    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({ message: smsText }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send notifications.");
      }
      setNotifyStatus({
        success: true,
        message: data.message || "Broadcast sent successfully!",
      });
    } catch (err: any) {
      setNotifyStatus({
        success: false,
        message: err.message || "Failed to broadcast notifications.",
      });
    } finally {
      setNotifyLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_secret");
    setSecret("");
    setIsAuthenticated(false);
    setRsvps([]);
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-[#fdeef3] px-6">
        <div className="w-full max-w-md rounded-3xl border border-deeni-pink-soft bg-white p-8 shadow-xl shadow-deeni-pink-deep/10">
          <div className="mb-6 text-center">
            <span className="text-4xl">👑</span>
            <h1 className="mt-3 font-display text-2xl font-bold text-deeni-ink">
              Royal Admin Access
            </h1>
            <p className="mt-1 font-body text-sm text-deeni-ink/60">
              Enter your secret key to view the guest list.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="adminSecret"
                className="mb-1 block font-body text-xs font-bold uppercase tracking-wider text-deeni-ink/70"
              >
                Admin Secret
              </label>
              <input
                id="adminSecret"
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter secret key..."
                className="w-full rounded-2xl border-2 border-deeni-pink-soft bg-white px-4 py-3 font-body text-sm text-deeni-ink outline-none transition focus:border-deeni-pink-deep"
              />
            </div>

            {authError && (
              <p className="font-body text-sm font-semibold text-deeni-pink-deep text-center">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-deeni-pink-deep py-4 font-body text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-deeni-pink-deep/30 transition hover:bg-deeni-ink disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Access Dashboard"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-deeni-blush pb-16">
      {/* Header bar */}
      <header className="sticky top-0 z-10 w-full border-b border-deeni-pink-soft bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <span className="font-display text-lg font-bold text-deeni-ink">
              Deeni's Kingdom Admin
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-deeni-pink-deep px-4 py-1.5 font-body text-xs font-bold uppercase tracking-wider text-deeni-pink-deep transition hover:bg-deeni-pink-deep hover:text-white"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 grid gap-8 lg:grid-cols-3">
        {/* Left Column: Stats & Twilio Broadcast */}
        <div className="lg:col-span-1 space-y-6">
          {/* Stats Card */}
          <div className="rounded-3xl bg-white p-6 shadow-md border border-deeni-pink-soft/30">
            <h2 className="font-display text-lg font-bold text-deeni-ink mb-4">
              Headcount Summary
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#fdeef3] rounded-2xl p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wide text-deeni-pink-deep">
                  RSVP Count
                </p>
                <p className="text-3xl font-extrabold text-deeni-ink mt-1">
                  {count}
                </p>
              </div>
              <div className="bg-[#fdeef3] rounded-2xl p-4 text-center">
                <p className="text-xs font-bold uppercase tracking-wide text-deeni-pink-deep">
                  Total Guests
                </p>
                <p className="text-3xl font-extrabold text-deeni-ink mt-1">
                  {totalGuests}
                </p>
              </div>
            </div>
          </div>

          {/* Broadcast SMS Card */}
          <div className="rounded-3xl bg-white p-6 shadow-md border border-deeni-pink-soft/30">
            <h2 className="font-display text-lg font-bold text-deeni-ink mb-2">
              Twilio Broadcast SMS
            </h2>
            <p className="text-xs text-deeni-ink/60 mb-4">
              Send a text update to all RSVPs. Use <code className="bg-deeni-blush px-1.5 py-0.5 rounded text-deeni-pink-deep font-bold font-mono">{"{name}"}</code> to personalize.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <textarea
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  rows={6}
                  placeholder="Type your message..."
                  className="w-full rounded-2xl border-2 border-deeni-pink-soft bg-white p-4 font-body text-sm text-deeni-ink outline-none transition focus:border-deeni-pink-deep"
                />
              </div>

              {notifyStatus && (
                <div
                  className={`rounded-2xl p-4 text-sm font-semibold ${
                    notifyStatus.success
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {notifyStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={notifyLoading || count === 0}
                className="w-full rounded-full bg-deeni-pink-deep py-3 font-body text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-deeni-pink-deep/30 transition hover:bg-deeni-ink disabled:opacity-60"
              >
                {notifyLoading ? "Sending SMS..." : "Send SMS Broadcast"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Guest List Table */}
        <div className="lg:col-span-2">
          <div className="h-full rounded-3xl bg-white p-6 shadow-md border border-deeni-pink-soft/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-bold text-deeni-ink">
                Attending Guests
              </h2>
              <button
                onClick={() => fetchRsvps(secret)}
                disabled={loading}
                className="text-xs font-bold uppercase tracking-wider text-deeni-pink-deep hover:text-deeni-ink transition"
              >
                {loading ? "Refreshing..." : "🔄 Refresh"}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-deeni-pink-soft/40 text-xs font-bold uppercase tracking-wider text-deeni-ink/60">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4 text-center">Guests</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-deeni-pink-soft/20 font-body text-sm text-deeni-ink">
                  {rsvps.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-deeni-ink/50">
                        No reservations found in the database.
                      </td>
                    </tr>
                  ) : (
                    rsvps.map((rsvp) => (
                      <tr key={rsvp.id} className="hover:bg-[#fdeef3]/30 transition">
                        <td className="py-3 px-4 font-semibold">{rsvp.name}</td>
                        <td className="py-3 px-4">{rsvp.phone}</td>
                        <td className="py-3 px-4 text-deeni-ink/70">
                          {rsvp.email || "—"}
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          {rsvp.guestCount}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
