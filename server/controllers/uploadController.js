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
      const mimeType = req.file.mimetype

      // העלאת הקובץ ל-S3
      const { s3Url } = await uploadFileToS3(
        fileBuffer,
        originalName,
        mimeType
      )



      // החזרת תשובה למשתמש
      res.status(201).json({
        message: "File uploaded successfully",
        s3Url
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
