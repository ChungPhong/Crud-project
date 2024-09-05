// module.exports = (objectPagination, query, countProduct) => {
//   if (query.page) {
//     objectPagination.currentPage = parseInt(query.page);
//   }

//   const totalPage = Math.ceil(countProduct / objectPagination.limitPage);
//   objectPagination.totalPage = totalPage;

//   objectPagination.skip =
//     (objectPagination.currentPage - 1) * objectPagination.limitPage;

//   return objectPagination;
// };

module.exports = (objectPagination, query, countProduct) => {
  // Xử lý trang hiện tại
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }

  // Tính toán số trang tối đa
  const totalPage = Math.ceil(countProduct / objectPagination.limitPage);
  objectPagination.totalPage = totalPage;

  // Đảm bảo rằng trang hiện tại không vượt quá tổng số trang
  if (objectPagination.currentPage > totalPage) {
    objectPagination.currentPage = totalPage; // Đặt lại trang hiện tại thành trang cuối cùng
  }

  // Tính toán số lượng bản ghi bỏ qua (skip)
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitPage;

  return objectPagination;
};
