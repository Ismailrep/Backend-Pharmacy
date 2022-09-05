import path from "path";

export const handlebarOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve("./helper"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./helper"),
  extName: ".handlebars",
};
