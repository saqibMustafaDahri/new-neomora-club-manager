import { useState } from 'react';
import { Users, FileText, CalendarRange } from 'lucide-react';
import { DataTable, type Column } from '../components/ui/DataTable';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormField } from '../components/ui/FormField';
import { EmptyState } from '../components/ui/EmptyState';
import { Tabs } from '../components/ui/Tabs';
import { useToast } from '../components/ui/Toast';

export function UIKit() {
  const [modalOpen, setModalOpen] = useState(false);
  const { toast, success, error } = useToast();

  // Mock data for DataTable
  const tableColumns: Column[] = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <Badge variant={val === 'Active' ? 'success' : 'neutral'}>{String(val)}</Badge>
      )
    },
  ];
  
  const tableRows = [
    { id: 1, name: 'Alice Smith', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Bob Jones', role: 'User', status: 'Inactive' },
    { id: 3, name: 'Charlie Day', role: 'Editor', status: 'Active' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <header className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-text">UI Kit</h1>
        <p className="text-text-muted mt-1">Component library test page.</p>
      </header>

      {/* Stats */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text border-b border-border pb-2">Stat Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={Users} label="Total Users" value="1,240" accent="primary" trend={{ value: 12, direction: 'up' }} />
          <StatCard icon={FileText} label="Pending Invoices" value="45" accent="warning" trend={{ value: 2, direction: 'down' }} />
          <StatCard icon={CalendarRange} label="Active Sessions" value="8" accent="success" />
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text border-b border-border pb-2">Badges</h2>
        <div className="flex gap-4 p-4 bg-surface rounded-lg border border-border">
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="neutral">Neutral</Badge>
        </div>
      </section>

      {/* Tabs */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text border-b border-border pb-2">Tabs</h2>
        <div className="p-6 bg-surface rounded-lg border border-border">
          <Tabs 
            tabs={[
              { id: 'tab1', label: 'Overview', content: <p className="text-sm text-text-muted">Overview content goes here...</p> },
              { id: 'tab2', label: 'Settings', content: <p className="text-sm text-text-muted">Settings content goes here...</p> },
              { id: 'tab3', label: 'Activity', content: <p className="text-sm text-text-muted">Recent activity logs...</p> },
            ]}
          />
        </div>
      </section>

      {/* Toasts & Modals */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text border-b border-border pb-2">Overlays (Toasts & Modals)</h2>
        <div className="flex gap-4 p-6 bg-surface rounded-lg border border-border">
          <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-surface-muted border border-border rounded hover:bg-border/50 text-sm font-medium">
            Open Modal
          </button>
          <button onClick={() => success('Changes saved successfully!')} className="px-4 py-2 bg-success/10 text-success border border-success/20 rounded hover:bg-success/20 text-sm font-medium">
            Success Toast
          </button>
          <button onClick={() => error('Failed to delete record.')} className="px-4 py-2 bg-danger/10 text-danger border border-danger/20 rounded hover:bg-danger/20 text-sm font-medium">
            Error Toast
          </button>
          <button onClick={() => toast('New message received.')} className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded hover:bg-primary/20 text-sm font-medium">
            Info Toast
          </button>
        </div>

        <Modal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          title="Edit Profile"
          footer={
            <>
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text">Cancel</button>
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">Save Changes</button>
            </>
          }
        >
          <div className="space-y-4 py-2">
            <FormField label="Full Name" required>
              {(id) => <input id={id} type="text" defaultValue="John Doe" />}
            </FormField>
            <FormField label="Email Address" error="Email is already in use.">
              {(id) => <input id={id} type="email" defaultValue="john@example.com" />}
            </FormField>
          </div>
        </Modal>
      </section>

      {/* Data Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text border-b border-border pb-2">Data Table</h2>
        <DataTable 
          columns={tableColumns} 
          rows={tableRows} 
          onRowClick={(row) => console.log('Clicked', row)} 
        />
      </section>

      {/* Empty State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text border-b border-border pb-2">Empty State</h2>
        <EmptyState 
          title="No Invoices" 
          message="You don't have any pending invoices at this time." 
          action={{ label: 'Create Invoice', onClick: () => alert('Action clicked') }}
        />
      </section>

    </div>
  );
}
