import {
  formatDate,
  toISOShort,
  toRelativeTime,
  isValidDate,
} from "./date.helper";

describe("date.helper", (): void => {
  describe("formatDate", (): void => {
    it("should format with default pattern (YYYY-MM-DD)", (): void => {
      const date = new Date(2026, 0, 15); // Jan 15, 2026
      expect(formatDate(date)).toBe("2026-01-15");
    });

    it("should format with custom pattern", (): void => {
      const date = new Date(2026, 4, 18, 14, 30, 15); // May 18, 2026, 14:30:15
      expect(formatDate(date, "YYYY/MM/DD HH:mm:ss")).toBe("2026/05/18 14:30:15");
    });
  });

  describe("toISOShort", (): void => {
    it("should return YYYY-MM-DD format", (): void => {
      const date = new Date(2026, 11, 25);
      expect(toISOShort(date)).toBe("2026-12-25");
    });
  });

  describe("toRelativeTime", (): void => {
    it("should return 'just now' for very recent dates", (): void => {
      expect(toRelativeTime(new Date())).toBe("just now");
    });

    it("should return minutes ago", (): void => {
      const date = new Date(Date.now() - 2 * 60 * 1000);
      expect(toRelativeTime(date)).toBe("2 minutes ago");
    });

    it("should return hours ago", (): void => {
      const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
      expect(toRelativeTime(date)).toBe("3 hours ago");
    });

    it("should return days ago", (): void => {
      const date = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      expect(toRelativeTime(date)).toBe("5 days ago");
    });

    it("should return weeks ago", (): void => {
      const date = new Date(Date.now() - 3 * 7 * 24 * 60 * 60 * 1000);
      expect(toRelativeTime(date)).toBe("3 weeks ago");
    });

    it("should handle months ago", (): void => {
      const date = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
      expect(toRelativeTime(date)).toMatch(/month(s)? ago/);
    });

    it("should handle years ago", (): void => {
      const date = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000);
      expect(toRelativeTime(date)).toMatch(/year(s)? ago/);
    });

    it("should handle future dates", (): void => {
      const date = new Date(Date.now() + 100000);
      expect(toRelativeTime(date)).toBe("in the future");
    });

    it("should return seconds ago (between 6 and 59)", (): void => {
      const date = new Date(Date.now() - 20 * 1000);
      expect(toRelativeTime(date)).toBe("20 seconds ago");
    });

    it("should return 1 minute ago (singular)", (): void => {
      const date = new Date(Date.now() - 60 * 1000);
      expect(toRelativeTime(date)).toBe("1 minute ago");
    });

    it("should return 1 hour ago (singular)", (): void => {
      const date = new Date(Date.now() - 60 * 60 * 1000);
      expect(toRelativeTime(date)).toBe("1 hour ago");
    });

    it("should return 1 day ago (singular)", (): void => {
      const date = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(toRelativeTime(date)).toBe("1 day ago");
    });

    it("should return 1 week ago (singular)", (): void => {
      const date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      expect(toRelativeTime(date)).toBe("1 week ago");
    });

    it("should return 1 month ago (singular)", (): void => {
      const date = new Date(Date.now() - 35 * 24 * 60 * 60 * 1000);
      expect(toRelativeTime(date)).toBe("1 month ago");
    });

    it("should return 1 year ago (singular)", (): void => {
      const date = new Date(Date.now() - 370 * 24 * 60 * 60 * 1000);
      expect(toRelativeTime(date)).toBe("1 year ago");
    });

    it("should return multiple years ago (plural)", (): void => {
      const date = new Date(Date.now() - 800 * 24 * 60 * 60 * 1000);
      expect(toRelativeTime(date)).toBe("2 years ago");
    });
  });

  describe("isValidDate", (): void => {
    it("should return true for valid dates", (): void => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date("2026-01-01"))).toBe(true);
    });

    it("should return false for invalid dates", (): void => {
      expect(isValidDate(new Date("invalid"))).toBe(false);
    });

    it("should return false for non-date values", (): void => {
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate("2026-01-01")).toBe(false);
    });
  });
});
