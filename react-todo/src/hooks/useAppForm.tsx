import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { MultiTextInputs } from "../components/settings/MultiTextInputs";

const { fieldContext, useFieldContext, formContext } = createFormHookContexts();

const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    MultiTextInputs,
  },
  formComponents: {},
  fieldContext,
  formContext,
});

export { useFieldContext, useAppForm, withForm, withFieldGroup };
