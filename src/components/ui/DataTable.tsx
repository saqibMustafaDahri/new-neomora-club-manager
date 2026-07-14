// import { useState, useMemo } from 'react';
// import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react';
// import { EmptyState } from './EmptyState';

// export interface Column<T = Record<string, unknown>> {
//   key: string;
//   label: string;
//   render?: (value: unknown, row: T) => React.ReactNode;
//   sortable?: boolean;
//   width?: string;
// }

// interface DataTableProps<T extends object> {
//   columns: Column<T>[];
//   rows: T[];
//   onRowClick?: (row: T) => void;
//   searchPlaceholder?: string;
//   searchKeys?: string[]; // which keys to search against; defaults to all string columns
//   emptyMessage?: string;
// }

// type SortDir = 'asc' | 'desc' | null;

// export function DataTable<T extends object>({
//   columns,
//   rows,
//   onRowClick,
//   searchPlaceholder = 'Search…',
//   searchKeys,
//   emptyMessage = 'No records found.',
// }: DataTableProps<T>) {
//   const [query, setQuery] = useState('');
//   const [sortKey, setSortKey] = useState<string | null>(null);
//   const [sortDir, setSortDir] = useState<SortDir>(null);

//   function handleSort(key: string) {
//     if (sortKey !== key) {
//       setSortKey(key);
//       setSortDir('asc');
//     } else if (sortDir === 'asc') {
//       setSortDir('desc');
//     } else {
//       setSortKey(null);
//       setSortDir(null);
//     }
//   }

//   const filtered = useMemo(() => {
//     if (!query.trim()) return rows;
//     const q = query.toLowerCase();
//     const keys = searchKeys ?? columns.map((c) => c.key);
//     return rows.filter((row) =>
//       keys.some((k) => String((row as Record<string, unknown>)[k] ?? '').toLowerCase().includes(q)),
//     );
//   }, [rows, query, searchKeys, columns]);

//   const sorted = useMemo(() => {
//     if (!sortKey || !sortDir) return filtered;
//     return [...filtered].sort((a, b) => {
//       const av = (a as Record<string, unknown>)[sortKey] ?? '';
//       const bv = (b as Record<string, unknown>)[sortKey] ?? '';
//       const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
//       return sortDir === 'asc' ? cmp : -cmp;
//     });
//   }, [filtered, sortKey, sortDir]);

//   function SortIcon({ colKey }: { colKey: string }) {
//     if (sortKey !== colKey) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />;
//     return sortDir === 'asc'
//       ? <ChevronUp className="w-3.5 h-3.5 text-primary" />
//       : <ChevronDown className="w-3.5 h-3.5 text-primary" />;
//   }

//   return (
//     <div className="flex flex-col gap-3">
//       {/* Search */}
//       <div className="relative max-w-xs">
//         <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder={searchPlaceholder}
//           className="pl-9 pr-4 py-2 w-full bg-background border border-border rounded-md text-sm text-text
//                      focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-text-muted"
//         />
//       </div>

//       {/* Table */}
//       <div className="rounded-lg border border-border overflow-hidden shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="bg-surface-muted border-b border-border">
//                 {columns.map((col) => (
//                   <th
//                     key={col.key}
//                     style={col.width ? { width: col.width } : undefined}
//                     className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap"
//                   >
//                     {col.sortable !== false ? (
//                       <button
//                         onClick={() => handleSort(col.key)}
//                         className="inline-flex items-center gap-1.5 hover:text-text transition-colors"
//                       >
//                         {col.label}
//                         <SortIcon colKey={col.key} />
//                       </button>
//                     ) : (
//                       col.label
//                     )}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-surface divide-y divide-border">
//               {sorted.length === 0 ? (
//                 <tr>
//                   <td colSpan={columns.length} className="py-16">
//                     <EmptyState message={emptyMessage} />
//                   </td>
//                 </tr>
//               ) : (
//                 sorted.map((row, i) => (
//                   <tr
//                     key={i}
//                     onClick={() => onRowClick?.(row)}
//                     className={`transition-colors ${
//                       onRowClick
//                         ? 'cursor-pointer hover:bg-primary/5'
//                         : 'hover:bg-surface-muted/50'
//                     }`}
//                   >
//                     {columns.map((col) => (
//                       <td key={col.key} className="px-4 py-3 text-text">
//                         {col.render
//                           ? col.render((row as Record<string, unknown>)[col.key], row)
//                           : String((row as Record<string, unknown>)[col.key] ?? '—')}
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//         {sorted.length > 0 && (
//           <div className="px-4 py-2 border-t border-border bg-surface-muted/30 text-xs text-text-muted">
//             {sorted.length} of {rows.length} record{rows.length !== 1 ? 's' : ''}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { Select } from './Select';

export interface Column<T = Record<string, unknown>> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface DataTableProps<T extends object> {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  searchPlaceholder?: string;
  searchKeys?: string[]; // which keys to search against; defaults to all string columns
  emptyMessage?: string;
  /** Optional dropdown filters rendered next to the search box (e.g. Location, Status). */
  filters?: FilterConfig[];
  pageSize?: number;
}

type SortDir = 'asc' | 'desc' | null;

export function DataTable<T extends object>({
  columns,
  rows,
  onRowClick,
  searchPlaceholder = 'Search…',
  searchKeys,
  emptyMessage = 'No records found.',
  filters,
  pageSize,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);

  function handleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
    } else if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  }

  function handleFilterChange(key: string, value: string) {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  }

  const filtered = useMemo(() => {
    let result = rows;

    // Apply dropdown filters
    if (filters && filters.length > 0) {
      result = result.filter((row) =>
        filters.every((f) => {
          const selected = filterValues[f.key];
          if (!selected) return true; // "All" selected
          return String((row as Record<string, unknown>)[f.key] ?? '') === selected;
        }),
      );
    }

    // Apply search
    if (query.trim()) {
      const q = query.toLowerCase();
      const keys = searchKeys ?? columns.map((c) => c.key);
      result = result.filter((row) =>
        keys.some((k) => String((row as Record<string, unknown>)[k] ?? '').toLowerCase().includes(q)),
      );
    }

    return result;
  }, [rows, query, searchKeys, columns, filters, filterValues]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey] ?? '';
      const bv = (b as Record<string, unknown>)[sortKey] ?? '';
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;

  useEffect(() => {
    if (!pageSize) {
      setPage(1);
      return;
    }

    setPage((current) => Math.min(current, totalPages));
  }, [pageSize, totalPages]);

  const pagedRows = pageSize ? sorted.slice((page - 1) * pageSize, page * pageSize) : sorted;
  const startIndex = pageSize && pagedRows.length > 0 ? (page - 1) * pageSize + 1 : 0;
  const endIndex = pageSize ? Math.min(page * pageSize, sorted.length) : sorted.length;

  function SortIcon({ colKey }: { colKey: string }) {
    if (sortKey !== colKey) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 text-primary" />
      : <ChevronDown className="w-3.5 h-3.5 text-primary" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs w-full sm:w-auto sm:flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9 pr-4 py-2 w-full bg-background border border-border rounded-md text-sm text-text
                       transition-all placeholder:text-text-muted"
          />
        </div>

        {filters?.map((f) => (
          <Select
            key={f.key}
            value={filterValues[f.key] ?? ''}
            onChange={(e) => handleFilterChange(f.key, e.target.value)}
            className="py-2 px-3 pr-10 bg-background text-sm text-text"
            containerClassName="min-w-[160px]"
          >
            <option value="">All {f.label}</option>
            {f.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-muted border-b border-border">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={col.width ? { width: col.width } : undefined}
                    className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap"
                  >
                    {col.sortable !== false ? (
                      <button
                        onClick={() => handleSort(col.key)}
                        className="inline-flex items-center gap-1.5 hover:text-text transition-colors"
                      >
                        {col.label}
                        <SortIcon colKey={col.key} />
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border">
              {pagedRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-16">
                    <EmptyState message={emptyMessage} />
                  </td>
                </tr>
              ) : (
                pagedRows.map((row, i) => (
                  <tr
                    key={pageSize ? (page - 1) * pageSize + i : i}
                    onClick={() => onRowClick?.(row)}
                    className={`transition-colors ${onRowClick
                      ? 'cursor-pointer hover:bg-primary/5'
                      : 'hover:bg-surface-muted/50'
                      }`}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-text">
                        {col.render
                          ? col.render((row as Record<string, unknown>)[col.key], row)
                          : String((row as Record<string, unknown>)[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {sorted.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-border bg-surface-muted/30 px-4 py-3 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <div>
              {pageSize
                ? `Showing ${startIndex}-${endIndex} of ${sorted.length} record${sorted.length !== 1 ? 's' : ''}`
                : `${sorted.length} of ${rows.length} record${rows.length !== 1 ? 's' : ''}`}
            </div>

            {pageSize && totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(current - 1, 1))}
                  disabled={page === 1}
                  className="rounded-md border border-border bg-background px-3 py-1.5 font-medium text-text transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="min-w-24 text-center font-medium text-text">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
                  disabled={page === totalPages}
                  className="rounded-md border border-border bg-background px-3 py-1.5 font-medium text-text transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}