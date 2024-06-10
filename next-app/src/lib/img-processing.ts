const sharp = require("sharp");

export async function processImageFile({
  file,
  height,
}: {
  file: File;
  height: number;
}): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return await sharp(buffer).resize(Number(height)).toBuffer();
}
