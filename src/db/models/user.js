import { model, Schema } from 'mongoose';

const usersSchema = new Schema( // створення схеми для користувача
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // поле email має бути унікальним, то додамо до нього unique: true
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

// метод toJSON() викликається тоді, коли обʼєкт серіалізується (перетворюється на JSON) під час виклику JSON.stringify() або res.json()
usersSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
  };

export const UsersCollection = model('users', usersSchema);