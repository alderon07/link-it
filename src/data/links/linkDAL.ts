/**
 * Links data access layer with Zod validation
 */
import { 
  CreateLinkSchema, 
  UpdateLinkSchema,
  IdSchema,
  type Link,
  type CreateLinkInput,
  type UpdateLinkInput
} from '@/lib/validate/links';
import { ValidationError } from '@/lib/validate/ValidationError';

// Data source
const links = require('@/dummy.json').links;

// Get all links from data source
export async function getAllLinks(): Promise<Link[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return links;
}

// Get a specific link by ID
export async function getLinkById(id: number): Promise<Link | null> {
  // Validate input
  const validatedId = IdSchema.safeParse(id);
  if (!validatedId.success) {
    throw new ValidationError(validatedId.error);
  }
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  // fetch from database
  const link = links.find((link: Link) => link.id === id);
  return link || null;
}

// Create a new link
export async function createLink(data: CreateLinkInput & {createdAt?: string, updatedAt?: string }): Promise<Link> {
  // Validate core data (title, url)
  const validationResult = CreateLinkSchema.safeParse(data);
  if (!validationResult.success) {
    throw new ValidationError(validationResult.error);
  }
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  const newLink: Link = {
    id: links.length + 1,
    ...validationResult.data,
  };
  
  links.push(newLink);
  return newLink;
}

// Update an existing link
export async function updateLink(data: UpdateLinkInput & { updatedAt?: string }): Promise<Link | null> {
  // Validate input
  const validationResult = UpdateLinkSchema.safeParse(data);
  if (!validationResult.success) {
    throw new ValidationError(validationResult.error);
  }
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  const linkIndex = links.findIndex((link: Link) => link.id === data.id);
  if (linkIndex === -1) {
    return null;
  }
  
  links[linkIndex] = {
    ...links[linkIndex],
    ...validationResult.data,
    updatedAt: data.updatedAt || links[linkIndex].updatedAt
  };
  
  return links[linkIndex];
}

// Delete a link
export async function deleteLink(id: number): Promise<Link | null> {
  // Validate input
  const validatedId = IdSchema.safeParse(id);
  if (!validatedId.success) {
    throw new ValidationError(validatedId.error);
  }
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  const linkIndex = links.findIndex((link: Link) => link.id === id);
  if (linkIndex === -1) {
    return null;
  }
  
  const deletedLink = links[linkIndex];
  links.splice(linkIndex, 1);
  return deletedLink;
} 