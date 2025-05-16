<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains over 1500 video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the Laravel [Patreon page](https://patreon.com/taylorotwell).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Cubet Techno Labs](https://cubettech.com)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[Many](https://www.many.co.uk)**
- **[Webdock, Fast VPS Hosting](https://www.webdock.io/en)**
- **[DevSquad](https://devsquad.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[OP.GG](https://op.gg)**
- **[WebReinvent](https://webreinvent.com/?utm_source=laravel&utm_medium=github&utm_campaign=patreon-sponsors)**
- **[Lendio](https://lendio.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).


# 📚 Техническое задание: Цифровая библиотека казахстанской литературы

## 🎯 Цель проекта

Создание адаптивного веб-сервиса для ознакомления с казахстанской литературой: каталог книг, чтение онлайн, загрузка, обсуждения и администрирование контента.

---

## 🗂️ 1. Структура проекта

### 1.1 Публичная часть (`/`)

* Главная страница с подборкой книг, новинок, популярных
* Страница каталога всех книг с фильтрами:

  * Автор
  * Жанр
  * Год издания
  * Язык
* Страница книги:

  * Обложка, описание, информация (жанр, язык, год, теги, автор)
  * Кнопки: «Читать онлайн», «Скачать», «Добавить в избранное», «Прочитано»
  * Блок отзывов (оценка, текст, имя)
* Страница поиска
* Личный кабинет пользователя
* Страница "Избранное" и "Прочитано"

---

## 🔐 2. Авторизация

### Роли пользователей:

* **Гость** (может читать и скачивать открытые книги, оставлять отзывы)
* **Пользователь** (имеет личный кабинет, может сохранять книги)
* **Админ** (доступ к админке, управлению контентом и пользователями)

### Авторизация:

* Email + пароль
* JWT (для API)
* Восстановление пароля
* Возможна регистрация через Google (опционально)

---

## 🛠 3. Админка (`/admin`)

Доступна только авторизованным администраторам.

### Разделы:

* **Книги**

  * Добавить книгу (обложка, PDF/EPUB, описание, автор, жанры, язык, год)
  * Редактирование/удаление
* **Авторы**

  * Добавление/редактирование биографии
* **Жанры и теги**

  * Управление категориями
* **Пользователи**

  * Просмотр зарегистрированных пользователей
  * Редактирование, бан
* **Отзывы**

  * Модерация и удаление отзывов
* **Аналитика** (опционально)

  * Количество просмотров, скачиваний, активные пользователи

---

## 🔄 4. Backend API

**Язык:** PHP (Laravel / Slim) или Go (Gin / Fiber) или Node.js (Express)
**База данных:** PostgreSQL или MySQL
**Структура API:**

### Эндпоинты:

* `/api/books` — список книг
* `/api/books/:id` — информация о книге
* `/api/books/:id/read` — получить файл/содержимое
* `/api/books/:id/download` — скачать файл (с защитой)
* `/api/books/:id/reviews` — отзывы о книге
* `/api/books/:id/reviews/new` — добавить отзыв
* `/api/users/:id/favorites` — избранное
* `/api/users/:id/read` — список прочитанных
* `/api/login`, `/api/register`, `/api/logout` — аутентификация
* `/api/admin/...` — админские маршруты (только с ролью `admin`)

### Middleware:

* Аутентификация (JWT)
* Роль доступа (user / admin)
* Ограничение доступа к книгам с платным/ограниченным доступом

---

## 📁 5. База данных (примерная структура)

### Таблицы:

#### `users`

* id
* email
* password
* role (`user`, `admin`)
* created\_at

#### `books`

* id
* title
* description
* year
* language
* file\_url
* cover\_image
* author\_id
* created\_at

#### `authors`

* id
* name
* biography

#### `genres`

* id
* name

#### `book_genre` (связующая)

* book\_id
* genre\_id

#### `tags`

* id
* name

#### `book_tag` (связующая)

* book\_id
* tag\_id

#### `reviews`

* id
* book\_id
* user\_id
* rating
* comment
* created\_at

#### `favorites`

* id
* user\_id
* book\_id

#### `read_books`

* id
* user\_id
* book\_id
* read\_at

---

## 🎨 6. Фронтенд

**Технологии**:

* HTML5 + CSS3 (или Tailwind CSS)
* JavaScript (Vanilla или Vue/React — опционально)
* Адаптивная вёрстка
* Запросы к API через `fetch` или `axios`
* Модальные окна для просмотра книги и авторов
* Поддержка SPA-навигации (опционально)

---

## 🖼️ 7. Онлайн-чтение

* Использовать встроенный ридер для PDF или EPUB (например, [PDF.js](https://mozilla.github.io/pdf.js/) или EPUB.js)
* Возможность открыть книгу в модальном окне или на отдельной странице

---

## 📌 8. Защита контента

* Открытые книги — без ограничений
* Приватные книги — доступны только авторизованным пользователям
* Защищённая ссылка для скачивания с токеном (временное действие)
* Проверка роли перед получением файла
* В логике ридера можно отключить «скачивание» по умолчанию (для online-only)

---

## 📈 9. Будущие доработки (необязательно на MVP)

* Комментарии к рецензиям
* Оценка пользователей (лайк/дизлайк)
* Подписка на авторов
* Темная тема
* Telegram-бот для рекомендаций
* API-интеграция с внешними источниками книг

---

Хочешь — я помогу начать разработку прямо сейчас: сделать ER-диаграмму, спроектировать структуру API или разметку каталога. Что делаем первым?
