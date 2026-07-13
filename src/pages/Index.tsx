import { Link } from 'react-router-dom';
import { ArrowRight, Building2, CreditCard, Users, Trophy, Shield, BarChart3, Lock, GitBranch, MessageSquare } from 'lucide-react';

const portals = [
  { key: 'superAdmin', name: 'Super Admin', description: 'Manage locations, programs, users, and reports.', icon: Shield },
  { key: 'locationManager', name: 'Location Manager', description: 'Oversee schedules, roster, and waitlist operations.', icon: Building2 },
  { key: 'financeOfficer', name: 'Finance', description: 'Handle invoices, rate cards, discounts, and VAT.', icon: CreditCard },
  { key: 'coach', name: 'Coach', description: 'Track sessions and attendance.', icon: Trophy },
  { key: 'parent', name: 'Parent / Guardian', description: 'View payments, schedule, and child activity.', icon: Users },
];

const features = [
  { icon: Building2, title: 'Multi-Location Management', desc: 'Run every academy site from one console with location-aware data.' },
  { icon: CreditCard, title: 'Smart Fee Collection', desc: 'Automated invoices, payment reminders and reconciliation.' },
  { icon: GitBranch, title: 'Participant Lifecycle', desc: 'Track enquiries, trials, enrolment, holds, and graduations.' },
  { icon: MessageSquare, title: 'WhatsApp & Email Automation', desc: 'Reach guardians where they actually read messages.' },
  { icon: BarChart3, title: 'Real-Time Reporting', desc: 'Revenue, retention, and capacity dashboards updated live.' },
  { icon: Lock, title: 'Role-Based Access', desc: 'Granular permissions for every staff role and location.' },
];

export function Index() {
  return (
    <div className="min-h-screen bg-background text-text">
      <section className="relative overflow-hidden text-white pt-20">
        <img
          src="/hero-bg.jpg"
          alt="Academy training session"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1B4332]/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B4332]/20 via-[#1B4332]/35 to-[#1B4332]/75" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-24 pt-8 text-center md:pb-28 md:pt-10">
          <div className="mb-10 flex items-center justify-center gap-2 text-white/85">
            <img src="/neomora-logo.png" alt="Neomora" className="h-7 w-auto brightness-0 invert" />
            <span className="text-xs font-medium tracking-wide">Club Manager</span>
          </div>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            The Complete Academy
            <br />
            <span className="text-white/82">Management Platform</span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm text-white/80 md:text-base">
            Manage participants, sessions, fees, and communications, all in one place.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/login-select"
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[#1B4332] shadow-sm transition-colors hover:bg-white/90"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login-select"
              className="inline-flex items-center gap-2 rounded-md border border-white/70 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#1B4332]"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Features</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Everything you need to run a modern academy</h2>
          <p className="mt-4 text-sm text-text-muted md:text-base">
            From your first enquiry to your hundredth invoice, Neomora handles the operations so your coaches can coach.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-muted text-text-muted">
                  <Icon className="h-4 w-4 text-green-700" />
                </div>
                <h3 className="mt-4 text-md font-semibold text-text">{feature.title}</h3>
                <p className="mt-2 text-sm leading-5 text-text-muted">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-secondary/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Portals</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">A purpose-built system for every role</h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {portals.map((portal) => {
              const Icon = portal.icon;

              return (
                <Link
                  key={portal.key}
                  to="/login-select"
                  className="group flex h-full flex-col rounded-xl border border-border bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#1B4332] text-white transition-colors group-hover:bg-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-text">{portal.name}</h3>
                  <p className="mt-2 flex-1 text-xs leading-5 text-text-muted">{portal.description}</p>

                  <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-text transition-colors group-hover:border-primary/30 group-hover:text-primary">
                    Access Portal <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-surface/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-text-muted md:flex-row">
          <div className="flex items-center gap-3">
            <img src="/neomora-logo.png" alt="Neomora" className="h-5 w-auto" />
            <span>© {new Date().getFullYear()} Neomora. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <a href="https://neomora.zielglobal.com" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">Discover Neomora Events</a>
            <a href="#" className="hover:text-text">Privacy</a>
            <a href="#" className="hover:text-text">Terms</a>
            <a href="#" className="hover:text-text">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Index;