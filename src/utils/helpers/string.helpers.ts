/**
 * convert string-boolean to boolean
 * @param value false | true
 * @returns boolean
 */
export const stringToBoolean = (value: string): boolean => {
  if (!value) return false;
  if (value.toLowerCase() === "false") return false;
  if (value.toLowerCase() === "true") return true;
  return false;
};
