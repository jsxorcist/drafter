 # Data Model: Визуальный конструктор схем

**Created**: 2025-01-27  
**Feature**: [spec.md](./spec.md)

## Overview

Модель данных описывает структуру диаграммы, включая сущности, соединения, текстовые заметки и рисунки. Все данные сериализуются в JSON для сохранения и экспорта/импорта.

## Core Entities

### Diagram (Схема)

Корневая сущность, представляющая полное состояние рабочего поля.

**Fields**:
- `id: string` - Уникальный идентификатор схемы
- `version: string` - Версия формата данных (для совместимости)
- `entities: Entity[]` - Массив сущностей на схеме
- `connections: Connection[]` - Массив соединений между сущностями
- `textNotes: TextNote[]` - Массив текстовых заметок
- `drawings: Drawing[]` - Массив рисунков
- `metadata: DiagramMetadata` - Метаданные схемы (дата создания, последнее изменение)

**Validation Rules**:
- `id` должен быть уникальным UUID
- `version` должен соответствовать текущей версии формата
- Все массивы должны быть инициализированы (не null)

**State Transitions**:
- Создание: Пустая схема с пустыми массивами
- Добавление элементов: Добавление в соответствующие массивы
- Удаление элементов: Удаление из массивов и связанных соединений
- Сохранение: Сериализация в JSON

---

### Entity (Сущность)

Представляет концептуальный элемент на диаграмме (процесс, компонент, актор и т.д.).

**Fields**:
- `id: string` - Уникальный идентификатор сущности
- `type: EntityType` - Тип сущности (определяет визуальное представление)
- `position: Position` - Позиция на рабочем поле (x, y координаты)
- `label: string` - Текстовый ярлык сущности
- `style: EntityStyle` - Стилизация (цвет, форма, размер)

**EntityType**:
- `"process"` - Процесс
- `"component"` - Компонент
- `"actor"` - Актор/участник
- `"decision"` - Решение/условие
- `"data"` - Данные
- `"custom"` - Пользовательский тип

**Position**:
- `x: number` - Координата X на рабочем поле
- `y: number` - Координата Y на рабочем поле

**EntityStyle**:
- `color: string` - Цвет сущности (CSS-цвет)
- `shape: "rectangle" | "circle" | "diamond" | "ellipse"` - Форма
- `width: number` - Ширина (опционально)
- `height: number` - Высота (опционально)

**Validation Rules**:
- `id` должен быть уникальным в рамках схемы
- `label` не должен быть пустым (минимум 1 символ)
- `position.x` и `position.y` должны быть числами
- `type` должен быть одним из допустимых значений

**Relationships**:
- Может иметь множество исходящих соединений (source)
- Может иметь множество входящих соединений (target)
- При удалении сущности удаляются все связанные соединения

---

### Connection (Соединение)

Представляет направленную связь или поток между двумя сущностями.

**Fields**:
- `id: string` - Уникальный идентификатор соединения
- `sourceId: string` - ID сущности-источника
- `targetId: string` - ID сущности-цели
- `label: string` - Опциональный текстовый ярлык на соединении
- `style: ConnectionStyle` - Стилизация соединения

**ConnectionStyle**:
- `color: string` - Цвет стрелки
- `strokeWidth: number` - Толщина линии
- `arrowType: "default" | "arrowclosed" | "arrowclosedsmall"` - Тип стрелки

**Validation Rules**:
- `id` должен быть уникальным в рамках схемы
- `sourceId` и `targetId` должны ссылаться на существующие сущности
- `sourceId` и `targetId` не должны быть одинаковыми (нет самосоединений)
- При удалении source или target сущности соединение должно быть удалено

**Relationships**:
- Связана с одной Entity через `sourceId`
- Связана с одной Entity через `targetId`
- При перемещении связанных сущностей соединение автоматически обновляется

---

### TextNote (Текстовая заметка)

Свободная текстовая аннотация на рабочем поле.

**Fields**:
- `id: string` - Уникальный идентификатор заметки
- `position: Position` - Позиция на рабочем поле
- `text: string` - Текст заметки
- `style: TextNoteStyle` - Стилизация заметки

**TextNoteStyle**:
- `fontSize: number` - Размер шрифта
- `color: string` - Цвет текста
- `backgroundColor: string` - Цвет фона (опционально)
- `borderRadius: number` - Радиус скругления углов

**Validation Rules**:
- `id` должен быть уникальным в рамках схемы
- `text` не должен быть пустым (минимум 1 символ)
- `position.x` и `position.y` должны быть числами

**Relationships**:
- Независима от сущностей (может существовать отдельно)
- При удалении не влияет на другие элементы

---

### Drawing (Рисунок)

Свободная графическая аннотация на рабочем поле.

**Fields**:
- `id: string` - Уникальный идентификатор рисунка
- `strokes: Stroke[]` - Массив штрихов (линий)
- `style: DrawingStyle` - Стилизация рисунка

**Stroke**:
- `points: Point[]` - Массив точек, образующих линию
- `color: string` - Цвет линии
- `strokeWidth: number` - Толщина линии

**Point**:
- `x: number` - Координата X
- `y: number` - Координата Y

**DrawingStyle**:
- `color: string` - Цвет по умолчанию
- `strokeWidth: number` - Толщина по умолчанию

**Validation Rules**:
- `id` должен быть уникальным в рамках схемы
- `strokes` должен содержать хотя бы один штрих
- Каждый штрих должен содержать минимум 2 точки

**Relationships**:
- Независима от сущностей и других элементов
- При удалении не влияет на другие элементы

---

### DiagramMetadata (Метаданные схемы)

Дополнительная информация о схеме.

**Fields**:
- `createdAt: string` - Дата и время создания (ISO 8601)
- `updatedAt: string` - Дата и время последнего изменения (ISO 8601)
- `title: string` - Название схемы (опционально)

**Validation Rules**:
- `createdAt` и `updatedAt` должны быть валидными ISO 8601 датами
- `title` может быть пустым

---

## Data Flow

### Создание схемы

1. Инициализация пустой схемы с пустыми массивами
2. Генерация уникального `id`
3. Установка `createdAt` и `updatedAt` в текущее время
4. Установка `version` в текущую версию формата

### Добавление сущности

1. Создание Entity с уникальным `id`
2. Установка позиции из координат клика
3. Добавление в `diagram.entities`
4. Обновление `diagram.metadata.updatedAt`

### Создание соединения

1. Валидация существования `sourceId` и `targetId`
2. Проверка на самосоединение
3. Создание Connection с уникальным `id`
4. Добавление в `diagram.connections`
5. Обновление `diagram.metadata.updatedAt`

### Удаление сущности

1. Поиск сущности по `id`
2. Поиск всех соединений, связанных с этой сущностью
3. Удаление сущности из `diagram.entities`
4. Удаление всех связанных соединений из `diagram.connections`
5. Обновление `diagram.metadata.updatedAt`

### Сохранение схемы

1. Сериализация Diagram в JSON
2. Сохранение в LocalStorage с ключом `diagram-{id}`
3. Обновление списка сохраненных схем

### Загрузка схемы

1. Десериализация JSON из LocalStorage или файла
2. Валидация структуры данных
3. Восстановление всех массивов (entities, connections, textNotes, drawings)
4. Восстановление позиций и стилей

---

## TypeScript Interfaces

```typescript
interface Diagram {
  id: string;
  version: string;
  entities: Entity[];
  connections: Connection[];
  textNotes: TextNote[];
  drawings: Drawing[];
  metadata: DiagramMetadata;
}

interface Entity {
  id: string;
  type: EntityType;
  position: Position;
  label: string;
  style: EntityStyle;
}

type EntityType = "process" | "component" | "actor" | "decision" | "data" | "custom";

interface Position {
  x: number;
  y: number;
}

interface EntityStyle {
  color: string;
  shape: "rectangle" | "circle" | "diamond" | "ellipse";
  width?: number;
  height?: number;
}

interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  style: ConnectionStyle;
}

interface ConnectionStyle {
  color: string;
  strokeWidth: number;
  arrowType: "default" | "arrowclosed" | "arrowclosedsmall";
}

interface TextNote {
  id: string;
  position: Position;
  text: string;
  style: TextNoteStyle;
}

interface TextNoteStyle {
  fontSize: number;
  color: string;
  backgroundColor?: string;
  borderRadius: number;
}

interface Drawing {
  id: string;
  strokes: Stroke[];
  style: DrawingStyle;
}

interface Stroke {
  points: Point[];
  color: string;
  strokeWidth: number;
}

interface Point {
  x: number;
  y: number;
}

interface DrawingStyle {
  color: string;
  strokeWidth: number;
}

interface DiagramMetadata {
  createdAt: string;
  updatedAt: string;
  title?: string;
}
```

---

## Serialization Format

### JSON Structure

```json
{
  "id": "uuid-string",
  "version": "1.0.0",
  "entities": [
    {
      "id": "entity-1",
      "type": "process",
      "position": { "x": 100, "y": 200 },
      "label": "Начало процесса",
      "style": {
        "color": "#3b82f6",
        "shape": "rectangle",
        "width": 150,
        "height": 60
      }
    }
  ],
  "connections": [
    {
      "id": "conn-1",
      "sourceId": "entity-1",
      "targetId": "entity-2",
      "label": "Переход",
      "style": {
        "color": "#6b7280",
        "strokeWidth": 2,
        "arrowType": "default"
      }
    }
  ],
  "textNotes": [],
  "drawings": [],
  "metadata": {
    "createdAt": "2025-01-27T10:00:00Z",
    "updatedAt": "2025-01-27T10:30:00Z",
    "title": "Моя схема"
  }
}
```

---

## Validation Rules Summary

1. Все `id` должны быть уникальными в рамках схемы
2. Все ссылки (`sourceId`, `targetId`) должны указывать на существующие сущности
3. Позиции должны быть валидными числами
4. Текстовые поля не должны быть пустыми (где требуется)
5. Типы должны соответствовать допустимым значениям
6. При удалении сущности должны удаляться все связанные соединения
7. Формат дат должен соответствовать ISO 8601

