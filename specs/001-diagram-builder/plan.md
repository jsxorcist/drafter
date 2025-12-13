# Implementation Plan: Визуальный конструктор схем

**Branch**: `001-diagram-builder` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-diagram-builder/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Веб-инструмент для быстрого построения визуальных схем во время живых обсуждений. Одностраничное React-приложение с использованием React-Flow для визуализации графов. Состояние полностью хранится на клиенте, сохранение через локальное хранилище браузера с экспортом/импортом JSON. Интерфейс включает рабочее поле, боковую панель и поддержку темной темы.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x (strict mode, no any)  
**Primary Dependencies**: React 18+, React-Flow (для работы с графами), Vite (сборщик)  
**Storage**: LocalStorage для сохранения схем, JSON для экспорта/импорта  
**Testing**: Нет автоматизированных тестов (согласно конституции)  
**Target Platform**: Браузер (полностью клиентское приложение, SPA)  
**Project Type**: web (frontend-only, одностраничное приложение)  
**Performance Goals**: Визуальная обратная связь в пределах 100ms, плавное взаимодействие с 50+ сущностями  
**Constraints**: Без серверной части, без аутентификации, минимальные зависимости, только браузерное хранилище  
**Scale/Scope**: Ситуативное использование "здесь и сейчас", поддержка до 50 сущностей и 40 соединений без деградации производительности

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Проверка соответствия конституции Drafter:**

- ✅ **TypeScript без any**: Все типы явно определены, использование `any` запрещено
- ✅ **ESLint + Prettier**: Конфигурация настроена и применяется автоматически
- ✅ **Feature-Sliced Design**: Структура кода следует FSD методологии (app, pages, widgets, features, entities, shared)
- ✅ **Без тестов**: Автоматизированные тесты не используются
- ✅ **Единые дизайн-токены**: Все визуальные параметры через CSS-переменные (цвета, типографика, радиусы, тени)
- ✅ **Inline-валидация форм**: Валидация в реальном времени с немедленным отображением ошибок
- ✅ **Optimistic UI с откатом**: Интерфейс обновляется немедленно, с откатом при ошибках
- ✅ **Понятные состояния загрузки/ошибок**: Все асинхронные операции имеют явные состояния
- ✅ **Минимальные зависимости**: Библиотеки подключаются только для решения конкретных задач
- ✅ **Браузерное приложение**: Работает полностью в браузере без серверной части

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# Feature-Sliced Design структура (согласно конституции)
src/
├── app/                    # Инициализация приложения, провайдеры, роутинг
├── pages/                  # Страницы приложения
├── widgets/                # Крупные составные блоки интерфейса
├── features/               # Бизнес-логика и интерактивные компоненты
├── entities/               # Бизнес-сущности (модели данных)
└── shared/                 # Переиспользуемые компоненты, утилиты, дизайн-токены
    ├── ui/                 # Базовые UI компоненты
    ├── lib/                # Утилиты и хелперы
    └── styles/             # CSS-переменные для дизайн-токенов
```

**Structure Decision**: Feature-Sliced Design структура выбрана согласно конституции проекта. Приложение одностраничное, поэтому основная логика будет в `pages/diagram-page`, компоненты рабочего поля в `widgets/canvas`, функциональность создания/редактирования сущностей в `features/entity-management`, модели данных в `entities/diagram`, а базовые UI компоненты и дизайн-токены в `shared`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Нет нарушений конституции. Все решения соответствуют принципам проекта.

---

## Phase 0: Research Complete ✅

**Output**: [research.md](./research.md)

**Key Decisions**:
- React-Flow для работы с графами
- Context API + useReducer для управления состоянием
- HTML5 Canvas API для рисования
- CSS-переменные для темной темы
- JSON для сериализации
- LocalStorage для сохранения

---

## Phase 1: Design Complete ✅

**Outputs**:
- [data-model.md](./data-model.md) - Модель данных с TypeScript интерфейсами
- [contracts/data-operations.md](./contracts/data-operations.md) - Контракты операций с данными
- [quickstart.md](./quickstart.md) - Руководство по быстрому старту

**Key Artifacts**:
- Полная модель данных с валидацией
- Контракты для всех операций с диаграммой
- TypeScript интерфейсы для типобезопасности
- Руководство по настройке проекта

---

## Phase 2: Ready for Task Breakdown

План готов для создания задач через `/speckit.tasks`.
