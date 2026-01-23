import { describe, it, expect } from "vitest";
import {
  validateLength,
  validateSlug,
  validateUrl,
  validateHexColor,
  validateEmail,
  validateMaxSize,
  validateUrlWithSize,
  CONSTRAINTS,
} from "../../convex/lib/validators";

describe("CONSTRAINTS", () => {
  it("should have expected constraint values", () => {
    expect(CONSTRAINTS.username.min).toBe(3);
    expect(CONSTRAINTS.username.max).toBe(30);
    expect(CONSTRAINTS.slug.min).toBe(3);
    expect(CONSTRAINTS.slug.max).toBe(30);
    expect(CONSTRAINTS.maxFieldSize).toBe(100000);
    expect(CONSTRAINTS.maxUrlSize).toBe(2000);
  });
});

describe("validateLength", () => {
  it("should pass for valid length within constraints", () => {
    expect(() =>
      validateLength("hello", "Field", { min: 1, max: 10 })
    ).not.toThrow();
  });

  it("should pass for exact minimum length", () => {
    expect(() =>
      validateLength("abc", "Field", { min: 3, max: 10 })
    ).not.toThrow();
  });

  it("should pass for exact maximum length", () => {
    expect(() =>
      validateLength("abcdefghij", "Field", { min: 1, max: 10 })
    ).not.toThrow();
  });

  it("should throw for length below minimum", () => {
    expect(() => validateLength("ab", "Username", { min: 3, max: 10 })).toThrow(
      "Username must be at least 3 characters"
    );
  });

  it("should throw for length above maximum", () => {
    expect(() =>
      validateLength("abcdefghijk", "Username", { min: 1, max: 10 })
    ).toThrow("Username must be at most 10 characters");
  });

  it("should pass when only max is specified", () => {
    expect(() => validateLength("a", "Field", { max: 10 })).not.toThrow();
  });

  it("should pass when only min is specified", () => {
    expect(() => validateLength("abc", "Field", { min: 3 })).not.toThrow();
  });

  it("should pass for empty constraints", () => {
    expect(() => validateLength("anything", "Field", {})).not.toThrow();
  });
});

describe("validateSlug", () => {
  it("should pass for valid slug with lowercase letters", () => {
    expect(() => validateSlug("my-slug")).not.toThrow();
  });

  it("should pass for valid slug with numbers", () => {
    expect(() => validateSlug("my-slug-123")).not.toThrow();
  });

  it("should pass for valid slug with only letters", () => {
    expect(() => validateSlug("myslug")).not.toThrow();
  });

  it("should pass for valid slug at minimum length", () => {
    expect(() => validateSlug("abc")).not.toThrow();
  });

  it("should throw for slug with uppercase letters", () => {
    expect(() => validateSlug("My-Slug")).toThrow(
      "Slug can only contain lowercase letters, numbers, and hyphens"
    );
  });

  it("should throw for slug with spaces", () => {
    expect(() => validateSlug("my slug")).toThrow(
      "Slug can only contain lowercase letters, numbers, and hyphens"
    );
  });

  it("should throw for slug with underscores", () => {
    expect(() => validateSlug("my_slug")).toThrow(
      "Slug can only contain lowercase letters, numbers, and hyphens"
    );
  });

  it("should throw for slug starting with hyphen", () => {
    expect(() => validateSlug("-myslug")).toThrow(
      "Slug cannot start or end with a hyphen"
    );
  });

  it("should throw for slug ending with hyphen", () => {
    expect(() => validateSlug("myslug-")).toThrow(
      "Slug cannot start or end with a hyphen"
    );
  });

  it("should throw for slug too short", () => {
    expect(() => validateSlug("ab")).toThrow(
      "Slug must be at least 3 characters"
    );
  });

  it("should throw for slug too long", () => {
    const longSlug = "a".repeat(31);
    expect(() => validateSlug(longSlug)).toThrow(
      "Slug must be at most 30 characters"
    );
  });

  it("should throw for slug with special characters", () => {
    expect(() => validateSlug("my@slug")).toThrow(
      "Slug can only contain lowercase letters, numbers, and hyphens"
    );
  });
});

describe("validateUrl", () => {
  it("should pass for valid HTTP URL", () => {
    expect(() => validateUrl("http://example.com")).not.toThrow();
  });

  it("should pass for valid HTTPS URL", () => {
    expect(() => validateUrl("https://example.com")).not.toThrow();
  });

  it("should pass for URL with path", () => {
    expect(() => validateUrl("https://example.com/path/to/page")).not.toThrow();
  });

  it("should pass for URL with query parameters", () => {
    expect(() =>
      validateUrl("https://example.com?foo=bar&baz=qux")
    ).not.toThrow();
  });

  it("should pass for URL with port", () => {
    expect(() => validateUrl("https://example.com:8080")).not.toThrow();
  });

  it("should pass for URL with fragment", () => {
    expect(() => validateUrl("https://example.com#section")).not.toThrow();
  });

  it("should throw for invalid URL without protocol", () => {
    expect(() => validateUrl("example.com")).toThrow("Invalid URL format");
  });

  it("should throw for empty string", () => {
    expect(() => validateUrl("")).toThrow("Invalid URL format");
  });

  it("should throw for malformed URL", () => {
    expect(() => validateUrl("not a url")).toThrow("Invalid URL format");
  });

  it("should throw for URL with spaces", () => {
    expect(() => validateUrl("https://example .com")).toThrow(
      "Invalid URL format"
    );
  });
});

describe("validateHexColor", () => {
  it("should pass for valid uppercase hex color", () => {
    expect(() => validateHexColor("#FFFFFF", "Color")).not.toThrow();
  });

  it("should pass for valid lowercase hex color", () => {
    expect(() => validateHexColor("#ffffff", "Color")).not.toThrow();
  });

  it("should pass for valid mixed case hex color", () => {
    expect(() => validateHexColor("#FfFfFf", "Color")).not.toThrow();
  });

  it("should pass for valid color with numbers", () => {
    expect(() => validateHexColor("#123456", "Color")).not.toThrow();
  });

  it("should throw for color without hash", () => {
    expect(() => validateHexColor("FFFFFF", "Background")).toThrow(
      "Background must be a valid hex color (e.g., #FFFFFF)"
    );
  });

  it("should throw for 3-digit shorthand color", () => {
    expect(() => validateHexColor("#FFF", "Color")).toThrow(
      "Color must be a valid hex color (e.g., #FFFFFF)"
    );
  });

  it("should throw for color with invalid characters", () => {
    expect(() => validateHexColor("#GGGGGG", "Color")).toThrow(
      "Color must be a valid hex color (e.g., #FFFFFF)"
    );
  });

  it("should throw for color too short", () => {
    expect(() => validateHexColor("#FFF00", "Color")).toThrow(
      "Color must be a valid hex color (e.g., #FFFFFF)"
    );
  });

  it("should throw for color too long", () => {
    expect(() => validateHexColor("#FFFFFFF", "Color")).toThrow(
      "Color must be a valid hex color (e.g., #FFFFFF)"
    );
  });
});

describe("validateEmail", () => {
  it("should pass for valid email", () => {
    expect(() => validateEmail("user@example.com")).not.toThrow();
  });

  it("should pass for email with subdomain", () => {
    expect(() => validateEmail("user@mail.example.com")).not.toThrow();
  });

  it("should pass for email with plus sign", () => {
    expect(() => validateEmail("user+tag@example.com")).not.toThrow();
  });

  it("should pass for email with dots in local part", () => {
    expect(() => validateEmail("user.name@example.com")).not.toThrow();
  });

  it("should throw for email without @", () => {
    expect(() => validateEmail("userexample.com")).toThrow(
      "Invalid email format"
    );
  });

  it("should throw for email without domain", () => {
    expect(() => validateEmail("user@")).toThrow("Invalid email format");
  });

  it("should throw for email without local part", () => {
    expect(() => validateEmail("@example.com")).toThrow("Invalid email format");
  });

  it("should throw for email with spaces", () => {
    expect(() => validateEmail("user @example.com")).toThrow(
      "Invalid email format"
    );
  });

  it("should throw for empty string", () => {
    expect(() => validateEmail("")).toThrow("Invalid email format");
  });
});

describe("validateMaxSize", () => {
  it("should pass for string within default limit", () => {
    const value = "a".repeat(1000);
    expect(() => validateMaxSize(value, "Field")).not.toThrow();
  });

  it("should pass for string at exact custom limit", () => {
    const value = "a".repeat(100);
    expect(() => validateMaxSize(value, "Field", 100)).not.toThrow();
  });

  it("should throw for string exceeding default limit", () => {
    const value = "a".repeat(100001);
    expect(() => validateMaxSize(value, "Content")).toThrow(
      "Content exceeds maximum allowed size of 100000 characters"
    );
  });

  it("should throw for string exceeding custom limit", () => {
    const value = "a".repeat(101);
    expect(() => validateMaxSize(value, "Bio", 100)).toThrow(
      "Bio exceeds maximum allowed size of 100 characters"
    );
  });

  it("should pass for empty string", () => {
    expect(() => validateMaxSize("", "Field", 100)).not.toThrow();
  });
});

describe("validateUrlWithSize", () => {
  it("should pass for valid URL within size limit", () => {
    expect(() => validateUrlWithSize("https://example.com")).not.toThrow();
  });

  it("should throw for URL exceeding size limit", () => {
    const longUrl = "https://example.com/" + "a".repeat(2000);
    expect(() => validateUrlWithSize(longUrl)).toThrow(
      "URL exceeds maximum allowed size of 2000 characters"
    );
  });

  it("should throw for invalid URL format even if within size", () => {
    expect(() => validateUrlWithSize("not-a-url")).toThrow(
      "Invalid URL format"
    );
  });

  it("should check size before format", () => {
    // A very long invalid URL should fail on size first
    const longInvalidUrl = "a".repeat(2001);
    expect(() => validateUrlWithSize(longInvalidUrl)).toThrow(
      "URL exceeds maximum allowed size of 2000 characters"
    );
  });
});
