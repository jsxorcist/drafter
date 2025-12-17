import { useState } from "react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "var(--color-background)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--spacing-xl)",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "var(--shadow-xl)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, color: "var(--color-text-primary)" }}>
          Сочетания клавиш и помощь
        </h2>

        <div style={{ marginBottom: "var(--spacing-lg)" }}>
          <h3 style={{ color: "var(--color-text-primary)" }}>Создание сущностей</h3>
          <ul style={{ color: "var(--color-text-secondary)" }}>
            <li>Выберите тип сущности в боковой панели</li>
            <li>Кликните на рабочее поле для размещения</li>
          </ul>
        </div>

        <div style={{ marginBottom: "var(--spacing-lg)" }}>
          <h3 style={{ color: "var(--color-text-primary)" }}>Соединения</h3>
          <ul style={{ color: "var(--color-text-secondary)" }}>
            <li>Перетащите от одной сущности к другой</li>
            <li>Автоматическое обновление при перемещении</li>
          </ul>
        </div>

        <div style={{ marginBottom: "var(--spacing-lg)" }}>
          <h3 style={{ color: "var(--color-text-primary)" }}>Редактирование</h3>
          <ul style={{ color: "var(--color-text-secondary)" }}>
            <li>Перетаскивайте сущности для перемещения</li>
            <li>Delete - удалить выделенную сущность</li>
            <li>Ctrl+Z - отменить действие</li>
            <li>Ctrl+Y - повторить действие</li>
          </ul>
        </div>

        <div style={{ marginBottom: "var(--spacing-lg)" }}>
          <h3 style={{ color: "var(--color-text-primary)" }}>Сохранение</h3>
          <ul style={{ color: "var(--color-text-secondary)" }}>
            <li>Автосохранение при изменениях</li>
            <li>Кнопка "Сохранить" для принудительного сохранения</li>
            <li>Экспорт в JSON файл</li>
            <li>Импорт из JSON файла</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            padding: "var(--spacing-sm) var(--spacing-md)",
            backgroundColor: "var(--color-primary)",
            color: "var(--color-text-inverse)",
            border: "none",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            fontSize: "var(--font-size-sm)",
            fontWeight: "var(--font-weight-medium)",
          }}
        >
          Понятно
        </button>
      </div>
    </div>
  );
}

export function HelpButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: "var(--spacing-sm)",
          backgroundColor: "var(--color-surface)",
          border: `1px solid var(--color-border)`,
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
          fontSize: "var(--font-size-base)",
          color: "var(--color-text-primary)",
          transition: "var(--transition-base)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-surface-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-surface)";
        }}
        title="Показать справку"
        aria-label="Показать справку"
      >
        ❓
      </button>
      <HelpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}