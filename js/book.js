import { supabase } from './api.js';

const bookId = new URLSearchParams(window.location.search).get('id');
const bookDetails = document.getElementById('book-details');
const reviewsList = document.getElementById('reviews-list');
const reviewForm = document.getElementById('review-form');

// Загрузка книги
async function loadBook() {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', bookId)
    .single();

  if (error) {
    bookDetails.innerHTML = '<p class="book-error">Ошибка загрузки книги.</p>';
    console.error(error);
    return;
  }

  const book = data;
  bookDetails.innerHTML = `
    <div class="book-card">
      <img src="${book.cover_url}" alt="${book.title}" />
      <h2>${book.title}</h2>
      <p><strong>Автор:</strong> ${book.author}</p>
      <p><strong>Жанр:</strong> ${book.genre}</p>
      <p>${book.description}</p>
    </div>
    <a href="${book.pdf_url}">Читать онлайн (не работает)</a>
    <a href="#">Скачать книгу (не работает)</a>
  `;
}

// Загрузка отзывов
async function loadReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('book_id', bookId)
    .order('created_at', { ascending: false });

  if (error) {
    reviewsList.innerHTML = '<p>Ошибка загрузки отзывов.</p>';
    console.error(error);
    return;
  }

  if (data.length === 0) {
    reviewsList.innerHTML = '<p>Пока нет отзывов.</p>';
    return;
  }

  const myReviewId = localStorage.getItem(`my_review_${bookId}`);
  reviewsList.innerHTML = '';
  data.forEach((review) => {
    const div = document.createElement('div');
    div.className = 'review';
    div.innerHTML = `
      <p><strong>${review.name}</strong> — ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
      <p>${review.comment}</p>
      ${String(review.id) === myReviewId ? `<button class="delete-review-btn" data-id="${review.id}">Удалить</button>` : ''}
      <hr />
    `;
    reviewsList.appendChild(div);
  });

  document.querySelectorAll('.delete-review-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (!error) {
        localStorage.removeItem(`my_review_${bookId}`);
        await loadReviews();
      } else {
        alert('Ошибка при удалении отзыва');
        console.error(error);
      }
    });
  });
}

// Отправка отзыва
reviewForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const rating = parseInt(document.getElementById('rating').value);
  const comment = document.getElementById('comment').value.trim();

  if (!name || !rating || !comment) return;

  const { data, error } = await supabase
    .from('reviews')
    .insert([{ book_id: bookId, name, rating, comment }])
    .select(); // Получаем вставленные данные

  if (error) {
    alert('Ошибка при отправке отзыва');
    console.error(error);
    return;
  }

  // Сохраняем ID своего отзыва в localStorage
  if (data && data.length > 0) {
    localStorage.setItem(`my_review_${bookId}`, data[0].id);
  }

  reviewForm.reset();
  await loadReviews();
});

loadBook();
loadReviews();
