import express from "express"
import detenv from "dotenv"
// על מנת שאוכל לגשת למשתני סביבה
detenv.config()
// יצירת אינסטנס חדש עבור השרת
const app = express()

app.get("/", (req, res) => {
  res.send("server is working")
})

const PORT = process.env.PORT || 3000
// פתיחת פורט במחשב אליו יחובר השרת
app.listen(PORT, (err) => {
  if (err) {
    throw err
  }
  console.log("server is running on port http://localhost:" + PORT)
})
