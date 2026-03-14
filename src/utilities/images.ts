import { promises as fsPromises } from 'fs';
import path from 'path';
import sharp from 'sharp';

const fullDir = path.join(__dirname, '../../assets/full');
const thumbDir = path.join(__dirname, '../../assets/thumb');

const getFullImagePath = (filename: string): string => {
  return path.join(fullDir, `${filename}.jpg`);
};

const getThumbImagePath = (
  filename: string,
  width: number,
  height: number,
): string => {
  return path.join(thumbDir, `${filename}_thumb${width}x${height}.jpg`);
};

const isImageFileExiste = async (filePath?: string): Promise<boolean> => {
  if (!filePath) return false;

  try {
    await fsPromises.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const resizingImage = async (
  filename: string,
  width: number,
  height: number,
): Promise<string> => {
  if (!filename) {
    throw new Error('filename is required');
  }

  if (!width || !height || width <= 0 || height <= 0) {
    throw new Error(
      'width and height are required and must be positive numbers',
    );
  }

  const fullPath = getFullImagePath(filename);
  const fullExists = await isImageFileExiste(fullPath);

  if (!fullExists) {
    throw new Error('image not found');
  }

  const thumbPath = getThumbImagePath(filename, width, height);
  const thumbExists = await isImageFileExiste(thumbPath);

  if (thumbExists) {
    return thumbPath;
  }

  await sharp(fullPath).resize(width, height).toFile(thumbPath);

  return thumbPath;
};

const removeThumbImages = async (): Promise<void> => {
  await fsPromises.rm(thumbDir, { recursive: true, force: true });
  await fsPromises.mkdir(thumbDir, { recursive: true });
};

export default {
  getFullImagePath,
  getThumbImagePath,
  isImageFileExiste,
  resizingImage,
  removeThumbImages,
};
