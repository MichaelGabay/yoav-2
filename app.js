import express from "express"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import router from "./routes/mainRoutes.js"
import dbConnection from "./db/dbConnection.js"

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// על מנת שאוכל לגשת למשתני סביבה
dotenv.config()
// יצירת אינסטנס חדש עבור השרת
const app = express()

// לוקח את המידע שנשלח לשרת - הופך את המידע חזרה לגייסון ומאפשר אליו גישה בתוך המסלול
app.use(express.json())

app.use("/api", router)
dbConnection()

const PORT = process.env.PORT || 3000
// פתיחת פורט במחשב אליו יחובר השרת
app.listen(PORT, (err) => {
  if (err) {
    throw err
  }
  console.log("server is running on port http://localhost:" + PORT)
})
