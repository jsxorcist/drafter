interface LoadingIndicatorProps {
  message?: string;
}

export function LoadingIndicator({ message = "Загрузка..." }: LoadingIndicatorProps) {
  return (
    <div
      style={{
        padding: "var(--spacing-md)",
        backgroundColor: "var(--color-info)",
        color: "var(--color-text-inverse)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-sm)",
        boxShadow: "var(--shadow-md)",
        fontSize: "var(--font-size-sm)",
        fontWeight: "var(--font-weight-medium)",
      }}
      role="status"
      aria-live="polite"
    >
      <div
        style={{
          width: "16px",
          height: "16px",
          border: "2px solid transparent",
          borderTop: "2px solid currentColor",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <span>{message}</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
