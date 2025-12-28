import NewTextInput from "./NewTextInput";
import { MINUS } from "../../util/icons";
import { useFieldContext } from "../../hooks/useAppForm";

export function MultiTextInputs({
  label,
  sideEffect,
}: {
  label: keyof TodoConfig;
  sideEffect?: SideEffect;
}) {
  const field = useFieldContext<string[]>();
  const values = field.state.value ?? [];

  const addItem = (item: string) => {
    if (!field.state.value.includes(item)) {
      field.pushValue(item);
      sideEffect?.({ key: label, newValue: item, type: "ADD" });
    }
  };

  const updateItem = (index: number, item: string) => {
    sideEffect?.({
      key: label,
      oldValue: field.state.value[index],
      newValue: item,
      type: "UPDATE",
    });
    field.replaceValue(index, item);
  };

  const deleteItem = (index: number) => {
    sideEffect?.({
      key: label,
      oldValue: field.state.value[index],
      type: "DELETE",
    });
    field.removeValue(index);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="pl-6 pr-8 py-4 flex-1 min-w-sm overflow-auto flex flex-col gap-2">
      <h3 className="px-2 text-lg font-medium text-slate-800">
        Manage {field.name}
      </h3>

      <div className="flex flex-col gap-4 max-h-72 p-2 overflow-y-auto">
        <NewTextInput label={field.name} onAdd={addItem} />
        {values.map((value, index) => (
          <div key={index} className="flex space-x-4">
            <input
              name={`${label}${index}`}
              type="text"
              value={value}
              onChange={(e) => updateItem(index, e.target.value)}
              onKeyDown={onKeyDown}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => deleteItem(index)}
              className="cursor-pointer px-4 py-2 text-red-500 bg-red-100 hover:bg-red-200 rounded-lg"
            >
              {MINUS}
            </button>
          </div>
        ))}

        {field.state.value.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <p className="text-sm">No {field.name.toLowerCase()} configured</p>
          </div>
        )}
      </div>
    </div>
  );
}
