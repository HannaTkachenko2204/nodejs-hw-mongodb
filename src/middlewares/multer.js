import multer from 'multer'; // бібліотека для завантаження зображень
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) { // параметр який визначає, в яку директорію будуть зберігатися завантажені файли
    cb(null, TEMP_UPLOAD_DIR); // aункція зворотного виклику використовується для передачі директорії, в яку слід зберегти файл
  },
  filename: function (req, file, cb) { // параметр який визначає, яке ім'я буде надане завантаженому файлу
    const uniqueSuffix = Date.now(); // суфікс який створюється за допомогою поточної дати і часу у мілісекундах, що гарантує унікальність кожного імені файлу
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

export const upload = multer({ storage });