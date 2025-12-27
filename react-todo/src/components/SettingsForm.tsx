import { useForm, useStore } from "@tanstack/react-form";
import { ADD, DELETE } from "../util/icons";
import { useState } from "react";

type FormData = TodoConfig;

type FormProps = {
  data: FormData;
  onSubmit: (data: FormData) => void;
  onCancel: VoidFunction;
};
export default function SettingsForm({ data, onSubmit, onCancel }: FormProps) {
  const form = useForm({
    defaultValues: data,
    onSubmit: async ({ value }) => {
      try {
        onSubmit(value);
      } catch (error) {
        console.error("Failed to save task", error);
      }
    },
  });

  const statuses = useStore(form.store, (state) => state.values.Statuses);
  const users = useStore(form.store, (state) => state.values.Users);
  const tags = useStore(form.store, (state) => state.values.Tags);
  const priorities = useStore(form.store, (state) => state.values.Priorities);

  const [activeTab, setActiveTab] = useState("statuses");
  const [newItem, setNewItem] = useState("");

  const tabs = [
    {
      id: "statuses",
      label: "Statuses",
      items: statuses,
      onUpdate: (items: string[]) => form.setFieldValue("Statuses", items),
    },
    {
      id: "users",
      label: "Users",
      items: users,
      onUpdate: (items: string[]) => form.setFieldValue("Users", items),
    },
    {
      id: "tags",
      label: "Tags",
      items: tags,
      onUpdate: (items: string[]) => form.setFieldValue("Tags", items),
    },
    {
      id: "priorities",
      label: "Priorities",
      items: priorities,
      onUpdate: (items: string[]) => form.setFieldValue("Priorities", items),
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab)!;

  const addItem = () => {
    if (!newItem.trim() || !activeTabData) return;
    if (activeTabData.items.includes(newItem.trim())) return;

    activeTabData.onUpdate([...activeTabData.items, newItem.trim()]);
    setNewItem("");
  };

  const removeItem = (item: string) => {
    if (!activeTabData) return;
    activeTabData.onUpdate(activeTabData.items.filter((i) => i !== item));
  };

  return (
    <>
      <div className="flex">
        <div className="w-48 border-r border-slate-200">
          <nav className="p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
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
                onKeyPress={(e) => e.key === "Enter" && addItem()}
                placeholder={`Add new ${activeTabData?.label
                  .toLowerCase()
                  .slice(0, -1)}`}
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

            {activeTabData.items.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm">
                  No {activeTabData.label.toLowerCase()} configured
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 py-4 px-4 items-end justify-between border-t border-red-200">
        <div className="flex flex-row gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
          >
            Cancel
          </button>
        </div>
        <div className="flex flex-row gap-4">
          <button
            type="button"
            onClick={() => form.reset()}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
          >
            Reset
          </button>
          <button
            type="submit"
            onClick={() => onSubmit(form.state.values)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}
