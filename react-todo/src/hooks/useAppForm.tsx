import {
  createFormHook,
  createFormHookContexts,
  formOptions,
} from "@tanstack/react-form";
import { defaultConfig } from "../util/constants";

const { fieldContext, useFieldContext, formContext } = createFormHookContexts();

const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {},
  formComponents: {},
  fieldContext,
  formContext,
});
export const settingsFormOpts = formOptions({
  defaultValues: defaultConfig,
});

export { useFieldContext, useAppForm, withForm, withFieldGroup };
