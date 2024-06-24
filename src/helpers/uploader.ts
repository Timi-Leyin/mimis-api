import axios from 'axios';
import cloudinary from 'src/config/cloudinary';

export async function uploadFile(file: string) {
  try {
    const upload = await cloudinary.uploader.upload(file);

    return upload;
  } catch (error) {
    return;
  }
}
