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
import dummyData from '@/dummy.json';

// Ensure consistent type compatibility
interface LinkData {
  id: number;
  userId: number;
  title: string;
  url: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Data source - map data to ensure all required fields have defaults
const links: LinkData[] = dummyData.links.map(link => ({
  ...link,
  description: link.description || '',
  createdAt: link.createdAt || new Date().toISOString(),
  updatedAt: link.updatedAt || new Date().toISOString()
}));

// Get all links from data source
export async function getAllLinks(): Promise<Link[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return links as Link[];
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
  const link = links.find(link => link.id === id);
  return link ? (link as Link) : null;
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
  
  // Create new link with all required fields
  const newLink: LinkData = {
    id: links.length + 1,
    ...validationResult.data,
    description: data.description || '',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString()
  };
  
  links.push(newLink);
  return newLink as Link;
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
  
  const linkIndex = links.findIndex(link => link.id === data.id);
  if (linkIndex === -1) {
    return null;
  }
  
  links[linkIndex] = {
    ...links[linkIndex],
    ...(data.title && { title: data.title }),
    ...(data.url && { url: data.url }),
    ...(data.description !== undefined && { description: data.description || '' }),
    updatedAt: data.updatedAt || new Date().toISOString()
  };
  
  return links[linkIndex] as Link;
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
  
  const linkIndex = links.findIndex(link => link.id === id);
  if (linkIndex === -1) {
    return null;
  }
  
  const deletedLink = links[linkIndex];
  links.splice(linkIndex, 1);
  return deletedLink as Link;
} 