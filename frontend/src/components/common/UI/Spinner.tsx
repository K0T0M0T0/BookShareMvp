export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="ui-spinner" role="status" aria-live="polite">
      <span className="ui-spinner__dot" />
      {label && <span className="ui-spinner__label">{label}</span>}
    </div>
  );
}

