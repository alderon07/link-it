'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAllLinks, 
  createLink, 
  updateLink, 
  deleteLink
} from '@/data/links/linkDAL';
import { type Link } from '@/lib/validate/links';
import { ValidationError } from '@/lib/validate/ValidationError';

export default function AdminPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  // Fetch links
  useEffect(() => {
    async function fetchLinks() {
      try {
        setIsLoading(true);
        setValidationErrors({});
        const data = await getAllLinks();
        setLinks(data);
      } catch (error) {
        console.error('Error loading links:', error);
        handleValidationError(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLinks();
  }, []);

  // Helper function to handle validation errors
  const handleValidationError = (error: unknown) => {
    if (error instanceof ValidationError) {
      const fieldErrors = error.errors.flatten().fieldErrors;
      const typedErrors: Record<string, string[]> = {};
      
      Object.entries(fieldErrors).forEach(([key, value]) => {
        if (value) {
          typedErrors[key] = value;
        }
      });
      
      setValidationErrors(typedErrors);
      return true;
    }
    return false;
  };

  // Handle adding a new link
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newLink.title && newLink.url) {
      try {
        setIsSubmitting(true);
        setValidationErrors({});
        const createdLink = await createLink({ ...newLink, userId: 1 });
        setLinks((prevLinks) => [...prevLinks, createdLink]);
        setNewLink({ title: '', url: '' });
      } catch (error) {
        console.error('Error creating link:', error);
        if (!handleValidationError(error)) {
          alert('Failed to create link. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handle updating a link
  const handleUpdateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLink) {
      try {
        setIsSubmitting(true);
        setValidationErrors({});
        const updatedLink = await updateLink(editingLink);
        if (updatedLink) {
          setLinks((prevLinks) =>
            prevLinks.map((link) =>
              link.id === updatedLink.id ? updatedLink : link
            )
          );
          setEditingLink(null);
        }
      } catch (error) {
        console.error('Error updating link:', error);
        if (!handleValidationError(error)) {
          alert('Failed to update link. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handle deleting a link
  const handleDeleteLink = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        setIsSubmitting(true);
        setValidationErrors({});
        const deletedLink = await deleteLink(id);
        if (deletedLink) {
          setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
        }
      } catch (error) {
        console.error('Error deleting link:', error);
        if (!handleValidationError(error)) {
          alert('Failed to delete link. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Render validation errors
  const renderValidationErrors = () => {
    if (Object.keys(validationErrors).length === 0) return null;
    
    return (
      <div className="mb-4 rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Validation errors</h3>
            <div className="mt-2 text-sm text-red-700">
              <ul className="list-disc space-y-1 pl-5">
                {Object.entries(validationErrors).map(([field, errors]) => (
                  errors.map((error, i) => (
                    <li key={`${field}-${i}`}><strong>{field}:</strong> {error}</li>
                  ))
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Manage Links</h1>
      
      {renderValidationErrors()}
      
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
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="url"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isSubmitting ? 'Adding...' : 'Add Link'}
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">URL</label>
              <input
                type="url"
                value={editingLink.url}
                onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-indigo-500"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditingLink(null)}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
          <div className="space-y-3 text-wrap">
            {links.map((link) => (
              <div
                key={link.id}
                className="flex items-center flex-wrap justify-between rounded-lg border border-gray-200 p-4"
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
                    className="rounded bg-primary text-text px-3 py-1 text-sm hover:bg-secondary hover:text-text-muted"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="rounded bg-danger px-3 py-1 text-sm text-white hover:bg-red-600"
                    disabled={isSubmitting}
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
