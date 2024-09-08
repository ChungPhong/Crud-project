const productsAdmin = require("./productAdmin.route");
const dashboard = require("./dashboardAdmin.route");
const productCategoryRouter = require("./product-category.router");
module.exports = (app) => {
  app.use("/admin/dashboard", dashboard);

  app.use("/admin/products", productsAdmin);
  app.use("/admin/products-category", productCategoryRouter);
};
