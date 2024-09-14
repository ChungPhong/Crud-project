const productsAdmin = require("./productAdmin.route");
const dashboard = require("./dashboardAdmin.route");
const productCategoryRouter = require("./product-category.router");
const role = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
module.exports = (app) => {
  app.use("/admin/dashboard", dashboard);

  app.use("/admin/products", productsAdmin);
  app.use("/admin/products-category", productCategoryRouter);
  app.use("/admin/roles", role);
  app.use("/admin/accounts", accountRoutes);
  app.use("/admin/auth", authRoutes);
};
