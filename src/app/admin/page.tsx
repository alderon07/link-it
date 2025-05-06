'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/utils/trpc';

export default function AdminPage() {
  const router = useRouter();
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [editingLink, setEditingLink] = useState<{
    id: string;
    title: string;
    url: string;
  } | null>(null);

  const { data: links, isLoading } = trpc.links.getAll.useQuery();
  const addLinkMutation = trpc.links.create.useMutation({
    onSuccess: () => {
      setNewLink({ title: '', url: '' });
      utils.links.getAll.invalidate();
    },
  });
  const updateLinkMutation = trpc.links.update.useMutation({
    onSuccess: () => {
      setEditingLink(null);
      utils.links.getAll.invalidate();
    },
  });
  const deleteLinkMutation = trpc.links.delete.useMutation({
    onSuccess: () => {
      utils.links.getAll.invalidate();
    },
  });

  const utils = trpc.useUtils();

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLink.title && newLink.url) {
      addLinkMutation.mutate(newLink);
    }
  };

  const handleUpdateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLink) {
      updateLinkMutation.mutate(editingLink);
    }
  };

  const handleDeleteLink = (id: string) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      deleteLinkMutation.mutate({ id });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Manage Links</h1>
      
      {/* Add New Link Form */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Add New Link</h2>
        <form onSubmit={handleAddLink} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newLink.title}
              onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="url"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={addLinkMutation.isPending}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {addLinkMutation.isPending ? 'Adding...' : 'Add Link'}
            </button>
          </div>
        </form>
      </div>

      {/* Edit Link Form */}
      {editingLink && (
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Edit Link</h2>
          <form onSubmit={handleUpdateLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={editingLink.title}
                onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">URL</label>
              <input
                type="url"
                value={editingLink.url}
                onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={updateLinkMutation.isPending}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {updateLinkMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditingLink(null)}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Links List */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Your Links</h2>
        {isLoading ? (
          <p>Loading links...</p>
        ) : !links || links.length === 0 ? (
          <p>No links found. Add some links above.</p>
        ) : (
          <div className="space-y-3">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div>
                  <h3 className="font-medium">{link.title}</h3>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {link.url}
                  </a>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingLink(link)}
                    className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                    disabled={deleteLinkMutation.isPending}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
