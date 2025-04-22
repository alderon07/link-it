import { LinkEditor } from './components/LinkEditor';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your profile and links</p>
        </div>

        {/* Profile Section */}
        <section className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                defaultValue="@johndoe"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <input
                type="text"
                id="bio"
                name="bio"
                defaultValue="Digital Creator & Tech Enthusiast"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-600 hover:file:bg-indigo-100"
              />
            </div>
          </div>
        </section>

        {/* Links Section */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Your Links</h2>
            <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Add New Link
            </button>
          </div>

          <div className="space-y-4">
            <LinkEditor
              defaultValues={{
                title: 'My Portfolio',
                url: 'https://example.com/portfolio',
              }}
            />
            <LinkEditor
              defaultValues={{
                title: 'Twitter Profile',
                url: 'https://twitter.com/example',
              }}
            />
            <LinkEditor
              defaultValues={{
                title: 'GitHub',
                url: 'https://github.com/example',
              }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
