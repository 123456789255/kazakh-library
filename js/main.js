import { supabase } from './api.js';

const listContainer = document.getElementById('book-list');
const searchInput = document.getElementById('search');
const genreSelect = document.getElementById('genre-filter');

// Загружаем все книги с сортировкой по дате (сначала новые)
async function fetchBooks() {
  let { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Ошибка загрузки:', error);
    return [];
  }

  return data;
}

// Получаем список уникальных жанров и считаем количество книг по каждому
async function fetchGenresWithCount() {
  const { data, error } = await supabase
    .from('books')
    .select('genre');

  if (error) {
    console.error('Ошибка загрузки жанров:', error);
    return;
  }

  // Считаем жанры
  const genreCount = {};
  data.forEach(({ genre }) => {
    if (!genre) return;
    genreCount[genre] = (genreCount[genre] || 0) + 1;
  });

  // Отрисовываем options
  genreSelect.innerHTML = `<option value="">Все жанры</option>`;
  Object.entries(genreCount).forEach(([genre, count]) => {
    const option = document.createElement('option');
    option.value = genre;
    option.textContent = `${genre} (${count})`;
    genreSelect.appendChild(option);
  });
}

function renderBooks(books) {
  listContainer.innerHTML = '';
  if (books.length === 0) {
    listContainer.innerHTML = '<p>Книги не найдены</p>';
    return;
  }

  books.forEach(book => {
    const div = document.createElement('div');
    div.className = 'book-card';
    div.innerHTML = `
      <img src="${book.cover_url}" alt="${book.title}" />
      <h3>${book.title}</h3>
      <p><strong>Автор:</strong> ${book.author}</p>
      <p><strong>Жанр:</strong> ${book.genre}</p>
      <p><strong>Год издания:</strong> ${book.year}</p>
      <p><strong>Язык:</strong> ${book.language}</p>
      <p><strong>Описание:</strong> ${book.description?.slice(0, 50)}...</p>
      <div class="buttons">
        <button onclick="location.href='book.html?id=${book.id}'">Подробнее</button>
        <a href="${book.pdf_url}">Читать онлайн (не работает)</a>
        <a href="${book.pdf_url}">Скачать книгу (не работает)</a>
      </div>
    `;
    listContainer.appendChild(div);
  });
}

async function updateList() {
  let books = await fetchBooks();
  const search = searchInput.value.toLowerCase();
  const genre = genreSelect.value;

  if (search) {
    books = books.filter(book =>
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search)
    );
  }

  if (genre) {
    books = books.filter(book => book.genre === genre);
  }

  renderBooks(books);
}

// Слушатели
searchInput.addEventListener('input', updateList);
genreSelect.addEventListener('change', updateList);

// Первая загрузка
await fetchGenresWithCount();
updateList();
