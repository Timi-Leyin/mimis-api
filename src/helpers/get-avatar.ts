import axios from 'axios';
import { AVATAR_URL, CWD } from 'src/config/constants';
import * as path from 'path';
import * as fs from 'fs';
import { writeFileSync } from 'fs';
import { uploadFile } from './uploader';
import { rm, rmdir } from 'fs/promises';
export const getAvatarUrl = ({ name }: { name: string }) => {
  return `${AVATAR_URL}?flip=false&seed=${name}`;
};

export const saveAvatar = async (data: string, name: string) => {
  const $path = path.join(CWD, 'public/avatars');
  const ext = 'svg';
  const filename = path.join($path, `${name}-${Date.now()}.${ext}`);
  writeFileSync(filename, data);
  const uploader = await uploadFile(filename);
  // await rm(filename);
  return uploader;
};

export const getAvatar = async (name: string) => {
  try {
    const response = await axios.get(getAvatarUrl({ name }));
    const file = await saveAvatar(response.data, name);
    return file;
  } catch (error) {
    return;
  }
};
