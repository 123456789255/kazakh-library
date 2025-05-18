import { supabase } from './api.js';

const allowedEmail = 'kazah.zanat@gmail.com'; // замени на свой email

// Проверка доступа по email
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

// Загрузка книг
async function loadBooks() {
  const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
  if (error) {
    alert('Ошибка загрузки книг: ' + error.message);
    return;
  }

  const container = document.getElementById('book-list');
  container.innerHTML = '';

  data.forEach(book => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${book.title}</h3>
      <p>${book.author} - ${book.genre}</p>
      <button class="delete-btn" data-id="${book.id}">Удалить</button>
    `;
    container.appendChild(div);
  });

  // Удаление книги через JS, а не через inline onclick
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (confirm('Удалить книгу?')) await deleteBook(id);
    });
  });
}

// Загрузка отзывов
async function loadReviews() {
  const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
  if (error) {
    alert('Ошибка загрузки отзывов: ' + error.message);
    return;
  }

  const container = document.getElementById('review-list');
  container.innerHTML = '';

  data.forEach(r => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>${r.name}</strong> (${r.rating}/5): ${r.comment}</p>
      <button class="delete-review-btn" data-id="${r.id}">Удалить</button>
    `;
    container.appendChild(div);
  });

  // Удаление отзывов без inline onclick
  document.querySelectorAll('.delete-review-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (confirm('Удалить отзыв?')) await deleteReview(id);
    });
  });
}

// Удаление отзыва
async function deleteReview(id) {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) alert('Ошибка удаления: ' + error.message);
  else loadReviews();
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
  };
  await addBook(book);
  form.reset();
};

// Запуск
checkAuth();
loadBooks();
loadReviews();
