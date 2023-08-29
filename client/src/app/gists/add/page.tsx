import Editor from '@/components/Editor';

export default function AddGist() {
  return (
    <main className="flex flex-col w-full h-full p-4 items-center text-primary-white">
      <form className="flex flex-col w-full flex-1 gap-4 max-w-4xl">
        <div>
          <input type="text" name="description" id="description" />
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between p-4 bg-secondary-gray border border-gray-600 rounded-t-md">
            <input type="text" name="name" id="name" />
            <div className="flex gap-4">
              <select name="" id="">
                <optgroup label="Indent Size">
                  <option selected value="2">
                    2
                  </option>
                  <option value="4">4</option>
                  <option value="8">8</option>
                </optgroup>
              </select>
              <select name="" id="">
                <optgroup label="Line Wrap Mode">
                  <option selected value="0">
                    No wrap
                  </option>
                  <option value="1">Soft wrap</option>
                </optgroup>
              </select>
            </div>
          </div>
          <Editor className="border-x border-gray-600" />
          <div className="p-2 bg-secondary-gray border border-gray-600 rounded-b-md text-sm">
            <span>Press Escape, then Tab or Shift+Tab to move focus.</span>
          </div>
        </div>
        <div>
          <button>Create gist</button>
        </div>
      </form>
    </main>
  );
}
