// require('dotenv').config();
// const jsonServer = require("json-server");
// const cors = require("cors");

// const server = jsonServer.create();
// const router = jsonServer.router("db.json");
// const middlewares = jsonServer.defaults();

// server.use(middlewares);
// server.use(jsonServer.bodyParser);
// const options={
//     origin: process.env.CORS_ORIGIN,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     allowedHeaders: ["Content-Type"],
// }
// server.use(cors(options));

// server.get("/api/photographers", (req, res) => {
//   const db = router.db;  
//   const photographers = db.get("photographers").value();
//   res.json({ photographers });
// });

// server.use("/api", router);

// const PORT = process.env.PORT || 3001;

// server.listen(PORT, () => {
//   console.log(`✅ JSON Server running at http://localhost:${PORT}`);
// });




const jsonServer = require("json-server");
const cors = require("cors");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
const options={
    origin: process.env.CORS_ORIGIN,
}
server.use(cors(options));
server.use(jsonServer.bodyParser);

// ✅ Custom route to return { photographers: [...] }
server.get("/api/photographers", (req, res) => {
  const db = router.db;  
  const photographers = db.get("photographers").value();
  res.json({ photographers });
});

// ✅ keep all other CRUD routes
server.use("/api", router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ JSON Server running at http://localhost:${PORT}`);
});
