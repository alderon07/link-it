/**
 * Type definitions for link-related data structures
 */

export interface Link {
  id: string;
  title: string;
  url: string;
}

export interface CreateLinkInput {
  title: string;
  url: string;
}

export interface UpdateLinkInput {
  id: string;
  title: string;
  url: string;
} 