// import { useState } from "react";
// import { Download, Users, DollarSign, Activity, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell,
//   LineChart, Line, PieChart, Pie, AreaChart, Area
// } from "recharts";

// // Mock data
// const monthlyRevenue = [
//   { month: "Jan", revenue: 20000, target: 25000 },
//   { month: "Feb", revenue: 25000, target: 25000 },
//   { month: "Mar", revenue: 30000, target: 25000 },
//   { month: "Apr", revenue: 28000, target: 30000 },
//   { month: "May", revenue: 35000, target: 30000 },
//   { month: "Jun", revenue: 40000, target: 35000 },
// ];

// const funnelData = [
//   { stage: "Inquiries", count: 1200 },
//   { stage: "Tours Booked", count: 800 },
//   { stage: "Assessments", count: 600 },
//   { stage: "Offers Made", count: 400 },
//   { stage: "Enrolled", count: 215 },
// ];

// const capacityData = [
//   { location: "Jeddah", capacity: 300, enrolled: 120 },
//   { location: "Riyadh", capacity: 400, enrolled: 95 },
// ];

// const SAR = (n: number) => `SAR ${n.toLocaleString()}`;

// const asNumber = (value: unknown) => {
//   if (typeof value === "number") return value;
//   const parsed = Number(value ?? 0);
//   return Number.isFinite(parsed) ? parsed : 0;
// };

// const formatSAR = (value: unknown) => SAR(asNumber(value));

// function MetricCard({ title, value, change, trend, icon: Icon, isActive, onClick }: { title: string, value: string, change: string, trend: "up" | "down" | "neutral", icon: any, isActive?: boolean, onClick?: () => void }) {
//   return (
//     <div
//       onClick={onClick}
//       className={`rounded-xl border bg-surface p-5 shadow-sm flex flex-col justify-between cursor-pointer transition-all hover:border-primary/50 ${isActive ? 'ring-2 ring-primary border-transparent' : ''}`}
//     >
//       <div className="flex items-center justify-between">
//         <p className="text-sm font-medium text-text-muted">{title}</p>
//         <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isActive ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
//           <Icon className="h-4 w-4" />
//         </div>
//       </div>
//       <div className="mt-4">
//         <h3 className="text-2xl font-bold text-text">{value}</h3>
//         <div className="mt-1 flex items-center text-xs">
//           {trend === "up" && <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />}
//           {trend === "down" && <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />}
//           {trend === "neutral" && <span className="mr-1 text-text-muted">-</span>}
//           <span className={trend === "up" ? "text-emerald-500 font-medium" : trend === "down" ? "text-red-500 font-medium" : "text-text-muted"}>
//             {change}
//           </span>
//           <span className="ml-1 text-text-muted">vs last month</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export function Reports() {
//   const [activeMetric, setActiveMetric] = useState("revenue");

//   const funnelWithDrop = funnelData.map((f, i) => {
//     const prev = i > 0 ? funnelData[i - 1].count : f.count;
//     const drop = prev === 0 ? 0 : Math.round(((prev - f.count) / prev) * 100);
//     return { ...f, drop: i === 0 ? 0 : drop };
//   });

//   // Revenue vs Target variance
//   const varianceData = monthlyRevenue.map(d => ({
//     month: d.month,
//     variance: d.revenue - d.target,
//   }));

//   // Cumulative revenue
//   let runningTotal = 0;
//   const cumulativeData = monthlyRevenue.map(d => {
//     runningTotal += d.revenue;
//     return { month: d.month, cumulative: runningTotal };
//   });

//   // Capacity utilization %
//   const utilizationData = capacityData.map(c => ({
//     location: c.location,
//     utilization: Math.round((c.enrolled / c.capacity) * 100),
//   }));

//   // Overall funnel conversion (first stage vs last stage)
//   const funnelStart = funnelData[0]?.count ?? 0;
//   const funnelEnd = funnelData[funnelData.length - 1]?.count ?? 0;
//   const conversionData = [
//     { name: "Converted", value: funnelEnd },
//     { name: "Lost", value: Math.max(funnelStart - funnelEnd, 0) },
//   ];

//   // Boys vs Girls registration (confirmed counts from register sheet)
//   const registrationData = [
//     { group: "U6", count: 32, type: "Boys" },
//     { group: "U12", count: 32, type: "Boys" },
//     { group: "Girls", count: 27, type: "Girls" },
//   ];

//   // Enquiries - sample/placeholder data
//   const enquiriesData = [
//     { week: "Week 1", enquiries: 18 },
//     { week: "Week 2", enquiries: 24 },
//     { week: "Week 3", enquiries: 15 },
//     { week: "Week 4", enquiries: 30 },
//     { week: "Week 5", enquiries: 22 },
//   ];
//   return (
//     <>
//       <div className="mb-6 flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-text">Reports</h1>
//           <p className="text-sm text-text-muted mt-1">Analytics and performance insights</p>
//         </div>
//       </div>
      
//       <div className="space-y-6">

//         {/* Metric Cards (5 columns on large screens) */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
//           <MetricCard title="Total Revenue" value="SAR 240.9K" change="18%" trend="up" icon={DollarSign} isActive={activeMetric === "revenue"} onClick={() => setActiveMetric("revenue")} />
//           <MetricCard title="Avg. Revenue per User" value="SAR 1,130" change="8.4%" trend="up" icon={Activity} isActive={activeMetric === "avg_revenue"} onClick={() => setActiveMetric("avg_revenue")} />

//           <MetricCard title="Total Enrolled Participants" value="215" change="31 new" trend="up" icon={Users} isActive={activeMetric === "participants"} onClick={() => setActiveMetric("participants")} />
//           <MetricCard title="Total Waitlist" value="12.4k" change="0.4x" trend="up" icon={TrendingUp} isActive={activeMetric === "growth"} onClick={() => setActiveMetric("growth")} />
//           <MetricCard title="Monthly Growth" value="1.7%" change="215 / 12.4K" trend="neutral" icon={BarChart3} isActive={activeMetric === "conversion"} onClick={() => setActiveMetric("conversion")} />
//         </div>

//         {activeMetric === "revenue" && (
//           <Panel title="Total Revenue (2025)" subtitle="">
//             <div className="h-72 w-full">
//               <ResponsiveContainer>
//                 <BarChart data={monthlyRevenue}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
//                   <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
//                   <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
//                   <Legend />
//                   <Bar dataKey="target" fill="#9ca3af" name="Target" radius={[4, 4, 0, 0]} opacity={0.4} />
//                   <Bar dataKey="revenue" fill="#1B4332" name="Revenue" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>
//         )}

//         {activeMetric === "participants" && (
//           <Panel title="Total Enrolled Participants" subtitle="">
//             <div className="h-72 w-full">
//               <ResponsiveContainer>
//                 <LineChart data={monthlyRevenue.map(d => ({ month: d.month, participants: Math.floor(d.revenue / 1200) }))}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
//                   <YAxis stroke="#6b7280" fontSize={12} />
//                   <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
//                   <Legend />
//                   <Line type="monotone" dataKey="participants" stroke="#1B4332" strokeWidth={3} name="Participants" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>
//         )}

//         {activeMetric === "avg_revenue" && (
//           <Panel title="Average Revenue per User" subtitle="">
//             <div className="h-72 w-full">
//               <ResponsiveContainer>
//                 <LineChart data={monthlyRevenue.map(d => ({ month: d.month, avg: Math.floor(d.revenue / (d.revenue / 1200)) }))}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
//                   <YAxis stroke="#6b7280" fontSize={12} />
//                   <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
//                   <Legend />
//                   <Line type="monotone" dataKey="avg" stroke="#1B4332" strokeWidth={3} name="Avg Revenue" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>
//         )}

//         {activeMetric === "growth" && (
//           <Panel title="Total Waitlist" subtitle="">
//             <div className="h-72 w-full">
//               <ResponsiveContainer>
//                 <BarChart data={monthlyRevenue.map((d, i) => ({ month: d.month, roas: 1.5 + (i * 0.15) }))}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
//                   <YAxis stroke="#6b7280" fontSize={12} />
//                   <Tooltip formatter={(v) => `${asNumber(v).toFixed(1)}x`} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
//                   <Legend />
//                   <Bar dataKey="roas" fill="#1B4332" name="Waitlist" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>
//         )}

//         {activeMetric === "conversion" && (
//           <Panel title="Monthly Growth" subtitle="">
//             <div className="h-72 w-full">
//               <ResponsiveContainer>
//                 <LineChart data={monthlyRevenue.map((d, i) => ({ month: d.month, rate: 1.2 + (i * 0.05) }))}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
//                   <YAxis stroke="#6b7280" fontSize={12} />
//                   <Tooltip formatter={(v) => `${asNumber(v).toFixed(1)}%`} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
//                   <Legend />
//                   <Line type="monotone" dataKey="rate" stroke="#1B4332" strokeWidth={3} name="Monthly Growth (%)" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>
//         )}

//         <Panel title="Enrolment Funnel" subtitle="From inquiry to completion">
//           <div className="h-72 w-full">
//             <ResponsiveContainer>
//               <BarChart data={funnelWithDrop} layout="vertical" margin={{ left: 20 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis type="number" stroke="#6b7280" fontSize={12} />
//                 <YAxis type="category" dataKey="stage" stroke="#6b7280" fontSize={12} width={100} />
//                 <Tooltip
//                   contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }}
//                   formatter={(v, _n, p) => [`${asNumber(v)} • drop-off ${(p as any).payload.drop}%`, "Count"]}
//                 />
//                 <Bar dataKey="count" fill="#1B4332" radius={[0, 4, 4, 0]}>
//                   {funnelWithDrop.map((_, i) => (
//                     <Cell key={i} fill={`#1B4332${Math.max(10, 100 - i * 15)}`} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//           <ul className="mt-3 grid grid-cols-2 gap-2 text-xs text-text-muted md:grid-cols-5">
//             {funnelWithDrop.map((f) => (
//               <li key={f.stage} className="rounded-md border border-border p-2">
//                 <p className="font-semibold text-text">{f.stage}</p>
//                 <p>{f.count} • drop {f.drop}%</p>
//               </li>
//             ))}
//           </ul>
//         </Panel>

//         <Panel title="Capacity Utilisation" subtitle="Enrolled vs total capacity per location">
//           <div className="h-64 w-full">
//             <ResponsiveContainer>
//               <BarChart data={capacityData} layout="vertical" margin={{ left: 30 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis type="number" stroke="#6b7280" fontSize={12} />
//                 <YAxis type="category" dataKey="location" stroke="#6b7280" fontSize={12} width={130} />
//                 <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
//                 <Legend />
//                 <Bar dataKey="capacity" fill="#9ca3af" name="Capacity" opacity={0.3} radius={[0, 4, 4, 0]} />
//                 <Bar dataKey="enrolled" fill="#1B4332" name="Enrolled" radius={[0, 4, 4, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </Panel>
//            <Panel title="Payment Methods" subtitle="Revenue collected by payment type">
//                   <div className="h-64 w-full">
//                     <ResponsiveContainer>
//                       <BarChart 
//                         data={[
//                           { method: "Bank Transfer", amount: 154000 },
//                           { method: "Card", amount: 62000 },
//                           { method: "Cash", amount: 24900 },
//                         ]} 
//                         layout="vertical" 
//                         margin={{ left: 40 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                         <XAxis type="number" stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
//                         <YAxis type="category" dataKey="method" stroke="#6b7280" fontSize={12} width={100} />
//                         <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
//                         <Legend />
//                         <Bar dataKey="amount" fill="#1B4332" name="Collected (SAR)" radius={[0, 4, 4, 0]} />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </Panel>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Panel title="Revenue vs Target Variance" subtitle="Kitna target se upar ya neechy">
//             <div className="h-64 w-full">
//               <ResponsiveContainer>
//                 <BarChart data={varianceData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
//                   <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
//                   <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
//                   <Bar dataKey="variance" name="Variance" radius={[4, 4, 0, 0]}>
//                     {varianceData.map((d, i) => (
//                       <Cell key={i} fill={d.variance >= 0 ? "#1B4332" : "#ef4444"} />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>

//           <Panel title="Cumulative Revenue Growth" subtitle="Running total over the year">
//             <div className="h-64 w-full">
//               <ResponsiveContainer>
//                 <AreaChart data={cumulativeData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
//                   <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
//                   <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
//                   <Area type="monotone" dataKey="cumulative" stroke="#1B4332" fill="#1B4332" fillOpacity={0.25} name="Cumulative Revenue" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>
//         </div>

//      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//          <Panel title="Boys vs Girls Registration" subtitle="U8 & U14/16 not yet counted">
//   <div className="h-64 w-full">
//     <ResponsiveContainer>
//       <BarChart data={registrationData} barCategoryGap="40%">
//         <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//         <XAxis dataKey="group" stroke="#6b7280" fontSize={12} />
//         <YAxis stroke="#6b7280" fontSize={12} />
//         <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
//         <Bar dataKey="count" name="Registered" radius={[4, 4, 0, 0]} barSize={100}>
//           {registrationData.map((d, i) => (
//             <Cell key={i} fill={d.type === "Girls" ? "#1B4332" : "#1B4332"} />
//           ))}
//         </Bar>
//       </BarChart>
//     </ResponsiveContainer>
//   </div>
// </Panel>

//           <Panel title="Enquiries" subtitle="Sample data — replace with Customer Enquiries sheet">
//             <div className="h-64 w-full">
//               <ResponsiveContainer>
//                 <BarChart data={enquiriesData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="week" stroke="#6b7280" fontSize={12} />
//                   <YAxis stroke="#6b7280" fontSize={12} />
//                   <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
//                   <Bar dataKey="enquiries" fill="#1B4332" name="Enquiries" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>
//         </div> 
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Panel title="Capacity Utilization %" subtitle="Enrolled as % of total capacity">
//             <div className="h-64 w-full">
//               <ResponsiveContainer>
//                 <BarChart data={utilizationData} layout="vertical" margin={{ left: 30 }}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis type="number" stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
//                   <YAxis type="category" dataKey="location" stroke="#6b7280" fontSize={12} width={130} />
//                   <Tooltip formatter={(v) => `${asNumber(v)}%`} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
//                   <Bar dataKey="utilization" fill="#1B4332" name="Utilization %" radius={[0, 4, 4, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>

//           <Panel title="Overall Funnel Conversion" subtitle="Inquiry to completion">
//             <div className="h-64 w-full">
//               <ResponsiveContainer>
//                 <PieChart>
//                   <Pie
//                     data={conversionData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={50}
//                     outerRadius={80}
//                     label
//                   >
//                     <Cell fill="#1B4332" />
//                     <Cell fill="#ef4444" />
//                   </Pie>
//                   <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Panel title="Fee and Payment Breakdown" subtitle="Distribution of collected amounts">
//             <div className="h-64 w-full">
//               <ResponsiveContainer>
//                 <PieChart>
//                   <Pie
//                     data={[
//                       { name: "AS Paid", value: 45000 },
//                       { name: "JS Paid", value: 72000 },
//                       { name: "VAT", value: 17550 },
//                       { name: "SignUp", value: 12000 },
//                     ]}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={50}
//                     outerRadius={80}
//                     label
//                   >
//                     {[0, 1, 2, 3].map((_, i) => (
//                       <Cell key={i} fill={["#0d5026", "#408a5b", "#443c26", "#352c4b"][i % 4]} />
//                     ))}
//                   </Pie>
//                   <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>

//           <Panel title="Revenue by Location" subtitle="Jeddah vs Riyadh">
//             <div className="h-64 w-full">
//               <ResponsiveContainer>
//                 <PieChart>
//                   <Pie
//                     data={[
//                       { name: "Jeddah", value: 135400 },
//                       { name: "Riyadh", value: 105500 },
//                     ]}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={50}
//                     outerRadius={80}
//                     label
//                   >
//                     {[0, 1].map((_, i) => (
//                       <Cell key={i} fill={["#204920", "#2d5f68"][i % 2]} />
//                     ))}
//                   </Pie>
//                   <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </Panel>
//         </div>
//       </div>
//     </>
//   );
// }

// function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
//   return (
//     <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
//       <div className="mb-4 flex items-start justify-between">
//         <div>
//           <h3 className="text-base font-semibold text-text">{title}</h3>
//           {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
//         </div>
//         <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-border bg-background hover:bg-surface-muted h-8 px-3 py-2 transition-colors">
//           <Download className="mr-2 h-4 w-4" /> Export
//         </button>
//       </div>
//       {children}
//     </div>
//   );
// }

import { useMemo, useState } from "react";
import { Download, DollarSign, Receipt, TrendingUp, Percent, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell,
  LineChart, Line, PieChart, Pie, AreaChart, Area
} from "recharts";
import { useDataStore } from "../../store/dataStore";

const SAR = (n: number) => `SAR ${n.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;

const asNumber = (value: unknown) => {
  if (typeof value === "number") return value;
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatSAR = (value: unknown) => SAR(asNumber(value));

const PIE_COLORS = ["#0d5026", "#408a5b", "#6b8f4e", "#a0a83f", "#c7b52e"];

function MetricCard({ title, value, change, trend, icon: Icon, isActive, onClick }: { title: string, value: string, change?: string, trend?: "up" | "down" | "neutral", icon: any, isActive?: boolean, onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border bg-surface p-5 shadow-sm flex flex-col justify-between cursor-pointer transition-all hover:border-primary/50 ${isActive ? 'ring-2 ring-primary border-transparent' : ''}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-muted">{title}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isActive ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-text">{value}</h3>
        {change && (
          <div className="mt-1 flex items-center text-xs">
            {trend === "up" && <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />}
            {trend === "down" && <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />}
            {trend === "neutral" && <span className="mr-1 text-text-muted">-</span>}
            <span className={trend === "up" ? "text-emerald-500 font-medium" : trend === "down" ? "text-red-500 font-medium" : "text-text-muted"}>
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-text">{title}</h3>
          {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
        </div>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-border bg-background hover:bg-surface-muted h-8 px-3 py-2 transition-colors">
          <Download className="mr-2 h-4 w-4" /> Export
        </button>
      </div>
      {children}
    </div>
  );
}

export function Reports() {
  const [activeMetric, setActiveMetric] = useState("revenue");

  const registrations = useDataStore((s) => s.registrations);
  const invoices = useDataStore((s) => s.invoices);
  const payments = useDataStore((s) => s.payments);
  const terms = useDataStore((s) => s.terms);
  const locations = useDataStore((s) => s.locations);
  const programs = useDataStore((s) => s.programs);
  const cohorts = useDataStore((s) => s.cohorts);
  const students = useDataStore((s) => s.students);
  const families = useDataStore((s) => s.families);
  const rateCards = useDataStore((s) => s.rateCards);
  const discountRules = useDataStore((s) => s.discountRules);

  const data = useMemo(() => {
    const termById = new Map(terms.map((t) => [t.id, t]));
    const locationById = new Map(locations.map((l) => [l.id, l]));
    const invoiceByRegId = new Map(invoices.map((i) => [i.registrationId, i]));
    const programById = new Map(programs.map((p) => [p.id, p]));
    const cohortById = new Map(cohorts.map((c) => [c.id, c]));
    const studentById = new Map(students.map((s) => [s.id, s]));

    const totalRevenue = invoices.reduce((sum, i) => sum + i.total, 0);
    const totalVat = invoices.reduce((sum, i) => sum + i.vatAmount, 0);
    const totalRegFees = invoices.reduce((sum, i) => sum + i.registrationFee, 0);
    const avgInvoiceValue = invoices.length > 0 ? totalRevenue / invoices.length : 0;

    // Per-term aggregates - the real cyclical unit for this business (3 terms, not 12 months)
    const termNumbers = [1, 2, 3];
    const revenueByTermNo = new Map<number, number>();
    const vatByTermNo = new Map<number, number>();
    const regFeeByTermNo = new Map<number, number>();
    const regCountByTermNo = new Map<number, number>();
    const studentsByTermNo = new Map<number, Set<string>>(termNumbers.map((n) => [n, new Set()]));
    for (const reg of registrations) {
      const term = reg.termId ? termById.get(reg.termId) : undefined;
      if (!term) continue;
      const inv = invoiceByRegId.get(reg.id);
      revenueByTermNo.set(term.termNo, (revenueByTermNo.get(term.termNo) ?? 0) + (inv?.total ?? 0));
      vatByTermNo.set(term.termNo, (vatByTermNo.get(term.termNo) ?? 0) + (inv?.vatAmount ?? 0));
      regFeeByTermNo.set(term.termNo, (regFeeByTermNo.get(term.termNo) ?? 0) + (inv?.registrationFee ?? 0));
      regCountByTermNo.set(term.termNo, (regCountByTermNo.get(term.termNo) ?? 0) + 1);
      studentsByTermNo.get(term.termNo)?.add(reg.studentId);
    }
    const revenueByTerm = termNumbers.map((n) => ({ term: `Term ${n}`, revenue: revenueByTermNo.get(n) ?? 0 }));
    const registrationsByTerm = termNumbers.map((n) => ({ term: `Term ${n}`, registrations: regCountByTermNo.get(n) ?? 0 }));
    const vatByTerm = termNumbers.map((n) => ({ term: `Term ${n}`, vat: vatByTermNo.get(n) ?? 0 }));
    const regFeeByTerm = termNumbers.map((n) => ({ term: `Term ${n}`, fees: regFeeByTermNo.get(n) ?? 0 }));
    const avgInvoiceByTerm = termNumbers.map((n) => {
      const rev = revenueByTermNo.get(n) ?? 0;
      const count = regCountByTermNo.get(n) ?? 0;
      return { term: `Term ${n}`, avg: count > 0 ? rev / count : 0 };
    });

    let running = 0;
    const cumulativeRevenueByTerm = termNumbers.map((n) => {
      running += revenueByTermNo.get(n) ?? 0;
      return { term: `Term ${n}`, cumulative: running };
    });

    const term1Revenue = revenueByTermNo.get(1) ?? 0;
    const term3Revenue = revenueByTermNo.get(3) ?? 0;
    const termOverTermChangePct = term1Revenue > 0 ? ((term3Revenue - term1Revenue) / term1Revenue) * 100 : 0;

    // New vs returning students, by term - a student counts as "returning" once they've appeared in
    // an earlier term this season
    const seenStudents = new Set<string>();
    const newVsReturningByTerm = termNumbers.map((n) => {
      const thisTermStudents = studentsByTermNo.get(n) ?? new Set<string>();
      let newCount = 0, returningCount = 0;
      for (const sid of thisTermStudents) {
        if (seenStudents.has(sid)) returningCount++; else newCount++;
      }
      for (const sid of thisTermStudents) seenStudents.add(sid);
      return { term: `Term ${n}`, New: newCount, Returning: returningCount };
    });

    // Invoices by payment status - real, same logic as the Participants table (paid/partial/unpaid)
    const paymentsByInvoice = new Map<string, number>();
    for (const p of payments) {
      paymentsByInvoice.set(p.invoiceId, (paymentsByInvoice.get(p.invoiceId) ?? 0) + p.amount);
    }
    let paidCount = 0, partialCount = 0, unpaidCount = 0;
    for (const inv of invoices) {
      const paid = paymentsByInvoice.get(inv.id) ?? 0;
      const balance = inv.total - paid;
      if (balance <= 0.01) paidCount++;
      else if (paid > 0) partialCount++;
      else unpaidCount++;
    }
    const invoiceStatusData = [
      { name: "Paid", value: paidCount },
      { name: "Partial", value: partialCount },
      { name: "Unpaid", value: unpaidCount },
    ].filter((d) => d.value > 0);

    // Payment verification - real, operationally meaningful for reconciliation
    const unverifiedCount = payments.filter((p) => !p.bankRef).length;
    const unverifiedPct = payments.length > 0 ? (unverifiedCount / payments.length) * 100 : 0;
    const paymentVerificationData = [
      { name: "Verified", value: payments.length - unverifiedCount },
      { name: "No Bank Reference", value: unverifiedCount },
    ];

    // Payment methods - real
    const prettyMethod = (m: string) => m.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const methodTotals = new Map<string, number>();
    for (const p of payments) methodTotals.set(p.method, (methodTotals.get(p.method) ?? 0) + p.amount);
    const paymentMethodData = Array.from(methodTotals.entries()).map(([method, amount]) => ({ method: prettyMethod(method), amount }));

    // Revenue by location - real
    const revenueByLocation = new Map<string, number>();
    for (const reg of registrations) {
      const term = reg.termId ? termById.get(reg.termId) : undefined;
      const loc = term ? locationById.get(term.locationId) : undefined;
      const inv = invoiceByRegId.get(reg.id);
      if (loc && inv) revenueByLocation.set(loc.name, (revenueByLocation.get(loc.name) ?? 0) + inv.total);
    }
    const revenueByLocationData = Array.from(revenueByLocation.entries()).map(([name, value]) => ({ name, value }));

    // Fee breakdown - real
    let asBase = 0, jsBase = 0, vatTotal = 0, signupTotal = 0;
    for (const reg of registrations) {
      const inv = invoiceByRegId.get(reg.id);
      if (!inv) continue;
      const program = programById.get(reg.programId);
      if (program?.code === "AS") asBase += inv.baseAmount;
      else if (program?.code === "JS") jsBase += inv.baseAmount;
      vatTotal += inv.vatAmount;
      signupTotal += inv.registrationFee;
    }
    const feeBreakdownData = [
      { name: "AS Base", value: asBase },
      { name: "JS Base", value: jsBase },
      { name: "VAT", value: vatTotal },
      { name: "Registration Fees", value: signupTotal },
    ].filter((d) => d.value > 0);

    // Revenue by program, per term - real
    const revByProgTerm = new Map<string, { term: string; AS: number; JS: number }>();
    for (const n of termNumbers) revByProgTerm.set(`Term ${n}`, { term: `Term ${n}`, AS: 0, JS: 0 });
    for (const reg of registrations) {
      const term = reg.termId ? termById.get(reg.termId) : undefined;
      const inv = invoiceByRegId.get(reg.id);
      const program = programById.get(reg.programId);
      if (!term || !inv || !program) continue;
      const row = revByProgTerm.get(`Term ${term.termNo}`);
      if (!row) continue;
      if (program.code === "AS") row.AS += inv.total;
      else if (program.code === "JS") row.JS += inv.total;
    }
    const revenueByProgramTermData = Array.from(revByProgTerm.values());

    // Revenue by cohort - top 10, real (a finance-flavored lens: which cohorts generate the most money,
    // as opposed to Admin's view of which cohorts have the most registrations)
    const revByCohort = new Map<string, number>();
    for (const reg of registrations) {
      const inv = invoiceByRegId.get(reg.id);
      const cohort = reg.cohortId ? cohortById.get(reg.cohortId) : undefined;
      if (inv && cohort) revByCohort.set(cohort.label, (revByCohort.get(cohort.label) ?? 0) + inv.total);
    }
    const revenueByCohortData = Array.from(revByCohort.entries())
      .map(([cohort, revenue]) => ({ cohort, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Rate card comparison - real, straight from RateCard records
    const rateCardComparisonData = rateCards.map((rc) => {
      const program = programById.get(rc.programId);
      return {
        program: program?.code ?? "Unknown",
        "Weekly Rate": rc.weeklyRate,
        "Kit Fee": rc.kitFee,
        "Registration Fee": rc.registrationFee,
      };
    });

    // Rate card status - real, same Active/Scheduled/Expired logic as the Rate Cards page
    const today = new Date().toISOString().split('T')[0];
    const rateCardStatusCounts = new Map<string, number>();
    for (const rc of rateCards) {
      let status = "Active";
      if (rc.effectiveFrom > today) status = "Scheduled";
      else if (rc.effectiveTo && rc.effectiveTo < today) status = "Expired";
      rateCardStatusCounts.set(status, (rateCardStatusCounts.get(status) ?? 0) + 1);
    }
    const rateCardStatusData = Array.from(rateCardStatusCounts.entries()).map(([name, value]) => ({ name, value }));

    // Discount rules summary - real, by type and active state
    const discountRuleData = discountRules.map((dr) => ({
      type: dr.type.replace('_', ' '),
      "Discount %": dr.discountPct,
      status: dr.active ? "Active" : "Inactive",
    }));

    // Top 10 paying families - real
    const familyTotals = new Map<string, number>();
    for (const reg of registrations) {
      const inv = invoiceByRegId.get(reg.id);
      const student = studentById.get(reg.studentId);
      if (inv && student) familyTotals.set(student.familyId, (familyTotals.get(student.familyId) ?? 0) + inv.total);
    }
    const sortedFamilies = Array.from(familyTotals.entries()).sort((a, b) => b[1] - a[1]);
    const top10Families = sortedFamilies.slice(0, 10);
    const topFamiliesData = top10Families.map(([familyId, total], i) => ({
      family: `Family ${i + 1}`, total, familyId,
    }));

    // Revenue concentration - top 10 families vs everyone else
    const top10Total = top10Families.reduce((sum, [, v]) => sum + v, 0);
    const allFamiliesTotal = Array.from(familyTotals.values()).reduce((sum, v) => sum + v, 0);
    const revenueConcentrationData = [
      { name: "Top 10 Families", value: top10Total },
      { name: "All Other Families", value: allFamiliesTotal - top10Total },
    ];

    // Kit opt-in - real
    const kitYes = registrations.filter((r) => r.kitOptIn).length;
    const kitNo = registrations.length - kitYes;
    const kitOptInData = [
      { name: "With Kit", value: kitYes },
      { name: "Without Kit / Unknown", value: kitNo },
    ];

    return {
      totalRevenue, totalVat, totalRegFees, avgInvoiceValue, termOverTermChangePct,
      revenueByTerm, registrationsByTerm, vatByTerm, regFeeByTerm, avgInvoiceByTerm,
      cumulativeRevenueByTerm, newVsReturningByTerm, invoiceStatusData, paymentVerificationData,
      unverifiedPct, paymentMethodData, revenueByLocationData, feeBreakdownData,
      revenueByProgramTermData, revenueByCohortData, rateCardComparisonData, rateCardStatusData,
      discountRuleData, topFamiliesData, revenueConcentrationData, kitOptInData,
    };
  }, [registrations, invoices, payments, terms, locations, programs, cohorts, students, families, rateCards, discountRules]);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Reports</h1>
          <p className="text-sm text-text-muted mt-1">Financial analytics and performance insights</p>
        </div>
      </div>

      <div className="space-y-6">

        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard title="Total Revenue" value={formatSAR(data.totalRevenue)} icon={DollarSign} isActive={activeMetric === "revenue"} onClick={() => setActiveMetric("revenue")} />
          <MetricCard title="Registrations" value={String(data.registrationsByTerm.reduce((s, r) => s + r.registrations, 0))} icon={Users} isActive={activeMetric === "registrations"} onClick={() => setActiveMetric("registrations")} />
          <MetricCard title="Avg. Invoice Value" value={formatSAR(data.avgInvoiceValue)} icon={TrendingUp} isActive={activeMetric === "avg_invoice"} onClick={() => setActiveMetric("avg_invoice")} />
          <MetricCard title="VAT Collected" value={formatSAR(data.totalVat)} icon={Percent} isActive={activeMetric === "vat"} onClick={() => setActiveMetric("vat")} />
          <MetricCard
            title="Term 1 → Term 3 Revenue Change"
            value={`${data.termOverTermChangePct >= 0 ? "+" : ""}${data.termOverTermChangePct.toFixed(1)}%`}
            change="across the 2025-26 season"
            trend={data.termOverTermChangePct > 0 ? "up" : data.termOverTermChangePct < 0 ? "down" : "neutral"}
            icon={Receipt}
            isActive={activeMetric === "regfees"}
            onClick={() => setActiveMetric("regfees")}
          />
        </div>

        {activeMetric === "revenue" && (
          <Panel title="Revenue by Term" subtitle="2025-26 season">
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={data.revenueByTerm}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="term" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#1B4332" name="Revenue" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        )}

        {activeMetric === "registrations" && (
          <Panel title="Registrations by Term" subtitle="">
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <LineChart data={data.registrationsByTerm}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="term" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                  <Line type="monotone" dataKey="registrations" stroke="#1B4332" strokeWidth={3} name="Registrations" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        )}

        {activeMetric === "avg_invoice" && (
          <Panel title="Average Invoice Value, by Term" subtitle="">
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <LineChart data={data.avgInvoiceByTerm}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="term" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                  <Line type="monotone" dataKey="avg" stroke="#1B4332" strokeWidth={3} name="Avg Invoice Value" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        )}

        {activeMetric === "vat" && (
          <Panel title="VAT Collected, by Term" subtitle="">
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={data.vatByTerm}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="term" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="vat" fill="#1B4332" name="VAT" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        )}

        {activeMetric === "regfees" && (
          <Panel title="Registration Fees Collected, by Term" subtitle="">
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={data.regFeeByTerm}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="term" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="fees" fill="#1B4332" name="Registration Fees" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Panel title="Invoices by Payment Status" subtitle="Paid, partial, or unpaid">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data.invoiceStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                    {data.invoiceStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Payment Verification" subtitle={`${data.unverifiedPct.toFixed(1)}% of payments have no bank reference on file`}>
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data.paymentVerificationData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                    <Cell fill="#1B4332" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <Panel title="Payment Methods" subtitle="Revenue collected by payment type, as recorded in the source ledger">
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={data.paymentMethodData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <YAxis type="category" dataKey="method" stroke="#6b7280" fontSize={12} width={100} />
                <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="amount" fill="#1B4332" name="Collected (SAR)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Panel title="Cumulative Revenue Growth" subtitle="Running total over the season">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <AreaChart data={data.cumulativeRevenueByTerm}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="term" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="cumulative" stroke="#1B4332" fill="#1B4332" fillOpacity={0.25} name="Cumulative Revenue" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Revenue by Location" subtitle="Jeddah vs Riyadh">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data.revenueByLocationData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                    {data.revenueByLocationData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Panel title="New vs Returning Students, by Term" subtitle="Returning = registered in an earlier term this season">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={data.newVsReturningByTerm}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="term" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="New" stackId="a" fill="#a0a83f" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Returning" stackId="a" fill="#1B4332" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Fee and Payment Breakdown" subtitle="Distribution of invoiced amounts">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data.feeBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                    {data.feeBreakdownData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Panel title="Revenue by Program, per Term" subtitle="Academy Sessions vs Junior Squad">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={data.revenueByProgramTermData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="term" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="AS" fill="#1B4332" name="Academy Sessions" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="JS" fill="#a0a83f" name="Junior Squad" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Revenue by Cohort" subtitle="Top 10 cohorts by revenue collected">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={data.revenueByCohortData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="cohort" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Bar dataKey="revenue" fill="#1B4332" name="Revenue" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Panel title="Rate Card Comparison" subtitle="Weekly rate, kit fee, and registration fee by program">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={data.rateCardComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="program" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="Weekly Rate" fill="#1B4332" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Kit Fee" fill="#408a5b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Registration Fee" fill="#a0a83f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Rate Card Status" subtitle="Active, scheduled, or expired">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data.rateCardStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                    {data.rateCardStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <Panel title="Discount Rules Summary" subtitle="Configured discount rate by type">
          <div className="h-56 w-full">
            <ResponsiveContainer>
              <BarChart data={data.discountRuleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="type" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v) => `${asNumber(v).toFixed(1)}%`} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                <Bar dataKey="Discount %" radius={[4, 4, 0, 0]}>
                  {data.discountRuleData.map((d, i) => <Cell key={i} fill={d.status === "Active" ? "#1B4332" : "#9ca3af"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Panel title="Top 10 Paying Families" subtitle="By total invoiced amount this season">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={data.topFamiliesData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                  <YAxis type="category" dataKey="family" stroke="#6b7280" fontSize={12} width={70} />
                  <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Bar dataKey="total" fill="#1B4332" name="Total Invoiced" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Revenue Concentration" subtitle="Top 10 families vs everyone else">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data.revenueConcentrationData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                    <Cell fill="#1B4332" />
                    <Cell fill="#9ca3af" />
                  </Pie>
                  <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Panel title="Kit Opt-In" subtitle="Registrations requesting a kit - relevant to kit stock cost, not yet broken out of Base Amount in the source ledger">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data.kitOptInData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                    <Cell fill="#1B4332" />
                    <Cell fill="#9ca3af" />
                  </Pie>
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
