const categoryMiddleware = require("../../middlewares/client/category.midllewares");
const productsRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use("/", homeRoutes);

  app.use("/products", productsRoutes);

  app.use("/search", searchRoutes);
};
