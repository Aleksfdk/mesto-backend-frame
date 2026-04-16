import { model, Schema } from 'mongoose';

const urlRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}([a-zA-Z0-9\-._~:\/?#\[\]@!$&'()*+,;=]+)?#?$/;

const cardSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => urlRegex.test(value),
      message: 'Некорректный формат ссылки',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});

export default model('card', cardSchema);
