const productsAdmin = require("./productAdmin.route");
const dashboard = require("./dashboardAdmin.route");
module.exports = (app) => {
  app.use("/admin/dashboard", dashboard);

  app.use("/admin/products", productsAdmin);
};
