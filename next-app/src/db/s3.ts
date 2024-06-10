import "server-only";

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucketName: string = process.env.BUCKET_NAME as string;
const bucketRegion: string = process.env.BUCKET_REGION as string;
const bucketAccessKey: string = process.env.ACCESS_KEY as string;
const bucketSecretAccessKey: string = process.env.SECRET_KEY as string;

export type S3AllowedContentTypes =
  | "image/jpeg"
  | "image/png"
  | "image/jpg"
  | "image/gif";

const client: S3Client = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: bucketAccessKey,
    secretAccessKey: bucketSecretAccessKey,
  },
});

export async function addImageToBucket({
  image,
  key,
  contentType,
}: {
  image: Buffer;
  key: string;
  contentType: S3AllowedContentTypes;
}) {
  const imageKey = key;

  const params = {
    Bucket: bucketName,
    Key: imageKey,
    Body: image,
    ContentType: contentType,
  };

  try {
    const command = new PutObjectCommand(params);
    client.send(command);
  } catch (error) {
    throw new Error("Could not add image to bucket");
  }
}

export async function deleteImageFromBucket({ key }: { key: string }) {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  const command = new DeleteObjectCommand(params);
  return client.send(command);
}

// // GET FUNCTIONS:

export async function getImageFromBucket({ key }: { key: string }) {
  return await getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );
}
