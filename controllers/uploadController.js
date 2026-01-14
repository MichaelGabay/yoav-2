import { uploadFileToS3 } from "../services/s3Service.js"
import fileModel from "../models/fileModel.js"
const uploadCtrl = {
  async uploadSingle(req, res) {
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
}

export default uploadCtrl
