import dotenv from "dotenv";
dotenv.config();

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import mime from "mime-types";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

function generateFileName(originalName) {
  const ext = mime.extension(originalName);
  return `${crypto.randomUUID()}.${ext}`;
}

export async function getPresignedUrl(fileType, originalName) {
  const fileName = generateFileName(originalName);
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType
  });

  const url = await getSignedUrl(s3, command); // 1 min

  return {
    uploadUrl: url,
    fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
  };
}
