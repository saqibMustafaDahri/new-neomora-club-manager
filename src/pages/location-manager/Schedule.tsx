import { useState, useMemo } from 'react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { useDataStore, SessionTemplateActions } from '../../store/dataStore';
import { selectUserLocations, selectScopedSessionTemplates } from '../../store/selectors';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { useToast } from '../../components/ui/Toast';
import { Select } from '../../components/ui/Select';
import type { SessionTemplate } from '../../types';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 9 }, (_, i) => i + 14); // 14:00 to 22:00

export function Schedule() {
  const { sessionEnrollments, cohorts, pitches } = useDataStore();
  const { success } = useToast();
  
  const locations = selectUserLocations();
  const locationIds = locations.map(l => l.id);
  const scopedPitches = pitches.filter(p => locationIds.includes(p.locationId));
  const templates = selectScopedSessionTemplates();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SessionTemplate | null>(null);
  
  // To pre-fill the form if clicking an empty slot
  const [defaultDay, setDefaultDay] = useState(0);
  const [defaultTime, setDefaultTime] = useState('16:00');

  function getEnrollmentCount(templateId: string) {
    return sessionEnrollments.filter(e => e.sessionTemplateId === templateId).length;
  }

  function handleCellClick(day: number, hour: number) {
    setEditingTemplate(null);
    setDefaultDay(day);
    setDefaultTime(`${hour}:00`);
    setModalOpen(true);
  }

  function handleTemplateClick(e: React.MouseEvent, template: SessionTemplate) {
    e.stopPropagation();
    setEditingTemplate(template);
    setModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const cohortId = fd.get('cohortId') as string;
    const pitchId = fd.get('pitchId') as string;
    const dayOfWeek = parseInt(fd.get('dayOfWeek') as string, 10);
    const startTime = fd.get('startTime') as string;
    const endTime = fd.get('endTime') as string;
    const capacity = parseInt(fd.get('capacity') as string, 10);

    if (editingTemplate) {
      SessionTemplateActions.update(editingTemplate.id, { cohortId, pitchId, dayOfWeek, startTime, endTime, capacity });
      success('Session updated successfully.');
    } else {
      const id = `sess_${Date.now()}`;
      SessionTemplateActions.add({ id, cohortId, pitchId, dayOfWeek, startTime, endTime, capacity });
      success('Session created successfully.');
    }
    setModalOpen(false);
  }

  // Group templates by day and hour for rendering
  const grid = useMemo(() => {
    const map = new Map<string, SessionTemplate[]>();
    templates.forEach(t => {
      const hour = parseInt(t.startTime.split(':')[0], 10);
      const key = `${t.dayOfWeek}-${hour}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    return map;
  }, [templates]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Weekly Schedule</h1>
          <p className="text-text-muted mt-1">Manage session templates for your locations.</p>
        </div>
        <button
          onClick={() => {
            setEditingTemplate(null);
            setDefaultDay(0);
            setDefaultTime('16:00');
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Session
        </button>
      </div>

      <div className="bg-surface rounded-lg border border-border shadow-sm overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="grid grid-cols-8 border-b border-border bg-surface-muted">
            <div className="p-3 border-r border-border flex items-center justify-center text-text-muted">
              <CalendarIcon className="w-5 h-5" />
            </div>
            {DAYS.map(day => (
              <div key={day} className="p-3 text-center text-sm font-semibold text-text-muted border-r border-border last:border-0">
                {day}
              </div>
            ))}
          </div>

          {/* Grid Rows */}
          {HOURS.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b border-border last:border-0 min-h-[100px]">
              <div className="p-3 border-r border-border bg-surface-muted/30 text-xs font-medium text-text-muted text-center flex flex-col justify-center">
                {hour}:00
              </div>
              {DAYS.map((_, dayIdx) => {
                const cellTemplates = grid.get(`${dayIdx}-${hour}`) || [];
                return (
                  <div 
                    key={dayIdx} 
                    className="border-r border-border last:border-0 p-2 hover:bg-surface-muted/30 transition-colors cursor-pointer flex flex-col gap-2"
                    onClick={() => handleCellClick(dayIdx, hour)}
                  >
                    {cellTemplates.map(template => {
                      const cohort = cohorts.find(c => c.id === template.cohortId);
                      const pitch = pitches.find(p => p.id === template.pitchId);
                      const enrolled = getEnrollmentCount(template.id);
                      const isFull = enrolled >= template.capacity;
                      const isNearFull = enrolled >= template.capacity * 0.8;
                      
                      const variant = isFull ? 'danger' : isNearFull ? 'warning' : 'success';
                      
                      return (
                        <div 
                          key={template.id} 
                          onClick={(e) => handleTemplateClick(e, template)}
                          className="bg-background border border-border rounded p-2 shadow-sm hover:border-primary transition-colors text-xs space-y-1.5"
                        >
                          <div className="font-semibold text-text truncate">
                            {cohort?.label || 'Unknown Cohort'}
                          </div>
                          <div className="text-text-muted truncate">
                            {pitch?.name || 'Unknown Pitch'}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-text-muted">{template.startTime} - {template.endTime}</span>
                            <Badge variant={variant} size="sm">{enrolled}/{template.capacity}</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTemplate ? 'Edit Session' : 'Add Session'}
      >
        <form id="session-form" onSubmit={handleSubmit} className="space-y-4 py-2">
          
          <FormField label="Cohort" required>
            {(id) => (
              <Select id={id} name="cohortId" required defaultValue={editingTemplate?.cohortId} containerClassName="w-full">
                <option value="" disabled>Select Cohort</option>
                {cohorts.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </Select>
            )}
          </FormField>
          
          <FormField label="Pitch" required>
            {(id) => (
              <Select id={id} name="pitchId" required defaultValue={editingTemplate?.pitchId} containerClassName="w-full">
                <option value="" disabled>Select Pitch</option>
                {scopedPitches.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({locations.find(l => l.id === p.locationId)?.name})</option>
                ))}
              </Select>
            )}
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Day of Week" required>
              {(id) => (
                <Select id={id} name="dayOfWeek" required defaultValue={editingTemplate?.dayOfWeek ?? defaultDay} containerClassName="w-full">
                  {DAYS.map((day, i) => (
                    <option key={i} value={i}>{day}</option>
                  ))}
                </Select>
              )}
            </FormField>
            
            <FormField label="Capacity" required>
              {(id) => (
                <input id={id} name="capacity" type="number" min="1" required defaultValue={editingTemplate?.capacity ?? 16} />
              )}
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Time" required>
              {(id) => (
                <input id={id} name="startTime" type="time" required defaultValue={editingTemplate?.startTime ?? defaultTime} />
              )}
            </FormField>
            <FormField label="End Time" required>
              {(id) => (
                <input id={id} name="endTime" type="time" required defaultValue={editingTemplate?.endTime ?? '17:00'} />
              )}
            </FormField>
          </div>
          
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
              form="session-form"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              {editingTemplate ? 'Save Changes' : 'Create Session'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
