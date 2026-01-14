import multer from "multer"

// הגדרת multer לשמירה בזיכרון (לא בדיסק)
const storage = multer.memoryStorage()

// הגדרת סינון קבצים (אופציונלי)
const fileFilter = (req, file, cb) => {
  // דוגמה: לאפשר רק תמונות
  // if (file.mimetype.startsWith("image/")) {
  //   cb(null, true)
  // } else {
  //   cb(new Error("Only image files are allowed"), false)
  // }

  // כרגע מאפשרים כל סוג קובץ
  cb(null, true)
}

// הגדרת multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB מקסימום
  },
})

// Middleware להעלאת קובץ בודד
const uploadSingle = upload.single("file")

// Middleware להעלאת מספר קבצים
const uploadMultiple = upload.array("files", 10) // מקסימום 10 קבצים

export { uploadSingle, uploadMultiple }
