# Quickstart Guide: Визуальный конструктор схем

**Created**: 2025-01-27  
**Feature**: [spec.md](./spec.md)

## Overview

Это руководство поможет быстро начать разработку визуального конструктора схем. Приложение представляет собой одностраничное React-приложение с использованием TypeScript, Vite и React-Flow.

## Prerequisites

- Node.js 18+ и npm/yarn/pnpm
- Браузер с поддержкой ES6+ и LocalStorage
- Редактор кода с поддержкой TypeScript

## Initial Setup

### 1. Создание проекта

```bash
# Создать новый проект с Vite
npm create vite@latest drafter -- --template react-ts

# Перейти в директорию проекта
cd drafter

# Установить зависимости
npm install
```

### 2. Установка основных зависимостей

```bash
# React-Flow для работы с графами
npm install reactflow

# Дополнительные утилиты (если потребуются)
npm install uuid
npm install -D @types/uuid
```

### 3. Настройка ESLint и Prettier

```bash
# Установка ESLint и Prettier
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

Создать файлы конфигурации:

**`.eslintrc.json`**:
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "react/react-in-jsx-scope": "off"
  }
}
```

**`.prettierrc`**:
```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### 4. Структура проекта (Feature-Sliced Design)

Создать следующую структуру директорий:

```
src/
├── app/                    # Инициализация приложения
│   ├── providers/          # React Context провайдеры
│   └── App.tsx            # Корневой компонент
├── pages/                  # Страницы приложения
│   └── diagram-page/      # Страница с диаграммой
├── widgets/                # Крупные блоки интерфейса
│   └── canvas/            # Рабочее поле с React-Flow
├── features/               # Бизнес-логика
│   ├── entity-management/ # Управление сущностями
│   ├── connection-management/ # Управление соединениями
│   ├── text-note-management/ # Управление заметками
│   ├── drawing-mode/      # Режим рисования
│   └── save-load/         # Сохранение/загрузка
├── entities/               # Бизнес-сущности
│   └── diagram/           # Модели данных диаграммы
└── shared/                 # Переиспользуемые компоненты
    ├── ui/                # Базовые UI компоненты
    ├── lib/               # Утилиты
    └── styles/            # CSS-переменные для дизайн-токенов
```

## Development Workflow

### 1. Запуск dev-сервера

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173` (или другому порту, указанному Vite).

### 2. Основные компоненты для начала работы

#### Создание базовой структуры диаграммы

**`src/entities/diagram/types.ts`**:
```typescript
// Определить типы из data-model.md
export interface Diagram { ... }
export interface Entity { ... }
export interface Connection { ... }
// и т.д.
```

#### Создание Context для состояния

**`src/app/providers/DiagramProvider.tsx`**:
```typescript
import { createContext, useContext, useReducer } from "react";
import { Diagram } from "@/entities/diagram/types";

interface DiagramContextType {
  diagram: Diagram;
  dispatch: React.Dispatch<DiagramAction>;
}

const DiagramContext = createContext<DiagramContextType | null>(null);

export function DiagramProvider({ children }: { children: React.ReactNode }) {
  const [diagram, dispatch] = useReducer(diagramReducer, createEmptyDiagram());
  
  return (
    <DiagramContext.Provider value={{ diagram, dispatch }}>
      {children}
    </DiagramContext.Provider>
  );
}

export function useDiagram() {
  const context = useContext(DiagramContext);
  if (!context) {
    throw new Error("useDiagram must be used within DiagramProvider");
  }
  return context;
}
```

#### Создание рабочего поля с React-Flow

**`src/widgets/canvas/Canvas.tsx`**:
```typescript
import ReactFlow, { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { useDiagram } from "@/app/providers/DiagramProvider";

export function Canvas() {
  const { diagram } = useDiagram();
  
  // Преобразование entities в React-Flow nodes
  const nodes: Node[] = diagram.entities.map(entity => ({
    id: entity.id,
    position: entity.position,
    data: { label: entity.label },
    type: entity.type,
  }));
  
  // Преобразование connections в React-Flow edges
  const edges: Edge[] = diagram.connections.map(conn => ({
    id: conn.id,
    source: conn.sourceId,
    target: conn.targetId,
  }));
  
  return (
    <ReactFlow nodes={nodes} edges={edges}>
      {/* Дополнительные настройки */}
    </ReactFlow>
  );
}
```

### 3. Реализация основных функций

#### Создание сущности

**`src/features/entity-management/create-entity.ts`**:
```typescript
import { Entity, EntityType, Position } from "@/entities/diagram/types";

export function createEntity(
  type: EntityType,
  position: Position,
  label: string
): Entity {
  return {
    id: generateId(),
    type,
    position,
    label,
    style: getDefaultStyle(type),
  };
}
```

#### Сохранение в LocalStorage

**`src/features/save-load/save-diagram.ts`**:
```typescript
import { Diagram } from "@/entities/diagram/types";

const STORAGE_KEY = "drafter-diagram";

export function saveDiagram(diagram: Diagram): void {
  try {
    const json = JSON.stringify(diagram);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    throw new Error("Failed to save diagram to localStorage");
  }
}

export function loadDiagram(): Diagram | null {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return null;
    return JSON.parse(json) as Diagram;
  } catch (error) {
    throw new Error("Failed to load diagram from localStorage");
  }
}
```

## Key Implementation Points

### 1. Интеграция React-Flow

- Использовать кастомные типы узлов для разных типов сущностей
- Настроить обработчики событий для drag-and-drop
- Реализовать создание соединений через перетаскивание

### 2. Управление состоянием

- Использовать useReducer для централизованного управления
- Реализовать optimistic updates (принцип конституции)
- Добавить систему Undo/Redo через Command pattern

### 3. Дизайн-токены

**`src/shared/styles/tokens.css`**:
```css
:root {
  /* Цвета */
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --color-background: #ffffff;
  --color-text: #1f2937;
  
  /* Типографика */
  --font-size-base: 14px;
  --font-size-lg: 18px;
  --font-weight-normal: 400;
  --font-weight-bold: 600;
  
  /* Радиусы */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* Тени */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  --color-background: #1f2937;
  --color-text: #f9fafb;
  /* и т.д. */
}
```

### 4. Темная тема

Реализовать переключение через изменение data-атрибута:

```typescript
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}
```

## Testing (Manual)

Согласно конституции, автоматизированные тесты не используются. Проверка осуществляется через:

1. **Ручное тестирование**: Проверка всех пользовательских сценариев из спецификации
2. **TypeScript**: Строгая типизация предотвращает многие ошибки
3. **ESLint**: Статический анализ кода

## Next Steps

1. Реализовать базовое рабочее поле с React-Flow
2. Добавить боковую панель для создания сущностей
3. Реализовать создание и редактирование сущностей
4. Добавить функциональность соединений
5. Реализовать сохранение/загрузку
6. Добавить режим рисования
7. Реализовать темную тему

## Common Issues

### React-Flow не отображается

- Убедитесь, что импортирован CSS: `import "reactflow/dist/style.css"`
- Проверьте, что nodes и edges имеют правильную структуру

### LocalStorage ошибки

- Обработайте случай, когда LocalStorage недоступен (приватный режим)
- Проверьте лимиты хранилища (обычно 5-10MB)

### TypeScript ошибки с any

- Используйте `unknown` вместо `any` и добавьте проверки типов
- Используйте type guards для валидации данных

## Resources

- [React-Flow Documentation](https://reactflow.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

