import dotenv from "dotenv";

const result = dotenv.config({ path: "./.env" });
if (result.error) {
  process.exit(1);
}

console.log(
  "DATABASE_URL:",
  process.env.DATABASE_URL ? "Definida" : "Não definida",
);
