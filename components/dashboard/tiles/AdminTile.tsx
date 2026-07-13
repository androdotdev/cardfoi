"use client";

import { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";

type UserListItem = {
  id: string;
  email: string;
  name?: string;
  role?: string;
};

export default function AdminTile() {
  const session = authClient.useSession();
  const isAdmin = session.data?.user?.role === "admin";
  const [userId, setUserId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/auth/admin/list-users?search=${search}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load users.");
        setUsers([]);
      } else {
        setUsers(data.users || []);
      }
    } catch {
      setError("Failed to load users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  if (!isAdmin) return null;

  async function handleDeleteUser() {
    if (!userId.trim()) {
      setMessage("Please enter or select a user ID.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete user: ${userId}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/admin/remove-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("User deleted successfully.");
        setUserId("");
        fetchUsers();
      } else {
        setMessage(data.error ?? "Failed to delete user.");
      }
    } catch {
      setMessage("Failed to delete user. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  function selectUser(user: UserListItem) {
    setUserId(user.id);
    setMessage("");
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
        Admin Panel
      </p>

      {/* Search input */}
      <div className="mb-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by email or name..."
          className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm w-full"
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 mb-3">{error}</p>
      )}

      {/* User list */}
      <div className="max-h-48 overflow-y-auto space-y-2 mb-3">
        {loading ? (
          <p className="text-xs text-gray-400 text-center py-2">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-2">{error ? "Error loading users." : "No users found."}</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              onClick={() => selectUser(user)}
              className={`p-2 border border-gray-100 rounded cursor-pointer hover:bg-gray-50 transition-colors ${
                userId === user.id ? "bg-gray-100 border-gray-300" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-700">{user.name || "No name"}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                {user.role && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {user.role}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 font-mono mt-1">{user.id}</p>
            </div>
          ))
        )}
      </div>

      {/* Selected user ID */}
      <div className="mb-3">
        <label className="text-xs text-gray-500 mb-1 block">
          Selected User ID
        </label>
        <input
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
            setMessage("");
          }}
          placeholder="Click a user above or type ID..."
          className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm w-full font-mono"
          disabled={isDeleting}
        />
      </div>

      {message && (
        <p className={`text-xs mb-3 ${message.includes("successfully") ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}

      <button
        onClick={handleDeleteUser}
        disabled={isDeleting || !userId.trim()}
        className="border border-red-200 text-red-500 text-sm px-4 py-2 rounded w-full hover:bg-red-50 disabled:opacity-50"
        type="button"
      >
        {isDeleting ? "Deleting..." : "Delete User Account"}
      </button>

      <div className="pt-3 border-t border-gray-100 mt-3">
        <p className="text-xs text-gray-400">
          Permanently deletes user and all associated data (cards, works, sessions, accounts).
        </p>
      </div>
    </div>
  );
}
