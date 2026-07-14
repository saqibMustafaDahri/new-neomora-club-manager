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
//                   <Tooltip formatter={(v) => `${asNumber(v).toFixed(0)}x`} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
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
//                   <Tooltip formatter={(v) => `${asNumber(v).toFixed(0)}%`} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
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
import { Download, Users, DollarSign, Activity, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight, SaudiRiyal } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell,
  LineChart, Line, PieChart, Pie, AreaChart, Area
} from "recharts";
import { useDataStore } from "../../store/dataStore";

const SAR = (n: number) => <span className="inline-flex items-center"><SaudiRiyal className="w-[1em] h-[1em] mr-1 opacity-80" />{n.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>;

const asNumber = (value: unknown) => {
  if (typeof value === "number") return value;
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatSAR = (value: unknown) => SAR(asNumber(value));

const PIE_COLORS = ["#0d5026", "#408a5b", "#6b8f4e", "#a0a83f", "#c7b52e"];

function MetricCard({ title, value, change, trend, icon: Icon, isActive, onClick }: { title: string, value: React.ReactNode, change?: React.ReactNode, trend?: "up" | "down" | "neutral", icon: any, isActive?: boolean, onClick?: () => void }) {
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

export function Reports() {
  const [activeMetric, setActiveMetric] = useState("revenue");

  const allRegistrations = useDataStore((s) => s.registrations);
  const selectedSeasonId = useDataStore((s) => s.selectedSeasonId);
  const seasons = useDataStore((s) => s.seasons);
  const invoices = useDataStore((s) => s.invoices);
  const allPayments = useDataStore((s) => s.payments);
  const terms = useDataStore((s) => s.terms);
  const locations = useDataStore((s) => s.locations);
  const pitches = useDataStore((s) => s.pitches);
  const sessionTemplates = useDataStore((s) => s.sessionTemplates);
  const sessionEnrollments = useDataStore((s) => s.sessionEnrollments);
  const waitlistEntries = useDataStore((s) => s.waitlistEntries);
  const cohorts = useDataStore((s) => s.cohorts);
  const programs = useDataStore((s) => s.programs);
  const students = useDataStore((s) => s.students);
  const families = useDataStore((s) => s.families);

  // Every revenue/registration/invoice chart below derives from this one filtered list, so
  // switching the global season selector cascades through all of them at once. Capacity
  // (SessionTemplate) and Waitlist have no term/season link in the schema at all - they stay
  // organization-wide regardless of the season filter, same as the Dashboard.
  const registrations = useMemo(() => {
    if (selectedSeasonId === "all") return allRegistrations;
    const seasonTermIds = new Set(terms.filter((t) => t.seasonId === selectedSeasonId).map((t) => t.id));
    return allRegistrations.filter((r) => seasonTermIds.has(r.termId));
  }, [allRegistrations, terms, selectedSeasonId]);

  // Payments are filtered the same way, via their invoice's registration - this is what the
  // Payment Verification chart's unverified-percentage figure depends on.
  const payments = useMemo(() => {
    if (selectedSeasonId === "all") return allPayments;
    const seasonRegIds = new Set(registrations.map((r) => r.id));
    const seasonInvoiceIds = new Set(invoices.filter((i) => seasonRegIds.has(i.registrationId)).map((i) => i.id));
    return allPayments.filter((p) => seasonInvoiceIds.has(p.invoiceId));
  }, [allPayments, invoices, registrations, selectedSeasonId]);

  const currentSeasonName = seasons.find((s) => s.id === selectedSeasonId)?.name;

  const data = useMemo(() => {
    const termById = new Map(terms.map((t) => [t.id, t]));
    const locationById = new Map(locations.map((l) => [l.id, l]));
    const pitchById = new Map(pitches.map((p) => [p.id, p]));
    const invoiceByRegId = new Map(invoices.map((i) => [i.registrationId, i]));
    const cohortById = new Map(cohorts.map((c) => [c.id, c]));
    const programById = new Map(programs.map((p) => [p.id, p]));

    const totalRevenue = registrations.reduce((sum, r) => sum + (invoiceByRegId.get(r.id)?.total ?? 0), 0);
    const activeStudentIds = new Set(registrations.filter((r) => r.status === "active").map((r) => r.studentId));
    const avgRevenuePerStudent = activeStudentIds.size > 0 ? totalRevenue / activeStudentIds.size : 0;

    // Revenue and registration counts by term number (real cyclical unit for this business - there's no
    // month-over-month history to show, only 3 real terms, so every "monthly" chart below is now per-term).
    const termNumbers = [1, 2, 3];
    const revenueByTermNo = new Map<number, number>();
    const regCountByTermNo = new Map<number, number>();
    for (const reg of registrations) {
      const term = reg.termId ? termById.get(reg.termId) : undefined;
      if (!term) continue;
      const inv = invoiceByRegId.get(reg.id);
      revenueByTermNo.set(term.termNo, (revenueByTermNo.get(term.termNo) ?? 0) + (inv?.total ?? 0));
      regCountByTermNo.set(term.termNo, (regCountByTermNo.get(term.termNo) ?? 0) + 1);
    }
    const revenueByTerm = termNumbers.map((n) => ({ term: `Term ${n}`, revenue: revenueByTermNo.get(n) ?? 0 }));
    const registrationsByTerm = termNumbers.map((n) => ({ term: `Term ${n}`, registrations: regCountByTermNo.get(n) ?? 0 }));
    const avgRevenueByTerm = termNumbers.map((n) => {
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

    // Waitlist by cohort - real, replaces a fabricated "ROAS"-style chart
    const waitlistByCohort = new Map<string, number>();
    for (const w of waitlistEntries) {
      const label = w.cohortId ? cohortById.get(w.cohortId)?.label ?? "Unknown" : "Unknown";
      waitlistByCohort.set(label, (waitlistByCohort.get(label) ?? 0) + 1);
    }
    const waitlistByCohortData = Array.from(waitlistByCohort.entries()).map(([cohort, count]) => ({ cohort, count }));

    // Capacity utilization by location - real, from actual SessionTemplate capacity vs SessionEnrollment count
    const enrolledBySession = new Map<string, number>();
    for (const e of sessionEnrollments) {
      enrolledBySession.set(e.sessionTemplateId, (enrolledBySession.get(e.sessionTemplateId) ?? 0) + 1);
    }
    const capacityByLocation = new Map<string, { capacity: number; enrolled: number }>();
    for (const st of sessionTemplates) {
      const pitch = pitchById.get(st.pitchId);
      const loc = pitch ? locationById.get(pitch.locationId) : undefined;
      const locName = loc?.name ?? "Unknown";
      const entry = capacityByLocation.get(locName) ?? { capacity: 0, enrolled: 0 };
      entry.capacity += st.capacity;
      entry.enrolled += enrolledBySession.get(st.id) ?? 0;
      capacityByLocation.set(locName, entry);
    }
    const capacityData = Array.from(capacityByLocation.entries()).map(([location, v]) => ({ location, ...v }));
    const utilizationData = capacityData.map((c) => ({
      location: c.location,
      utilization: c.capacity > 0 ? Math.round((c.enrolled / c.capacity) * 1000) / 10 : 0,
    }));

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

    // Payment methods - real (reflects what's actually recorded, not invented categories)
    const methodTotals = new Map<string, number>();
    for (const p of payments) {
      methodTotals.set(p.method, (methodTotals.get(p.method) ?? 0) + p.amount);
    }
    const prettyMethod = (m: string) => m.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const paymentMethodData = Array.from(methodTotals.entries()).map(([method, amount]) => ({ method: prettyMethod(method), amount }));

    // Registration status breakdown - now includes Waitlisted (from WaitlistEntry, since a waitlisted
    // child has no Registration row at all until promoted - that's why this was missing before)
    const statusCounts = new Map<string, number>();
    for (const reg of registrations) {
      const label = reg.status.charAt(0).toUpperCase() + reg.status.slice(1);
      statusCounts.set(label, (statusCounts.get(label) ?? 0) + 1);
    }
    if (waitlistEntries.length > 0) {
      statusCounts.set("Waitlisted", waitlistEntries.length);
    }
    const statusData = Array.from(statusCounts.entries()).map(([name, value]) => ({ name, value }));

    // Registrations by cohort - real, replaces a fabricated "Boys vs Girls" chart (no gender field exists
    // anywhere in the source spreadsheets, so it isn't shown here rather than guessed)
    const cohortCounts = new Map<string, number>();
    for (const reg of registrations) {
      const label = reg.cohortId ? cohortById.get(reg.cohortId)?.label ?? "Unknown" : "Unknown";
      cohortCounts.set(label, (cohortCounts.get(label) ?? 0) + 1);
    }
    const registrationsByCohortData = Array.from(cohortCounts.entries())
      .map(([cohort, count]) => ({ cohort, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Student retention by terms committed - real, from Registration.commitmentTerms (deduped per student,
    // since every one of a student's registrations this season carries the same value)
    const commitmentByStudent = new Map<string, number>();
    for (const reg of registrations) {
      if (!commitmentByStudent.has(reg.studentId)) {
        commitmentByStudent.set(reg.studentId, reg.commitmentTerms);
      }
    }
    const retentionCounts = new Map<number, number>();
    for (const terms_ of commitmentByStudent.values()) {
      retentionCounts.set(terms_, (retentionCounts.get(terms_) ?? 0) + 1);
    }
    const retentionData = Array.from(retentionCounts.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([terms_, count]) => ({ label: terms_ === 1 ? "1 term" : `${terms_} terms`, count }));

    // Unverified payments - real, operationally meaningful: a payment recorded with no bank reference
    // can't be reconciled against the bank statement
    const unverifiedCount = payments.filter((p) => !p.bankRef).length;
    const unverifiedPct = payments.length > 0 ? (unverifiedCount / payments.length) * 100 : 0;
    const paymentVerificationData = [
      { name: "Verified", value: payments.length - unverifiedCount },
      { name: "No Bank Reference", value: unverifiedCount },
    ];

    // Kit opt-in - real, from Registration.kitOptIn (operationally useful for ordering kit stock)
    const kitYes = registrations.filter((r) => r.kitOptIn).length;
    const kitNo = registrations.length - kitYes;
    const kitOptInData = [
      { name: "With Kit", value: kitYes },
      { name: "Without Kit / Unknown", value: kitNo },
    ];

    // Sibling families - real, from Family/Student, counting only families with a registered student
    // (useful given the sibling discount rule depends on this exact grouping)
    const studentById = new Map(students.map((s) => [s.id, s]));
    const registeredStudentIds = new Set(registrations.map((r) => r.studentId));
    const familyRegisteredCount = new Map<string, number>();
    for (const studentId of registeredStudentIds) {
      const student = studentById.get(studentId);
      if (!student) continue;
      familyRegisteredCount.set(student.familyId, (familyRegisteredCount.get(student.familyId) ?? 0) + 1);
    }
    let singleChildFamilies = 0, siblingFamilies = 0;
    for (const count of familyRegisteredCount.values()) {
      if (count > 1) siblingFamilies++; else singleChildFamilies++;
    }
    const siblingFamilyData = [
      { name: "Single Child", value: singleChildFamilies },
      { name: "Siblings (2+)", value: siblingFamilies },
    ];

    // Revenue by program, per term - real, shows product-mix trend across the season
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

    // Enrollments by day of week - real, from SessionTemplate.dayOfWeek via SessionEnrollment
    // (useful for staffing: which weekdays carry the most sessions)
    const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const templateById = new Map(sessionTemplates.map((t) => [t.id, t]));
    const enrollByDay = new Map<number, number>(DAY_NAMES.map((_, i) => [i, 0]));
    for (const e of sessionEnrollments) {
      const template = templateById.get(e.sessionTemplateId);
      if (!template) continue;
      enrollByDay.set(template.dayOfWeek, (enrollByDay.get(template.dayOfWeek) ?? 0) + 1);
    }
    const enrollmentsByDayData = DAY_NAMES.map((day, i) => ({ day, count: enrollByDay.get(i) ?? 0 }));

    return {
      totalRevenue, activeStudentCount: activeStudentIds.size, avgRevenuePerStudent,
      revenueByTerm, registrationsByTerm, avgRevenueByTerm, cumulativeRevenueByTerm,
      termOverTermChangePct, waitlistByCohortData, capacityData, utilizationData,
      revenueByLocationData, feeBreakdownData, paymentMethodData, statusData,
      registrationsByCohortData, retentionData, unverifiedCount, unverifiedPct,
      paymentVerificationData, kitOptInData, siblingFamilyData, revenueByProgramTermData,
      enrollmentsByDayData,
    };
  }, [registrations, invoices, payments, terms, locations, pitches, sessionTemplates, sessionEnrollments, waitlistEntries, cohorts, programs, students, families]);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Reports</h1>
          <p className="text-sm text-text-muted mt-1">Analytics and performance insights</p>
          <p className="text-xs text-text-muted mt-1">
            {selectedSeasonId === "all" ? "Showing all seasons combined" : `Showing ${currentSeasonName ?? "the selected season"}`} - change this from the season selector in the top bar. Capacity and waitlist figures are always organization-wide, since they aren't tied to a specific season.
          </p>
        </div>
      </div>

      <div className="space-y-6">

        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard title="Total Revenue" value={formatSAR(data.totalRevenue)} icon={DollarSign} isActive={activeMetric === "revenue"} onClick={() => setActiveMetric("revenue")} />
          <MetricCard title="Avg. Revenue per Active Student" value={formatSAR(data.avgRevenuePerStudent)} icon={Activity} isActive={activeMetric === "avg_revenue"} onClick={() => setActiveMetric("avg_revenue")} />
          <MetricCard title="Active Students" value={String(data.activeStudentCount)} icon={Users} isActive={activeMetric === "participants"} onClick={() => setActiveMetric("participants")} />
          <MetricCard title="Total Waitlist" value={String(data.waitlistByCohortData.reduce((s, w) => s + w.count, 0))} icon={TrendingUp} isActive={activeMetric === "growth"} onClick={() => setActiveMetric("growth")} />
          <MetricCard
            title="Term 1 → Term 3 Revenue Change"
            value={`${data.termOverTermChangePct >= 0 ? "+" : ""}${data.termOverTermChangePct.toFixed(0)}%`}
            change="across the 2025-26 season"
            trend={data.termOverTermChangePct > 0 ? "up" : data.termOverTermChangePct < 0 ? "down" : "neutral"}
            icon={BarChart3}
            isActive={activeMetric === "conversion"}
            onClick={() => setActiveMetric("conversion")}
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

        {activeMetric === "participants" && (
          <Panel title="Registrations by Term" subtitle="Active + waitlisted + withdrawn">
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

        {activeMetric === "avg_revenue" && (
          <Panel title="Average Revenue per Registration, by Term" subtitle="">
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <LineChart data={data.avgRevenueByTerm}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="term" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                  <Line type="monotone" dataKey="avg" stroke="#1B4332" strokeWidth={3} name="Avg Revenue per Registration" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        )}

        {activeMetric === "growth" && (
          <Panel title="Waitlist by Cohort" subtitle="">
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={data.waitlistByCohortData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="cohort" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="count" fill="#1B4332" name="Waitlisted" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        )}

        {activeMetric === "conversion" && (
          <Panel title="Cumulative Revenue by Term" subtitle="Running total across the season">
            <div className="h-72 w-full">
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
        )}

        <Panel title="Capacity Utilisation" subtitle="Enrolled vs total capacity per location">
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={data.capacityData} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis type="category" dataKey="location" stroke="#6b7280" fontSize={12} width={130} />
                <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="capacity" fill="#9ca3af" name="Capacity" opacity={0.3} radius={[0, 4, 4, 0]} />
                <Bar dataKey="enrolled" fill="#1B4332" name="Enrolled" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

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
          <Panel title="Registrations by Program" subtitle="Academy Sessions vs Junior Squad">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={[
                  { program: "Academy Sessions", count: registrations.filter(r => programs.find(p => p.id === r.programId)?.code === "AS").length },
                  { program: "Junior Squad", count: registrations.filter(r => programs.find(p => p.id === r.programId)?.code === "JS").length },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="program" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Bar dataKey="count" fill="#1B4332" name="Registrations" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Panel title="Registrations by Cohort" subtitle="Top 10 cohorts by registration count">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={data.registrationsByCohortData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="cohort" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Bar dataKey="count" name="Registered" fill="#1B4332" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Registration Status" subtitle="Registrations by status, plus students currently on a waitlist">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data.statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                    {data.statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Panel title="Capacity Utilization %" subtitle="Enrolled as % of total capacity">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={data.utilizationData} layout="vertical" margin={{ left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${asNumber(v).toFixed(0)}%`} domain={[0, 100]} />
                  <YAxis type="category" dataKey="location" stroke="#6b7280" fontSize={12} width={130} />
                  <Tooltip formatter={(v) => `${asNumber(v).toFixed(0)}%`} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Bar dataKey="utilization" fill="#1B4332" name="Utilization %" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Panel title="Student Retention" subtitle="Terms committed this season, per student">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={data.retentionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Bar dataKey="count" fill="#1B4332" name="Students" radius={[4, 4, 0, 0]} />
                </BarChart>
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

          <Panel title="Kit Opt-In" subtitle="Registrations requesting a kit">
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

          <Panel title="Enrollments by Day of Week" subtitle="Which weekdays carry the most sessions">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={data.enrollmentsByDayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Bar dataKey="count" fill="#1B4332" name="Enrollments" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Panel title="Sibling Families" subtitle="Families with more than one registered child">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={data.siblingFamilyData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} label>
                    <Cell fill="#1B4332" />
                    <Cell fill="#a0a83f" />
                  </Pie>
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Panel title="Fee and Payment Breakdown" subtitle="Distribution of invoiced amounts">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
  data={data.feeBreakdownData}
  dataKey="value"
  nameKey="name"
  cx="50%"
  cy="50%"
  innerRadius={50}
  outerRadius={80}
  label={({ value }) => Math.round(value).toLocaleString()}
>
  {data.feeBreakdownData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
</Pie>
                  <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Revenue by Location" subtitle="Jeddah vs Riyadh">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <PieChart>
                 <Pie
  data={data.revenueByLocationData}
  dataKey="value"
  nameKey="name"
  cx="50%"
  cy="50%"
  innerRadius={50}
  outerRadius={80}
  label={({ value }) => Math.round(value).toLocaleString()}
>
  {data.revenueByLocationData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
</Pie>
                  <Tooltip formatter={(v) => formatSAR(v)} contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8 }} />
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
