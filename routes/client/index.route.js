const categoryMiddleware = require("../../middlewares/client/category.midllewares");
const cartMiddleware = require("../../middlewares/client/cart.midlleware");
const productsRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const userRoutes = require("./user.route");
const checkoutRoutes = require("./checkout.route");
module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cartId);
  app.use("/", homeRoutes);
  app.use("/checkout", checkoutRoutes);
  app.use("/products", productsRoutes);
  app.use("/search", searchRoutes);
  app.use("/cart", cartRoutes);
  app.use("/user", userRoutes);
};
