# Data Operations Contracts

**Created**: 2025-01-27  
**Feature**: [spec.md](../spec.md)

## Overview

Поскольку приложение полностью клиентское без серверной части, контракты описывают внутренние интерфейсы и функции для работы с данными диаграммы.

## Core Operations

### Diagram Operations

#### `createDiagram(): Diagram`

Создает новую пустую диаграмму.

**Returns**: `Diagram` - Новая диаграмма с пустыми массивами и сгенерированным ID

**Side Effects**: None

---

#### `loadDiagram(id: string): Diagram | null`

Загружает диаграмму из LocalStorage.

**Parameters**:
- `id: string` - ID диаграммы

**Returns**: `Diagram | null` - Загруженная диаграмма или null, если не найдена

**Side Effects**: None

**Errors**: 
- Может вернуть null, если диаграмма не найдена
- Может выбросить ошибку, если данные повреждены

---

#### `saveDiagram(diagram: Diagram): void`

Сохраняет диаграмму в LocalStorage.

**Parameters**:
- `diagram: Diagram` - Диаграмма для сохранения

**Returns**: `void`

**Side Effects**: 
- Записывает данные в LocalStorage
- Обновляет `diagram.metadata.updatedAt`

**Errors**: 
- Может выбросить ошибку, если LocalStorage переполнен
- Может выбросить ошибку, если данные не сериализуются

---

#### `exportDiagram(diagram: Diagram): string`

Экспортирует диаграмму в JSON строку.

**Parameters**:
- `diagram: Diagram` - Диаграмма для экспорта

**Returns**: `string` - JSON строка

**Side Effects**: None

**Errors**: 
- Может выбросить ошибку, если данные не сериализуются

---

#### `importDiagram(json: string): Diagram`

Импортирует диаграмму из JSON строки.

**Parameters**:
- `json: string` - JSON строка с данными диаграммы

**Returns**: `Diagram` - Импортированная диаграмма

**Side Effects**: None

**Errors**: 
- Может выбросить ошибку, если JSON невалиден
- Может выбросить ошибку, если структура данных не соответствует ожидаемой

---

### Entity Operations

#### `createEntity(type: EntityType, position: Position, label: string): Entity`

Создает новую сущность.

**Parameters**:
- `type: EntityType` - Тип сущности
- `position: Position` - Позиция на рабочем поле
- `label: string` - Текстовый ярлык

**Returns**: `Entity` - Новая сущность с сгенерированным ID

**Side Effects**: None

**Validation**:
- `label` не должен быть пустым
- `position.x` и `position.y` должны быть числами

---

#### `updateEntityPosition(entityId: string, position: Position, diagram: Diagram): Diagram`

Обновляет позицию сущности.

**Parameters**:
- `entityId: string` - ID сущности
- `position: Position` - Новая позиция
- `diagram: Diagram` - Текущая диаграмма

**Returns**: `Diagram` - Обновленная диаграмма

**Side Effects**: 
- Обновляет позицию сущности
- Обновляет все связанные соединения (через React-Flow)
- Обновляет `diagram.metadata.updatedAt`

**Errors**: 
- Может выбросить ошибку, если сущность не найдена

---

#### `updateEntityLabel(entityId: string, label: string, diagram: Diagram): Diagram`

Обновляет текстовый ярлык сущности.

**Parameters**:
- `entityId: string` - ID сущности
- `label: string` - Новый ярлык
- `diagram: Diagram` - Текущая диаграмма

**Returns**: `Diagram` - Обновленная диаграмма

**Side Effects**: 
- Обновляет ярлык сущности
- Обновляет `diagram.metadata.updatedAt`

**Validation**:
- `label` не должен быть пустым

**Errors**: 
- Может выбросить ошибку, если сущность не найдена

---

#### `deleteEntity(entityId: string, diagram: Diagram): Diagram`

Удаляет сущность и все связанные соединения.

**Parameters**:
- `entityId: string` - ID сущности для удаления
- `diagram: Diagram` - Текущая диаграмма

**Returns**: `Diagram` - Обновленная диаграмма

**Side Effects**: 
- Удаляет сущность из `diagram.entities`
- Удаляет все соединения, где сущность является source или target
- Обновляет `diagram.metadata.updatedAt`

**Errors**: 
- Может выбросить ошибку, если сущность не найдена

---

### Connection Operations

#### `createConnection(sourceId: string, targetId: string, diagram: Diagram): Diagram`

Создает новое соединение между двумя сущностями.

**Parameters**:
- `sourceId: string` - ID сущности-источника
- `targetId: string` - ID сущности-цели
- `diagram: Diagram` - Текущая диаграмма

**Returns**: `Diagram` - Обновленная диаграмма

**Side Effects**: 
- Добавляет соединение в `diagram.connections`
- Обновляет `diagram.metadata.updatedAt`

**Validation**:
- `sourceId` и `targetId` должны ссылаться на существующие сущности
- `sourceId` и `targetId` не должны быть одинаковыми

**Errors**: 
- Может выбросить ошибку, если source или target сущности не найдены
- Может выбросить ошибку, если попытка создать самосоединение

---

#### `deleteConnection(connectionId: string, diagram: Diagram): Diagram`

Удаляет соединение.

**Parameters**:
- `connectionId: string` - ID соединения для удаления
- `diagram: Diagram` - Текущая диаграмма

**Returns**: `Diagram` - Обновленная диаграмма

**Side Effects**: 
- Удаляет соединение из `diagram.connections`
- Обновляет `diagram.metadata.updatedAt`

**Errors**: 
- Может выбросить ошибку, если соединение не найдено

---

### Text Note Operations

#### `createTextNote(position: Position, text: string): TextNote`

Создает новую текстовую заметку.

**Parameters**:
- `position: Position` - Позиция на рабочем поле
- `text: string` - Текст заметки

**Returns**: `TextNote` - Новая заметка с сгенерированным ID

**Side Effects**: None

**Validation**:
- `text` не должен быть пустым

---

#### `updateTextNote(noteId: string, text: string, diagram: Diagram): Diagram`

Обновляет текст заметки.

**Parameters**:
- `noteId: string` - ID заметки
- `text: string` - Новый текст
- `diagram: Diagram` - Текущая диаграмма

**Returns**: `Diagram` - Обновленная диаграмма

**Side Effects**: 
- Обновляет текст заметки
- Обновляет `diagram.metadata.updatedAt`

**Validation**:
- `text` не должен быть пустым

**Errors**: 
- Может выбросить ошибку, если заметка не найдена

---

#### `deleteTextNote(noteId: string, diagram: Diagram): Diagram`

Удаляет текстовую заметку.

**Parameters**:
- `noteId: string` - ID заметки для удаления
- `diagram: Diagram` - Текущая диаграмма

**Returns**: `Diagram` - Обновленная диаграмма

**Side Effects**: 
- Удаляет заметку из `diagram.textNotes`
- Обновляет `diagram.metadata.updatedAt`

**Errors**: 
- Может выбросить ошибку, если заметка не найдена

---

### Drawing Operations

#### `addDrawingStroke(drawingId: string, stroke: Stroke, diagram: Diagram): Diagram`

Добавляет штрих к рисунку.

**Parameters**:
- `drawingId: string` - ID рисунка
- `stroke: Stroke` - Штрих для добавления
- `diagram: Diagram` - Текущая диаграмма

**Returns**: `Diagram` - Обновленная диаграмма

**Side Effects**: 
- Добавляет штрих в `diagram.drawings[drawingId].strokes`
- Обновляет `diagram.metadata.updatedAt`

**Errors**: 
- Может выбросить ошибку, если рисунок не найден

---

#### `deleteDrawing(drawingId: string, diagram: Diagram): Diagram`

Удаляет рисунок.

**Parameters**:
- `drawingId: string` - ID рисунка для удаления
- `diagram: Diagram` - Текущая диаграмма

**Returns**: `Diagram` - Обновленная диаграмма

**Side Effects**: 
- Удаляет рисунок из `diagram.drawings`
- Обновляет `diagram.metadata.updatedAt`

**Errors**: 
- Может выбросить ошибку, если рисунок не найден

---

## Undo/Redo Operations

#### `createCommand(action: Action, diagram: Diagram): Command`

Создает команду для системы отмены/повтора.

**Parameters**:
- `action: Action` - Действие для выполнения
- `diagram: Diagram` - Текущая диаграмма

**Returns**: `Command` - Команда с возможностью выполнения и отмены

**Side Effects**: None

---

#### `executeCommand(command: Command, diagram: Diagram): Diagram`

Выполняет команду.

**Parameters**:
- `command: Command` - Команда для выполнения
- `diagram: Diagram` - Текущая диаграмма

**Returns**: `Diagram` - Обновленная диаграмма

**Side Effects**: 
- Выполняет действие команды
- Обновляет диаграмму

---

#### `undoCommand(command: Command, diagram: Diagram): Diagram`

Отменяет команду.

**Parameters**:
- `command: Command` - Команда для отмены
- `diagram: Diagram` - Текущая диаграмма

**Returns**: `Diagram` - Диаграмма в состоянии до выполнения команды

**Side Effects**: 
- Отменяет действие команды
- Восстанавливает предыдущее состояние диаграммы

---

## Type Definitions

```typescript
type Action = 
  | { type: "CREATE_ENTITY"; entity: Entity }
  | { type: "DELETE_ENTITY"; entityId: string }
  | { type: "UPDATE_ENTITY_POSITION"; entityId: string; position: Position }
  | { type: "UPDATE_ENTITY_LABEL"; entityId: string; label: string }
  | { type: "CREATE_CONNECTION"; connection: Connection }
  | { type: "DELETE_CONNECTION"; connectionId: string }
  | { type: "CREATE_TEXT_NOTE"; note: TextNote }
  | { type: "DELETE_TEXT_NOTE"; noteId: string }
  | { type: "UPDATE_TEXT_NOTE"; noteId: string; text: string }
  | { type: "ADD_DRAWING_STROKE"; drawingId: string; stroke: Stroke }
  | { type: "DELETE_DRAWING"; drawingId: string };

interface Command {
  id: string;
  action: Action;
  execute: (diagram: Diagram) => Diagram;
  undo: (diagram: Diagram) => Diagram;
}
```

---

## Error Handling

Все операции должны обрабатывать следующие типы ошибок:

1. **ValidationError**: Некорректные входные данные
2. **NotFoundError**: Элемент не найден
3. **StorageError**: Ошибка при работе с LocalStorage
4. **SerializationError**: Ошибка при сериализации/десериализации

Все ошибки должны содержать понятные сообщения для пользователя (принцип конституции: "Понятные состояния загрузки/ошибок").

