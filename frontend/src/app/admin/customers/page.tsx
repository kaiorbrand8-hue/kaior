"use client";

import { useEffect, useState } from "react";
import { getUsers } from "@/lib/api";
import type { AdminUserEntry } from "@/lib/types";

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<AdminUserEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  const load = (search?: string) =>
    getUsers({ keyword: search, limit: 50 }).then((res) => {
      setUsers(res.items);
      setTotal(res.total);
    });

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    load(keyword).finally(() => setLoading(false));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-navy-900">Customers ({total})</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search name, email or phone"
            className="border border-navy-900/20 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="border border-navy-900 bg-navy-900 px-4 py-2 text-xs uppercase tracking-widest-lg text-cream hover:bg-navy-800"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-charcoal/50">Loading...</p>
      ) : users.length === 0 ? (
        <p className="mt-6 text-sm text-charcoal/50">No customers found.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-navy-900/10 text-left text-xs uppercase tracking-wide text-charcoal/50">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Signed up via</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-navy-900/5">
                  <td className="py-3 pr-4 text-navy-900">{u.name}</td>
                  <td className="py-3 pr-4 text-charcoal/70">{u.email}</td>
                  <td className="py-3 pr-4 text-charcoal/70">{u.phone || "—"}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        u.googleId ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {u.googleId ? "Google" : "Email"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-charcoal/70 capitalize">{u.role}</td>
                  <td className="py-3 text-charcoal/50">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
