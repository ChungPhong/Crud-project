const categoryMiddleware = require("../../middlewares/client/category.midllewares");
const cartMiddleware = require("../../middlewares/client/cart.midlleware");
const userMiddleware = require("../../middlewares/client/user.midlleware");
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const authMiddleware = require("../../middlewares/client/auth.middlewares");

const productsRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const userRoutes = require("./user.route");
const checkoutRoutes = require("./checkout.route");
const chatRoutes = require("./chat.route");
const usersRoutes = require("./users.route");

module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cartId);
  app.use(userMiddleware.infoUser);
  app.use(settingMiddleware.settingGeneral);
  app.use("/", homeRoutes);
  app.use("/checkout", checkoutRoutes);
  app.use("/products", productsRoutes);
  app.use("/search", searchRoutes);
  app.use("/cart", cartRoutes);
  app.use("/user", userRoutes);
  app.use("/chat", authMiddleware.requireAuth, chatRoutes);
  app.use("/users", authMiddleware.requireAuth, usersRoutes);
};
