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
    bookDetails.innerHTML = '<p>Ошибка загрузки книги</p>';
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

  reviewsList.innerHTML = '';
  data.forEach((review) => {
    const div = document.createElement('div');
    div.className = 'review';
    div.innerHTML = `
      <p><strong>${review.name}</strong> — ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
      <p>${review.comment}</p>
      <hr />
    `;
    reviewsList.appendChild(div);
  });
}

// Отправка отзыва
reviewForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const rating = parseInt(document.getElementById('rating').value);
  const comment = document.getElementById('comment').value.trim();

  if (!name || !rating || !comment) return;

  const { error } = await supabase.from('reviews').insert([
    {
      book_id: bookId,
      name,
      rating,
      comment,
    },
  ]);

  if (error) {
    alert('Ошибка при отправке отзыва');
    console.error(error);
    return;
  }

  reviewForm.reset();
  await loadReviews();
});

loadBook();
loadReviews();
