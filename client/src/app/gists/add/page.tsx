'use client';

import Editor from '@/components/Editor';
import { useState } from 'react';

export default function AddGist() {
  const [editorState, setEditorState] = useState<string[]>(['']);

  function handleEditorChange(docState: string[]) {
    setEditorState(docState);
  }

  // TODO: add custom arrow to select controls
  // TODO: wire up to formik

  return (
    <main className="flex flex-col w-full h-full p-4 items-center text-primary-white">
      <form className="flex flex-col w-full flex-1 gap-4 max-w-4xl">
        <div>
          <input
            type="text"
            name="description"
            id="description"
            placeholder="Gist description"
            className="w-full rounded-md p-2 text-sm bg-secondary-gray text-primary-white border border-gray-600"
          />
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex items-start justify-between p-4 bg-secondary-gray border border-gray-600 rounded-t-md">
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Gist name"
              className="rounded-md p-2 text-sm bg-primary-gray text-primary-white border border-gray-600"
            />
            <div className="flex gap-4">
              <select
                defaultValue={'2'}
                name=""
                id=""
                className="rounded-md px-2 py-1 text-sm bg-primary-gray text-primary-white border border-gray-600 appearance-none"
              >
                <optgroup label="Indent Size">
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="8">8</option>
                </optgroup>
              </select>
              <select
                name=""
                id=""
                className="rounded-md px-2 py-1 text-sm bg-primary-gray text-primary-white border border-gray-600 appearance-none"
                defaultValue={'no-wrap'}
              >
                <optgroup label="Line Wrap Mode">
                  <option value="no-wrap">No wrap</option>
                  <option value="soft-wrap">Soft wrap</option>
                </optgroup>
              </select>
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
            <select
              name=""
              id=""
              className="rounded-md px-2 py-1 text-sm bg-secondary-gray text-primary-white border border-gray-600 appearance-none"
              defaultValue={'private'}
            >
              <optgroup label="Visibility">
                <option value="private">Private</option>
                <option value="public">Public</option>
              </optgroup>
            </select>
            <button
              type="submit"
              className="flex items-center gap-2 bg-primary-green px-2 py-1 text-sm font-semibold rounded-md hover:bg-secondary-green disabled:bg-secondary-gray"
            >
              Create gist
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
