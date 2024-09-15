const productsAdmin = require("./productAdmin.route");
const dashboard = require("./dashboardAdmin.route");
const productCategoryRouter = require("./product-category.router");
const role = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const authMiddleware = require("../../middlewares/admin/auth.middlewares");
module.exports = (app) => {
  app.use("/admin/dashboard", authMiddleware.requireAuth, dashboard);

  app.use("/admin/products", authMiddleware.requireAuth, productsAdmin);
  app.use(
    "/admin/products-category",
    authMiddleware.requireAuth,
    productCategoryRouter
  );
  app.use("/admin/roles", authMiddleware.requireAuth, role);
  app.use("/admin/accounts", authMiddleware.requireAuth, accountRoutes);
  app.use("/admin/auth", authRoutes);
};
