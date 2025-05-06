/**
 * Link service layer for business logic
 */
import {
  type Link,
  type CreateLinkInput,
  type UpdateLinkInput
} from '@/lib/validate/links';
import * as linkDAL from './linkDAL';

// Get all links with possible filtering/sorting logic
export async function getAllLinks(): Promise<Link[]> {
  const links = await linkDAL.getAllLinks();
  // Here you could add business logic like sorting, filtering, etc.
  return links;
}

// Get a specific link by ID
export async function getLinkById(id: number): Promise<Link | null> {
  return await linkDAL.getLinkById(id);
}

// Create a new link with business logic
export async function createLink(data: CreateLinkInput & { userId: string }): Promise<Link> {
  // Here you could add business logic before creating
  // For example: validating URL, adding default properties, etc.
  const now = new Date().toISOString();
  
  const linkData = {
    ...data,
    createdAt: now,
    updatedAt: now
  };
  
  return await linkDAL.createLink(linkData);
}

// Update a link with business logic
export async function updateLink(data: UpdateLinkInput): Promise<Link | null> {
  // Here you could add business logic before updating
  // For example: checking permissions, validating changes, etc.
  
  const updatedData = {
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  return await linkDAL.updateLink(updatedData);
}

// Delete a link with business logic
export async function deleteLink(id: number): Promise<Link | null> {
  // Here you could add business logic before deleting
  // For example: checking if link can be deleted, etc.
  
  return await linkDAL.deleteLink(id);
}

// Example of additional business logic
export async function searchLinks(query: string): Promise<Link[]> {
  const links = await linkDAL.getAllLinks();
  
  // Business logic for searching
  if (!query) return links;
  
  const lowerQuery = query.toLowerCase();
  return links.filter(link => 
    link.title.toLowerCase().includes(lowerQuery) || 
    link.url.toLowerCase().includes(lowerQuery) ||
    (link.description && link.description.toLowerCase().includes(lowerQuery))
  );
}

// Example of additional business logic
export async function getLinksByUser(userId: number): Promise<Link[]> {
  const links = await linkDAL.getAllLinks();
  
  // Business logic for filtering by user
  return links.filter(link => link.userId === userId);
}
