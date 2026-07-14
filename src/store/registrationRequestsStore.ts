import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RegistrationRequest } from '../types';

const STORAGE_KEY = 'neomora-registration-requests';

interface RegistrationRequestsState {
    requests: RegistrationRequest[];
    addRequest: (r: RegistrationRequest) => void;
    updateRequest: (id: string, patch: Partial<RegistrationRequest>) => void;
}

// This is the one piece of the app that intentionally persists to localStorage rather than
// staying purely in-memory like the rest of the store - it has to, so a request submitted from
// the public /apply link (which may be opened in a completely different browser tab, with its
// own separate in-memory Zustand instance) can actually reach the admin reviewing it.
export const useRegistrationRequestsStore = create<RegistrationRequestsState>()(
    persist(
        (set) => ({
            requests: [],
            addRequest: (r) => set((state) => ({ requests: [...state.requests, r] })),
            updateRequest: (id, patch) =>
                set((state) => ({
                    requests: state.requests.map((req) => (req.id === id ? { ...req, ...patch } : req)),
                })),
        }),
        { name: STORAGE_KEY }
    )
);

// Cross-tab sync: the persist middleware writes to localStorage automatically, but only the
// tab that made the change knows about it in-memory. Other open tabs need to rehydrate when
// the browser's native 'storage' event fires (which only fires in *other* tabs, not the one
// that wrote the change).
if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
            useRegistrationRequestsStore.persist.rehydrate();
        }
    });
}
