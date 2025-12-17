interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div
      style={{
        padding: "var(--spacing-md)",
        backgroundColor: "var(--color-error)",
        color: "var(--color-text-inverse)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--spacing-md)",
        boxShadow: "var(--shadow-md)",
        fontSize: "var(--font-size-sm)",
        fontWeight: "var(--font-weight-medium)",
      }}
      role="alert"
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
        <span>⚠️</span>
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "var(--color-text-inverse)",
            cursor: "pointer",
            fontSize: "var(--font-size-lg)",
            padding: 0,
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Закрыть сообщение об ошибке"
        >
          ×
        </button>
      )}
    </div>
  );
}
