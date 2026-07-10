import { useState } from 'react';
import clsx from 'clsx';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id);

  function handleTabClick(id: string) {
    setActiveTab(id);
    onChange?.(id);
  }

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className="flex flex-col w-full">
      <div className="border-b border-border overflow-x-auto">
        <nav className="flex space-x-6 px-2" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={clsx(
                  'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-muted hover:text-text hover:border-border-hover'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="mt-4">
        {activeContent}
      </div>
    </div>
  );
}
