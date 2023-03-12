export const nameFormatter = (name: string) => {
  const regex = new RegExp(/[-_\W()]/g);
  let ext = name.substring(0, name.length - 4);
  let value = ext.replaceAll(regex, " ");
  let result = value.toUpperCase();
  return result;
};

