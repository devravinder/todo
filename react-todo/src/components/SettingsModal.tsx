import React, { useState } from 'react';
import { ADD, CLOSE, DELETE } from '../util/icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: string[];
  users: string[];
  tags: string[];
  priorities: string[];
  onUpdateGroups: (groups: string[]) => void;
  onUpdateUsers: (users: string[]) => void;
  onUpdateTags: (tags: string[]) => void;
  onUpdatePriorities: (priorities: string[]) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  groups,
  users,
  tags,
  priorities,
  onUpdateGroups,
  onUpdateUsers,
  onUpdateTags,
  onUpdatePriorities
}) => {
  const [activeTab, setActiveTab] = useState('groups');
  const [newItem, setNewItem] = useState('');

  const tabs = [
    { id: 'groups', label: 'Groups', items: groups, onUpdate: onUpdateGroups },
    { id: 'users', label: 'Users', items: users, onUpdate: onUpdateUsers },
    { id: 'tags', label: 'Tags', items: tags, onUpdate: onUpdateTags },
    { id: 'priorities', label: 'Priorities', items: priorities, onUpdate: onUpdatePriorities }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  const addItem = () => {
    if (!newItem.trim() || !activeTabData) return;
    if (activeTabData.items.includes(newItem.trim())) return;
    
    activeTabData.onUpdate([...activeTabData.items, newItem.trim()]);
    setNewItem('');
  };

  const removeItem = (item: string) => {
    if (!activeTabData) return;
    activeTabData.onUpdate(activeTabData.items.filter(i => i !== item));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Settings</h2>
          <button
            onClick={onClose}
            className="text-slate-500 text-lg hover:text-slate-700 focus:outline-none"
          >
            {CLOSE}
          </button>
        </div>

        <div className="flex">
          <div className="w-48 border-r border-slate-200">
            <nav className="p-4 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                Manage {activeTabData?.label}
              </h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem()}
                  placeholder={`Add new ${activeTabData?.label.toLowerCase().slice(0, -1)}`}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={addItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {ADD}
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {activeTabData?.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <span className="text-slate-700">{item}</span>
                  <button
                    onClick={() => removeItem(item)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    disabled={activeTabData.items.length <= 1}
                  >
                    {DELETE}
                  </button>
                </div>
              ))}
              
              {activeTabData?.items.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-sm">No {activeTabData.label.toLowerCase()} configured</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;