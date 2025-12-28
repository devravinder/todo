/* eslint-disable @typescript-eslint/no-empty-object-type */
import { withFieldGroup } from "../../hooks/useAppForm";
import { defaultConfig } from "../../util/constants";
import ColorPicker from "./ColorPicker";

export type Color = { "text-color": string; "bg-color": string };

export const PriorityColors = withFieldGroup({
  defaultValues: defaultConfig["Priority Colors"],
  render: function Render({ group }) {
    return (
      <div className="px-4 py-4 flex-1 min-w-sm overflow-auto">
        <h3 className="px-2 text-lg font-medium text-slate-800">
          Manage Colors
        </h3>
        <div className="flex flex-col gap-4 max-h-72 p-2 overflow-y-auto">
          {Object.keys(group.state.values).map((key) => (
            <div key={key} className=" py-4 px-4 rounded-lg border border-slate-200 shadow-md">
              <group.Field name={key}>
                {(field) => (
                  <ColorPicker
                    label={key}
                    color={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              </group.Field>
            </div>
          ))}
        </div>
      </div>
    );
  },
});
