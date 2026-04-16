import { model, Schema} from "mongoose";
import validator from 'validator';

const urlRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}([a-zA-Z0-9\-._~:\/?#\[\]@!$&'()*+,;=]+)?#?$/;

const userSchema = new Schema({
    name: {
        type: String,
        minLength: 2,
        maxLength: 30,
        default: 'Жак-Ив Кусто'
    },
    about: {
        type: String,
        minLength: 2,
        maxLength: 200,
        default: 'Исследователь'
    },
    avatar: {
        type: String,
        default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
        validate: {
            validator: (value: string) => urlRegex.test(value),
            message: 'Некорректный формат ссылки на аватар'
        }
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) => validator.isEmail(value),
            message: 'Некорректный формат почты'
        }
    },
    password: {
        type: String,
        required: true,
        select: false
    }
});

export default model('user', userSchema);
