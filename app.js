(() => {
  const APP_KEYS = {
    notes: 'smart_notes_notes',
    settings: 'smart_notes_settings',
  };

  const DEFAULT_SETTINGS = {
    theme: 'light',
    defaultCategory: 'other',
    maxNoteLength: 280,
  };

  const CATEGORY_LABELS = {
    study: 'Учёба',
    shopping: 'Покупки',
    personal: 'Личное',
    other: 'Другое',
  };

  const CLASSIFICATION_RULES = [
    { category: 'shopping', keywords: ['купить', 'магазин', 'продукты', 'молоко', 'хлеб', 'супермаркет', 'заказать', 'аптека'] },
    { category: 'study', keywords: ['учёба', 'урок', 'пара', 'лаба', 'лабораторная', 'доклад', 'экзамен', 'задание', 'курсовая', 'реферат'] },
    { category: 'personal', keywords: ['позвонить', 'семья', 'мама', 'папа', 'встреча', 'дом', 'личное', 'день рождения', 'родители'] },
  ];

  const state = {
    notes: [],
    filter: 'all',
    searchQuery: '',
    settings: { ...DEFAULT_SETTINGS },
    installPromptEvent: null,
  };

  const elements = {
    body: document.body,
    noteForm: document.getElementById('note-form'),
    noteInput: document.getElementById('note-input'),
    addNoteBtn: document.getElementById('add-note-btn'),
    charCounter: document.getElementById('char-counter'),
    formMessage: document.getElementById('form-message'),
    notesList: document.getElementById('notes-list'),
    notesState: document.getElementById('notes-state'),
    notesSummary: document.getElementById('notes-summary'),
    categoryFilters: document.getElementById('category-filters'),
    searchInput: document.getElementById('search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    settingsDialog: document.getElementById('settings-dialog'),
    openSettingsBtn: document.getElementById('open-settings-btn'),
    themeSelect: document.getElementById('theme-select'),
    defaultCategorySelect: document.getElementById('default-category-select'),
    saveSettingsBtn: document.getElementById('save-settings-btn'),
    clearNotesBtn: document.getElementById('clear-notes-btn'),
    installBtn: document.getElementById('install-btn'),
    noteCardTemplate: document.getElementById('note-card-template'),
  };

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      console.error(`Failed to read ${key}`, error);
      showFormMessage('Не удалось загрузить сохранённые данные.');
      return fallback;
    }
  }

  function saveJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Failed to save ${key}`, error);
      showFormMessage('Не удалось сохранить изменения. Проверьте настройки браузера.');
      return false;
    }
  }

  function sanitizeText(text) {
    return text.replace(/\s+/g, ' ').trim();
  }

  function classifyNote(text, defaultCategory) {
    const value = text.toLowerCase();
    for (const rule of CLASSIFICATION_RULES) {
      if (rule.keywords.some((keyword) => value.includes(keyword))) {
        return rule.category;
      }
    }
    return defaultCategory || 'other';
  }

  function createNote(text) {
    const normalizedText = sanitizeText(text);
    return {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text: normalizedText,
      category: classifyNote(normalizedText, state.settings.defaultCategory),
      createdAt: new Date().toISOString(),
      isPinned: false,
    };
  }

  function validateNote(text) {
    const trimmed = sanitizeText(text);
    if (!trimmed) return 'Введите текст заметки.';
    if (text.trim() && !trimmed) return 'Заметка не может состоять только из пробелов.';
    if (trimmed.length > state.settings.maxNoteLength) {
      return `Слишком длинная заметка. Максимум — ${state.settings.maxNoteLength} символов.`;
    }
    return '';
  }

  function formatDate(isoString) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ru-RU', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }

  function showFormMessage(message, isSuccess = false) {
    elements.formMessage.textContent = message;
    elements.formMessage.style.color = isSuccess ? 'var(--primary)' : 'var(--danger)';
  }

  function applyTheme(theme) {
    elements.body.dataset.theme = theme;
  }

  function getVisibleNotes() {
    const normalizedQuery = state.searchQuery.trim().toLowerCase();
    return state.notes.filter((note) => {
      const matchesCategory = state.filter === 'all' || note.category === state.filter;
      const matchesSearch = !normalizedQuery || note.text.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }

  function updateSummary(visibleCount) {
    const total = state.notes.length;
    elements.notesSummary.textContent = `Всего заметок: ${total}. Показано: ${visibleCount}.`;
  }

  function renderNotes() {
    const visibleNotes = getVisibleNotes();
    elements.notesList.innerHTML = '';

    if (!state.notes.length) {
      elements.notesState.textContent = 'Заметок пока нет. Добавьте первую запись.';
      elements.notesState.classList.remove('hidden');
      updateSummary(0);
      return;
    }

    if (!visibleNotes.length) {
      elements.notesState.textContent = 'Ничего не найдено по выбранному фильтру.';
      elements.notesState.classList.remove('hidden');
      updateSummary(0);
      return;
    }

    elements.notesState.classList.add('hidden');
    const fragment = document.createDocumentFragment();

    visibleNotes
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .forEach((note) => {
        const clone = elements.noteCardTemplate.content.cloneNode(true);
        clone.querySelector('.category-badge').textContent = CATEGORY_LABELS[note.category] || CATEGORY_LABELS.other;
        clone.querySelector('.note-date').textContent = formatDate(note.createdAt);
        clone.querySelector('.note-text').textContent = note.text;
        const deleteBtn = clone.querySelector('.delete-note-btn');
        deleteBtn.dataset.id = note.id;
        fragment.appendChild(clone);
      });

    elements.notesList.appendChild(fragment);
    updateSummary(visibleNotes.length);
  }

  function persistNotes() {
    return saveJson(APP_KEYS.notes, state.notes);
  }

  function persistSettings() {
    return saveJson(APP_KEYS.settings, state.settings);
  }

  function updateCharCounter() {
    elements.charCounter.textContent = `${elements.noteInput.value.length} / ${state.settings.maxNoteLength}`;
  }

  function setLoading(isLoading) {
    elements.addNoteBtn.disabled = isLoading;
    elements.addNoteBtn.textContent = isLoading ? 'Сохраняю...' : 'Добавить';
  }

  function initializeState() {
    const loadedNotes = loadJson(APP_KEYS.notes, []);
    const loadedSettings = loadJson(APP_KEYS.settings, DEFAULT_SETTINGS);

    state.notes = Array.isArray(loadedNotes) ? loadedNotes : [];
    state.settings = {
      ...DEFAULT_SETTINGS,
      ...(loadedSettings && typeof loadedSettings === 'object' ? loadedSettings : {}),
    };

    elements.themeSelect.value = state.settings.theme;
    elements.defaultCategorySelect.value = state.settings.defaultCategory;
    applyTheme(state.settings.theme);
    renderNotes();
    updateCharCounter();
  }

  function onAddNote(event) {
    event.preventDefault();
    showFormMessage('');
    const rawText = elements.noteInput.value;
    const validationError = validateNote(rawText);

    if (validationError) {
      showFormMessage(validationError);
      return;
    }

    setLoading(true);
    const note = createNote(rawText);
    state.notes.push(note);

    if (!persistNotes()) {
      state.notes.pop();
      setLoading(false);
      return;
    }

    elements.noteInput.value = '';
    updateCharCounter();
    setLoading(false);
    showFormMessage(`Заметка добавлена. Категория: ${CATEGORY_LABELS[note.category]}.`, true);
    renderNotes();
  }

  function onDeleteNote(event) {
    const button = event.target.closest('.delete-note-btn');
    if (!button) return;
    const noteId = button.dataset.id;
    const nextNotes = state.notes.filter((note) => note.id !== noteId);
    if (nextNotes.length === state.notes.length) return;
    state.notes = nextNotes;
    if (!persistNotes()) return;
    renderNotes();
    showFormMessage('Заметка удалена.', true);
  }

  function onFilterClick(event) {
    const button = event.target.closest('.filter-chip');
    if (!button) return;
    state.filter = button.dataset.filter;
    Array.from(elements.categoryFilters.querySelectorAll('.filter-chip')).forEach((chip) => {
      chip.classList.toggle('active', chip.dataset.filter === state.filter);
    });
    renderNotes();
  }

  function onSaveSettings() {
    state.settings.theme = elements.themeSelect.value;
    state.settings.defaultCategory = elements.defaultCategorySelect.value;
    applyTheme(state.settings.theme);
    if (persistSettings()) {
      elements.settingsDialog.close();
      renderNotes();
      showFormMessage('Настройки сохранены.', true);
    }
  }

  function onClearNotes() {
    const confirmed = window.confirm('Удалить все заметки? Это действие нельзя отменить.');
    if (!confirmed) return;
    state.notes = [];
    if (persistNotes()) {
      renderNotes();
      elements.settingsDialog.close();
      showFormMessage('Все заметки удалены.', true);
    }
  }

  function setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      state.installPromptEvent = event;
      elements.installBtn.classList.remove('hidden');
    });

    elements.installBtn.addEventListener('click', async () => {
      if (!state.installPromptEvent) return;
      state.installPromptEvent.prompt();
      await state.installPromptEvent.userChoice;
      state.installPromptEvent = null;
      elements.installBtn.classList.add('hidden');
    });
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').catch((error) => {
          console.error('Service worker registration failed', error);
        });
      });
    }
  }

  function attachEvents() {
    elements.noteForm.addEventListener('submit', onAddNote);
    elements.noteInput.addEventListener('input', () => {
      updateCharCounter();
      if (elements.formMessage.textContent) showFormMessage('');
    });
    elements.notesList.addEventListener('click', onDeleteNote);
    elements.categoryFilters.addEventListener('click', onFilterClick);
    elements.searchInput.addEventListener('input', (event) => {
      state.searchQuery = event.target.value;
      renderNotes();
    });
    elements.clearSearchBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      state.searchQuery = '';
      renderNotes();
    });
    elements.openSettingsBtn.addEventListener('click', () => elements.settingsDialog.showModal());
    elements.saveSettingsBtn.addEventListener('click', onSaveSettings);
    elements.clearNotesBtn.addEventListener('click', onClearNotes);
  }

  initializeState();
  attachEvents();
  setupInstallPrompt();
  registerServiceWorker();
})();
