"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/admin/ui/Toast";

const ROLES: Record<string, { label: string; color: string; permissions: string[] }> = {
  admin: {
    label: "Admin",
    color: "#ff7a00",
    permissions: ["all"],
  },
  editor: {
    label: "Editor",
    color: "#3b82f6",
    permissions: ["posts.read", "posts.write", "posts.publish", "media.read", "media.write"],
  },
  author: {
    label: "Author",
    color: "#22c55e",
    permissions: ["posts.read", "posts.write", "media.read"],
  },
};

export default function UsersManagementPage() {
  const { addToast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "author",
  });

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openAddModal = () => {
    setForm({ name: "", email: "", username: "", password: "", role: "author" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setForm({
      name: user.name,
      email: user.email,
      username: user.username,
      password: "",
      role: user.role,
    });
    setEditingId(user.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/admin/users/${editingId}` : "/api/admin/users";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        addToast(isEditing ? "User updated! ✓" : "User added! ✓", "success");
        setIsModalOpen(false);
        loadUsers();
      } else {
        addToast("Error saving user profile", "error");
      }
    } catch (err) {
      addToast("Failed to connect to API", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
        if (res.ok) {
          addToast("User deleted successfully", "success");
          loadUsers();
        } else {
          addToast("Failed to delete user", "error");
        }
      } catch (err) {
        addToast("Error connecting to server", "error");
      }
    }
  };

  // Stats calculation
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const editorCount = users.filter((u) => u.role === "editor").length;
  const authorCount = users.filter((u) => u.role === "author").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <h1
            className="font-anton text-3xl text-white uppercase tracking-wider"
            style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}
          >
            USERS MANAGEMENT
          </h1>
          <p className="text-gray-500 text-xs mt-1">Configure administrator accounts and editing privileges.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl font-black text-black text-xs uppercase tracking-wider bg-gradient-to-r from-[#ff7a00] to-[#ffb300] cursor-pointer"
        >
          + Add User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: totalUsers },
          { label: "Admins", value: adminCount },
          { label: "Editors", value: editorCount },
          { label: "Authors", value: authorCount },
        ].map((item, i) => (
          <div
            key={i}
            className="p-5 rounded-[20px] border bg-[#0F0F0F] flex flex-col justify-between space-y-2"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <span className="text-gray-500 text-[10px] font-black uppercase tracking-wider block">
              {item.label}
            </span>
            <span
              className="font-anton text-4xl text-white block"
              style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div
        className="rounded-[20px] overflow-hidden border bg-[#050505]"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                {["Avatar", "Name", "Email", "Role", "Last Login", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3.5 text-left text-gray-500 text-xs font-bold uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="group border-b hover:bg-white/[0.02] transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.03)" }}
                >
                  {/* Avatar */}
                  <td className="px-6 py-4">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm text-black uppercase"
                      style={{ background: "linear-gradient(135deg,#ff7a00,#ffb300)" }}
                    >
                      {user.name?.[0] || "A"}
                    </div>
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4">
                    <p className="text-white font-bold text-sm">{user.name}</p>
                    <p className="text-gray-600 text-xs">@{user.username}</p>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-gray-400 text-sm">{user.email}</td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    {user.role && ROLES[user.role] ? (
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                        style={{
                          background: `${ROLES[user.role].color}15`,
                          color: ROLES[user.role].color,
                          border: `1px solid ${ROLES[user.role].color}25`,
                        }}
                      >
                        {ROLES[user.role].label}
                      </span>
                    ) : (
                      "Author"
                    )}
                  </td>

                  {/* Last Login */}
                  <td className="px-6 py-4 text-gray-500 text-xs font-semibold">{user.lastLogin}</td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`flex items-center gap-1.5 text-xs font-bold ${
                        user.active ? "text-green-400" : "text-gray-600"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${user.active ? "bg-green-400" : "bg-gray-600"}`} />
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex gap-3 text-xs font-bold">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-orange-500 hover:text-orange-400 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-8 rounded-[28px] space-y-6"
              style={{
                background: "rgba(15,15,15,0.98)",
                border: "1px solid rgba(255,122,0,0.15)",
                boxShadow: "0 0 60px rgba(255,122,0,0.1)",
              }}
            >
              <h3
                className="font-anton text-2xl text-white uppercase tracking-wider"
                style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}
              >
                {isEditing ? "EDIT USER" : "ADD USER"}
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                <input
                  placeholder="Full Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none bg-white/[0.04] border border-white/[0.08]"
                />
                <input
                  placeholder="Email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none bg-white/[0.04] border border-white/[0.08]"
                />
                <input
                  placeholder="Username"
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none bg-white/[0.04] border border-white/[0.08]"
                />
                {!isEditing && (
                  <input
                    placeholder="Password"
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none bg-white/[0.04] border border-white/[0.08]"
                  />
                )}

                {/* Role picker */}
                <div className="space-y-2">
                  <label className="text-gray-500 text-xs font-bold uppercase block">Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(ROLES).map(([key, role]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setForm({ ...form, role: key })}
                        className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all duration-200"
                        style={
                          form.role === key
                            ? {
                                background: `${role.color}20`,
                                border: `1px solid ${role.color}40`,
                                color: role.color,
                              }
                            : {
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                color: "#666",
                              }
                        }
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-xl text-gray-400 text-sm border border-white/[0.08] hover:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl font-black text-black text-sm uppercase tracking-wider bg-gradient-to-r from-[#ff7a00] to-[#ffb300] cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
