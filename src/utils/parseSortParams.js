import { SORT_ORDER } from '../constants/index.js';

const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder); // перевіряє, чи відповідає sortOrder одному з відомих порядків сортування — або зростанню (ASC), або спаданню (DESC)
  if (isKnownOrder) return sortOrder;
  return SORT_ORDER.ASC; // за замовчуванням порядок сортування на зростання (ASC)
};

const parseSortBy = (sortBy) => {
  // sortBy має вказувати поле, за яким потрібно виконати сортування
  const keysOfContact = [
    '_id',
    'name',
    'phoneNumber',
    'email',
    'isFavourite',
    'contactType',
  ];

  if (keysOfContact.includes(sortBy)) {
    // чи входить дане поле до списку допустимих полів
    return sortBy;
  }

  return '_id'; // за замовчуванням
};

export const parseSortParams = (query) => {
  // приймає об'єкт query, з якого витягує значення sortOrder та sortBy, передає їх на обробку у відповідні функції та повертає об'єкт із валідованими та готовими до використання параметрами для сортування
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};
