// Get today's quest based on day of year
export function getTodayDayNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay); // 1-365
  // We only have 5 real problems seeded, so we loop them for testing purposes
  return (dayOfYear % 5) || 5; // Returns 1-5
}

// Check if quest is still available (within 24 hours)
export function isQuestAvailable(dayNumber: number): boolean {
  return getTodayDayNumber() === dayNumber;
}

// Get time remaining for today's quest
export function getTimeRemaining(): string {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
}
