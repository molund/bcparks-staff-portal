import express from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";

import homeRoutes from "./routes/home.js";
import helloRoute from "./routes/nested-path-example/hello.js";
import ormTestRoutes from "./routes/nested-path-example/orm.js";

if (!process.env.PG_CONNECTION_STRING) {
  throw new Error("Required environment variables are not set");
}

const app = express();

// enable CORS for all routes
app.use(cors());

// JSON parsing middleware
app.use(express.json());

// Logging middleware
app.use(morgan("dev"));

// Compression middleware
app.use(compression());

// add routes
app.use("/", homeRoutes); // example stuff for testing
app.use("/nested-path-example/", helloRoute); // example stuff for testing
app.use("/nested-path-example/", ormTestRoutes); // example stuff for testing

// error handling middleware
// eslint-disable-next-line no-unused-vars -- required signature for Express error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: {
      message,
      status,
    },
  });
});

// start the server
try {
  app.listen(8100, "0.0.0.0", () => {
    console.log("Server listening at http://localhost:8100");
  });
} catch (err) {
  console.error("Error starting server", err);
  throw new Error("Server failed to start");
}
