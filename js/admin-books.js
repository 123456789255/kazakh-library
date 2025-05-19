import { supabase } from './api.js';

const allowedEmail = 'kazah.zanat@gmail.com'; // замени на свой email

document.getElementById('logout-btn')?.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert('Ошибка при выходе: ' + error.message);
  } else {
    location.href = 'admiral.html'; // перенаправление на страницу входа
  }
});

// Проверка доступа
async function checkAuth() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || user.email !== allowedEmail) {
    alert('Доступ запрещён');
    location.href = 'index.html';
  }
}

// Добавление книги
async function addBook(book) {
  const { error } = await supabase.from('books').insert([book]);
  if (error) alert('Ошибка: ' + error.message);
  else loadBooks();
}

// Удаление книги
async function deleteBook(id) {
  const { error } = await supabase.from('books').delete().eq('id', id);
  if (error) alert('Ошибка удаления: ' + error.message);
  else loadBooks();
}

// Обновление книги
async function updateBook(id, updated) {
  const { error } = await supabase.from('books').update(updated).eq('id', id);
  if (error) alert('Ошибка при обновлении: ' + error.message);
  else loadBooks();
}

// Загрузка книг с фильтрами
async function loadBooks() {
  const { data, error } = await supabase.from('books').select('*');
  if (error) return alert('Ошибка загрузки книг: ' + error.message);

  const container = document.getElementById('book-list');
  const titleFilter = document.getElementById('book-title-filter')?.value.toLowerCase();
  const genreFilter = document.getElementById('book-genre-filter')?.value;

  const filtered = data.filter(book => {
    const byTitle = !titleFilter || book.title.toLowerCase().includes(titleFilter);
    const byGenre = !genreFilter || book.genre === genreFilter;
    return byTitle && byGenre;
  });

  // Кнопка сброса фильтров книг
  document.getElementById('reset-book-filters').addEventListener('click', () => {
    document.getElementById('book-genre-filter').value = '';
    document.getElementById('book-title-filter').value = '';
    loadBooks(); // перезагрузка всех книг без фильтра
  });

  container.innerHTML = '';
  if (data.length === 0) {
        container.innerHTML = "<p>Отзывов нет.</p>";
        return;
    }
  filtered.forEach(book => {
    const div = document.createElement('div');
    div.classList.add('book-item')
    div.innerHTML = `
      <div><h3><strong>Название: </strong></h3><span contenteditable="true" data-field="title" data-id="${book.id}">${book.title}</span></div>
      <div><p><strong>Автор: </strong></p><span contenteditable="true" data-field="author" data-id="${book.id}">${book.author}</span></div>
      <div><p><strong>Жанр: </strong></p><span contenteditable="true" data-field="genre" data-id="${book.id}">${book.genre}</span></div>
      <div><p><strong>Год: </strong></p><span contenteditable="true" data-field="year" data-id="${book.id}">${book.year}</span></div>
      <div><p><strong>Язык: </strong></p><span contenteditable="true" data-field="language" data-id="${book.id}">${book.language}</span></div>
      <div><p><strong>Описание: </strong></p><span class="description" contenteditable="true" data-field="description" data-id="${book.id}">${book.description}</span></div>
      <div><p><strong>Адрес обложки: </strong></p><span contenteditable="true" data-field="cover_url" data-id="${book.id}">${book.cover_url}</span></div>
      <div><p><strong>PDF адрес книги: </strong></p><span contenteditable="true" data-field="pdf_url" data-id="${book.id}">${book.pdf_url}</span></div>
      <div class="buttons">
        <button class="about-book-btn" onclick="location.href='book.html?id=${book.id}'">Подробнее</button>
        <button class="save-book-btn" data-id="${book.id}">Сохранить</button>
        <button class="delete-book-btn" data-id="${book.id}">Удалить</button>
      </div>
    `;
    container.appendChild(div);
  });

  document.querySelectorAll('.save-book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const fields = document.querySelectorAll(`[data-id="${id}"]`);
      const updated = {};
      fields.forEach(el => {
        const field = el.dataset.field;
        if (field) {
          updated[field] = el.innerText.trim();
        }
      });

      console.log(updated);
      updateBook(id, updated);
    });
  });

  document.querySelectorAll('.delete-book-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm('Удалить книгу?')) await deleteBook(btn.dataset.id);
    });
  });

  // Обновить фильтр жанров
  updateGenreFilter(data);
}

// Обновление фильтра жанров книг
function updateGenreFilter(books) {
  const genreSelect = document.getElementById('book-genre-filter');
  if (!genreSelect) return;
  const genres = {};
  books.forEach(b => genres[b.genre] = (genres[b.genre] || 0) + 1);

  genreSelect.innerHTML = '<option value="">Все жанры</option>';
  Object.entries(genres).forEach(([genre, count]) => {
    genreSelect.innerHTML += `<option value="${genre}">${genre} (${count})</option>`;
  });
}

// Обработка формы добавления книги
document.getElementById('add-book-form').onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const book = {
    title: form.title.value.trim(),
    author: form.author.value.trim(),
    genre: form.genre.value.trim(),
    description: form.description.value.trim(),
    cover_url: form.cover_url.value.trim(),
    pdf_url: form.pdf_url.value.trim(),
    language: form.language.value.trim(),
    year: form.year.value.trim(),
  };
  await addBook(book);
  form.reset();
};

// Фильтры
['book-title-filter', 'book-genre-filter', 'review-rating-filter', 'review-genre-filter', 'review-title-filter'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => {
    loadBooks();
  });
});

// Запуск
checkAuth();
loadBooks();
