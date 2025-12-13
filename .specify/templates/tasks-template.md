---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
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

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create Feature-Sliced Design structure (app, pages, widgets, features, entities, shared)
- [ ] T002 Initialize TypeScript React project with React-Flow and dependencies
- [ ] T003 [P] Configure ESLint and Prettier
- [ ] T004 [P] Setup CSS-переменные для дизайн-токенов (цвета, типографика, радиусы, тени)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Setup database schema and migrations framework
- [ ] T005 [P] Implement authentication/authorization framework
- [ ] T006 [P] Setup API routing and middleware structure
- [ ] T007 Create base models/entities that all stories depend on
- [ ] T008 Configure error handling and logging infrastructure
- [ ] T009 Setup environment configuration management

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Verification**: [How to verify this story works on its own - ручное тестирование]

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create [Entity1] entity in src/entities/[entity1]/
- [ ] T013 [P] [US1] Create [Entity2] entity in src/entities/[entity2]/
- [ ] T014 [US1] Implement [Feature] in src/features/[feature]/ (depends on T012, T013)
- [ ] T015 [US1] Implement UI components in src/features/[feature]/ui/
- [ ] T016 [US1] Add inline-валидацию форм с немедленным отображением ошибок
- [ ] T017 [US1] Implement optimistic UI с откатом при ошибках
- [ ] T018 [US1] Add понятные состояния загрузки и обработку ошибок

**Checkpoint**: At this point, User Story 1 should be fully functional and independently verifiable through manual testing

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Verification**: [How to verify this story works on its own - ручное тестирование]

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create [Entity] entity in src/entities/[entity]/
- [ ] T021 [US2] Implement [Feature] in src/features/[feature]/
- [ ] T022 [US2] Implement UI components in src/features/[feature]/ui/
- [ ] T023 [US2] Add inline-валидацию и optimistic UI
- [ ] T024 [US2] Integrate with User Story 1 components (if needed)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Verification**: [How to verify this story works on its own - ручное тестирование]

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create [Entity] entity in src/entities/[entity]/
- [ ] T027 [US3] Implement [Feature] in src/features/[feature]/
- [ ] T028 [US3] Implement UI components in src/features/[feature]/ui/
- [ ] T029 [US3] Add inline-валидацию и optimistic UI

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories (мгновенная обратная связь)
- [ ] TXXX Проверка соответствия ESLint + Prettier
- [ ] TXXX Проверка отсутствия типа `any` в TypeScript
- [ ] TXXX Валидация использования дизайн-токенов (CSS-переменные)
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Entities before features
- Features before widgets/pages
- Core implementation before integration
- Inline-валидация и optimistic UI должны быть реализованы для всех форм
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Entities within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all entities for User Story 1 together:
Task: "Create [Entity1] entity in src/entities/[entity1]/"
Task: "Create [Entity2] entity in src/entities/[entity2]/"
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
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

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
