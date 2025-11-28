export function cn(...classes: any[]) {
  return classes
    .flatMap((cls) =>
      typeof cls === "string"
        ? cls
        : cls && typeof cls === "object"
        ? Object.entries(cls)
            .filter(([_, v]) => Boolean(v))
            .map(([k]) => k)
        : []
    )
    .join(" ");
}
