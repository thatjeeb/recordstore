export const getDayMonthYear = (): { day: number; month: number; year: number } => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return { day, month, year };
};
