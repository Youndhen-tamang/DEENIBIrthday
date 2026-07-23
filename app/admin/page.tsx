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

interface ManualGuestRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  guestCount: number;
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
  const [smsText, setSmsText] = useState("👑 Royal Announcement: Hello [Name], please remember that Princess Deeni's 3rd birthday is coming up on Saturday, Aug 8 at 6:00 PM! Venue: 5 Star Banquet Hall.");
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyStatus, setNotifyStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Multi-Guest Add States
  const [guestRows, setGuestRows] = useState<ManualGuestRow[]>([
    { id: "row-1", name: "", phone: "", email: "", guestCount: 1 },
  ]);
  const [manualAddLoading, setManualAddLoading] = useState(false);
  const [manualAddStatus, setManualAddStatus] = useState<{ success: boolean; message: string } | null>(null);

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

  // Row helper handlers
  function handleAddRow() {
    setGuestRows([
      ...guestRows,
      { id: `row-${Date.now()}`, name: "", phone: "", email: "", guestCount: 1 },
    ]);
  }

  function handleRemoveRow(id: string) {
    if (guestRows.length === 1) return;
    setGuestRows(guestRows.filter((r) => r.id !== id));
  }

  function handleRowChange(id: string, field: keyof ManualGuestRow, value: any) {
    setGuestRows(
      guestRows.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  }

  // Send single specific guest from row
  async function handleSendSingleGuestRow(row: ManualGuestRow) {
    if (!row.name.trim() || !row.phone.trim()) {
      setManualAddStatus({ success: false, message: `Name and phone number are required for ${row.name || "this guest"}.` });
      return;
    }

    setManualAddLoading(true);
    setManualAddStatus(null);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: row.name,
          phone: row.phone,
          email: row.email,
          guestCount: row.guestCount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send to guest.");

      setManualAddStatus({
        success: true,
        message: `Successfully saved ${row.name} & sent confirmation SMS!`,
      });

      // Remove row if more than 1, or reset it if single
      if (guestRows.length > 1) {
        setGuestRows(guestRows.filter((r) => r.id !== row.id));
      } else {
        setGuestRows([{ id: "row-1", name: "", phone: "", email: "", guestCount: 1 }]);
      }

      fetchRsvps(secret);
    } catch (err: any) {
      setManualAddStatus({
        success: false,
        message: err.message || "Failed to add guest.",
      });
    } finally {
      setManualAddLoading(false);
    }
  }

  // Save all rows and send SMS to all added guests
  async function handleSaveAllGuestRows(e: React.FormEvent) {
    e.preventDefault();

    const validRows = guestRows.filter((r) => r.name.trim() && r.phone.trim());
    if (validRows.length === 0) {
      setManualAddStatus({
        success: false,
        message: "Please fill out name and phone for at least one guest.",
      });
      return;
    }

    setManualAddLoading(true);
    setManualAddStatus(null);

    let successCount = 0;
    let failCount = 0;

    for (const row of validRows) {
      try {
        const res = await fetch("/api/rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: row.name,
            phone: row.phone,
            email: row.email,
            guestCount: row.guestCount,
          }),
        });

        if (res.ok) successCount++;
        else failCount++;
      } catch {
        failCount++;
      }
    }

    setManualAddStatus({
      success: failCount === 0,
      message: `Batch complete! Successfully added & texted: ${successCount} guest(s). ${failCount > 0 ? `Failed: ${failCount}` : ""}`,
    });

    // Reset rows to 1 empty
    setGuestRows([{ id: "row-1", name: "", phone: "", email: "", guestCount: 1 }]);
    setManualAddLoading(false);
    fetchRsvps(secret);
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_secret");
    setSecret("");
    setIsAuthenticated(false);
    setRsvps([]);
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-[#FFF9F5] px-6">
        <div className="w-full max-w-md rounded-3xl border border-party-border bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <span className="text-4xl">👑</span>
            <h1 className="mt-3 font-display text-2xl font-bold text-party-text">
              Royal Admin Access
            </h1>
            <p className="mt-1 font-body text-sm text-party-muted">
              Enter your secret key to view the guest list.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="adminSecret"
                className="mb-1 block font-body text-xs font-bold uppercase tracking-wider text-party-muted"
              >
                Admin Secret
              </label>
              <input
                id="adminSecret"
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter secret key..."
                className="w-full rounded-xl border border-party-border bg-party-bg px-4 py-3 font-body text-sm text-party-text outline-none focus:border-party-accent"
              />
            </div>

            {authError && (
              <p className="font-body text-sm font-semibold text-red-600 text-center">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-party-text py-3.5 font-body text-sm font-bold uppercase tracking-widest text-white transition hover:bg-party-accent-deep disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Access Dashboard"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#FFF9F5] pb-16">
      {/* Header bar */}
      <header className="sticky top-0 z-10 w-full border-b border-party-border bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <span className="font-display text-lg font-bold text-party-text">
              Deeni&apos;s Kingdom Admin
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-party-border px-4 py-1.5 font-body text-xs font-bold uppercase tracking-wider text-party-muted transition hover:bg-party-text hover:text-white"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-party-border text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-party-muted">
              RSVP Families
            </p>
            <p className="text-3xl font-extrabold text-party-text mt-1">
              {count}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-party-border text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-party-muted">
              Total Headcount
            </p>
            <p className="text-3xl font-extrabold text-party-text mt-1">
              {totalGuests}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-party-border text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-party-muted">
              Twilio Status
            </p>
            <p className="text-sm font-bold text-green-600 mt-2">
              Connected ✅
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-party-border text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-party-muted">
              Event Date
            </p>
            <p className="text-sm font-bold text-party-text mt-2">
              Aug 8, 2026
            </p>
          </div>
        </div>

        {/* Multi-Guest Entry Card (Add 1 or Multiple & Send to Specific or All) */}
        <div className="rounded-3xl bg-white p-6 border border-party-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-party-text">
                Add Guests &amp; Direct SMS Manager
              </h2>
              <p className="text-xs text-party-muted mt-0.5">
                Add multiple guests at once, or send a confirmation SMS to a specific guest row.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddRow}
              className="inline-flex items-center gap-1.5 rounded-lg border border-party-border bg-party-bg px-3.5 py-2 font-body text-xs font-bold text-party-text hover:bg-party-border transition"
            >
              + Add More Guest Row
            </button>
          </div>

          <form onSubmit={handleSaveAllGuestRows} className="space-y-4">
            <div className="space-y-3">
              {guestRows.map((row, idx) => (
                <div
                  key={row.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-party-bg p-4 rounded-xl border border-party-border"
                >
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold uppercase text-party-muted mb-1">
                      Guest #{idx + 1} Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={row.name}
                      onChange={(e) => handleRowChange(row.id, "name", e.target.value)}
                      className="w-full rounded-lg border border-party-border bg-white px-3 py-1.5 font-body text-xs text-party-text outline-none focus:border-party-accent"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold uppercase text-party-muted mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (347) 935-2721"
                      value={row.phone}
                      onChange={(e) => handleRowChange(row.id, "phone", e.target.value)}
                      className="w-full rounded-lg border border-party-border bg-white px-3 py-1.5 font-body text-xs text-party-text outline-none focus:border-party-accent"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold uppercase text-party-muted mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      value={row.email}
                      onChange={(e) => handleRowChange(row.id, "email", e.target.value)}
                      className="w-full rounded-lg border border-party-border bg-white px-3 py-1.5 font-body text-xs text-party-text outline-none focus:border-party-accent"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold uppercase text-party-muted mb-1 text-center">
                      Count
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={row.guestCount}
                      onChange={(e) => handleRowChange(row.id, "guestCount", Number(e.target.value))}
                      className="w-full text-center rounded-lg border border-party-border bg-white px-2 py-1.5 font-body text-xs text-party-text outline-none focus:border-party-accent"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-2 pt-3 sm:pt-0">
                    <button
                      type="button"
                      disabled={manualAddLoading}
                      onClick={() => handleSendSingleGuestRow(row)}
                      className="flex-1 rounded-lg bg-party-accent-deep py-1.5 px-2 font-body text-[10px] font-bold uppercase tracking-wider text-white hover:bg-party-text transition disabled:opacity-50"
                      title="Send confirmation SMS to this specific guest"
                    >
                      Send This
                    </button>

                    {guestRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(row.id)}
                        className="rounded-lg border border-red-200 bg-red-50 text-red-600 px-2 py-1.5 font-body text-xs font-bold hover:bg-red-100 transition"
                        title="Remove row"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {manualAddStatus && (
              <div
                className={`rounded-xl p-3 text-xs font-semibold ${
                  manualAddStatus.success
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {manualAddStatus.message}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleAddRow}
                className="font-body text-xs font-bold text-party-accent-deep hover:underline"
              >
                + Add Another Guest Row
              </button>

              <button
                type="submit"
                disabled={manualAddLoading}
                className="rounded-xl bg-party-text px-6 py-2.5 font-body text-xs font-bold uppercase tracking-widest text-white hover:bg-party-accent-deep transition disabled:opacity-60"
              >
                {manualAddLoading ? "Processing..." : `Save All & Send SMS (${guestRows.length})`}
              </button>
            </div>
          </form>
        </div>

        {/* Main Grid: Broadcast SMS + Guest List */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Broadcast SMS Card */}
          <div className="lg:col-span-1 rounded-3xl bg-white p-6 border border-party-border h-fit">
            <h2 className="font-display text-lg font-bold text-party-text mb-2">
              Broadcast SMS (All Guests)
            </h2>
            <p className="text-xs text-party-muted mb-2">
              Send a text update to all RSVPs. Placeholders: <code className="bg-party-bg px-1 py-0.5 rounded text-party-accent-deep font-mono">[Name]</code>, <code className="bg-party-bg px-1 py-0.5 rounded text-party-accent-deep font-mono">[Event Name]</code>, <code className="bg-party-bg px-1 py-0.5 rounded text-party-accent-deep font-mono">[MM/DD/YYYY]</code>, <code className="bg-party-bg px-1 py-0.5 rounded text-party-accent-deep font-mono">[Address]</code>.
            </p>
            <p className="text-[11px] text-party-muted/60 mb-4 italic">
              Note: Twilio automatically suppresses delivery to any recipient who has replied STOP.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <textarea
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  rows={6}
                  placeholder="Type your message..."
                  className="w-full rounded-2xl border border-party-border bg-party-bg p-4 font-body text-sm text-party-text outline-none transition focus:border-party-accent"
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
                className="w-full rounded-full bg-party-accent-deep py-3 font-body text-sm font-bold uppercase tracking-widest text-white transition hover:bg-party-text disabled:opacity-60"
              >
                {notifyLoading ? "Sending SMS..." : "Send Broadcast to All Guests"}
              </button>
            </form>
          </div>

          {/* Right Column: Guest List Table */}
          <div className="lg:col-span-2">
            <div className="h-full rounded-3xl bg-white p-6 border border-party-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-bold text-party-text">
                  Attending Guests List ({count})
                </h2>
                <button
                  onClick={() => fetchRsvps(secret)}
                  disabled={loading}
                  className="text-xs font-bold uppercase tracking-wider text-party-accent-deep hover:text-party-text transition"
                >
                  {loading ? "Refreshing..." : "🔄 Refresh List"}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-party-border text-xs font-bold uppercase tracking-wider text-party-muted">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4 text-center">Guests</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-party-border font-body text-sm text-party-text">
                    {rsvps.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-party-muted">
                          No reservations found in the database.
                        </td>
                      </tr>
                    ) : (
                      rsvps.map((rsvp) => (
                        <tr key={rsvp.id} className="hover:bg-party-bg/50 transition">
                          <td className="py-3 px-4 font-semibold">{rsvp.name}</td>
                          <td className="py-3 px-4">{rsvp.phone}</td>
                          <td className="py-3 px-4 text-party-muted">
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
      </div>
    </main>
  );
}
