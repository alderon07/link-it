interface LinkEditorProps {
  defaultValues: {
    title: string;
    url: string;
  };
}

export function LinkEditor({ defaultValues }: LinkEditorProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-start gap-4">
        <div className="grow space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              defaultValue={defaultValues.title}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="url"
              defaultValue={defaultValues.url}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="rounded bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
            title="Move"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
              />
            </svg>
          </button>
          <button
            type="button"
            className="rounded bg-red-50 p-2 text-red-600 hover:bg-red-100"
            title="Delete"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 