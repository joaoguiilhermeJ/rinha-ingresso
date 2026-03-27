
import express from "express";
import eventosRoutes from "./routes/eventos.js";
import reservasRoutes from "./routes/reservas.js";

const app = express();

app.use((req, res, next) => {
  res.set("Connection", "keep-alive");
  next();
});

app.use(express.json({ limit: "1kb" }));

app.use("/eventos", eventosRoutes);
app.use("/reservas", reservasRoutes);

const port = process.env.PORT || 8080;
app.listen(port);
