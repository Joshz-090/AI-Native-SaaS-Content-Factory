"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Key, 
  Layers, 
  Check, 
  Trash2,
  Mail,
  Award
} from "lucide-react";

export default function TeamManagementPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("EDITOR");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    try {
      const res = await fetch("/api/team");
      if (res.ok) {
        const json = await res.json();
        setMembers(json.members || []);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), role }),
      });

      if (res.ok) {
        await fetchMembers();
        setIsModalOpen(false);
        setName("");
        setEmail("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Access Governance
            </span>
            <span className="text-xs text-slate-400">Clerk Organizations • Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-2">
            Team & Tenant Administration
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage organization members, assign authorization levels, and audit generative action quotas.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all self-start sm:self-center"
        >
          <UserPlus size={16} />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Tenant Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
            AG
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Acme Global Media
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Enterprise Shard
              </span>
            </h2>
            <p className="text-xs text-slate-400">Tenant Slug: <span className="font-mono text-slate-300">acme-global-media</span> • Region: <span className="font-mono text-slate-300">us-east-1</span></p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">ORGANIZATION ID</span>
            <span className="text-slate-200">org_enterprise_01</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">RLS ENFORCEMENT</span>
            <span className="text-emerald-400">Strict Deterministic</span>
          </div>
        </div>
      </div>

      {/* Member Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users size={16} className="text-indigo-400" />
            Active Organization Members ({members.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Member</th>
                <th className="py-3.5 px-5">Role</th>
                <th className="py-3.5 px-5">Onboarding Date</th>
                <th className="py-3.5 px-5">Total Generations</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-4 px-5">
                    <div>
                      <p className="font-bold text-slate-100">{member.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{member.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      member.role === "ADMIN" 
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : member.role === "EDITOR"
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-400 font-mono">
                    {member.joinedDate}
                  </td>
                  <td className="py-4 px-5 font-mono text-slate-200">
                    {member.activityCount} jobs
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button 
                      onClick={() => alert(`Managing permissions for ${member.name}`)}
                      className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      Configure
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <h3 className="text-base font-bold text-white">Invite Team Member</h3>

            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Blake"
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Corporate Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Assigned RBAC Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                >
                  <option value="ADMIN">ADMIN (Full access + Billing + Quota control)</option>
                  <option value="EDITOR">EDITOR (Content Generation & Scheduling)</option>
                  <option value="VIEWER">VIEWER (Read-only analytics and audit logs)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30"
                >
                  {isSubmitting ? "Sending..." : "Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
