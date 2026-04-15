# Smart Notes — интерфейсы и типы ошибок

## 1. Интерфейс классификатора

```ts
interface IClassifier {
  classify(text: string, defaultCategory: NoteCategory): NoteCategory;
}
```

## 2. Интерфейс хранилища заметок

```ts
interface INotesStorage {
  loadNotes(): Promise<Note[]>;
  saveNotes(notes: Note[]): Promise<void>;
  clearNotes(): Promise<void>;
}
```

## 3. Интерфейс хранилища настроек

```ts
interface ISettingsStorage {
  loadSettings(): Promise<AppSettings>;
  saveSettings(settings: AppSettings): Promise<void>;
}
```

## 4. Интерфейс конфигурации

```ts
interface IConfigProvider {
  getDefaultSettings(): AppSettings;
  getMaxNoteLength(): number;
  getStorageKeys(): {
    notesKey: string;
    settingsKey: string;
  };
}
```

## 5. Интерфейс кеша

```ts
interface ICache<T> {
  get(key: string): T | null;
  set(key: string, value: T, ttlMs?: number): void;
  remove(key: string): void;
  clear(): void;
}
```

## 6. Интерфейсы сервисов

```ts
interface INotesService {
  addNote(text: string): Promise<Note>;
  deleteNote(noteId: string): Promise<void>;
  getAllNotes(): Promise<Note[]>;
  getFilteredNotes(category: NoteCategory | "all"): Promise<Note[]>;
}
```

```ts
interface ISettingsService {
  getSettings(): Promise<AppSettings>;
  updateSettings(settings: AppSettings): Promise<void>;
}
```
