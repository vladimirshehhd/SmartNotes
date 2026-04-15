# Smart Notes - Диаграммы последовательностей

## 1. Добавление заметки

```text
User -> MainView: вводит текст и нажимает "Добавить"
MainView -> NotesViewModel: handleAddNote(text)
NotesViewModel -> NotesService: addNote(text)
NotesService -> SettingsService: getSettings()
SettingsService -> LocalStorageAdapter: loadSettings()
LocalStorageAdapter --> SettingsService: settings
SettingsService --> NotesService: settings
NotesService -> ClassifierService: classify(text, defaultCategory)
ClassifierService --> NotesService: category
NotesService -> LocalStorageAdapter: loadNotes()
LocalStorageAdapter --> NotesService: notes
NotesService -> LocalStorageAdapter: saveNotes(updatedList)
LocalStorageAdapter --> NotesService: ok
NotesService --> NotesViewModel: newNote
NotesViewModel -> MainView: render(success)
```

## 2. Загрузка заметок при старте

```text
User -> MainView: открывает приложение
MainView -> NotesViewModel: init()
NotesViewModel -> NotesService: getAllNotes()
NotesService -> LocalStorageAdapter: loadNotes()
LocalStorageAdapter --> NotesService: notes
NotesService --> NotesViewModel: notes
NotesViewModel -> SettingsService: getSettings()
SettingsService -> LocalStorageAdapter: loadSettings()
LocalStorageAdapter --> SettingsService: settings
SettingsService --> NotesViewModel: settings
NotesViewModel -> MainView: render(list)
```
