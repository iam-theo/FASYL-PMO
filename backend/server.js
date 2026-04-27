import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;


app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
)

app.get("/", (req, res) => {
  res.send("Fasyl PMO Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
