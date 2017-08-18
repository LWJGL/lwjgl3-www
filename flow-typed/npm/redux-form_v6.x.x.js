import * as React from 'react';

declare module 'redux-form' {
  declare type FieldData = void | null | boolean | string | number | Date;

  declare type FieldValues = {
    [field: string]: FieldData,
  };

  declare type ErrorObject = FieldValues;
  declare type WarningsObject = FieldValues;

  declare type FormConfig = {
    form: string,
    alwaysAsyncValidate?: boolean,
    asyncBlurFields?: Array<string>,
    asyncValidate?: (values: {}, dispatch: Function, props: {}, blurredField: string) => Promise<void>,
    destroyOnUnmount?: boolean,
    enableReinitialize?: boolean,
    forceUnregisterOnUnmount?: boolean,
    getFormState?: () => mixed,
    keepDirtyOnReinitialize?: boolean,
    initialValues?: FieldValues,
    onChange?: (values: FieldValues, dispatch: Function, props: FormProps) => void,
    onSubmit?: (values: FieldValues, dispatch: Function, props: FormProps) => Promise<void> | Error | true,
    onSubmitFail?: (errors: ErrorObject, dispatch: Function, submitError: Error | null, props: FormProps) => void,
    onSubmitSuccess?: (result: any, dispatch: Function, props: FormProps) => void,
    propNamespace?: string,
    pure?: boolean,
    shouldValidate?: (
      values: FieldValues,
      nextProps: FormProps,
      props: FormProps,
      initialRender: boolean,
      structure: {}
    ) => boolean,
    shouldAsyncValidate?: (
      asyncErrors: {},
      initialized: boolean,
      trigger: string,
      blurredField: string,
      pristine: boolean,
      syncValidationPasses: boolean
    ) => boolean,
    touchOnBlur?: boolean,
    touchOnChange?: boolean,
    persistentSubmitErrors?: boolean,
    validate?: (values: FieldValues, props: FormProps) => ErrorObject,
    warn?: (values: FieldValues, props: FormProps) => WarningsObject,
  };

  declare type PreboundActionCreators = {
    /**
     * Inserts a value into the given array field in your form.
     * This is a bound action creator, so it returns nothing.
     */
    insert: (field: string, index: number, value: any) => void,
    /**
     * Moves a value at the given from index to the given to index in the given array field in your form.
     * This is a bound action creator, so it returns nothing.
     */
    move: (field: string, from: number, to: number) => void,
    /**
     * Pops a value off of the end of a given array field in your form.
     * This is a bound action creator, so it returns nothing.
     */
    pop: (field: string) => void,
    /**
     * Pushes the given value onto the end of the given array field in your form.
     * This is a bound action creator, so it returns nothing.
     */
    push: (field: string, value: any) => void,
    /**
     * Removes a value at the given index from the given array field in your form.
     * This is a bound action creator, so it returns nothing.
     */
    remove: (field: string, index: number) => void,
    /**
     * Removes all the values from the given array field in your form.
     * This is a bound action creator, so it returns nothing.
     */
    removeAll: (field: string) => void,
    /**
     * Shifts a value out of the beginning of the given array in your form.
     * This is a bound action creator, so it returns nothing.
     */
    shift: (field: string) => void,
    /**
     * Performs an Array.splice operation on the given array in your form.
     * This is a bound action creator, so it returns nothing.
     */
    splice: (field: string, index: number, removeNum: number, value: any) => void,
    /**
     * Swaps two values at the given indexes of the given array field in your form.
     * This is a bound action creator, so it returns nothing.
     */
    swap: (field: string, indexA: number, indexB: number) => void,
    /**
     * Unshifts the given value into the beginning of the given array field in your form.
     * This is a bound action creator, so it returns nothing.
     */
    unshift: (field: string, value: any) => void,
  };

  declare type FormProps = {
    anyTouched: boolean,
    array: PreboundActionCreators,
    asyncValidate: (values: {}, dispatch: Function, props: {}) => Promise<void>,
    /**
     * This value will be either:
     *  false - No asynchronous validation is currently happening
     *  true - Asynchronous validation is currently running in preparation to submit a form
     *  a string - The name of the field that just blurred to trigger asynchronous validation
     */
    asyncValidating: string | boolean,
    /**
     * Sets the value and marks the field as autofilled in the Redux Store.
     * This is useful when a field needs to be set programmatically, but in a way that lets the user know
     * (via a styling change using the autofilled prop in Field) that it has been autofilled for them programmatically.
     * This is a bound action creator, so it returns nothing.
     */
    autofill: (field: string, value: any) => void,
    blur: (field: string, value: any) => void,
    change: (field: string, value: any) => void,
    clearAsyncError: (field: string, value: any) => void,
    destroy: () => void,
    dirty: boolean,
    error: any,
    form: string,
    handleSubmit: (data: FieldValues) => Promise<void> | Error | true,
    initialize: (data: FieldValues) => void,
    initialized: boolean,
    initialValues: FieldValues,
    invalid: boolean,
    pristine: boolean,
    reset: () => void,
    submitFailed: boolean,
    submitSucceeded: boolean,
    submitting: boolean,
    touch: (...fields: Array<string>) => void,
    untouch: (...fields: Array<string>) => void,
    valid: boolean,
    warning: any,
  };

  declare type InputEventOrValue = SyntheticEvent<HTMLElement> | FieldData;

  declare type InputProps = {
    checked: boolean,
    name: string,
    onBlur(eventOrValue: InputEventOrValue): mixed,
    onChange(eventOrValue: InputEventOrValue): mixed,
    onDragStart(event: DragEvent): mixed,
    onDrop(event: DragEvent): mixed,
    onFocus(event: FocusEvent): mixed,
    value: FieldData,
  };

  declare type InputMeta = {
    active: boolean,
    autofilled: boolean,
    asyncValidating: boolean,
    dirty: boolean,
    dispatch: Function,
    error?: string,
    form: string,
    invalid: boolean,
    pristine: boolean,
    submitting: boolean,
    submitFailed: boolean,
    touched: boolean,
    valid: boolean,
    visited: boolean,
    warning?: string,
  };

  // <Field />
  declare type FieldProps = {
    name: string,
    component: React.ElementType,
    format?: (value: any, name: string) => string,
    normalize?: (value: any, previousValue: any, allValues: {}, previousAllValues: {}) => any,
    onBlur?: (event: SyntheticEvent<HTMLElement>, newValue: any, previousValue: any) => void,
    onChange?: (event: SyntheticEvent<HTMLElement>, newValue: any, previousValue: any) => void,
    onDragStart?: (event: SyntheticEvent<HTMLElement>) => void,
    onDrop?: (event: SyntheticEvent<HTMLElement>, newValue: any, previousValue: any) => void,
    onFocus?: (event: SyntheticEvent<HTMLElement>) => void,
    props?: {},
    parse?: (value: string, name: string) => any,
    validate?: (value: string, allValues: {}, props: {}) => string | Error | void,
    warn?: (value: string, allValues: {}, props: {}) => string | Error | void,
    /**
     * If true, the rendered component will be available with the getRenderedComponent() method. Defaults to false.
     * Cannot be used if your component is a stateless function component.
     */
    withRef?: boolean,
  };
  declare var Field: React.Component<FieldProps, void>;

  // <Fields />
  declare type FieldsProps = {
    name: string,
    component: React.ElementType,
    format?: (value: any, name: string) => string,
    props?: {},
    parse?: (value: string, name: string) => any,
    withRef?: boolean,
  };
  declare var Fields: React.Component<FieldsProps, void>;

  // <FieldArray />
  declare type FieldArrayProps = {
    name: string,
    component: React.ElementType,
    format?: (value: any, name: string) => string,
    validate?: (value: string, allValues: {}, props: {}) => string | Error | void,
    warn?: (value: string, allValues: {}, props: {}) => string | Error | void,
    withRef?: boolean,
    props?: {},
  };
  declare var FieldArray: React.Component<FieldArrayProps, void>;

  // <Form />
  declare type FormElementProps = {
    onSubmit?: (values: FieldValues, dispatch: Function, props: FormProps) => Promise<void> | Error | true,
  };
  declare var Form: HTMLFormElement & React.Component<FormElementProps, void>;

  // <FormSection />
  declare type FormSectionProps = {
    name: string,
    component?: React.ElementType,
  };
  declare var FormSection: React.Component<FormSectionProps, void>;

  declare function reduxForm(config: FormConfig): (component: React.ComponentType<any>) => React.ComponentType<any>;

  declare function reducer(state: any, action: {}): any;
  declare function getValues(state: any): any;
  declare var SubmissionError: Class<Error>;

  declare type FormValueSelector = (state: any, ...fields: Array<string>) => any;
  declare type GetFormState = (state: any) => any;
  declare function formValueSelector(form: string, getFormState?: GetFormState): FormValueSelector;

  /*
    Selectors
  */

  // Gets the form values. Shocking, right?
  declare function getFormValues(formName: string): (state: any) => {};

  // Gets the form's initial values.
  declare function getFormInitialValues(formName: string): (state: any) => {};

  // Returns the form synchronous validation errors.
  declare function getFormSyncErrors(formName: string): (state: any) => {};

  // Returns the form's fields meta data, namely touched and visited.
  declare function getFormMeta(formName: string): (state: any) => {};

  // Returns the form asynchronous validation errors.
  declare function getFormAsyncErrors(formName: string): (state: any) => {};

  // Returns the form synchronous warnings.
  declare function getFormSyncWarnings(formName: string): (state: any) => {};

  // Returns the form submit validation errors.
  declare function getFormSubmitErrors(formName: string): (state: any) => {};

  // Gets the names of all the forms currently managed by Redux-Form.
  // The reason that this is a function that returns a function is twofold:
  // - symmetry with the other selectors
  // - to allow for the getFormState parameter described at the top of this page.
  // - If you are using ImmutableJS, it will return a List.
  declare function getFormNames(): (state: any) => Array<string>;

  // Returns true if the form is dirty, i.e. the values have been altered from the original initialValues provided. The opposite of isPristine.
  declare function isDirty(formName: string): (state: any) => boolean;

  // Returns true if the form is pristine, i.e. the values have NOT been altered from the original initialValues provided. The opposite of isDirty.
  declare function isPristine(formName: string): (state: any) => boolean;

  // Returns true if the form is valid, i.e. has no sync, async, or submission errors. The opposite of isInvalid.
  declare function isValid(formName: string): (state: any) => boolean;

  // Returns true if the form is invalid, i.e. has sync, async, or submission errors. The opposite of isValid.
  declare function isInvalid(formName: string): (state: any) => boolean;

  // Returns true if the form is submitting.
  declare function isSubmitting(formName: string): (state: any) => boolean;

  // Returns true if the form has previously been successfully submitted.
  declare function hasSubmitSucceeded(formName: string): (state: any) => boolean;

  // Returns true if the form has previously failed to submit.
  declare function hasSubmitFailed(formName: string): (state: any) => boolean;

  /*
    Action Creators - DO NOT USE
  */

  declare function arrayInsert(form: string, field: string, index: number, value: any): any;
  declare function arrayMove(form: string, field: string, from: number, to: number): any;
  declare function arrayPop(form: string, field: string): any;
  declare function arrayPush(form: string, field: string, value: any): any;
  declare function arrayRemove(form: string, field: string, index: number): any;
  declare function arrayRemoveAll(form: string, field: string): any;
  declare function arrayShift(form: string, field: string): any;
  declare function arraySplice(form: string, field: string, index: number, removeNum: number, value: any): any;
  declare function arraySwap(form: string, field: string, indexA: number, indexB: number): any;
  declare function arrayUnshift(form: string, field: string, value: any): any;

  // Saves the value to the field and sets its autofilled property to true.
  declare function autofill(form: string, field: string, value: string): any;

  // Saves the value to the field.
  declare function blur(form: string, field: string, value: any): any;

  // Saves the value to the field.
  declare function change(form: string, field: string, value: any): any;

  // Destroys the forms, removing all of their state.
  declare function destroy(...forms: Array<string>): any;

  // Marks the given field as active and visited.
  declare function focus(form: string, field: string): any;

  // Sets the initial values in the form with which future data values will be compared to calculate dirty and pristine. The data parameter may contain deep nested array and object values that match the shape of your form fields.
  // If the keepDirty parameter is true, the values of currently dirty fields will be retained to avoid overwriting user edits. (keepDirty can appear as either the third argument, or a property of options as the 3rd or 4th argument, for the sake of backwards compatibility).
  // If the keepSubmitSucceeded parameter is true, it will not clear the submitSucceeded flag if it is set.
  declare type InitOptions = {
    keepDirty: boolean,
    keepSubmitSucceeded: boolean,
  };
  declare function initialize(form: string, data: {}, keepDirty?: boolean, options?: InitOptions): any;

  // Registers a field with the form. The type parameter can be Field or FieldArray.
  declare function registerField(form: string, name: string, type: string): any;

  // Resets the values in the form back to the values past in with the most recent initialize action.
  declare function reset(form: string): any;

  // Flips the asyncValidating flag true.
  declare function startAsyncValidation(form: string): any;

  // Flips the submitting flag true.
  declare function startSubmit(form: string): any;

  // Flips the submitting flag false and populates submitError for each field.
  declare function stopSubmit(form: string, errors: {}): any;

  // Flips the asyncValidating flag false and populates asyncError for each field.
  declare function stopAsyncValidation(form: string, errors: {}): any;

  // Triggers a submission of the specified form.
  declare function submit(form: string): any;

  // Marks all the fields passed in as touched.
  declare function touch(form: string, ...fields: Array<string>): any;

  // Unregisters a field with the form.
  declare function unregisterField(form: string, name: string): any;

  // Resets the 'touched' flag for all the fields passed in.
  declare function untouch(form: string, ...fields: Array<string>): any;
}
