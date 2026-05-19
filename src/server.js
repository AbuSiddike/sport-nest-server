const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const { connectDatabase } = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDatabase();
  app.listen(PORT, async () => {
    await console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
