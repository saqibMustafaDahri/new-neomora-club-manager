// import { useMemo, useState } from 'react';
// import {
//   MessageCircle, Mail, Search, Phone, CheckCircle2, Clock, XCircle,
//   Smartphone, ShieldCheck, Plus, Zap, ChevronRight, Info
// } from 'lucide-react';
// import { useDataStore, EnquiryActions } from '../../store/dataStore';
// import { Badge } from '../../components/ui/Badge';
// import { useToast } from '../../components/ui/Toast';
// import type { Enquiry } from '../../types';

// // ─────────────────────────────────────────────────────────────────────────
// // Automation settings below is a UI-only mock, modeled on how the real
// // WhatsApp Business (Cloud) API is actually structured - message templates
// // need Meta approval and a category (MARKETING / UTILITY / AUTHENTICATION),
// // a business phone number has a quality rating and messaging-limit tier,
// // and automations are "trigger -> template" rules. None of this is wired to
// // a real WhatsApp Business Account; there's nothing to connect to yet.
// // ─────────────────────────────────────────────────────────────────────────

// interface MessageTemplate {
//   id: string;
//   name: string;
//   category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
//   language: string;
//   status: 'Approved' | 'Pending' | 'Rejected';
//   preview: string;
// }

// const MOCK_TEMPLATES: MessageTemplate[] = [
//   { id: 't1', name: 'enquiry_welcome', category: 'MARKETING', language: 'en', status: 'Approved', preview: 'Hi {{1}}, thanks for your interest in Neomora! A team member will reach out shortly to help with {{2}} registration.' },
//   { id: 't2', name: 'payment_reminder', category: 'UTILITY', language: 'en', status: 'Approved', preview: 'Hi {{1}}, this is a reminder that SAR {{2}} is outstanding for {{3}}. Reply here to arrange payment.' },
//   { id: 't3', name: 'session_reminder_24h', category: 'UTILITY', language: 'en', status: 'Approved', preview: 'Reminder: {{1}} has a session tomorrow at {{2}} on {{3}}. See you there!' },
//   { id: 't4', name: 'waitlist_spot_available', category: 'UTILITY', language: 'en', status: 'Pending', preview: 'Good news! A spot has opened up for {{1}} in {{2}}. Reply YES within 24 hours to confirm.' },
//   { id: 't5', name: 'term_offer_promo', category: 'MARKETING', language: 'ar', status: 'Rejected', preview: '\u0639\u0631\u0636 \u062e\u0627\u0635 \u0644\u0644\u0641\u0635\u0644 \u0627\u0644\u0642\u0627\u062f\u0645! \u0633\u062c\u0644 \u0627\u0644\u0622\u0646 \u0648\u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u062e\u0635\u0645 15%.' },
// ];

// interface AutomationRule {
//   id: string;
//   trigger: string;
//   templateId: string;
//   channel: 'whatsapp' | 'email';
//   enabled: boolean;
// }

// const INITIAL_RULES: AutomationRule[] = [
//   { id: 'r1', trigger: 'New enquiry received', templateId: 't1', channel: 'whatsapp', enabled: true },
//   { id: 'r2', trigger: 'Invoice overdue by 3 days', templateId: 't2', channel: 'whatsapp', enabled: true },
//   { id: 'r3', trigger: 'Session starts in 24 hours', templateId: 't3', channel: 'whatsapp', enabled: false },
//   { id: 'r4', trigger: 'Waitlist spot becomes available', templateId: 't4', channel: 'whatsapp', enabled: false },
// ];

// const CATEGORY_STYLES: Record<MessageTemplate['category'], string> = {
//   MARKETING: 'bg-primary/10 text-primary',
//   UTILITY: 'bg-success/10 text-success',
//   AUTHENTICATION: 'bg-warning/10 text-warning',
// };

// const STATUS_ICON: Record<MessageTemplate['status'], typeof CheckCircle2> = {
//   Approved: CheckCircle2,
//   Pending: Clock,
//   Rejected: XCircle,
// };

// function EnquiriesTab() {
//   const { enquiries, locations } = useDataStore();
//   const { success } = useToast();
//   const [channelFilter, setChannelFilter] = useState<'all' | Enquiry['channel']>('all');
//   const [statusFilter, setStatusFilter] = useState<'all' | Enquiry['status']>('all');
//   const [query, setQuery] = useState('');

//   const locationById = new Map(locations.map((l) => [l.id, l]));

//   const stats = useMemo(() => {
//     const whatsapp = enquiries.filter((e) => e.channel === 'whatsapp').length;
//     const email = enquiries.filter((e) => e.channel === 'email').length;
//     const newCount = enquiries.filter((e) => e.status === 'new').length;
//     const converted = enquiries.filter((e) => e.status === 'converted').length;
//     return { total: enquiries.length, whatsapp, email, newCount, converted };
//   }, [enquiries]);

//   const filtered = useMemo(() => {
//     return enquiries.filter((e) => {
//       if (channelFilter !== 'all' && e.channel !== channelFilter) return false;
//       if (statusFilter !== 'all' && e.status !== statusFilter) return false;
//       if (query && !`${e.contactName} ${e.phone ?? ''} ${e.email ?? ''}`.toLowerCase().includes(query.toLowerCase())) return false;
//       return true;
//     });
//   }, [enquiries, channelFilter, statusFilter, query]);

//   function markStatus(id: string, status: Enquiry['status']) {
//     EnquiryActions.update(id, { status });
//     success(`Marked as ${status}`);
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="bg-surface rounded-lg border border-border p-4">
//           <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Total Enquiries</p>
//           <p className="text-2xl font-bold text-text mt-1.5">{stats.total}</p>
//         </div>
//         <div className="bg-surface rounded-lg border border-border p-4">
//           <p className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" />WhatsApp</p>
//           <p className="text-2xl font-bold text-text mt-1.5">{stats.whatsapp}</p>
//         </div>
//         <div className="bg-surface rounded-lg border border-border p-4">
//           <p className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />Email</p>
//           <p className="text-2xl font-bold text-text mt-1.5">{stats.email}</p>
//         </div>
//         <div className="bg-surface rounded-lg border border-border p-4">
//           <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Converted</p>
//           <p className="text-2xl font-bold text-success mt-1.5">{stats.converted}</p>
//         </div>
//       </div>

//       {stats.email === 0 && (
//         <div className="flex items-start gap-2.5 bg-primary/5 border border-primary/20 rounded-md p-3 text-xs text-text-muted">
//           <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
//           <span>All {stats.whatsapp} real enquiries on file came in via WhatsApp (from the Riyadh location's enquiry log). No email enquiries exist in the source data yet - once the academy starts logging them, they'll show up here alongside WhatsApp.</span>
//         </div>
//       )}

//       <div className="flex flex-wrap items-center gap-3">
//         <div className="relative flex-1 min-w-[200px]">
//           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
//           <input
//             type="text"
//             placeholder="Search by name or phone..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
//           />
//         </div>
//         <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value as any)} className="text-sm bg-surface border border-border rounded-md px-3 py-2 text-text">
//           <option value="all">All channels</option>
//           <option value="whatsapp">WhatsApp</option>
//           <option value="email">Email</option>
//         </select>
//         <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="text-sm bg-surface border border-border rounded-md px-3 py-2 text-text">
//           <option value="all">All statuses</option>
//           <option value="new">New</option>
//           <option value="contacted">Contacted</option>
//           <option value="converted">Converted</option>
//           <option value="closed">Closed</option>
//         </select>
//       </div>

//       <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
//         <div className="px-5 py-3 border-b border-border bg-surface-muted/30">
//           <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{filtered.length} of {enquiries.length} enquiries</span>
//         </div>
//         <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
//           {filtered.slice(0, 100).map((e) => (
//             <div key={e.id} className="px-5 py-3 flex items-center gap-4">
//               <div className="w-9 h-9 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
//                 {e.channel === 'whatsapp' ? <MessageCircle className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-text">{e.contactName}</p>
//                 <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
//                   {e.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{e.phone}</span>}
//                   {e.ageBand && <span>{e.ageBand}</span>}
//                   {e.locationId && <span>{locationById.get(e.locationId)?.name}</span>}
//                 </div>
//               </div>
//               <Badge variant={e.status === 'new' ? 'info' : e.status === 'converted' ? 'success' : e.status === 'contacted' ? 'warning' : 'neutral'}>
//                 {e.status}
//               </Badge>
//               {e.status === 'new' && (
//                 <button onClick={() => markStatus(e.id, 'contacted')} className="text-xs font-medium text-primary hover:underline shrink-0">
//                   Mark contacted
//                 </button>
//               )}
//               {e.status === 'contacted' && (
//                 <button onClick={() => markStatus(e.id, 'converted')} className="text-xs font-medium text-success hover:underline shrink-0">
//                   Mark converted
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//         {filtered.length > 100 && (
//           <div className="px-5 py-3 text-center text-xs text-text-muted border-t border-border">
//             Showing first 100 of {filtered.length} matching enquiries - refine your search to narrow further.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function AutomationsTab() {
//   const [rules, setRules] = useState(INITIAL_RULES);
//   const templateById = new Map(MOCK_TEMPLATES.map((t) => [t.id, t]));

//   function toggleRule(id: string) {
//     setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-start gap-2.5 bg-warning/5 border border-warning/20 rounded-md p-3 text-xs text-text-muted">
//         <Info className="w-4 h-4 text-warning shrink-0 mt-0.5" />
//         <span>This is a configuration UI only - nothing here is connected to a real WhatsApp Business Account or email provider yet. It's built to match how the real WhatsApp Cloud API works (templates need Meta approval before they can be sent, categorized as Marketing/Utility/Authentication) so the real integration can slot in later without a redesign.</span>
//       </div>

//       {/* Connected number card */}
//       <div className="bg-surface rounded-lg border border-border shadow-sm p-5">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-sm font-semibold text-text flex items-center gap-2"><Smartphone className="w-4 h-4 text-text-muted" />WhatsApp Business Number</h3>
//           <Badge variant="neutral">Not Connected</Badge>
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
//           <div>
//             <p className="text-xs text-text-muted uppercase tracking-wider">Display Name</p>
//             <p className="text-text font-medium mt-1">—</p>
//           </div>
//           <div>
//             <p className="text-xs text-text-muted uppercase tracking-wider">Phone Number</p>
//             <p className="text-text font-medium mt-1">—</p>
//           </div>
//           <div>
//             <p className="text-xs text-text-muted uppercase tracking-wider flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Quality Rating</p>
//             <p className="text-text font-medium mt-1">—</p>
//           </div>
//           <div>
//             <p className="text-xs text-text-muted uppercase tracking-wider">Messaging Tier</p>
//             <p className="text-text font-medium mt-1">—</p>
//           </div>
//         </div>
//         <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
//           <Plus className="w-3.5 h-3.5" />
//           Connect WhatsApp Business Account
//         </button>
//       </div>

//       {/* Message templates */}
//       <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
//         <div className="px-5 py-3 border-b border-border bg-surface-muted/30 flex items-center justify-between">
//           <h3 className="text-sm font-semibold text-text">Message Templates</h3>
//           <button className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
//             <Plus className="w-3.5 h-3.5" />New Template
//           </button>
//         </div>
//         <div className="divide-y divide-border">
//           {MOCK_TEMPLATES.map((t) => {
//             const StatusIcon = STATUS_ICON[t.status];
//             return (
//               <div key={t.id} className="px-5 py-4">
//                 <div className="flex items-center justify-between gap-3 mb-1.5">
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-mono font-semibold text-text">{t.name}</span>
//                     <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${CATEGORY_STYLES[t.category]}`}>{t.category}</span>
//                     <span className="text-xs text-text-muted uppercase">{t.language}</span>
//                   </div>
//                   <span className={`flex items-center gap-1 text-xs font-medium ${t.status === 'Approved' ? 'text-success' : t.status === 'Pending' ? 'text-warning' : 'text-danger'}`}>
//                     <StatusIcon className="w-3.5 h-3.5" />
//                     {t.status}
//                   </span>
//                 </div>
//                 <p className="text-xs text-text-muted bg-surface-muted/20 rounded p-2.5 mt-2">{t.preview}</p>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Automation rules */}
//       <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
//         <div className="px-5 py-3 border-b border-border bg-surface-muted/30 flex items-center justify-between">
//           <h3 className="text-sm font-semibold text-text flex items-center gap-2"><Zap className="w-4 h-4 text-text-muted" />Automation Rules</h3>
//           <button className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
//             <Plus className="w-3.5 h-3.5" />New Rule
//           </button>
//         </div>
//         <div className="divide-y divide-border">
//           {rules.map((r) => {
//             const template = templateById.get(r.templateId);
//             return (
//               <div key={r.id} className="px-5 py-4 flex items-center gap-4">
//                 <button
//                   onClick={() => toggleRule(r.id)}
//                   className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${r.enabled ? 'bg-primary' : 'bg-surface-muted border border-border'}`}
//                   aria-label={r.enabled ? 'Disable rule' : 'Enable rule'}
//                 >
//                   <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${r.enabled ? 'translate-x-4' : ''}`} />
//                 </button>
//                 <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap text-sm">
//                   <span className="font-medium text-text">{r.trigger}</span>
//                   <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
//                   <span className="flex items-center gap-1 text-text-muted">
//                     {r.channel === 'whatsapp' ? <MessageCircle className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
//                     <span className="font-mono text-xs">{template?.name}</span>
//                   </span>
//                 </div>
//                 <Badge variant={r.enabled ? 'success' : 'neutral'} size="sm">{r.enabled ? 'Active' : 'Paused'}</Badge>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// export function Enquiries() {
//   const [tab, setTab] = useState<'enquiries' | 'automations'>('enquiries');

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight text-text">Enquiries & Automations</h1>
//         <p className="text-text-muted mt-1">WhatsApp and email enquiries, and the automations that respond to them.</p>
//       </div>

//       <div className="flex gap-2 border-b border-border">
//         <button
//           onClick={() => setTab('enquiries')}
//           className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'enquiries' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}
//         >
//           Enquiries
//         </button>
//         <button
//           onClick={() => setTab('automations')}
//           className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'automations' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}
//         >
//           Automation Settings
//         </button>
//       </div>

//       {tab === 'enquiries' ? <EnquiriesTab /> : <AutomationsTab />}
//     </div>
//   );
// }




import { useMemo, useState } from 'react';
import {
  MessageCircle, Mail, Search, Phone, CheckCircle2, Clock, XCircle,
  Smartphone, ShieldCheck, Plus, Zap, ChevronRight, Info, ArrowRight,
  LayoutGrid, List as ListIcon, RotateCcw, Ban
} from 'lucide-react';
import { useDataStore, EnquiryActions } from '../../store/dataStore';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { useToast } from '../../components/ui/Toast';
import type { Enquiry } from '../../types';

// ─────────────────────────────────────────────────────────────────────────
// Automation settings is a UI-only mock, modeled on how the real WhatsApp
// Business (Cloud) API is actually structured - message templates need Meta
// approval and a category (MARKETING / UTILITY / AUTHENTICATION), and only
// APPROVED templates can actually be attached to an automation rule, same
// as the real API. Nothing here is connected to a real WhatsApp Business
// Account yet.
// ─────────────────────────────────────────────────────────────────────────

interface MessageTemplate {
  id: string;
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  preview: string;
}

const INITIAL_TEMPLATES: MessageTemplate[] = [
  { id: 't1', name: 'enquiry_welcome', category: 'MARKETING', language: 'en', status: 'Approved', preview: 'Hi {{1}}, thanks for your interest in Neomora! A team member will reach out shortly to help with {{2}} registration.' },
  { id: 't2', name: 'payment_reminder', category: 'UTILITY', language: 'en', status: 'Approved', preview: 'Hi {{1}}, this is a reminder that SAR {{2}} is outstanding for {{3}}. Reply here to arrange payment.' },
  { id: 't3', name: 'session_reminder_24h', category: 'UTILITY', language: 'en', status: 'Approved', preview: 'Reminder: {{1}} has a session tomorrow at {{2}} on {{3}}. See you there!' },
  { id: 't4', name: 'waitlist_spot_available', category: 'UTILITY', language: 'en', status: 'Pending', preview: 'Good news! A spot has opened up for {{1}} in {{2}}. Reply YES within 24 hours to confirm.' },
  { id: 't5', name: 'term_offer_promo', category: 'MARKETING', language: 'ar', status: 'Rejected', preview: '\u0639\u0631\u0636 \u062e\u0627\u0635 \u0644\u0644\u0641\u0635\u0644 \u0627\u0644\u0642\u0627\u062f\u0645! \u0633\u062c\u0644 \u0627\u0644\u0622\u0646 \u0648\u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u062e\u0635\u0645 15%.' },
];

interface AutomationRule {
  id: string;
  trigger: string;
  templateId: string;
  channel: 'whatsapp' | 'email';
  enabled: boolean;
}

const INITIAL_RULES: AutomationRule[] = [
  { id: 'r1', trigger: 'New enquiry received', templateId: 't1', channel: 'whatsapp', enabled: true },
  { id: 'r2', trigger: 'Invoice overdue by 3 days', templateId: 't2', channel: 'whatsapp', enabled: true },
  { id: 'r3', trigger: 'Session starts in 24 hours', templateId: 't3', channel: 'whatsapp', enabled: false },
  { id: 'r4', trigger: 'Waitlist spot becomes available', templateId: 't4', channel: 'whatsapp', enabled: false },
];

const TRIGGER_PRESETS = [
  'New enquiry received',
  'Enquiry not contacted within 24 hours',
  'Trial session booked',
  'Invoice overdue by 3 days',
  'Payment received',
  'Session starts in 24 hours',
  'Waitlist spot becomes available',
  'Registration confirmed',
];

const CATEGORY_STYLES: Record<MessageTemplate['category'], string> = {
  MARKETING: 'bg-primary/10 text-primary',
  UTILITY: 'bg-success/10 text-success',
  AUTHENTICATION: 'bg-warning/10 text-warning',
};

const STATUS_ICON: Record<MessageTemplate['status'], typeof CheckCircle2> = {
  Approved: CheckCircle2,
  Pending: Clock,
  Rejected: XCircle,
};

// ─────────────────────────────────────────────────────────────────────────
// CRM pipeline
// ─────────────────────────────────────────────────────────────────────────

const STAGE_ORDER: Enquiry['status'][] = ['new', 'contacted', 'trial_booked', 'converted'];
const STAGE_LABELS: Record<Enquiry['status'], string> = {
  new: 'New', contacted: 'Contacted', trial_booked: 'Trial Booked', converted: 'Converted', closed: 'Closed',
};
const STAGE_BADGE: Record<Enquiry['status'], 'info' | 'warning' | 'success' | 'neutral'> = {
  new: 'info', contacted: 'warning', trial_booked: 'warning', converted: 'success', closed: 'neutral',
};

function nextStageOf(status: Enquiry['status']): Enquiry['status'] | null {
  const idx = STAGE_ORDER.indexOf(status);
  if (idx === -1 || idx === STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[idx + 1];
}

function EnquiryDetailModal({
  enquiry, locationName, onClose, onAdvance, onCloseEnquiry, onReopen, onSaveNotes,
}: {
  enquiry: Enquiry;
  locationName: string;
  onClose: () => void;
  onAdvance: (e: Enquiry) => void;
  onCloseEnquiry: (e: Enquiry) => void;
  onReopen: (e: Enquiry) => void;
  onSaveNotes: (e: Enquiry, notes: string) => void;
}) {
  const [notes, setNotes] = useState(enquiry.notes ?? '');
  const next = nextStageOf(enquiry.status);

  const timeline = useMemo(() => {
    const entries = [...enquiry.history].sort((a, b) => a.at.localeCompare(b.at));
    return entries;
  }, [enquiry.history]);

  return (
    <Modal isOpen onClose={onClose} title={enquiry.contactName} width="lg">
      <div className="space-y-5 py-1">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={STAGE_BADGE[enquiry.status]}>{STAGE_LABELS[enquiry.status]}</Badge>
          <span className="flex items-center gap-1.5 text-sm text-text-muted">
            {enquiry.channel === 'whatsapp' ? <MessageCircle className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
            {enquiry.channel === 'whatsapp' ? 'WhatsApp' : 'Email'}
          </span>
          {enquiry.phone && <span className="flex items-center gap-1.5 text-sm text-text-muted"><Phone className="w-3.5 h-3.5" />{enquiry.phone}</span>}
          {enquiry.ageBand && <span className="text-sm text-text-muted">{enquiry.ageBand}</span>}
          <span className="text-sm text-text-muted">{locationName}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {next && (
            <button
              onClick={() => onAdvance(enquiry)}
              className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              Move to {STAGE_LABELS[next]} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          {enquiry.status !== 'closed' && (
            <button
              onClick={() => onCloseEnquiry(enquiry)}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface-muted border border-border text-text-muted rounded-md text-xs font-medium hover:text-danger hover:border-danger/40 transition-colors"
            >
              <Ban className="w-3.5 h-3.5" /> Close (Not Interested)
            </button>
          )}
          {enquiry.status === 'closed' && (
            <button
              onClick={() => onReopen(enquiry)}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface-muted border border-border text-text-muted rounded-md text-xs font-medium hover:text-primary hover:border-primary/40 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reopen
            </button>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => onSaveNotes(enquiry, notes)}
            rows={3}
            placeholder="Add a note about this enquiry..."
            className="w-full mt-1.5 text-sm bg-surface border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Activity Timeline</label>
          <div className="mt-2 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-text-muted mt-1.5 shrink-0" />
              <div className="text-sm">
                <p className="text-text">Enquiry received via {enquiry.channel === 'whatsapp' ? 'WhatsApp' : 'email'}</p>
                <p className="text-xs text-text-muted">{enquiry.receivedDate ?? 'Date not recorded in source data'}</p>
              </div>
            </div>
            {timeline.map((h, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="text-sm">
                  <p className="text-text">Moved to {STAGE_LABELS[h.status as Enquiry['status']] ?? h.status}</p>
                  <p className="text-xs text-text-muted">{new Date(h.at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function PipelineTab() {
  const { enquiries, locations } = useDataStore();
  const { success } = useToast();
  const [view, setView] = useState<'board' | 'list'>('board');
  const [channelFilter, setChannelFilter] = useState<'all' | Enquiry['channel']>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const locationById = useMemo(() => new Map(locations.map((l) => [l.id, l])), [locations]);

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      if (channelFilter !== 'all' && e.channel !== channelFilter) return false;
      if (locationFilter !== 'all' && e.locationId !== locationFilter) return false;
      if (query && !`${e.contactName} ${e.phone ?? ''}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [enquiries, channelFilter, locationFilter, query]);

  const stats = useMemo(() => {
    const whatsapp = enquiries.filter((e) => e.channel === 'whatsapp').length;
    const email = enquiries.filter((e) => e.channel === 'email').length;
    return { total: enquiries.length, whatsapp, email };
  }, [enquiries]);

  const stageColumns = useMemo(() => {
    const cols: Record<Enquiry['status'], Enquiry[]> = { new: [], contacted: [], trial_booked: [], converted: [], closed: [] };
    for (const e of filtered) cols[e.status].push(e);
    return cols;
  }, [filtered]);

  const selected = enquiries.find((e) => e.id === selectedId) ?? null;

  function advance(e: Enquiry) {
    const next = nextStageOf(e.status);
    if (!next) return;
    EnquiryActions.update(e.id, { status: next, history: [...e.history, { status: next, at: new Date().toISOString() }] });
    success(`Moved to ${STAGE_LABELS[next]}`);
  }
  function closeEnquiry(e: Enquiry) {
    EnquiryActions.update(e.id, { status: 'closed', history: [...e.history, { status: 'closed', at: new Date().toISOString() }] });
    success('Marked as closed');
  }
  function reopen(e: Enquiry) {
    EnquiryActions.update(e.id, { status: 'new', history: [...e.history, { status: 'new', at: new Date().toISOString() }] });
    success('Reopened');
  }
  function saveNotes(e: Enquiry, notes: string) {
    EnquiryActions.update(e.id, { notes: notes || null });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg border border-border p-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Total Enquiries</p>
          <p className="text-2xl font-bold text-text mt-1.5">{stats.total}</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" />WhatsApp</p>
          <p className="text-2xl font-bold text-text mt-1.5">{stats.whatsapp}</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />Email</p>
          <p className="text-2xl font-bold text-text mt-1.5">{stats.email}</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Converted</p>
          <p className="text-2xl font-bold text-success mt-1.5">{stageColumns.converted.length}</p>
        </div>
      </div>

      {stats.email === 0 && (
        <div className="flex items-start gap-2.5 bg-primary/5 border border-primary/20 rounded-md p-3 text-xs text-text-muted">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>All {stats.whatsapp} real enquiries on file came in via WhatsApp (from the Riyadh location's enquiry log). No email enquiries exist in the source data yet.</span>
        </div>
      )}

      {/* Funnel bar */}
      <div className="bg-surface rounded-lg border border-border p-4">
        <div className="flex items-center justify-between text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
          <span>Pipeline</span>
        </div>
        <div className="flex rounded-md overflow-hidden h-8 text-xs font-medium text-white">
          {(['new', 'contacted', 'trial_booked', 'converted', 'closed'] as const).map((stage) => {
            const count = stageColumns[stage].length;
            const pct = filtered.length > 0 ? (count / filtered.length) * 100 : 0;
            const colors: Record<string, string> = { new: '#1B4332', contacted: '#408a5b', trial_booked: '#a0a83f', converted: '#0d5026', closed: '#9ca3af' };
            if (count === 0) return null;
            return (
              <div key={stage} style={{ width: `${pct}%`, backgroundColor: colors[stage] }} className="flex items-center justify-center min-w-[2rem] px-1 truncate">
                {count}
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-text-muted">
          {(['new', 'contacted', 'trial_booked', 'converted', 'closed'] as const).map((stage) => (
            <span key={stage}>{STAGE_LABELS[stage]}: <strong className="text-text">{stageColumns[stage].length}</strong></span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value as any)} className="text-sm bg-surface border border-border rounded-md px-3 py-2 text-text">
          <option value="all">All channels</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="email">Email</option>
        </select>
        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="text-sm bg-surface border border-border rounded-md px-3 py-2 text-text">
          <option value="all">All locations</option>
          {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <div className="flex gap-1 bg-surface-muted rounded-md p-1 ml-auto">
          <button onClick={() => setView('board')} className={`p-1.5 rounded ${view === 'board' ? 'bg-surface shadow-sm text-primary' : 'text-text-muted'}`} aria-label="Board view">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-surface shadow-sm text-primary' : 'text-text-muted'}`} aria-label="List view">
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {(['new', 'contacted', 'trial_booked', 'converted', 'closed'] as const).map((stage) => (
            <div key={stage} className="bg-surface-muted/20 rounded-lg border border-border overflow-hidden flex flex-col">
              <div className="px-3 py-2.5 border-b border-border bg-surface flex items-center justify-between">
                <span className="text-xs font-semibold text-text uppercase tracking-wider">{STAGE_LABELS[stage]}</span>
                <Badge variant={STAGE_BADGE[stage]} size="sm">{stageColumns[stage].length}</Badge>
              </div>
              <div className="p-2 space-y-2 max-h-[60vh] overflow-y-auto">
                {stageColumns[stage].length === 0 ? (
                  <p className="text-xs text-text-muted text-center py-6">No enquiries</p>
                ) : (
                  stageColumns[stage].slice(0, 50).map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setSelectedId(e.id)}
                      className="w-full text-left bg-surface rounded-md border border-border p-3 hover:border-primary/40 hover:shadow-sm transition-all"
                    >
                      <p className="text-sm font-medium text-text truncate">{e.contactName}</p>
                      <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                        {e.phone && <span className="truncate">{e.phone}</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        {e.ageBand && <span className="text-[10px] font-medium bg-surface-muted px-1.5 py-0.5 rounded">{e.ageBand}</span>}
                        <span className="text-[10px] text-text-muted">{locationById.get(e.locationId ?? '')?.name}</span>
                      </div>
                    </button>
                  ))
                )}
                {stageColumns[stage].length > 50 && (
                  <p className="text-[10px] text-text-muted text-center py-1">+{stageColumns[stage].length - 50} more - use search to narrow</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-surface-muted/30">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{filtered.length} of {enquiries.length} enquiries</span>
          </div>
          <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
            {filtered.slice(0, 150).map((e) => (
              <button key={e.id} onClick={() => setSelectedId(e.id)} className="w-full px-5 py-3 flex items-center gap-4 hover:bg-surface-muted/20 transition-colors text-left">
                <div className="w-9 h-9 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                  {e.channel === 'whatsapp' ? <MessageCircle className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text">{e.contactName}</p>
                  <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
                    {e.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{e.phone}</span>}
                    {e.ageBand && <span>{e.ageBand}</span>}
                    <span>{locationById.get(e.locationId ?? '')?.name}</span>
                  </div>
                </div>
                <Badge variant={STAGE_BADGE[e.status]}>{STAGE_LABELS[e.status]}</Badge>
                <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
              </button>
            ))}
          </div>
          {filtered.length > 150 && (
            <div className="px-5 py-3 text-center text-xs text-text-muted border-t border-border">
              Showing first 150 of {filtered.length} - refine your search to narrow further.
            </div>
          )}
        </div>
      )}

      {selected && (
        <EnquiryDetailModal
          enquiry={selected}
          locationName={locationById.get(selected.locationId ?? '')?.name ?? 'Unknown'}
          onClose={() => setSelectedId(null)}
          onAdvance={advance}
          onCloseEnquiry={closeEnquiry}
          onReopen={reopen}
          onSaveNotes={saveNotes}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Automations tab
// ─────────────────────────────────────────────────────────────────────────

function NewTemplateModal({ onClose, onCreate }: { onClose: () => void; onCreate: (t: Omit<MessageTemplate, 'id' | 'status'>) => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MessageTemplate['category']>('UTILITY');
  const [language, setLanguage] = useState('en');
  const [preview, setPreview] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onCreate({ name: name.trim().toLowerCase().replace(/\s+/g, '_'), category, language, preview });
  }

  return (
    <Modal isOpen onClose={onClose} title="New Message Template">
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <FormField label="Template Name" required>
          {(id) => <input id={id} type="text" placeholder="e.g. term_offer_promo" value={name} onChange={(e) => setName(e.target.value)} required />}
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" required>
            {(id) => (
              <select id={id} value={category} onChange={(e) => setCategory(e.target.value as MessageTemplate['category'])} required>
                <option value="MARKETING">Marketing</option>
                <option value="UTILITY">Utility</option>
                <option value="AUTHENTICATION">Authentication</option>
              </select>
            )}
          </FormField>
          <FormField label="Language" required>
            {(id) => (
              <select id={id} value={language} onChange={(e) => setLanguage(e.target.value)} required>
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            )}
          </FormField>
        </div>
        <FormField label="Message Body" required>
          {(id) => (
            <textarea
              id={id} rows={3} required value={preview} onChange={(e) => setPreview(e.target.value)}
              placeholder="Hi {{1}}, ..."
              className="w-full text-sm bg-surface border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            />
          )}
        </FormField>
        <p className="text-xs text-text-muted">Use {'{{1}}'}, {'{{2}}'}... as placeholders. New templates start as Pending, same as a real submission to Meta for approval.</p>
        <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">Submit for Approval</button>
        </div>
      </form>
    </Modal>
  );
}

function NewRuleModal({ templates, onClose, onCreate }: { templates: MessageTemplate[]; onClose: () => void; onCreate: (r: Omit<AutomationRule, 'id'>) => void }) {
  const approvedTemplates = templates.filter((t) => t.status === 'Approved');
  const [triggerChoice, setTriggerChoice] = useState(TRIGGER_PRESETS[0]);
  const [customTrigger, setCustomTrigger] = useState('');
  const [templateId, setTemplateId] = useState(approvedTemplates[0]?.id ?? '');
  const [channel, setChannel] = useState<'whatsapp' | 'email'>('whatsapp');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trigger = triggerChoice === 'custom' ? customTrigger.trim() : triggerChoice;
    if (!trigger || !templateId) return;
    onCreate({ trigger, templateId, channel, enabled: true });
  }

  return (
    <Modal isOpen onClose={onClose} title="New Automation Rule">
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <FormField label="Trigger" required>
          {(id) => (
            <select id={id} value={triggerChoice} onChange={(e) => setTriggerChoice(e.target.value)} required>
              {TRIGGER_PRESETS.map((t) => <option key={t} value={t}>{t}</option>)}
              <option value="custom">Custom...</option>
            </select>
          )}
        </FormField>
        {triggerChoice === 'custom' && (
          <FormField label="Custom Trigger" required>
            {(id) => <input id={id} type="text" value={customTrigger} onChange={(e) => setCustomTrigger(e.target.value)} placeholder="Describe the trigger..." required />}
          </FormField>
        )}
        <FormField label="Template" required>
          {(id) => (
            approvedTemplates.length === 0 ? (
              <p className="text-xs text-danger">No approved templates yet - a rule can only send an approved template, same as the real WhatsApp API.</p>
            ) : (
              <select id={id} value={templateId} onChange={(e) => setTemplateId(e.target.value)} required>
                {approvedTemplates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            )
          )}
        </FormField>
        <FormField label="Channel" required>
          {(id) => (
            <select id={id} value={channel} onChange={(e) => setChannel(e.target.value as 'whatsapp' | 'email')} required>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </select>
          )}
        </FormField>
        <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors">Cancel</button>
          <button type="submit" disabled={approvedTemplates.length === 0} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">Create Rule</button>
        </div>
      </form>
    </Modal>
  );
}

function AutomationsTab() {
  const { success } = useToast();
  const [templates, setTemplates] = useState<MessageTemplate[]>(INITIAL_TEMPLATES);
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [showNewRule, setShowNewRule] = useState(false);
  const templateById = new Map(templates.map((t) => [t.id, t]));

  function toggleRule(id: string) {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }

  function createTemplate(t: Omit<MessageTemplate, 'id' | 'status'>) {
    const newTemplate: MessageTemplate = { ...t, id: `t${Date.now()}`, status: 'Pending' };
    setTemplates((prev) => [...prev, newTemplate]);
    setShowNewTemplate(false);
    success('Template submitted for Meta approval');
  }

  function createRule(r: Omit<AutomationRule, 'id'>) {
    const newRule: AutomationRule = { ...r, id: `r${Date.now()}` };
    setRules((prev) => [...prev, newRule]);
    setShowNewRule(false);
    success('Automation rule created');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2.5 bg-warning/5 border border-warning/20 rounded-md p-3 text-xs text-text-muted">
        <Info className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <span>This is a configuration UI only - nothing here is connected to a real WhatsApp Business Account or email provider yet. It matches how the real WhatsApp Cloud API works so a real integration can slot in later without a redesign.</span>
      </div>

      <div className="bg-surface rounded-lg border border-border shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text flex items-center gap-2"><Smartphone className="w-4 h-4 text-text-muted" />WhatsApp Business Number</h3>
          <Badge variant="neutral">Not Connected</Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><p className="text-xs text-text-muted uppercase tracking-wider">Display Name</p><p className="text-text font-medium mt-1">—</p></div>
          <div><p className="text-xs text-text-muted uppercase tracking-wider">Phone Number</p><p className="text-text font-medium mt-1">—</p></div>
          <div><p className="text-xs text-text-muted uppercase tracking-wider flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Quality Rating</p><p className="text-text font-medium mt-1">—</p></div>
          <div><p className="text-xs text-text-muted uppercase tracking-wider">Messaging Tier</p><p className="text-text font-medium mt-1">—</p></div>
        </div>
        <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-3.5 h-3.5" />Connect WhatsApp Business Account
        </button>
      </div>

      <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-surface-muted/30 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text">Message Templates</h3>
          <button onClick={() => setShowNewTemplate(true)} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" />New Template
          </button>
        </div>
        <div className="divide-y divide-border">
          {templates.map((t) => {
            const StatusIcon = STATUS_ICON[t.status];
            return (
              <div key={t.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-semibold text-text">{t.name}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${CATEGORY_STYLES[t.category]}`}>{t.category}</span>
                    <span className="text-xs text-text-muted uppercase">{t.language}</span>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium ${t.status === 'Approved' ? 'text-success' : t.status === 'Pending' ? 'text-warning' : 'text-danger'}`}>
                    <StatusIcon className="w-3.5 h-3.5" />{t.status}
                  </span>
                </div>
                <p className="text-xs text-text-muted bg-surface-muted/20 rounded p-2.5 mt-2">{t.preview}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-surface-muted/30 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text flex items-center gap-2"><Zap className="w-4 h-4 text-text-muted" />Automation Rules</h3>
          <button onClick={() => setShowNewRule(true)} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" />New Rule
          </button>
        </div>
        <div className="divide-y divide-border">
          {rules.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-text-muted">No automation rules yet.</p>
          ) : rules.map((r) => {
            const template = templateById.get(r.templateId);
            return (
              <div key={r.id} className="px-5 py-4 flex items-center gap-4">
                <button
                  onClick={() => toggleRule(r.id)}
                  className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${r.enabled ? 'bg-primary' : 'bg-surface-muted border border-border'}`}
                  aria-label={r.enabled ? 'Disable rule' : 'Enable rule'}
                >
                  <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${r.enabled ? 'translate-x-4' : ''}`} />
                </button>
                <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap text-sm">
                  <span className="font-medium text-text">{r.trigger}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
                  <span className="flex items-center gap-1 text-text-muted">
                    {r.channel === 'whatsapp' ? <MessageCircle className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                    <span className="font-mono text-xs">{template?.name ?? 'Unknown template'}</span>
                  </span>
                </div>
                <Badge variant={r.enabled ? 'success' : 'neutral'} size="sm">{r.enabled ? 'Active' : 'Paused'}</Badge>
              </div>
            );
          })}
        </div>
      </div>

      {showNewTemplate && <NewTemplateModal onClose={() => setShowNewTemplate(false)} onCreate={createTemplate} />}
      {showNewRule && <NewRuleModal templates={templates} onClose={() => setShowNewRule(false)} onCreate={createRule} />}
    </div>
  );
}

export function Enquiries() {
  const [tab, setTab] = useState<'pipeline' | 'automations'>('pipeline');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Enquiries & Automations</h1>
        <p className="text-text-muted mt-1">WhatsApp and email enquiries, tracked through a pipeline, and the automations that respond to them.</p>
      </div>

      <div className="flex gap-2 border-b border-border">
        <button onClick={() => setTab('pipeline')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'pipeline' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}>
          Pipeline
        </button>
        <button onClick={() => setTab('automations')} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'automations' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'}`}>
          Automation Settings
        </button>
      </div>

      {tab === 'pipeline' ? <PipelineTab /> : <AutomationsTab />}
    </div>
  );
}
