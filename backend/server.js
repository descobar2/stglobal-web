// Punto de entrada: separado de la aplicación para permitir pruebas sin puerto fijo.
import "dotenv/config";
import { createApp } from "./app.js";
import { ping } from "./models/db.js";

const port = Number(process.env.PORT || 4000);
const app = createApp();
try {
  const connected = await ping();
  console.log(connected ? "DB connection OK" : "DB connection unavailable");
} catch (error) {
  console.error("DB startup check failed:", error.message);
}
app.listen(port, () => console.log("STGlobal API listening on " + port));
