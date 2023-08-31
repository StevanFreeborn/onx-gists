'use client';

import { Formik } from 'formik';
import { useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { object } from 'yup';
import Editor from './Editor';

export default function GistForm() {
  const [editorState, setEditorState] = useState<string[]>(['']);

  function handleEditorChange(docState: string[]) {
    setEditorState(docState);
  }

  const formFields = {
    name: '',
    description: '',
    visibility: 'private',
    lineWrapMode: 'no-wrap',
    indentSize: 2,
  };

  const formFieldKeys = Object.keys(formFields).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: curr,
    }),
    {}
  ) as {
    [k in keyof typeof formFields]: k;
  };

  // TODO: Define valiation
  const validationSchema = object();

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
            <div className="flex items-start justify-between p-4 bg-secondary-gray border border-gray-600 rounded-t-md">
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
                      <option value="no-wrap">No wrap</option>
                      <option value="soft-wrap">Soft wrap</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>
            <Editor
              docState={editorState}
              setDocState={handleEditorChange}
              className="border-x border-gray-600"
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
                >
                  <optgroup label="Visibility">
                    <option value="private">Private</option>
                    <option value="public">Public</option>
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
