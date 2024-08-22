import { model, Schema } from 'mongoose';

const sessionsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'users' }, // id юзера, якому належить сесія
    accessToken: { type: String, required: true }, // короткоживучий(в нашому випадку 15 хвилин) токен, який браузер буде нам додавати в хедери запитів (хедер Authorization)
    refreshToken: { type: String, required: true }, // більш довгоживучому (в нашому випадку 1 день, але може бути і більше) токену, який можна буде обміняти на окремому ендпоінті на нову пару access + resfresh токенів. Зберігається в cookies
    accessTokenValidUntil: { type: Date, required: true }, // термін життя access токену
    refreshTokenValidUntil: { type: Date, required: true }, // терміну життя refresh токену
  },
  { timestamps: true, versionKey: false },
);

export const SessionsCollection = model('sessions', sessionsSchema);
