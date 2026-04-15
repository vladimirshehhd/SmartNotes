# Smart Notes — модель предметной области, DTO и маппинг

## 1. Domain-модели

### Note
- `id: string`
- `text: string`
- `category: NoteCategory`
- `createdAt: string`
- `isPinned: boolean`

### NoteCategory
- `study`
- `shopping`
- `personal`
- `other`

### AppSettings
- `theme: "light" | "dark"`
- `defaultCategory: NoteCategory`
- `maxNoteLength: number`

### FilterState
- `selectedCategory: "all" | NoteCategory`
- `searchQuery: string`

### ClassificationRule
- `category: NoteCategory`
- `keywords: string[]`

### StorageState
- `notes: Note[]`
- `settings: AppSettings`
- `schemaVersion: number`

## 2. DTO

### NoteDTO
- `id: string`
- `text: string`
- `category: string`
- `created_at: string`
- `is_pinned?: boolean`

### SettingsDTO
- `theme: string`
- `default_category: string`
- `max_note_length: number`
- `schema_version: number`

### NotesFileDTO
- `items: NoteDTO[]`
- `schema_version: number`

### AppStateDTO
- `notes: NoteDTO[]`
- `settings: SettingsDTO`

## 3. Инварианты и ограничения данных
1. `text` заметки не может быть пустым после `trim()`.
2. Максимальная длина заметки в MVP — **280 символов**.
3. `category` должна быть одной из четырёх допустимых категорий.
4. `createdAt` хранится в ISO-формате.
5. `schemaVersion` — положительное целое число.
6. `id` должен быть уникальным среди заметок.

## 5. Правила классификации
Примеры правил:
- `shopping`: купить, магазин, хлеб, молоко, продукты
- `study`: учёба, экзамен, доклад, лабораторная, пара, задание
- `personal`: позвонить, семья, встреча, дом, мама, папа

Если совпадений нет, категория назначается как `other` или как `defaultCategory`.
