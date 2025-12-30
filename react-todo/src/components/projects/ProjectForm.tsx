import { useAppForm } from "../../hooks/useAppForm";
import useFileHandle from "../../hooks/useFileHandler";
import type { Project } from "../../hooks/useProject";
import useProject from "../../hooks/useProject";
import { MINUS } from "../../util/icons";
import NewTextInput from "../settings/NewTextInput";

export type ProjectFormData = {
  activeProject: Project;
  projects: Project[];
};

type FormProps = {
  onCancel: VoidFunction;
  data?: ProjectFormData;
};

export default function ProjectForm({ onCancel, data }: FormProps) {
  const { getSampleNewProject } = useProject();

  const form = useAppForm({
    defaultValues: data,
    onSubmit: async ({ value }) => {
      try {
        console.log({ value });
      } catch (error) {
        console.error("Failed to save task", error);
      }
    },
  });

  const { isOpening, openFolder } = useFileHandle();
  const onNewProjectClick = async <
    Field extends { pushValue: (item: Project) => void }
  >(
    field: Field,
    name: string
  ) => {
    const fileHandleResult = await openFolder();

    if ("handle" in fileHandleResult)
      field.pushValue({
        ...getSampleNewProject(fileHandleResult.handle),
        name,
      });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="flex">
        <div className="pl-6 pr-8 py-4 flex-1 min-w-sm overflow-auto flex flex-col gap-2">
          <h3 className="px-2 text-lg font-medium text-slate-800">
            Manage Projects
          </h3>

          <form.Field name={"projects"} mode="array">
            {(field) => {
              return (
                <div className="flex flex-col gap-4 max-h-72 p-4 overflow-y-auto">
                  <NewTextInput
                    label={"project"}
                    onAdd={(item) => onNewProjectClick(field, item)}
                    disabled={isOpening}
                  />
                  {field.state.value.map((_, i) => {
                    return (
                      <form.Field key={i} name={`${label}[${i}]`}>
                        {(subField) => {
                          return (
                            <div className="flex space-x-4">
                              <input
                                name={subField.name}
                                type="text"
                                value={subField.state.value}
                                onChange={(e) =>
                                  subField.handleChange(e.target.value)
                                }
                                onKeyDown={onKeyDown}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  field.removeValue(i);
                                }}
                                className="cursor-pointer px-4 py-2 text-red-500 bg-red-100 hover:bg-red-200 rounded-lg"
                              >
                                {MINUS}
                              </button>
                            </div>
                          );
                        }}
                      </form.Field>
                    );
                  })}
                  {field.state.value.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <p className="text-sm">
                        No {field.name.toLowerCase()} configured
                      </p>
                    </div>
                  )}
                </div>
              );
            }}
          </form.Field>
        </div>
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
            onClick={() => form.reset()}
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
