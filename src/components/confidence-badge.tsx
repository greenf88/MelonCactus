export function ConfidenceBadge({ level }: { level: string }) {
  const slug = level.toLowerCase().replaceAll(" ", "-");
  return <span className={`confidence-badge ${slug}`}>{level}</span>;
}

