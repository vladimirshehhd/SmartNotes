# Smart Notes — архитектура: слои и модули

## 1. Архитектурный стиль
Для проекта выбран стиль **MVVM-like**.

## 2. Слои

### UI Layer
Отвечает за отображение интерфейса и обработку действий пользователя.

### ViewModel / Presentation Layer
Связывает UI с сервисами приложения.

### Application / Service Layer
Содержит сценарии использования:
- создать заметку;
- удалить заметку;
- загрузить список;
- применить фильтр;
- сохранить настройки.

### Domain Layer
Содержит модели и бизнес-правила.

### Infrastructure Layer
Отвечает за localStorage, JSON, конфигурацию и PWA.

## 3. Модули и ответственность
1. `ui` — рендеринг формы, списка, ошибок, экрана настроек.
2. `presentation` — состояние экрана и обработка событий.
3. `application` — use case-сценарии.
4. `domain` — модели, категории, валидация.
5. `classification` — алгоритм и правила определения категорий.
6. `storage` — чтение и запись localStorage.
7. `config` — значения по умолчанию и константы.
8. `pwa` — manifest и service worker.

## 4. Правило зависимостей
- `ui` -> `presentation`
- `presentation` -> `application`
- `application` -> `domain`, `classification`, `storage`, `config`
- `domain` не зависит от внешних слоёв

## 5. Ключевой принцип
UI не должен напрямую читать или записывать localStorage.  
Все операции проходят через Application и Infrastructure слои.
