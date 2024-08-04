// eslint-disable-next-line no-unused-vars
export const notFoundHandler = (req, res, next) => {
  // мідлвар в Express.js, який обробляє всі запити, що не відповідають жодному з визначених маршрутів
  res.status(404).json({
    message: 'Route not found',
  });
};
