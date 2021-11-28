import { createConnection } from "mysql";
import { HOST, USER, PASSWORD, DB } from "../config/db.config.js";

const connection = createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DB
});

connection.connect(err => {
  if (err) throw error;
  console.log("успешно соединено с базой данных");
});

export default connection;