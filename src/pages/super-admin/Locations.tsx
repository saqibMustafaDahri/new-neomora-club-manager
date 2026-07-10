import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useDataStore, LocationActions } from '../../store/dataStore';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { useToast } from '../../components/ui/Toast';
import type { Location } from '../../types';

export function Locations() {
  const { locations } = useDataStore();
  const { success } = useToast();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const columns: Column<Location>[] = [
    { key: 'name', label: 'Name' },
    { key: 'city', label: 'City' },
  ];

  function handleRowClick(row: Location) {
    setEditingLocation(row);
    setModalOpen(true);
  }

  function handleAddClick() {
    setEditingLocation(null);
    setModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const city = fd.get('city') as string;

    if (editingLocation) {
      LocationActions.update(editingLocation.id, { name, city });
      success('Location updated successfully.');
    } else {
      const id = `loc_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
      LocationActions.add({ id, name, city });
      success('Location added successfully.');
    }
    setModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Locations</h1>
          <p className="text-text-muted mt-1">Manage physical hubs and academies.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Location
        </button>
      </div>

      <div className="bg-surface rounded-lg border border-border shadow-sm p-6">
        <DataTable
          columns={columns}
          rows={locations}
          onRowClick={handleRowClick}
          searchPlaceholder="Search locations..."
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingLocation ? 'Edit Location' : 'Add Location'}
      >
        <form id="location-form" onSubmit={handleSubmit} className="space-y-4 py-2">
          <FormField label="Location Name" required>
            {(id) => (
              <input
                id={id}
                name="name"
                type="text"
                required
                defaultValue={editingLocation?.name}
                placeholder="e.g. Jeddah Hub"
              />
            )}
          </FormField>
          
          <FormField label="City" required>
            {(id) => (
              <input
                id={id}
                name="city"
                type="text"
                required
                defaultValue={editingLocation?.city}
                placeholder="e.g. Jeddah"
              />
            )}
          </FormField>
          
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="location-form"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              {editingLocation ? 'Save Changes' : 'Create Location'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
