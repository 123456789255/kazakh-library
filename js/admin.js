import { supabase } from './api.js';

const allowedEmail = 'kazah.zanat@gmail.com'; // замени на свой email

// Проверка доступа
async function checkAuth() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || user.email !== allowedEmail) {
    alert('Доступ запрещён');
    location.href = 'auth.html';
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
  filtered.forEach(book => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3 contenteditable="true" data-field="title" data-id="${book.id}"><strong>Название:</strong> ${book.title}</h3>
      <p contenteditable="true" data-field="author" data-id="${book.id}"><strong>Автор:</strong> ${book.author}</p>
      <p contenteditable="true" data-field="genre" data-id="${book.id}"><strong>Жанр:</strong> ${book.genre}</p>
      <p contenteditable="true" data-field="year" data-id="${book.id}"><strong>Год:</strong> ${book.year}</p>
      <p contenteditable="true" data-field="language" data-id="${book.id}"><strong>Язык:</strong> ${book.language}</p>
      <p contenteditable="true" data-field="description" data-id="${book.id}"><strong>Описание</strong> ${book.description}</p>
      <button class="save-book-btn" data-id="${book.id}">Сохранить</button>
      <button class="delete-btn" data-id="${book.id}">Удалить</button>
    `;
    container.appendChild(div);
  });

  document.querySelectorAll('.save-book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const fields = document.querySelectorAll(`[data-id="${id}"]`);
      const updated = {};
      fields.forEach(el => {
        updated[el.dataset.field] = el.innerText.trim();
      });
      updateBook(id, updated);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm('Удалить книгу?')) await deleteBook(btn.dataset.id);
    });
  });

  // Обновить фильтр жанров
  updateGenreFilter(data);
}

// Загрузка отзывов с фильтрами
async function loadReviews() {
  const { data: reviews, error } = await supabase.from('reviews').select('*, books(title, genre)').order('created_at', { ascending: false });
  if (error) return alert('Ошибка загрузки отзывов: ' + error.message);

  const container = document.getElementById('review-list');
  const ratingFilter = document.getElementById('review-rating-filter')?.value;
  const genreFilter = document.getElementById('review-genre-filter')?.value;
  const titleFilter = document.getElementById('review-title-filter')?.value?.toLowerCase();

  const filtered = reviews.filter(r => {
    const byRating = !ratingFilter || String(r.rating) === ratingFilter;
    const byGenre = !genreFilter || r.books?.genre === genreFilter;
    const byTitle = !titleFilter || r.books?.title.toLowerCase().includes(titleFilter);
    return byRating && byGenre && byTitle;
  });

  // Кнопка сброса фильтров отзывов
  document.getElementById('reset-review-filters').addEventListener('click', () => {
    document.getElementById('review-rating-filter').value = '';
    document.getElementById('review-genre-filter').value = '';
    document.getElementById('review-book-title-filter').value = '';
    loadReviews(); // перезагрузка всех отзывов без фильтра
  });

  container.innerHTML = '';
  filtered.forEach(r => {
    const bookTitle = r.books?.title || 'Неизвестная книга';
    container.innerHTML += `
      <p><strong>${r.name}</strong> (${r.rating}/5): ${r.comment} — <em>${bookTitle}</em></p>
      <button class="delete-review-btn" data-id="${r.id}">Удалить</button>
    `;
  });

  document.querySelectorAll('.delete-review-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm('Удалить отзыв?')) await deleteReview(btn.dataset.id);
    });
  });

  updateReviewGenreFilter(reviews);
}

// Удаление отзыва
async function deleteReview(id) {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) alert('Ошибка удаления: ' + error.message);
  else loadReviews();
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

// Обновление фильтра жанров отзывов
function updateReviewGenreFilter(reviews) {
  const genreSelect = document.getElementById('review-genre-filter');
  if (!genreSelect) return;
  const genres = {};

  reviews.forEach(r => {
    if (r.books?.genre) genres[r.books.genre] = true;
  });

  genreSelect.innerHTML = '<option value="">Все жанры</option>';
  Object.keys(genres).forEach(g => {
    genreSelect.innerHTML += `<option value="${g}">${g}</option>`;
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
    loadReviews();
  });
});

// Запуск
checkAuth();
loadBooks();
loadReviews();
