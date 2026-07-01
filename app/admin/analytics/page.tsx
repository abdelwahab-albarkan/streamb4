"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#ff7a00", "#ffb300", "#ff6b0b", "#ffa726", "#ffcc80"];

export default function AnalyticsPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch("/api/admin/posts");
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadPosts();
  }, []);

  // Format data for AreaChart (views over time)
  const viewsData = posts
    .filter((p) => p.status === "published")
    .map((p) => ({
      name: p.date,
      views: p.views || 0,
    }))
    .reverse();

  // Format category breakdown
  const categoryMap: Record<string, number> = {};
  posts.forEach((p) => {
    const cat = p.category || "Uncategorized";
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const categoryData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  // Format SEO Distribution data
  const distributionData = [
    { name: "Good (80+)", count: posts.filter((p) => (p.seoScore || 0) >= 80).length },
    { name: "Medium (50-79)", count: posts.filter((p) => (p.seoScore || 0) >= 50 && (p.seoScore || 0) < 80).length },
    { name: "Critical (<50)", count: posts.filter((p) => (p.seoScore || 0) < 50).length },
  ];

  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const avgViews = posts.length > 0 ? Math.round(totalViews / posts.length) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col">
        <h1
          className="font-anton text-3xl text-white uppercase tracking-wider"
          style={{ fontFamily: "var(--font-anton), Anton, sans-serif" }}
        >
          ANALYTICS HUB
        </h1>
        <p className="text-gray-500 text-xs mt-1">Track reading statistics, reader sources, and optimizations.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Article Views", value: totalViews.toLocaleString() },
          { label: "Average Views Per Post", value: avgViews.toLocaleString() },
          { label: "Total Articles Count", value: posts.length.toString() },
        ].map((item, i) => (
          <div
            key={i}
            className="p-6 rounded-[20px] border flex flex-col justify-between space-y-2 bg-[#0F0F0F]"
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Area Chart */}
        <div
          className="p-6 rounded-[24px] border bg-[#0F0F0F] space-y-4"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <span className="text-white text-xs font-black uppercase tracking-wider block">Traffic views</span>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff7a00" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff7a00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="#444" tick={{ fill: "#666", fontSize: 10 }} />
                <YAxis stroke="#444" tick={{ fill: "#666", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: "#111",
                    border: "1px solid rgba(255,122,0,0.2)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area type="monotone" dataKey="views" stroke="#ff7a00" strokeWidth={2} fill="url(#viewsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div
          className="p-6 rounded-[24px] border bg-[#0F0F0F] space-y-4"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <span className="text-white text-xs font-black uppercase tracking-wider block">Categories Share</span>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#111",
                    border: "1px solid rgba(255,122,0,0.2)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SEO score distribution Bar Chart */}
        <div
          className="p-6 rounded-[24px] border bg-[#0F0F0F] space-y-4 lg:col-span-2"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <span className="text-white text-xs font-black uppercase tracking-wider block">SEO Score Distribution</span>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="#444" tick={{ fill: "#666", fontSize: 10 }} />
                <YAxis stroke="#444" tick={{ fill: "#666", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: "#111",
                    border: "1px solid rgba(255,122,0,0.2)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#ff7a00" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
