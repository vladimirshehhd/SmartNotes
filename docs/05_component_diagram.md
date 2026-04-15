# Smart Notes — диаграмма компонентов

## 1. Описание компонентов
- **Main View / Settings View** — интерфейс.
- **NotesViewModel** — координация сценариев и состояние экрана.
- **NotesService** — работа с заметками.
- **SettingsService** — работа с настройками.
- **ConfigService** — значения по умолчанию и константы.
- **ClassifierService** — определение категории.
- **ClassificationRules** — словари ключевых слов.
- **StorageService** — работа с localStorage.

## 2. Правила
1. View не обращается напрямую к StorageService.
2. ViewModel не содержит правил хранения и классификации.
3. StorageService скрывает браузерный API от остальной системы.
