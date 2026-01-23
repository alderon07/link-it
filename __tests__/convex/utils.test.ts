import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  generateSlug,
  sanitizeText,
  isValidUrl,
  isValidHexColor,
  generateUsername,
  now,
} from "../../convex/lib/utils";

describe("generateSlug", () => {
  it("should convert to lowercase", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("should replace spaces with hyphens", () => {
    expect(generateSlug("my page name")).toBe("my-page-name");
  });

  it("should replace underscores with hyphens", () => {
    expect(generateSlug("my_page_name")).toBe("my-page-name");
  });

  it("should remove special characters", () => {
    expect(generateSlug("Hello! World?")).toBe("hello-world");
  });

  it("should trim leading and trailing hyphens", () => {
    expect(generateSlug("  hello  ")).toBe("hello");
  });

  it("should collapse multiple hyphens", () => {
    expect(generateSlug("hello   world")).toBe("hello-world");
  });

  it("should handle empty string", () => {
    expect(generateSlug("")).toBe("");
  });

  it("should handle numbers", () => {
    expect(generateSlug("Page 123")).toBe("page-123");
  });

  it("should handle mixed content", () => {
    expect(generateSlug("My Page #1!")).toBe("my-page-1");
  });
});

describe("sanitizeText", () => {
  it("should escape < character", () => {
    expect(sanitizeText("<script>")).toBe("&lt;script&gt;");
  });

  it("should escape > character", () => {
    expect(sanitizeText("a > b")).toBe("a &gt; b");
  });

  it("should escape double quotes", () => {
    expect(sanitizeText('say "hello"')).toBe("say &quot;hello&quot;");
  });

  it("should escape single quotes", () => {
    expect(sanitizeText("it's")).toBe("it&#x27;s");
  });

  it("should trim whitespace", () => {
    expect(sanitizeText("  hello  ")).toBe("hello");
  });

  it("should handle multiple escape characters", () => {
    expect(sanitizeText('<a href="test">link</a>')).toBe(
      "&lt;a href=&quot;test&quot;&gt;link&lt;/a&gt;"
    );
  });

  it("should handle empty string", () => {
    expect(sanitizeText("")).toBe("");
  });

  it("should handle normal text without escaping", () => {
    expect(sanitizeText("Hello World")).toBe("Hello World");
  });
});

describe("isValidUrl", () => {
  it("should return true for valid HTTP URL", () => {
    expect(isValidUrl("http://example.com")).toBe(true);
  });

  it("should return true for valid HTTPS URL", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
  });

  it("should return true for URL with path", () => {
    expect(isValidUrl("https://example.com/path")).toBe(true);
  });

  it("should return true for URL with query params", () => {
    expect(isValidUrl("https://example.com?foo=bar")).toBe(true);
  });

  it("should return false for invalid URL", () => {
    expect(isValidUrl("not a url")).toBe(false);
  });

  it("should return false for URL without protocol", () => {
    expect(isValidUrl("example.com")).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(isValidUrl("")).toBe(false);
  });
});

describe("isValidHexColor", () => {
  it("should return true for valid uppercase hex", () => {
    expect(isValidHexColor("#FFFFFF")).toBe(true);
  });

  it("should return true for valid lowercase hex", () => {
    expect(isValidHexColor("#ffffff")).toBe(true);
  });

  it("should return true for valid mixed case hex", () => {
    expect(isValidHexColor("#FfFfFf")).toBe(true);
  });

  it("should return false for hex without hash", () => {
    expect(isValidHexColor("FFFFFF")).toBe(false);
  });

  it("should return false for 3-digit hex", () => {
    expect(isValidHexColor("#FFF")).toBe(false);
  });

  it("should return false for invalid characters", () => {
    expect(isValidHexColor("#GGGGGG")).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(isValidHexColor("")).toBe(false);
  });
});

describe("generateUsername", () => {
  it("should generate username from first name", () => {
    const username = generateUsername("John", null);
    expect(username).toMatch(/^john-[a-z0-9]{4}$/);
  });

  it("should generate username from last name if no first name", () => {
    const username = generateUsername(null, "Doe");
    expect(username).toMatch(/^doe-[a-z0-9]{4}$/);
  });

  it("should use fallback if no names provided", () => {
    const username = generateUsername(null, null);
    expect(username).toMatch(/^user-[a-z0-9]{4}$/);
  });

  it("should use custom fallback", () => {
    const username = generateUsername(null, null, "guest");
    expect(username).toMatch(/^guest-[a-z0-9]{4}$/);
  });

  it("should prefer first name over last name", () => {
    const username = generateUsername("John", "Doe");
    expect(username).toMatch(/^john-[a-z0-9]{4}$/);
  });

  it("should generate different usernames each time", () => {
    const username1 = generateUsername("John", null);
    const username2 = generateUsername("John", null);
    expect(username1).not.toBe(username2);
  });

  it("should handle empty strings", () => {
    const username = generateUsername("", "");
    expect(username).toMatch(/^user-[a-z0-9]{4}$/);
  });
});

describe("now", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return current timestamp in milliseconds", () => {
    const mockDate = new Date("2024-01-15T10:30:00.000Z");
    vi.setSystemTime(mockDate);

    expect(now()).toBe(mockDate.getTime());
  });

  it("should return different values at different times", () => {
    vi.setSystemTime(new Date("2024-01-15T10:00:00.000Z"));
    const time1 = now();

    vi.setSystemTime(new Date("2024-01-15T10:00:01.000Z"));
    const time2 = now();

    expect(time2).toBeGreaterThan(time1);
    expect(time2 - time1).toBe(1000);
  });
});
