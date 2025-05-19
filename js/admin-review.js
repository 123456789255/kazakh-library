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
    if (reviews.length === 0) {
        container.innerHTML = "<p>Отзывов нет.</p>";
        return;
    }

    filtered.forEach(r => {
        let stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        const bookTitle = r.books?.title || 'Неизвестная книга';

        const div = document.createElement('div');
        div.className = 'review-card';
        div.innerHTML = `
        <div>
            <h3><strong>Название книги: </strong>${bookTitle}</h3>
            <p><strong>Имя:</strong> ${r.name}</p>
            <p><strong>Рейтинг:</strong> ${stars}</p>
            <p><strong>Комментарий:</strong></p>
            <p>${r.comment}</p>
        </div>
        <button class="delete-review-btn" data-id="${r.id}">Удалить</button>
        `;

        container.appendChild(div);
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

// Фильтры
['book-title-filter', 'book-genre-filter', 'review-rating-filter', 'review-genre-filter', 'review-title-filter'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => {
        loadReviews();
    });
});

// Запуск
checkAuth();
loadReviews();
