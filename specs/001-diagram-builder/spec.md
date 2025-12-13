# Feature Specification: Визуальный конструктор схем

**Feature Branch**: `001-diagram-builder`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "Создать веб-инструмент для менеджеров и продуктовых команд, позволяющий быстро строить визуальные схемы во время живых обсуждений. Пользователи могут размещать сущности на рабочем поле, соединять их направленными стрелками и добавлять короткие текстовые заметки прямо на схеме. Есть возможность рисовать. Сущности создаются из боковой панели, свободно перемещаются, переименовываются, соединяются и удаляются. Соединения визуально отражают связи или поток между сущностями и создаются интерактивно. Рабочее поле должно ощущаться отзывчивым и «прощать ошибки», позволяя быстро вносить изменения без сложных меню и настроек. Инструмент предназначен для быстрого объяснения и генерации идей, а не для точного дизайна или долгосрочной совместной работы. Пользователь должен иметь возможность сохранить текущее состояние схемы и позже восстановить его в том же браузере."

## User Scenarios & Verification *(mandatory)*

### User Story 1 - Создание и размещение сущностей на рабочем поле (Priority: P1)

Менеджер во время живого обсуждения продукта открывает инструмент и начинает строить схему. Он создает сущности из боковой панели и размещает их на рабочем поле, чтобы визуализировать концепцию или процесс.

**Why this priority**: Это базовая функциональность инструмента. Без возможности создавать и размещать сущности невозможно построить схему. Это минимально необходимый функционал для MVP.

**Independent Verification**: Можно проверить, открыв инструмент, создав несколько сущностей из боковой панели и разместив их на рабочем поле. Схема должна отображаться с размещенными сущностями.

**Acceptance Scenarios**:

1. **Given** пользователь открыл инструмент с пустым рабочим полем, **When** пользователь выбирает тип сущности из боковой панели и кликает на рабочее поле, **Then** новая сущность появляется на рабочем поле в месте клика
2. **Given** на рабочем поле уже есть несколько сущностей, **When** пользователь создает новую сущность, **Then** новая сущность не перекрывает существующие и размещается в указанном месте
3. **Given** пользователь создал сущность, **When** пользователь просматривает рабочее поле, **Then** сущность отображается с понятным визуальным представлением (форма, цвет, текст)

---

### User Story 2 - Соединение сущностей направленными стрелками (Priority: P2)

Продуктовый менеджер создал несколько сущностей, представляющих этапы процесса. Теперь он соединяет их направленными стрелками, чтобы показать поток или связи между этапами.

**Why this priority**: Соединения - это ключевая функциональность для создания осмысленных схем. Без возможности соединять сущности инструмент не может выполнять свою основную задачу - визуализацию связей и потоков.

**Independent Verification**: Можно проверить, создав две сущности на рабочем поле и интерактивно соединив их направленной стрелкой. Соединение должно визуально отображаться и отражать направление связи.

**Acceptance Scenarios**:

1. **Given** на рабочем поле есть две сущности, **When** пользователь начинает перетаскивание от одной сущности к другой, **Then** появляется визуальная индикация соединения, и при отпускании создается направленная стрелка
2. **Given** создано соединение между двумя сущностями, **When** пользователь перемещает одну из сущностей, **Then** соединение автоматически обновляется, сохраняя связь
3. **Given** на рабочем поле есть несколько сущностей, **When** пользователь создает множественные соединения, **Then** все соединения визуально различимы и не перекрываются критически
4. **Given** создано соединение, **When** пользователь удаляет одну из связанных сущностей, **Then** соединение также удаляется

---

### User Story 3 - Редактирование сущностей (перемещение, переименование, удаление) (Priority: P3)

Во время обсуждения менеджер понимает, что нужно изменить название сущности, переместить ее в другое место или удалить ненужную. Он делает это быстро и интуитивно, без сложных меню.

**Why this priority**: Возможность редактирования критична для итеративного процесса создания схем во время обсуждений. Без этого пользователи не смогут вносить изменения и уточнения по ходу работы.

**Independent Verification**: Можно проверить, создав сущность и выполнив операции перемещения (drag-and-drop), переименования (двойной клик или inline-редактирование) и удаления (клавиша Delete или контекстное меню). Все операции должны выполняться быстро и интуитивно.

**Acceptance Scenarios**:

1. **Given** на рабочем поле есть сущность, **When** пользователь перетаскивает сущность в другое место, **Then** сущность перемещается плавно, и все соединения обновляются автоматически
2. **Given** на рабочем поле есть сущность с текстом, **When** пользователь активирует режим редактирования (двойной клик или специальное действие), **Then** текст становится редактируемым inline, и изменения сохраняются при подтверждении
3. **Given** на рабочем поле есть сущность, **When** пользователь удаляет сущность (клавиша Delete или контекстное меню), **Then** сущность удаляется, и все связанные соединения также удаляются
4. **Given** пользователь случайно удалил сущность, **When** рабочее поле "прощает ошибки", **Then** должна быть возможность быстро отменить действие (например, через Undo)

---

### User Story 4 - Добавление текстовых заметок на схеме (Priority: P4)

Менеджер хочет добавить короткое пояснение или комментарий прямо на схеме, рядом с определенной сущностью или в свободной области рабочего поля.

**Why this priority**: Текстовые заметки помогают добавлять контекст и пояснения к схеме, делая ее более информативной. Это важная функциональность для объяснения концепций во время обсуждений.

**Independent Verification**: Можно проверить, создав текстовую заметку на рабочем поле, отредактировав ее содержимое и переместив в нужное место. Заметка должна быть видна и редактируема.

**Acceptance Scenarios**:

1. **Given** пользователь работает со схемой, **When** пользователь создает текстовую заметку (через боковую панель или контекстное меню), **Then** заметка появляется на рабочем поле и может быть размещена в любом месте
2. **Given** создана текстовая заметка, **When** пользователь редактирует текст заметки, **Then** изменения применяются мгновенно, и заметка остается на месте
3. **Given** на рабочем поле есть текстовая заметка, **When** пользователь перемещает заметку, **Then** заметка перемещается свободно, не привязываясь к сущностям

---

### User Story 5 - Рисование на схеме (Priority: P5)

Пользователь хочет добавить произвольные рисунки или аннотации на схему для дополнительного пояснения или выделения областей.

**Why this priority**: Рисование - это дополнительная функциональность, которая расширяет возможности инструмента, но не является критичной для основной задачи построения схем. Это улучшает гибкость инструмента для творческих обсуждений.

**Independent Verification**: Можно проверить, активировав режим рисования и создав произвольные линии или фигуры на рабочем поле. Рисунки должны сохраняться и быть видимыми на схеме.

**Acceptance Scenarios**:

1. **Given** пользователь работает со схемой, **When** пользователь активирует режим рисования и рисует на рабочем поле, **Then** рисунок отображается в реальном времени и сохраняется как часть схемы
2. **Given** на схеме есть рисунок, **When** пользователь перемещает сущности или другие элементы, **Then** рисунок остается на месте и не мешает взаимодействию с другими элементами
3. **Given** пользователь создал рисунок, **When** пользователь хочет удалить рисунок, **Then** должна быть возможность выбрать и удалить рисунок

---

### User Story 6 - Сохранение и восстановление схемы (Priority: P6)

Менеджер создал схему во время обсуждения и хочет сохранить ее, чтобы позже вернуться к ней в том же браузере и продолжить работу или показать коллегам.

**Why this priority**: Сохранение позволяет пользователям не терять работу и возвращаться к схемам позже. Хотя потеря данных допустима на ранних этапах согласно конституции, возможность сохранения значительно улучшает пользовательский опыт.

**Independent Verification**: Можно проверить, создав схему, сохранив ее, закрыв и снова открыв инструмент, и восстановив сохраненную схему. Все элементы схемы должны быть восстановлены в том же состоянии.

**Acceptance Scenarios**:

1. **Given** пользователь создал схему с сущностями, соединениями и заметками, **When** пользователь сохраняет схему, **Then** состояние схемы сохраняется локально в браузере
2. **Given** пользователь сохранил схему, **When** пользователь закрывает и снова открывает инструмент в том же браузере, **Then** система предлагает восстановить последнюю сохраненную схему
3. **Given** пользователь восстановил сохраненную схему, **When** пользователь просматривает рабочее поле, **Then** все элементы (сущности, соединения, заметки, рисунки) отображаются в том же состоянии, что и при сохранении
4. **Given** пользователь работает с восстановленной схемой, **When** пользователь вносит изменения, **Then** изменения могут быть сохранены поверх существующей схемы или как новая версия

---

### Edge Cases

- Что происходит, когда пользователь пытается создать соединение от сущности к самой себе?
- Как система обрабатывает ситуацию, когда на рабочем поле размещено очень большое количество сущностей (например, 100+)?
- Что происходит, если пользователь пытается сохранить схему, но в браузере недостаточно места для локального хранилища?
- Как система обрабатывает ситуацию, когда пользователь случайно закрывает вкладку браузера во время работы над схемой?
- Что происходит, если пользователь пытается переместить сущность за пределы видимой области рабочего поля?
- Как система обрабатывает ситуацию, когда пользователь создает соединение между сущностями, которые находятся очень далеко друг от друга?
- Что происходит, если пользователь пытается переименовать сущность, введя очень длинный текст?
- Как система обрабатывает ситуацию, когда пользователь работает на устройстве с маленьким экраном (мобильный телефон)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create entities from a side panel and place them on the canvas
- **FR-002**: System MUST allow users to freely move entities on the canvas using drag-and-drop
- **FR-003**: System MUST allow users to rename entities through inline editing (double-click or similar intuitive action)
- **FR-004**: System MUST allow users to delete entities (Delete key or context menu)
- **FR-005**: System MUST allow users to create directed connections (arrows) between entities interactively
- **FR-006**: System MUST automatically update connections when connected entities are moved
- **FR-007**: System MUST automatically remove connections when one of the connected entities is deleted
- **FR-008**: System MUST allow users to add text notes directly on the canvas
- **FR-009**: System MUST allow users to edit text notes inline
- **FR-010**: System MUST allow users to move text notes freely on the canvas
- **FR-011**: System MUST provide drawing functionality for adding freeform annotations to the canvas
- **FR-012**: System MUST allow users to save the current state of the diagram locally in the browser
- **FR-013**: System MUST allow users to restore a previously saved diagram in the same browser
- **FR-014**: System MUST provide an intuitive, responsive interface that minimizes friction and "forgives mistakes"
- **FR-015**: System MUST allow quick changes without complex menus and settings
- **FR-016**: System MUST provide visual feedback for all user interactions (creating, moving, connecting, editing)
- **FR-017**: System MUST handle errors gracefully with clear, user-friendly messages
- **FR-018**: System MUST support undo functionality for accidental deletions or changes

### Key Entities

- **Entity (Сущность)**: Represents a conceptual element on the diagram (e.g., process step, component, actor). Has position (x, y coordinates), visual representation (shape, color), text label, and unique identifier. Can be connected to other entities.

- **Connection (Соединение)**: Represents a directed relationship or flow between two entities. Has source entity, target entity, visual representation (arrow), and direction. Automatically updates when source or target entities are moved.

- **Text Note (Текстовая заметка)**: Represents a free-form text annotation on the canvas. Has position (x, y coordinates), text content, and can be placed independently of entities.

- **Drawing (Рисунок)**: Represents freeform drawing annotations on the canvas. Has stroke data (path, color, thickness) and position. Stored as part of the diagram but independent of entities.

- **Diagram (Схема)**: Represents the complete state of the canvas, including all entities, connections, text notes, and drawings. Can be saved and restored as a single unit.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create and place their first entity on the canvas within 10 seconds of opening the tool
- **SC-002**: Users can create a simple diagram with 5 entities and 4 connections in under 2 minutes
- **SC-003**: All user interactions (create, move, connect, edit, delete) provide visual feedback within 100 milliseconds
- **SC-004**: Users can successfully save and restore a diagram with 20+ entities and 15+ connections without data loss
- **SC-005**: The interface feels responsive and "forgiving" - users can undo accidental deletions and make quick corrections without frustration
- **SC-006**: Users can complete the primary workflow (create entities, connect them, add notes) without consulting documentation or help
- **SC-007**: The tool supports diagrams with up to 50 entities and 40 connections while maintaining smooth interaction performance
- **SC-008**: 90% of users can successfully create their first meaningful diagram (3+ entities, 2+ connections) on first attempt without errors
