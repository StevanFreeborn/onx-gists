'use client';

import { getKeysFromObject, toTitleCase } from '@/utils/utils';
import { Formik } from 'formik';
import { useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { object, string } from 'yup';
import Editor from './Editor';

enum Visibility {
  private = 'private',
  public = 'public',
}

enum LineWrapMode {
  noWrap = 'noWrap',
  softWrap = 'softWrap',
}

enum IndentSize {
  two = 2,
  four = 4,
  eight = 8,
}

export default function GistForm() {
  const [editorState, setEditorState] = useState<string[]>(['']);

  function handleEditorChange(docState: string[]) {
    setEditorState(docState);
  }

  const formFields = {
    name: '',
    description: '',
    visibility: Visibility.private,
    lineWrapMode: LineWrapMode.noWrap,
    indentSize: IndentSize.two,
  };

  const formFieldKeys = getKeysFromObject(formFields);

  // TODO: Define valiation
  const validationSchema = object({
    [formFieldKeys.name]: string()
      .required(`${toTitleCase(formFieldKeys.name)} is required`)
      .max(
        150,
        `${toTitleCase(formFieldKeys.name)} should be 150 characters or less`
      ),
    [formFieldKeys.description]: string()
      .required(`${toTitleCase(formFieldKeys.description)} is required`)
      .max(
        5000,
        `${toTitleCase(
          formFieldKeys.description
        )} should be 5000 characters or less`
      ),
    [formFieldKeys.visibility]: string()
      .required(`${toTitleCase(formFieldKeys.visibility)} is required`)
      .oneOf(Object.values(Visibility)),
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={formFields}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          // TODO: Post data to server
          await new Promise(resolve => setTimeout(resolve, 2000));
          console.log({ ...values, editorState });
          // TODO: Redirect to newly created gist page
        } catch (error) {
          // TODO: Display server side errors
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        handleSubmit,
        handleChange,
        handleBlur,
      }) => (
        // TODO: display validation errors
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full flex-1 gap-4 max-w-4xl"
        >
          <div>
            <input
              type="text"
              name="description"
              id="description"
              placeholder="Gist description"
              className="w-full rounded-md p-2 text-sm bg-secondary-gray text-primary-white border border-gray-600"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex items-start justify-between px-4 py-2 bg-secondary-gray border border-gray-600 rounded-t-md">
              <input
                type="text"
                name={formFieldKeys.name}
                id={formFieldKeys.name}
                placeholder="Gist name"
                className="rounded-md p-2 text-sm bg-primary-gray text-primary-white border border-gray-600"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <div className="flex gap-4">
                <div className="flex items-center justify-center rounded-md border border-gray-600">
                  <select
                    value={values.indentSize}
                    name={formFieldKeys.indentSize}
                    id={formFieldKeys.indentSize}
                    className="rounded-md px-2 py-1 text-sm bg-primary-gray text-primary-white border-r-8 border-transparent"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <optgroup label="Indent Size">
                      <option value="2">2</option>
                      <option value="4">4</option>
                      <option value="8">8</option>
                    </optgroup>
                  </select>
                </div>
                <div className="flex items-center justify-center rounded-md border border-gray-600">
                  <select
                    name={formFieldKeys.lineWrapMode}
                    id={formFieldKeys.lineWrapMode}
                    className="rounded-md px-2 py-1 text-sm bg-primary-gray text-primary-white border border-r-8 border-transparent"
                    value={values.lineWrapMode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <optgroup label="Line Wrap Mode">
                      <option value={LineWrapMode.noWrap}>
                        {toTitleCase(LineWrapMode.noWrap)}
                      </option>
                      <option value={LineWrapMode.softWrap}>
                        {toTitleCase(LineWrapMode.softWrap)}
                      </option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>
            <Editor
              docState={editorState}
              setDocState={handleEditorChange}
              className="border-x border-gray-600 h-0"
            />
            <div className="p-2 bg-secondary-gray border border-gray-600 rounded-b-md text-sm">
              <span>Press Escape, then Tab or Shift+Tab to move focus.</span>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-md border border-gray-600">
                <select
                  name={formFieldKeys.visibility}
                  id={formFieldKeys.visibility}
                  className="rounded-md px-2 py-1 text-sm bg-secondary-gray text-primary-white border-r-8 border-transparent"
                  value={values.visibility}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <optgroup label="Visibility">
                    <option value={Visibility.private}>
                      {toTitleCase(Visibility.private)}
                    </option>
                    <option value={Visibility.public}>
                      {toTitleCase(Visibility.public)}
                    </option>
                  </optgroup>
                </select>
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 bg-primary-green px-2 py-1 text-sm font-semibold rounded-md hover:bg-secondary-green disabled:bg-secondary-gray"
              >
                {isSubmitting ? (
                  <CgSpinner className="animate-spin w-5 h-5" />
                ) : null}
                Create gist
              </button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
}
