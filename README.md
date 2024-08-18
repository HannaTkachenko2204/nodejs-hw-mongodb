Cтворення серверу для роботи з колекцією контактів через HTTP запити (отримання даних всіх контактів або одного по id)


Ініціалізація проєкту (npm init -y, eslint, файли .gitignore та .prettierrc, nodemon як залежність для розробки, скрипт "dev" у package.json)


Налаштування серверу (виклик express(), налаштування cors та логгера pino, обробка неіснуючих роутів, змінна оточення в файлі .env.example)


Під'єднання до MongoDB (кластер в mongodb та функція initMongoConnection, MongoDB Atlas, MongoDB Compass, використання пакету mongoose)


Створення роутів для роботи з контактами (GET /contacts, GET /contacts/:contactId)


Деплой додатку на render.com. Базовий набір контактів із файлу contacts.json
