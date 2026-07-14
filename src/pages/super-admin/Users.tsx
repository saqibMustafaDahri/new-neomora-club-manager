import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useDataStore, UserActions } from '../../store/dataStore';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { useToast } from '../../components/ui/Toast';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import type { User, Role } from '../../types';

export function Users() {
  const { users, locations, families } = useDataStore();
  const { success } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('parent');

  const columns: Column<User>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (val) => {
        let variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' = 'neutral';
        if (val === 'superAdmin') variant = 'danger';
        else if (val === 'locationManager') variant = 'warning';
        else if (val === 'financeOfficer') variant = 'success';
        else if (val === 'coach') variant = 'info';

        return <Badge variant={variant}>{String(val)}</Badge>;
      }
    },
    {
      key: 'locationScope',
      label: 'Access Scope',
      render: (val, row) => {
        if (row.role === 'superAdmin' || row.role === 'financeOfficer') {
          return <span className="text-text-muted text-sm">All Locations</span>;
        }
        if (row.role === 'parent') {
          const family = families.find(f => f.id === row.familyId);
          return <span className="text-text-muted text-sm">Family: {family?.guardianName || 'None'}</span>;
        }

        const scopeNames = (val as string[]).map(id => locations.find(l => l.id === id)?.name).filter(Boolean);
        if (scopeNames.length === 0) return <span className="text-text-muted text-sm">No Locations</span>;
        return <span className="text-text text-sm truncate max-w-[200px] block">{scopeNames.join(', ')}</span>;
      }
    }
  ];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const email = fd.get('email') as string;

    // We get role from state to match what was rendered.
    const role = selectedRole;

    let locationScope: string[] = [];
    let familyId: string | null = null;

    if (role === 'locationManager' || role === 'coach') {
      // In a real app we'd use a multi-select component. For this, we'll just read checked inputs.
      const checkedLocations = Array.from(e.currentTarget.querySelectorAll('input[name="locationScope"]:checked'))
        .map(input => (input as HTMLInputElement).value);
      locationScope = checkedLocations;
    } else if (role === 'parent') {
      familyId = (fd.get('familyId') as string) || null;
    }

    const id = `user_${Date.now()}`;

    UserActions.add({
      id,
      name,
      email,
      role,
      locationScope,
      familyId
    });

    success('User added successfully.');
    setModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Users</h1>
          <p className="text-text-muted mt-1">Manage system access, roles, and location scopes.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-surface rounded-lg border border-border shadow-sm p-6">
        <DataTable
          columns={columns}
          rows={users}
          searchPlaceholder="Search users by name or email..."
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add User"
      >
        <form id="user-form" onSubmit={handleSubmit} className="space-y-4 py-2">

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Full Name" required>
              {(id) => <input id={id} name="name" type="text" placeholder="e.g. Sarah Connor" required />}
            </FormField>
            <FormField label="Email Address" required>
              {(id) => <input id={id} name="email" type="email" placeholder="e.g. sarah@example.com" required />}
            </FormField>
          </div>

          <FormField label="Role" required>
            {(id) => (
              <Select
                id={id}
                name="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Role)}
                required
                containerClassName="w-full"
              >
                <option value="parent">Parent</option>
                <option value="coach">Coach</option>
                <option value="locationManager">Location Manager</option>
                <option value="financeOfficer">Finance Officer</option>
                <option value="superAdmin">Super Admin</option>
              </Select>
            )}
          </FormField>

          {(selectedRole === 'locationManager' || selectedRole === 'coach') && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-text">Location Scope</label>
              <p className="text-xs text-text-muted mb-2">Select which locations this user can manage.</p>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-border rounded-md p-3">
                {locations.map(loc => (
                  <label key={loc.id} className="flex items-center gap-2 text-sm text-text">
                    <input type="checkbox" name="locationScope" value={loc.id} className="rounded border-border text-primary focus:ring-primary" />
                    {loc.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          {selectedRole === 'parent' && (
            <FormField label="Family Link" required>
              {(id) => (
                <Select id={id} name="familyId" required defaultValue="" containerClassName="w-full">
                  <option value="" disabled>Select a Family...</option>
                  {families.map(fam => (
                    <option key={fam.id} value={fam.id}>{fam.guardianName}</option>
                  ))}
                </Select>
              )}
            </FormField>
          )}

          {/* Super Admin & Finance Officer get full access inherently, no extra fields needed */}
          {(selectedRole === 'superAdmin' || selectedRole === 'financeOfficer') && (
            <div className="bg-primary/5 p-3 rounded-md border border-primary/20">
              <p className="text-sm text-primary">This role grants access to all locations and settings.</p>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="user-form"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              Create User
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
