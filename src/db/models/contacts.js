import { model, Schema } from 'mongoose'; // схема, модель, документ

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true, // ця властивість вказує, чи є поле обов'язковим для заповнення
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: [/.+@.+\..+/, 'Please fill a valid email address'],
      default: null, // вказує значення за замовчуванням, якщо поле не вказано при створенні документа
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'], // це перелік допустимих значень для поля
      required: true,
      default: 'personal',
    },
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // дає можливість при створенні контакту вказувати звʼязок між колекціями users та students
    photo: { type: String }, // можливість додавати до об’єкту контакту властивість photo
  },
  {
    timestamps: true, // встановлює значення true, щоб автоматично створювати поля createdAt та updatedAt, які вказують на час створення та оновлення документа
    versionKey: false, // вказує, чи має бути створене поле __v для відстеження версій документу
  },
);

export const ContactsCollection = model('contacts', contactsSchema); // створюємо модель контакта за допомогою схеми
