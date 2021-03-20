export const toFormatDate = (data: Date) => {
  return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
};
