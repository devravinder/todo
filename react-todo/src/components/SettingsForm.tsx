import { useForm } from "@tanstack/react-form";
import { ADD, MINUS } from "../util/icons";
import { useState } from "react";

type FormData = TodoConfig;

type FormProps = {
  data: FormData;
  onConfigChange : (oldValue: TodoConfig, newValue: TodoConfig) => void;
  onCancel: VoidFunction;
};

type FormArrayKey = ArrayKeys<FormData>;

export default function SettingsForm({ data, onConfigChange, onCancel }: FormProps) {



  const { Field, handleSubmit, reset } = useForm({
    defaultValues: data,
    onSubmit: async ({ value }) => {
      try {
        onConfigChange(data, value);
      } catch (error) {
        console.error("Failed to save task", error);
      }
    },
  });

  const tabs: FormArrayKey[] = Object.keys(data).filter((key) =>
    Array.isArray(data[key as FormArrayKey])
  ) as FormArrayKey[];

  const [activeTab, setActiveTab] = useState<FormArrayKey>(
    tabs[0] as FormArrayKey
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit();
      }}
    >
      <div className="flex">
        <div className="w-48 border-r border-slate-200">
          <nav className="p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <Field name={activeTab} mode="array">
          {(field) => {
            return (
              <div className="p-6 flex-1">
                <h3 className="px-2 text-lg font-medium text-slate-800">
                  Manage {field.name}
                </h3>

                <div className="flex flex-col gap-4 max-h-64 p-2 overflow-y-auto">
                  <NewListInput
                    label={field.name}
                    onAdd={(item) => {
                      if (!field.state.value.includes(item))
                        field.pushValue(item);
                    }}
                  />
                  {field.state.value.map((_, index) => (
                    <div key={index} className="flex space-x-4">
                      <Field
                        name={`${activeTab}[${index}]`}
                      >
                        {(subField) => {
                          return (
                            <input
                              name={subField.name}
                              type="text"
                              value={subField.state.value}
                              onChange={(e) =>
                                subField.handleChange(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                }
                              }}
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          );
                        }}
                      </Field>
                      <button
                        type="button"
                        onClick={() => field.removeValue(index)}
                        className="cursor-pointer px-4 py-2 text-red-500 bg-red-100 hover:bg-red-200 rounded-lg"
                      >
                        {MINUS}
                      </button>
                    </div>
                  ))}

                  {field.state.value.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <p className="text-sm">
                        No {field.name.toLowerCase()} configured
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          }}
        </Field>
      </div>

      <div className="flex gap-4 py-4 px-4 items-end justify-between border-t border-slate-200">
        <div className="flex flex-row gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-200 te-600xt-slate-700 rounded-md hover:bg-slate-300"
          >
            Cancel
          </button>
        </div>
        <div className="flex flex-row gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

const NewListInput = ({
  label,
  onAdd,
}: {
  label: string;
  onAdd: (item: string) => void;
}) => {
  const [newItem, setNewItem] = useState("");
  const addItem = () => {
    const value = newItem.trim();
    if (!value) return;
    onAdd(value);
    setNewItem("");
  };
  return (
    <div className="flex space-x-4">
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addItem();
          }
        }}
        placeholder={`Add new ${label.toLowerCase().slice(0, -1)}`}
        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        onClick={addItem}
        type="button"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-none"
      >
        {ADD}
      </button>
    </div>
  );
};
