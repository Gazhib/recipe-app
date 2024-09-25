export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem("expiration");
  if (storedExpirationDate < 0) {
    return 0;
  }

  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
}



