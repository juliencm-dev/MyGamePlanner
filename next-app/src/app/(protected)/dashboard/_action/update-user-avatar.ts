"use server";

import { updateUserAvatar } from "@/db/data-access/users";
import { addImageToBucket, S3AllowedContentTypes } from "@/db/s3";
import { processImageFile } from "@/lib/img-processing";
import { ServerResponseMessage } from "@/lib/types";
import { createId } from "@paralleldrive/cuid2";

export async function updateUserAvatarAction(formData: FormData): Promise<ServerResponseMessage> {
  try {
    const imgFile: File = formData.get("image") as File;
    const fileContentType: string = imgFile.type;

    if (!["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(fileContentType)) {
      return {
        message: "Invalid image type",
        status: 400,
      };
    }

    const imgBuffer = await processImageFile({
      file: imgFile,
      height: 200,
    });

    const imageKey = `uaImg-${createId()}`;

    await addImageToBucket({
      key: imageKey,
      image: imgBuffer,
      contentType: fileContentType as S3AllowedContentTypes,
    });

    await updateUserAvatar({
      avatarKey: imageKey,
    });

    return {
      message: "Avatar updated successfully",
      status: 200,
    } as ServerResponseMessage;
  } catch (error) {
    return {
      message: "Something went wrong. Could not update avatar.",
      status: 500,
    } as ServerResponseMessage;
  }
}
