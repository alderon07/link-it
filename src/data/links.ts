/**
 * Links data access layer with Zod validation
 */
import { z } from 'zod';

// Define Zod schemas for validation
export const LinkSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  url: z.string().url("Please enter a valid URL"),
});

export const CreateLinkSchema = LinkSchema.omit({ id: true });
export const UpdateLinkSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  url: z.string().url("Please enter a valid URL"),
});

// Define types from schemas
export type Link = z.infer<typeof LinkSchema>;
export type CreateLinkInput = z.infer<typeof CreateLinkSchema>;
export type UpdateLinkInput = z.infer<typeof UpdateLinkSchema>;

// Mock data - in a real app, this would be fetched from a database
const links: Link[] = [
  {
    id: '1',
    title: 'Google',
    url: 'https://google.com',
  },
  {
    id: '2',
    title: 'Facebook',
    url: 'https://facebook.com',
  },
  {
    id: '3',
    title: 'Twitter',
    url: 'https://twitter.com',
  },
  {
    id: '4',
    title: 'Instagram',
    url: 'https://instagram.com',
  },
];

// Custom error class for validation errors
export class ValidationError extends Error {
  errors: z.ZodError;
  
  constructor(errors: z.ZodError) {
    super('Validation error');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

// Get all links
export async function getAllLinks(): Promise<Link[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return links;
}

// Get a specific link by ID
export async function getLinkById(id: string): Promise<Link | null> {
  // Validate input
  const validatedId = z.string().safeParse(id);
  if (!validatedId.success) {
    throw new ValidationError(validatedId.error);
  }
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  const link = links.find((link) => link.id === id);
  return link || null;
}

// Create a new link
export async function createLink(data: CreateLinkInput): Promise<Link> {
  // Validate input
  const validationResult = CreateLinkSchema.safeParse(data);
  if (!validationResult.success) {
    throw new ValidationError(validationResult.error);
  }
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const newLink: Link = {
    id: String(links.length + 1),
    title: validationResult.data.title,
    url: validationResult.data.url,
  };
  
  links.push(newLink);
  return newLink;
}

// Update an existing link
export async function updateLink(data: UpdateLinkInput): Promise<Link | null> {
  // Validate input
  const validationResult = UpdateLinkSchema.safeParse(data);
  if (!validationResult.success) {
    throw new ValidationError(validationResult.error);
  }
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const linkIndex = links.findIndex((link) => link.id === data.id);
  if (linkIndex === -1) {
    return null;
  }
  
  links[linkIndex] = {
    ...links[linkIndex],
    title: validationResult.data.title,
    url: validationResult.data.url,
  };
  
  return links[linkIndex];
}

// Delete a link
export async function deleteLink(id: string): Promise<Link | null> {
  // Validate input
  const validatedId = z.string().safeParse(id);
  if (!validatedId.success) {
    throw new ValidationError(validatedId.error);
  }
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const linkIndex = links.findIndex((link) => link.id === id);
  if (linkIndex === -1) {
    return null;
  }
  
  const deletedLink = links[linkIndex];
  links.splice(linkIndex, 1);
  return deletedLink;
} 