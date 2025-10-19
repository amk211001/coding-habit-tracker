import { calculateStreak, checkAndAwardAchievements } from '../src/hooks/useAchievements';
import { subDays, startOfDay, addDays } from 'date-fns';

describe('calculateStreak', () => {
  const today = startOfDay(new Date());

  it('returns 0 for empty completions array', () => {
    const habit = { completions: [] };
    expect(calculateStreak(habit)).toBe(0);
  });

  it('returns 1 for single completion', () => {
    const habit = { completions: [today] };
    expect(calculateStreak(habit)).toBe(1);
  });

  it('returns 2 for two consecutive days', () => {
    const habit = {
      completions: [today, subDays(today, 1)]
    };
    expect(calculateStreak(habit)).toBe(2);
  });

  it('returns 1 for two days with gap', () => {
    const habit = {
      completions: [today, subDays(today, 2)]
    };
    expect(calculateStreak(habit)).toBe(1);
  });

  it('returns 3 for three consecutive days', () => {
    const habit = {
      completions: [today, subDays(today, 1), subDays(today, 2)]
    };
    expect(calculateStreak(habit)).toBe(3);
  });

  it('breaks streak at gap in middle', () => {
    const habit = {
      completions: [today, subDays(today, 1), subDays(today, 3)]
    };
    expect(calculateStreak(habit)).toBe(2);
  });

  it('handles dates not in order', () => {
    const habit = {
      completions: [subDays(today, 2), today, subDays(today, 1)]
    };
    expect(calculateStreak(habit)).toBe(3);
  });

  it('returns 1 for non-consecutive recent completions', () => {
    const habit = {
      completions: [today, subDays(today, 3), subDays(today, 5)]
    };
    expect(calculateStreak(habit)).toBe(1);
  });

  it('handles duplicate dates', () => {
    const habit = {
      completions: [today, today, subDays(today, 1)]
    };
    expect(calculateStreak(habit)).toBe(2);
  });

  it('returns 1 for old streak not current', () => {
    const habit = {
      completions: [subDays(today, 10), subDays(today, 11), subDays(today, 12)]
    };
    expect(calculateStreak(habit)).toBe(3);
  });
});

describe('checkAndAwardAchievements', () => {
  const today = startOfDay(new Date());

  it('unlocks streak7 achievement for streak >= 7', () => {
    const habit = {
      completions: Array.from({ length: 7 }, (_, i) => subDays(today, i)),
      achievements: []
    };
    const result = checkAndAwardAchievements(habit);
    expect(result.newUnlocked).toContain('streak7');
    expect(result.achievements).toContain('streak7');
  });

  it('unlocks streak30 achievement for streak >= 30', () => {
    const habit = {
      completions: Array.from({ length: 30 }, (_, i) => subDays(today, i)),
      achievements: []
    };
    const result = checkAndAwardAchievements(habit);
    expect(result.newUnlocked).toContain('streak30');
    expect(result.achievements).toContain('streak30');
  });

  it('unlocks streak100 achievement for streak >= 100', () => {
    const habit = {
      completions: Array.from({ length: 100 }, (_, i) => subDays(today, i)),
      achievements: []
    };
    const result = checkAndAwardAchievements(habit);
    expect(result.newUnlocked).toContain('streak100');
    expect(result.achievements).toContain('streak100');
  });

  it('does not unlock already achieved streak7', () => {
    const habit = {
      completions: Array.from({ length: 10 }, (_, i) => subDays(today, i)),
      achievements: ['streak7']
    };
    const result = checkAndAwardAchievements(habit);
    expect(result.newUnlocked).not.toContain('streak7');
    expect(result.achievements).toContain('streak7');
  });

  it('unlocks multiple achievements at once', () => {
    const habit = {
      completions: Array.from({ length: 100 }, (_, i) => subDays(today, i)),
      achievements: []
    };
    const result = checkAndAwardAchievements(habit);
    expect(result.newUnlocked).toEqual(['streak7', 'streak30', 'streak100']);
    expect(result.achievements).toEqual(['streak7', 'streak30', 'streak100']);
  });

  it('unlocks remaining achievements when some already achieved', () => {
    const habit = {
      completions: Array.from({ length: 100 }, (_, i) => subDays(today, i)),
      achievements: ['streak7', 'streak30']
    };
    const result = checkAndAwardAchievements(habit);
    expect(result.newUnlocked).toEqual(['streak100']);
    expect(result.achievements).toEqual(['streak7', 'streak30', 'streak100']);
  });

  it('does not unlock any achievements for streak < 7', () => {
    const habit = {
      completions: [today, subDays(today, 1)],
      achievements: []
    };
    const result = checkAndAwardAchievements(habit);
    expect(result.newUnlocked).toEqual([]);
    expect(result.achievements).toEqual([]);
  });

  it('unlocks only streak7 for streak >=7 but <30', () => {
    const habit = {
      completions: Array.from({ length: 10 }, (_, i) => subDays(today, i)),
      achievements: []
    };
    const result = checkAndAwardAchievements(habit);
    expect(result.newUnlocked).toEqual(['streak7']);
    expect(result.achievements).toEqual(['streak7']);
  });

  it('unlocks streak7 and streak30 for streak >=30 but <100', () => {
    const habit = {
      completions: Array.from({ length: 50 }, (_, i) => subDays(today, i)),
      achievements: []
    };
    const result = checkAndAwardAchievements(habit);
    expect(result.newUnlocked).toEqual(['streak7', 'streak30']);
    expect(result.achievements).toEqual(['streak7', 'streak30']);
  });
});