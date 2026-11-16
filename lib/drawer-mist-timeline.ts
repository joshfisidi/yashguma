export function drawerMistProgress(seconds: number, from: number, opening: boolean) {
  // The source starts with Yash fully formed and ends with the mist gone.
  return opening ? Math.max(0, from - seconds / 2) : Math.min(1, from + seconds);
}
