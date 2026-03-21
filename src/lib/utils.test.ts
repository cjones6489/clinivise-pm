import { describe, it, expect } from "vitest";
import { undefinedToNull, stripUndefined } from "./utils";

describe("undefinedToNull", () => {
  it("converts undefined values to null", () => {
    const result = undefinedToNull({ a: "hello", b: undefined, c: 42 });
    expect(result).toEqual({ a: "hello", b: null, c: 42 });
  });

  it("preserves null values", () => {
    const result = undefinedToNull({ a: null });
    expect(result).toEqual({ a: null });
  });

  it("preserves empty strings", () => {
    const result = undefinedToNull({ a: "" });
    expect(result).toEqual({ a: "" });
  });

  it("preserves zero", () => {
    const result = undefinedToNull({ a: 0 });
    expect(result).toEqual({ a: 0 });
  });

  it("preserves false", () => {
    const result = undefinedToNull({ a: false });
    expect(result).toEqual({ a: false });
  });

  it("handles empty object", () => {
    const result = undefinedToNull({});
    expect(result).toEqual({});
  });

  it("converts all-undefined object to all-null", () => {
    const result = undefinedToNull({ a: undefined, b: undefined });
    expect(result).toEqual({ a: null, b: null });
  });
});

describe("stripUndefined", () => {
  it("removes undefined keys", () => {
    const result = stripUndefined({ a: "hello", b: undefined, c: 42 });
    expect(result).toEqual({ a: "hello", c: 42 });
    expect("b" in result).toBe(false);
  });

  it("preserves null values", () => {
    const result = stripUndefined({ a: null, b: undefined });
    expect(result).toEqual({ a: null });
    expect("a" in result).toBe(true);
  });

  it("preserves empty strings", () => {
    const result = stripUndefined({ a: "", b: undefined });
    expect(result).toEqual({ a: "" });
  });

  it("preserves zero and false", () => {
    const result = stripUndefined({ a: 0, b: false, c: undefined });
    expect(result).toEqual({ a: 0, b: false });
  });

  it("handles empty object", () => {
    const result = stripUndefined({});
    expect(result).toEqual({});
  });

  it("returns empty object when all values are undefined", () => {
    const result = stripUndefined({ a: undefined, b: undefined });
    expect(result).toEqual({});
  });
});
