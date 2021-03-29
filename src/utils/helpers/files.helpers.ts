export const moveFile = async (file: any, path: string): Promise<any> => {
  return await file.mv(path);
};
