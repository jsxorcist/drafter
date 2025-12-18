# Tasks: Визуальный конструктор схем

**Input**: Design documents from `/specs/001-diagram-builder/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Согласно конституции проекта, автоматизированные тесты не используются. Качество обеспечивается через строгую типизацию, линтинг и ручное тестирование.

**Organization**: Tasks are grouped by user story to enable independent implementation of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Feature-Sliced Design**: Структура согласно FSD методологии:
  - `src/app/` - инициализация приложения
  - `src/pages/` - страницы
  - `src/widgets/` - крупные блоки интерфейса
  - `src/features/` - бизнес-логика и интерактивные компоненты
  - `src/entities/` - бизнес-сущности
  - `src/shared/` - переиспользуемые компоненты и утилиты
- Paths shown below follow Feature-Sliced Design structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create Feature-Sliced Design structure (app, pages, widgets, features, entities, shared) in src/
- [x] T002 Initialize Vite + React + TypeScript project with dependencies (React 18+, React-Flow, uuid)
- [x] T003 [P] Configure ESLint with TypeScript rules and no-any restriction in .eslintrc.json
- [x] T004 [P] Configure Prettier with consistent formatting in .prettierrc
- [x] T005 [P] Create CSS-переменные для дизайн-токенов (цвета, типографика, радиусы, тени) в src/shared/styles/tokens.css
- [x] T006 [P] Setup base HTML structure and root App component in src/app/App.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 [P] Create TypeScript types for Diagram entity in src/entities/diagram/types.ts
- [x] T008 [P] Create TypeScript types for Entity entity in src/entities/diagram/types.ts
- [x] T009 [P] Create TypeScript types for Connection entity in src/entities/diagram/types.ts
- [x] T010 [P] Create TypeScript types for TextNote entity in src/entities/diagram/types.ts
- [x] T011 [P] Create TypeScript types for Drawing entity in src/entities/diagram/types.ts
- [x] T012 Create utility functions for ID generation in src/shared/lib/id-generator.ts
- [x] T013 Create utility functions for validation in src/shared/lib/validation.ts
- [x] T014 Create DiagramContext and useReducer for state management in src/app/providers/DiagramProvider.tsx
- [x] T015 Create diagram reducer with actions (CREATE_ENTITY, DELETE_ENTITY, etc.) in src/app/providers/diagramReducer.ts
- [x] T016 Create empty diagram factory function in src/entities/diagram/factory.ts
- [x] T017 Setup React-Flow base configuration and styles import in src/widgets/canvas/Canvas.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Создание и размещение сущностей на рабочем поле (Priority: P1) 🎯 MVP

**Goal**: Пользователь может создавать сущности из боковой панели и размещать их на рабочем поле для визуализации концепций

**Independent Verification**: Открыть инструмент, создать несколько сущностей из боковой панели и разместить их на рабочем поле. Схема должна отображаться с размещенными сущностями.

### Implementation for User Story 1

- [x] T018 [P] [US1] Create Entity factory function with default styles in src/entities/diagram/factory.ts
- [x] T019 [P] [US1] Create entity type definitions and constants in src/entities/diagram/constants.ts
- [x] T020 [US1] Implement createEntity action in diagram reducer in src/app/providers/diagramReducer.ts
- [x] T021 [US1] Create SidePanel component for entity creation in src/widgets/side-panel/SidePanel.tsx
- [x] T022 [US1] Create entity type buttons in SidePanel in src/widgets/side-panel/EntityTypeButton.tsx
- [x] T023 [US1] Create custom React-Flow node component for entities in src/widgets/canvas/EntityNode.tsx
- [x] T024 [US1] Integrate React-Flow Canvas with DiagramContext in src/widgets/canvas/Canvas.tsx
- [x] T025 [US1] Implement click handler to create entity on canvas in src/widgets/canvas/Canvas.tsx
- [x] T026 [US1] Transform entities to React-Flow nodes in src/widgets/canvas/nodeTransform.ts
- [x] T027 [US1] Add visual feedback when creating entities (optimistic UI) in src/widgets/canvas/Canvas.tsx
- [x] T028 [US1] Create DiagramPage component combining Canvas and SidePanel in src/pages/diagram-page/DiagramPage.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and independently verifiable through manual testing

---

## Phase 4: User Story 2 - Соединение сущностей направленными стрелками (Priority: P2)

**Goal**: Пользователь может интерактивно создавать направленные соединения между сущностями для визуализации связей и потоков

**Independent Verification**: Создать две сущности на рабочем поле и интерактивно соединить их направленной стрелкой. Соединение должно визуально отображаться и отражать направление связи.

### Implementation for User Story 2

- [x] T029 [P] [US2] Create Connection factory function in src/entities/diagram/factory.ts
- [x] T030 [US2] Implement createConnection action in diagram reducer in src/app/providers/diagramReducer.ts
- [x] T031 [US2] Implement validation for connections (no self-connections) in src/shared/lib/validation.ts
- [x] T032 [US2] Add connection creation handler in React-Flow Canvas in src/widgets/canvas/Canvas.tsx
- [x] T033 [US2] Transform connections to React-Flow edges in src/widgets/canvas/edgeTransform.ts
- [x] T034 [US2] Configure React-Flow edges with arrow markers in src/widgets/canvas/Canvas.tsx
- [x] T035 [US2] Implement automatic connection update when entities move in src/widgets/canvas/Canvas.tsx
- [x] T036 [US2] Add visual feedback during connection creation (preview line) in src/widgets/canvas/Canvas.tsx
- [x] T037 [US2] Implement deleteConnection action for cleanup in diagram reducer in src/app/providers/diagramReducer.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Редактирование сущностей (перемещение, переименование, удаление) (Priority: P3)

**Goal**: Пользователь может быстро перемещать, переименовывать и удалять сущности интуитивно, без сложных меню

**Independent Verification**: Создать сущность и выполнить операции перемещения (drag-and-drop), переименования (двойной клик) и удаления (клавиша Delete). Все операции должны выполняться быстро и интуитивно.

### Implementation for User Story 3

- [x] T038 [US3] Implement updateEntityPosition action in diagram reducer in src/app/providers/diagramReducer.ts
- [x] T039 [US3] Implement updateEntityLabel action in diagram reducer in src/app/providers/diagramReducer.ts
- [x] T040 [US3] Implement deleteEntity action with connection cleanup in diagram reducer in src/app/providers/diagramReducer.ts
- [x] T041 [US3] Enable drag-and-drop for entities in React-Flow in src/widgets/canvas/Canvas.tsx
- [x] T042 [US3] Create inline text editor component for entity labels in src/widgets/canvas/EntityNode.tsx
- [x] T043 [US3] Implement double-click to edit entity label in src/widgets/canvas/EntityNode.tsx
- [x] T044 [US3] Add keyboard handler for Delete key in src/widgets/canvas/Canvas.tsx
- [x] T045 [US3] Create Command pattern for Undo/Redo in src/shared/lib/command.ts
- [x] T046 [US3] Implement undo/redo actions in diagram reducer in src/app/providers/diagramReducer.ts
- [x] T047 [US3] Add Undo/Redo keyboard shortcuts (Ctrl+Z, Ctrl+Y) in src/widgets/canvas/Canvas.tsx
- [x] T048 [US3] Add visual feedback for all edit operations (optimistic UI) in src/widgets/canvas/Canvas.tsx

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Добавление текстовых заметок на схеме (Priority: P4)

**Goal**: Пользователь может добавлять текстовые заметки на рабочее поле для пояснений и комментариев

**Independent Verification**: Создать текстовую заметку на рабочем поле, отредактировать ее содержимое и переместить в нужное место. Заметка должна быть видна и редактируема.

### Implementation for User Story 4

- [x] T049 [P] [US4] Create TextNote factory function in src/entities/diagram/factory.ts
- [x] T050 [US4] Implement createTextNote action in diagram reducer in src/app/providers/diagramReducer.ts
- [x] T051 [US4] Implement updateTextNote action in diagram reducer in src/app/providers/diagramReducer.ts
- [x] T052 [US4] Implement deleteTextNote action in diagram reducer in src/app/providers/diagramReducer.ts
- [x] T053 [US4] Create custom React-Flow node for text notes in src/widgets/canvas/TextNoteNode.tsx
- [x] T054 [US4] Add text note creation button in SidePanel in src/widgets/side-panel/SidePanel.tsx
- [x] T055 [US4] Implement click handler to create text note on canvas in src/widgets/canvas/Canvas.tsx
- [x] T056 [US4] Create inline editor for text notes in src/widgets/canvas/TextNoteNode.tsx
- [x] T057 [US4] Enable drag-and-drop for text notes in src/widgets/canvas/Canvas.tsx
- [x] T058 [US4] Transform text notes to React-Flow nodes in src/widgets/canvas/nodeTransform.ts
- [x] T059 [US4] Add visual feedback for text note operations in src/widgets/canvas/Canvas.tsx

**Checkpoint**: At this point, User Stories 1-4 should all work independently

---

## Phase 7: User Story 5 - Рисование на схеме (Priority: P5)

**Goal**: Пользователь может добавлять произвольные рисунки и аннотации на схему для дополнительного пояснения

**Independent Verification**: Активировать режим рисования и создать произвольные линии или фигуры на рабочем поле. Рисунки должны сохраняться и быть видимыми на схеме.

### Implementation for User Story 5

- [x] T060 [P] [US5] Create Drawing factory function and Stroke types in src/entities/diagram/factory.ts
- [x] T061 [US5] Implement addDrawingStroke action in diagram reducer in src/app/providers/diagramReducer.ts
- [x] T062 [US5] Implement deleteDrawing action in diagram reducer in src/app/providers/diagramReducer.ts
- [x] T063 [US5] Create DrawingMode feature component in src/features/drawing-mode/DrawingMode.tsx
- [x] T064 [US5] Create Canvas layer for drawing overlay in src/features/drawing-mode/DrawingCanvas.tsx
- [x] T065 [US5] Implement mouse event handlers for drawing in src/features/drawing-mode/DrawingCanvas.tsx
- [x] T066 [US5] Add drawing mode toggle button in SidePanel in src/widgets/side-panel/SidePanel.tsx
- [x] T067 [US5] Integrate drawing canvas layer with React-Flow Canvas in src/widgets/canvas/Canvas.tsx
- [x] T068 [US5] Implement stroke rendering on canvas in src/features/drawing-mode/DrawingCanvas.tsx
- [x] T069 [US5] Add drawing selection and deletion UI in src/features/drawing-mode/DrawingCanvas.tsx
- [x] T070 [US5] Save drawing strokes to diagram state in src/features/drawing-mode/DrawingCanvas.tsx

**Checkpoint**: At this point, User Stories 1-5 should all work independently

---

## Phase 8: User Story 6 - Сохранение и восстановление схемы (Priority: P6)

**Goal**: Пользователь может сохранить текущее состояние схемы и восстановить его позже в том же браузере

**Independent Verification**: Создать схему, сохранить ее, закрыть и снова открыть инструмент, восстановить сохраненную схему. Все элементы должны быть восстановлены в том же состоянии.

### Implementation for User Story 6

- [x] T071 [P] [US6] Create serializeDiagram function for JSON export in src/entities/diagram/serialization.ts
- [x] T072 [P] [US6] Create deserializeDiagram function with validation in src/entities/diagram/serialization.ts
- [x] T073 [US6] Implement saveDiagram to LocalStorage in src/features/save-load/saveDiagram.ts
- [x] T074 [US6] Implement loadDiagram from LocalStorage in src/features/save-load/loadDiagram.ts
- [x] T075 [US6] Create auto-save functionality with debounce in src/features/save-load/autoSave.ts
- [x] T076 [US6] Add save button in UI in src/widgets/toolbar/Toolbar.tsx
- [x] T077 [US6] Implement export diagram to JSON file in src/features/save-load/exportDiagram.ts
- [x] T078 [US6] Implement import diagram from JSON file in src/features/save-load/importDiagram.ts
- [x] T079 [US6] Add import/export buttons in Toolbar in src/widgets/toolbar/Toolbar.tsx
- [x] T080 [US6] Create restore diagram prompt on app load in src/app/App.tsx
- [x] T081 [US6] Add error handling for LocalStorage operations in src/features/save-load/saveDiagram.ts
- [x] T082 [US6] Add error handling for import validation in src/features/save-load/importDiagram.ts
- [x] T083 [US6] Implement diagram versioning for compatibility in src/entities/diagram/serialization.ts

**Checkpoint**: At this point, all user stories should be fully functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T084 [P] Implement dark theme toggle in src/features/theme-toggle/ThemeToggle.tsx
- [x] T085 [P] Add dark theme CSS variables in src/shared/styles/tokens.css
- [x] T086 [P] Create theme persistence in LocalStorage in src/features/theme-toggle/ThemeToggle.tsx
- [x] T087 [P] Add Toolbar component with save/export/import buttons in src/widgets/toolbar/Toolbar.tsx
- [x] T088 Optimize React-Flow rendering for 50+ entities in src/widgets/canvas/Canvas.tsx
- [x] T089 Add debounce for auto-save to reduce LocalStorage writes in src/features/save-load/autoSave.ts
- [x] T090 Implement React.memo for EntityNode and TextNoteNode components in src/widgets/canvas/
- [x] T091 Add keyboard shortcuts help modal in src/widgets/help-modal/HelpModal.tsx
- [x] T092 Add error messages with user-friendly text in src/shared/ui/ErrorMessage.tsx
- [x] T093 Add loading states for save/load operations in src/features/save-load/
- [x] T094 Verify all components use CSS-переменные from tokens.css
- [x] T095 Run ESLint check and fix all no-any violations
- [x] T096 Verify optimistic UI for all user interactions
- [x] T097 Add ARIA labels for accessibility in all interactive components
- [x] T098 Test all user stories manually according to acceptance scenarios
- [x] T099 Validate quickstart.md instructions work correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5 → P6)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 (needs entities to connect)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US1 (needs entities to edit)
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Independent, but benefits from US1-3
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - Independent
- **User Story 6 (P6)**: Can start after Foundational (Phase 2) - Independent, but needs content to save

### Within Each User Story

- Entities before features
- Features before widgets/pages
- Core implementation before integration
- Inline-валидация и optimistic UI должны быть реализованы для всех форм
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, user stories can start in parallel (with dependencies respected)
- Entities within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members (respecting dependencies)

---

## Parallel Example: User Story 1

```bash
# Launch all entity types together:
Task: "Create Entity factory function with default styles in src/entities/diagram/factory.ts"
Task: "Create entity type definitions and constants in src/entities/diagram/constants.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Add User Story 6 → Test independently → Deploy/Demo
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 4 (independent)
   - Developer C: User Story 5 (independent)
3. After US1 complete:
   - Developer A: User Story 2
   - Developer B: User Story 3
   - Developer C: User Story 6
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and verifiable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently through manual testing
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Ensure all forms have inline-валидацию and optimistic UI
- Use CSS-переменные for all visual parameters (colors, typography, radii, shadows)
- All TypeScript code must avoid `any` type (use `unknown` with type guards)
- All user interactions must provide visual feedback within 100ms

