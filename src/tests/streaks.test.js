import {
  calculateStreak,
  checkAndAwardAchievements,
} from "../hooks/useAchievements";

describe("Streak and Achievement Tests (mocked dates)", () => {
  const makeHabitWithDays = (numDays, achievements = []) => {
    const completions = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < numDays; i++) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      completions.push(d);
    }

    return { completions, achievements };
  };

  describe("calculateStreak", () => {
    test("empty completions → streak = 0", () => {
      expect(calculateStreak({ completions: [], achievements: [] })).toBe(0);
    });

    test("single completion → streak = 1", () => {
      expect(calculateStreak(makeHabitWithDays(1))).toBe(1);
    });

    test("consecutive 3-day streak", () => {
      expect(calculateStreak(makeHabitWithDays(3))).toBe(3);
    });

    test("streak breaks with gap", () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const habit = {
        completions: [
          today,
          new Date(today.getTime() - 24 * 60 * 60 * 1000),
          new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
        ],
        achievements: [],
      };
      expect(calculateStreak(habit)).toBe(2);
    });

    test("unordered completions still counted", () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const habit = {
        completions: [new Date(today.getTime() - 24 * 60 * 60 * 1000), today],
        achievements: [],
      };
      expect(calculateStreak(habit)).toBe(2);
    });
  });

  describe("checkAndAwardAchievements", () => {
    test("awards streak7 for 7-day streak", () => {
      const habit = makeHabitWithDays(7);
      const result = checkAndAwardAchievements(habit);
      expect(result.achievements).toContain("streak7");
      expect(result.newUnlocked).toContain("streak7");
    });

    test("awards streak30 for 30-day streak", () => {
      const habit = makeHabitWithDays(30);
      const result = checkAndAwardAchievements(habit);
      expect(result.achievements).toContain("streak30");
      expect(result.newUnlocked).toContain("streak30");
    });

    test("awards streak100 for 100-day streak", () => {
      const habit = makeHabitWithDays(100);
      const result = checkAndAwardAchievements(habit);
      expect(result.achievements).toContain("streak100");
      expect(result.newUnlocked).toContain("streak100");
    });

    test("does not re-award existing achievements", () => {
      const habit = makeHabitWithDays(7, ["streak7"]);
      const result = checkAndAwardAchievements(habit);
      expect(result.achievements.filter((a) => a === "streak7").length).toBe(1);
    });

    test("handles habits with no completions safely", () => {
      const habit = { completions: [], achievements: [] };
      const result = checkAndAwardAchievements(habit);
      expect(result.achievements).toEqual([]);
      expect(result.newUnlocked).toEqual([]);
    });
  });
});
