export function shortAddress(address: string) {
  return address.substr(0, 6) + "..." + address.substr(-4);
}

export function formatDuration(duration: number) {
  if (duration < 60) {
    if (duration === 1) return `1 second`;
    return `${duration} second`;
  }

  if (duration < 3600) {
    const minutes = Math.floor(duration / 60);
    if (minutes === 1) return `1 minute`;
    return `${minutes} minute`;
  }

  // Display until 47 hours
  if (duration < 172800) {
    const hours = Math.floor(duration / 3600);
    if (hours === 1) return `1 hour`;
    return `${hours} hour`;
  }

  const days = Math.floor(duration / 86400);
  return `${days} day`;
}
