import { vi, beforeEach, afterAll } from "vitest";
import "@testing-library/jest-dom/vitest";

// Mock Convex internals that aren't available in test environment
vi.mock("convex/values", async () => {
  const actual = await vi.importActual("convex/values");
  return {
    ...actual,
    ConvexError: class ConvexError extends Error {
      data: Record<string, unknown>;
      constructor(data: Record<string, unknown>) {
        super(data.message as string);
        this.data = data;
        this.name = "ConvexError";
      }
    },
  };
});

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});

// Clean up after all tests
afterAll(() => {
  vi.restoreAllMocks();
});
