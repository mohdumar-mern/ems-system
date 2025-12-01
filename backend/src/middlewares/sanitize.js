import mongoSanitize from "express-mongo-sanitize";

const sanitize = (app) => {
  app.use(mongoSanitize());
};

export default sanitize;
