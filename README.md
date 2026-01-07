# מדריך העלאת קבצים ל-AWS S3 ושמירה ב-MongoDB 📤

מדריך מפורט שלב אחר שלב להעלאת קבצים ל-AWS S3 (במסלול החינמי) ושמירת כתובת ה-CDN URL בלבד במסד הנתונים MongoDB.

**⚠️ חשוב:** במסד הנתונים MongoDB נשמרים רק המידע על הקובץ וכתובת ה-CDN URL שלו - הקובץ עצמו נשמר ב-AWS S3 בלבד!

---

## 📋 תוכן עניינים

1. [התקנת חבילות נדרשות](#1-התקנת-חבילות-נדרשות)
2. [הגדרת חשבון AWS S3](#2-הגדרת-חשבון-aws-s3)
3. [הגדרת משתני סביבה](#3-הגדרת-משתני-סביבה)
4. [יצירת מודל לקבצים במסד הנתונים](#4-יצירת-מודל-לקבצים-במסד-הנתונים)
5. [יצירת שירות להעלאת קבצים ל-S3](#5-יצירת-שירות-להעלאת-קבצים-ל-s3)
6. [יצירת בקר להעלאת קבצים](#6-יצירת-בקר-להעלאת-קבצים)
7. [יצירת נתיב להעלאת קבצים](#7-יצירת-נתיב-להעלאת-קבצים)
8. [שימוש במערכת](#8-שימוש-במערכת)

---

## 1. התקנת חבילות נדרשות

### שלב 1.1: התקנת multer לעיבוד קבצים
`multer` הוא middleware ל-Express שמאפשר טיפול בקבצים שנשלחים דרך `multipart/form-data`.

```bash
npm install multer
```

**מה זה עושה?**
- מאפשר קבלת קבצים מה-request
- שומר את הקובץ זמנית בזיכרון או בדיסק
- מספק גישה למידע על הקובץ (שם, גודל, סוג)

### שלב 1.2: התקנת AWS SDK
`@aws-sdk/client-s3` הוא ה-SDK הרשמי של AWS לעבודה עם S3.

```bash
npm install @aws-sdk/client-s3
```

**מה זה עושה?**
- מספק פונקציות להעלאת קבצים ל-S3
- מטפל באימות מול AWS
- מספק גישה לכל שירותי S3

### שלב 1.3: התקנת uuid ליצירת שמות ייחודיים
`uuid` משמש ליצירת שמות ייחודיים לקבצים.

```bash
npm install uuid
```

**מה זה עושה?**
- יוצר מזהים ייחודיים לקבצים
- מונע התנגשויות בשמות קבצים
- מבטיח שכל קובץ יקבל שם ייחודי

---

## 2. הגדרת חשבון AWS S3

### שלב 2.1: יצירת חשבון AWS (אם אין לך)
1. היכנס ל-[AWS Console](https://aws.amazon.com/)
2. לחץ על "Create an AWS Account"
3. מלא את הפרטים הנדרשים
4. **חשוב:** AWS מספקת 12 חודשים חינם עם 5GB אחסון S3

### שלב 2.2: יצירת S3 Bucket
1. היכנס ל-AWS Console
2. חפש "S3" בשורת החיפוש
3. לחץ על "Create bucket"
4. מלא את הפרטים:
   - **Bucket name:** בחר שם ייחודי (לדוגמה: `my-app-uploads-2024`)
   - **Region:** בחר את האזור הקרוב אליך (לדוגמה: `us-east-1`)
   - **Block Public Access:** בטל את הסימון אם אתה רוצה גישה ציבורית לקבצים
5. לחץ על "Create bucket"

### שלב 2.3: יצירת IAM User ו-Access Keys
1. חפש "IAM" ב-AWS Console
2. לחץ על "Users" בתפריט השמאלי
3. לחץ על "Create user"
4. תן שם למשתמש (לדוגמה: `s3-upload-user`)
5. בחר "Attach policies directly"
6. חפש ובחר את המדיניות `AmazonS3FullAccess` (או `AmazonS3ReadWriteAccess` למגבלות יותר)
7. לחץ על "Next" ולאחר מכן "Create user"
8. לחץ על המשתמש שיצרת
9. לחץ על הכרטיסייה "Security credentials"
10. לחץ על "Create access key"
11. בחר "Application running outside AWS"
12. לחץ על "Next" ולאחר מכן "Create access key"
13. **חשוב מאוד:** העתק את ה-Access Key ID וה-Secret Access Key - לא תוכל לראות אותם שוב!

---

## 3. הגדרת משתני סביבה

### שלב 3.1: עדכון קובץ .env
הוסף את המשתנים הבאים לקובץ `.env` שלך:

```env
# משתנים קיימים
PORT=3000
MONGODB_URI="mongodb://admin:password123@localhost:27018/yoav?authSource=admin"
SECRET_KEY="your-secret-key-here"

# משתנים חדשים ל-S3
AWS_ACCESS_KEY_ID=your-access-key-id-here
AWS_SECRET_ACCESS_KEY=your-secret-access-key-here
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=my-app-uploads-2024
```

**הסבר על כל משתנה:**
- `AWS_ACCESS_KEY_ID`: המפתח הציבורי שקבלת מ-AWS IAM
- `AWS_SECRET_ACCESS_KEY`: המפתח הפרטי שקבלת מ-AWS IAM
- `AWS_REGION`: האזור שבו יצרת את ה-bucket (לדוגמה: `us-east-1`, `eu-west-1`)
- `AWS_S3_BUCKET_NAME`: השם של ה-bucket שיצרת

**אזהרת אבטחה:** לעולם אל תעלה את קובץ `.env` ל-Git! ודא שהוא נמצא ב-`.gitignore`.

---

## 4. יצירת מודל לקבצים במסד הנתונים

**⚠️ חשוב להבין:** המודל שומר רק מידע על הקובץ וכתובת ה-CDN URL שלו. הקובץ עצמו נשמר ב-AWS S3 בלבד, לא במסד הנתונים!

### שלב 4.1: יצירת קובץ המודל
צור קובץ חדש: `models/fileModel.js`

```javascript
import mongoose from "mongoose"

const fileSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  s3Key: {
    type: String,
    required: true,
    unique: true,
  },
  s3Url: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("File", fileSchema)
```

**הסבר על השדות:**
- `originalName`: השם המקורי של הקובץ כפי שנשלח מהמשתמש
- `fileName`: השם החדש שנוצר (עם UUID) כדי למנוע התנגשויות
- `fileSize`: גודל הקובץ בבתים
- `mimeType`: סוג הקובץ (לדוגמה: `image/jpeg`, `application/pdf`)
- `s3Key`: המפתח (נתיב) של הקובץ ב-S3
- `s3Url`: **כתובת ה-CDN URL המלאה של הקובץ ב-S3** - זה מה שנשמר במסד הנתונים, לא הקובץ עצמו!
- `uploadedBy`: מזהה המשתמש שהעלה את הקובץ
- `uploadedAt`: תאריך ושעה של ההעלאה

**⚠️ הערה חשובה:** הקובץ עצמו נשמר ב-AWS S3 בלבד. במסד הנתונים MongoDB נשמרים רק המידע על הקובץ וכתובת ה-CDN URL שלו (`s3Url`).

---

## 5. יצירת שירות להעלאת קבצים ל-S3

### שלב 5.1: יצירת תיקיית services
אם התיקייה `services` לא קיימת, צור אותה.

### שלב 5.2: יצירת קובץ השירות
צור קובץ חדש: `services/s3Service.js`

```javascript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"

// יצירת לקוח S3 עם האימות
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

/**
 * העלאת קובץ ל-S3
 * @param {Buffer} fileBuffer - תוכן הקובץ כ-Buffer
 * @param {string} originalName - השם המקורי של הקובץ
 * @param {string} mimeType - סוג הקובץ (MIME type)
 * @returns {Promise<{s3Key: string, s3Url: string}>} - מפתח ו-URL של הקובץ ב-S3
 */
export const uploadFileToS3 = async (fileBuffer, originalName, mimeType) => {
  try {
    // יצירת שם ייחודי לקובץ
    const fileExtension = originalName.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    
    // המפתח (נתיב) של הקובץ ב-S3
    const s3Key = `uploads/${fileName}`

    // פקודת העלאה ל-S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: mimeType,
      // אם אתה רוצה שהקבצים יהיו נגישים לציבור
      // ACL: "public-read",
    })

    // ביצוע ההעלאה
    await s3Client.send(command)

    // יצירת URL של הקובץ
    const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`

    return {
      s3Key,
      s3Url,
    }
  } catch (error) {
    console.error("Error uploading file to S3:", error)
    throw new Error("Failed to upload file to S3")
  }
}
```

**הסבר על הקוד:**
1. **יצירת S3Client:** יוצר לקוח S3 עם פרטי האימות מה-`.env`
2. **יצירת שם ייחודי:** משתמש ב-UUID כדי ליצור שם ייחודי לקובץ
3. **העלאה ל-S3:** שולח את הקובץ ל-S3 באמצעות `PutObjectCommand`
4. **יצירת URL:** בונה את כתובת ה-URL המלאה של הקובץ

---

## 6. יצירת בקר להעלאת קבצים

### שלב 6.1: יצירת קובץ הבקר
צור קובץ חדש: `controllers/fileController.js`

```javascript
import fileModel from "../models/fileModel.js"
import { uploadFileToS3 } from "../services/s3Service.js"

const fileCtrl = {
  /**
   * העלאת קובץ ל-S3 ושמירה במסד הנתונים
   */
  async uploadFile(req, res) {
    try {
      // בדיקה אם קובץ נשלח
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" })
      }

      // קבלת מידע על הקובץ
      const fileBuffer = req.file.buffer
      const originalName = req.file.originalname
      const fileSize = req.file.size
      const mimeType = req.file.mimetype

      // העלאת הקובץ ל-S3
      const { s3Key, s3Url } = await uploadFileToS3(
        fileBuffer,
        originalName,
        mimeType
      )

      // יצירת שם קובץ חדש (ללא נתיב)
      const fileName = s3Key.split("/").pop()

      // שמירת המידע במסד הנתונים
      const fileRecord = await fileModel.create({
        originalName,
        fileName,
        fileSize,
        mimeType,
        s3Key,
        s3Url,
        uploadedBy: req.user._id, // מזהה המשתמש מה-middleware של האימות
      })

      // החזרת תשובה למשתמש
      res.status(201).json({
        message: "File uploaded successfully",
        file: {
          id: fileRecord._id,
          originalName: fileRecord.originalName,
          fileName: fileRecord.fileName,
          fileSize: fileRecord.fileSize,
          s3Url: fileRecord.s3Url,
          uploadedAt: fileRecord.uploadedAt,
        },
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      })
    }
  },

  /**
   * קבלת רשימת כל הקבצים שהמשתמש העלה
   */
  async getMyFiles(req, res) {
    try {
      const files = await fileModel
        .find({ uploadedBy: req.user._id })
        .select("-__v")
        .sort({ uploadedAt: -1 }) // מהחדש לישן

      res.status(200).json({
        message: "Files retrieved successfully",
        files,
      })
    } catch (error) {
      console.error("Error retrieving files:", error)
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      })
    }
  },

  /**
   * מחיקת קובץ מ-S3 וממסד הנתונים
   */
  async deleteFile(req, res) {
    try {
      const fileId = req.params.id

      // מציאת הקובץ במסד הנתונים
      const file = await fileModel.findOne({
        _id: fileId,
        uploadedBy: req.user._id, // רק הקבצים של המשתמש
      })

      if (!file) {
        return res.status(404).json({ message: "File not found" })
      }

      // מחיקת הקובץ מ-S3 (דורש הוספת פונקציה ל-s3Service)
      // await deleteFileFromS3(file.s3Key)

      // מחיקת הרשומה ממסד הנתונים
      await fileModel.deleteOne({ _id: fileId })

      res.status(200).json({
        message: "File deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting file:", error)
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      })
    }
  },
}

export default fileCtrl
```

**הסבר על הקוד:**
1. **uploadFile:** מקבל את הקובץ מה-request, מעלה אותו ל-S3, ושומר רק את המידע והכתובת ה-CDN URL ב-DB (לא את הקובץ עצמו)
2. **getMyFiles:** מחזיר את כל הקבצים שהמשתמש העלה (כולל כתובות ה-CDN URL)
3. **deleteFile:** מוחק קובץ (דורש הוספת פונקציית מחיקה ל-S3)

**⚠️ חשוב:** הקובץ עצמו נשמר ב-AWS S3 בלבד. במסד הנתונים MongoDB נשמרים רק המידע על הקובץ וכתובת ה-CDN URL שלו.

---

## 7. יצירת נתיב להעלאת קבצים

### שלב 7.1: יצירת middleware לעיבוד קבצים
צור קובץ חדש: `middlewares/upload.js`

```javascript
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
export const uploadSingle = upload.single("file")

// Middleware להעלאת מספר קבצים
export const uploadMultiple = upload.array("files", 10) // מקסימום 10 קבצים
```

**הסבר:**
- `memoryStorage()`: שומר את הקובץ בזיכרון (לא בדיסק) - נוח לעבודה עם S3
- `fileFilter`: מאפשר לסנן סוגי קבצים (לדוגמה: רק תמונות)
- `limits.fileSize`: מגביל את גודל הקובץ (10MB בדוגמה)

### שלב 7.2: יצירת נתיבי קבצים
צור קובץ חדש: `routes/fileRoutes.js`

```javascript
import express from "express"
import fileCtrl from "../controllers/fileController.js"
import authUser from "../middlewares/auth.js"
import { uploadSingle } from "../middlewares/upload.js"

const router = express.Router()

// העלאת קובץ (דורש אימות)
router.post("/upload", authUser, uploadSingle, fileCtrl.uploadFile)

// קבלת כל הקבצים של המשתמש (דורש אימות)
router.get("/my-files", authUser, fileCtrl.getMyFiles)

// מחיקת קובץ (דורש אימות)
router.delete("/:id", authUser, fileCtrl.deleteFile)

export default router
```

### שלב 7.3: הוספת הנתיבים לנתיב הראשי
עדכן את `routes/mainRoutes.js`:

```javascript
import express from "express"
const router = express.Router()
import userRoutes from "./userRoutes.js"
import fileRoutes from "./fileRoutes.js"

router.get("/", (req, res) => {
  res.status(200).send("server is running")
})

router.use("/user", userRoutes)
router.use("/file", fileRoutes) // הוספת נתיבי קבצים

export default router
```

---

## 8. שימוש במערכת

### שלב 8.1: הפעלת השרת
```bash
npm run dev
```

### שלב 8.2: העלאת קובץ באמצעות Postman או REST Client

#### דוגמה 1: העלאת קובץ עם REST Client
עדכן את `requests/user.rest` או צור קובץ חדש `requests/file.rest`:

```http
@baseUrl = http://localhost:3000/api
@fileUrl = {{baseUrl}}/file
@token = your-jwt-token-here

### Upload file
POST {{fileUrl}}/upload
Authorization: {{token}}
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="dog.jpg"
Content-Type: image/jpeg

< ./assets/dog.jpg
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

#### דוגמה 2: העלאת קובץ עם Postman
1. פתח Postman
2. בחר `POST` ובחר את הכתובת: `http://localhost:3000/api/file/upload`
3. עבור לכרטיסייה "Headers" והוסף:
   - Key: `Authorization`
   - Value: `Bearer your-jwt-token-here`
4. עבור לכרטיסייה "Body"
5. בחר `form-data`
6. הוסף שדה חדש:
   - Key: `file` (בחר `File` מהתפריט הנפתח)
   - Value: בחר קובץ מהמחשב
7. לחץ על "Send"

#### דוגמה 3: העלאת קובץ עם cURL
```bash
curl -X POST http://localhost:3000/api/file/upload \
  -H "Authorization: Bearer your-jwt-token-here" \
  -F "file=@./assets/dog.jpg"
```

### שלב 8.3: קבלת רשימת הקבצים שלי
```http
GET {{fileUrl}}/my-files
Authorization: {{token}}
```

### שלב 8.4: מחיקת קובץ
```http
DELETE {{fileUrl}}/file-id-here
Authorization: {{token}}
```

---

## 📝 סיכום התהליך המלא

1. **המשתמש שולח קובץ** → השרת מקבל את הקובץ דרך `multer`
2. **הקובץ נשמר זמנית בזיכרון** → `multer` מספק גישה ל-`req.file.buffer`
3. **הקובץ מועלה ל-S3** → השירות `s3Service` מעלה את הקובץ ל-S3
4. **קבלת CDN URL מהקובץ** → S3 מחזיר את כתובת ה-CDN URL של הקובץ
5. **שמירה במסד הנתונים** → **רק המידע על הקובץ וכתובת ה-CDN URL נשמרים ב-MongoDB** - הקובץ עצמו נשאר ב-S3 בלבד!
6. **החזרת תשובה למשתמש** → השרת מחזיר את פרטי הקובץ למשתמש (כולל כתובת ה-CDN URL)

**⚠️ חשוב להבין:** הקובץ עצמו נשמר ב-AWS S3 בלבד. במסד הנתונים MongoDB נשמרים רק:
- מידע על הקובץ (שם, גודל, סוג)
- **כתובת ה-CDN URL** (`s3Url`) - זה מה שמאפשר גישה לקובץ

---

## 🔒 אבטחה וטיפים

### טיפים לאבטחה:
1. **אימות:** כל הנתיבים דורשים אימות (JWT token)
2. **הגבלת גודל:** הגדר מגבלת גודל מקסימלי לקבצים
3. **סינון סוגי קבצים:** הגבל את סוגי הקבצים המותרים (לדוגמה: רק תמונות)
4. **שמירת מפתחות:** לעולם אל תעלה את קובץ `.env` ל-Git
5. **הרשאות S3:** השתמש ב-IAM user עם הרשאות מינימליות (רק S3)

### טיפים לביצועים:
1. **דחיסת תמונות:** אם אתה מעלה תמונות, שקול לדחוס אותן לפני ההעלאה
2. **CDN:** עבור יישומים גדולים, שקול להשתמש ב-CloudFront של AWS
3. **אסינכרוניות:** עבור קבצים גדולים, שקול להשתמש בתורים (SQS) לעיבוד אסינכרוני

---

## 🐛 פתרון בעיות נפוצות

### בעיה: "Access Denied" מ-S3
**פתרון:**
- ודא שה-Access Keys נכונים ב-`.env`
- ודא שה-IAM user יש לו הרשאות ל-S3
- ודא שה-bucket name נכון

### בעיה: "Bucket not found"
**פתרון:**
- ודא שה-bucket name ב-`.env` תואם לשם ה-bucket שיצרת
- ודא שה-region נכון

### בעיה: "File too large"
**פתרון:**
- הגדל את `limits.fileSize` ב-`middlewares/upload.js`
- או הקטן את גודל הקובץ

---

## 📚 משאבים נוספים

- [תיעוד AWS S3](https://docs.aws.amazon.com/s3/)
- [תיעוד Multer](https://github.com/expressjs/multer)
- [תיעוד AWS SDK v3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)
- [AWS Free Tier](https://aws.amazon.com/free/)

---

**בהצלחה! 🚀**
