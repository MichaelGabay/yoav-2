import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

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
      ACL: "public-read",
    })

    // ביצוע ההעלאה
    await s3Client.send(command)

    // יצירת URL של הקובץ
    const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`

    return {
      s3Url,
    }
  } catch (error) {
    console.error("Error uploading file to S3:", error)
    throw new Error("Failed to upload file to S3")
  }
}
