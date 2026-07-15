type BrandProps = { compact?: boolean };

export function Brand({ compact = false }: BrandProps) {
  return (
    <div className="brand" aria-label="AI Resume">
      <span className="brand__mark" aria-hidden="true">AI</span>
      <span className="brand__text">
        <strong>AI Resume</strong>
        {!compact && <small>Powered by R² Solutions Group</small>}
      </span>
    </div>
  );
}
