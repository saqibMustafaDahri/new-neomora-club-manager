import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RegistrationRequest } from '../types';

const STORAGE_KEY = 'neomora-registration-requests';

interface RegistrationRequestsState {
    requests: RegistrationRequest[];
    addRequest: (r: RegistrationRequest) => void;
    updateRequest: (id: string, patch: Partial<RegistrationRequest>) => void;
}

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

if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
            useRegistrationRequestsStore.persist.rehydrate();
        }
    });
}
