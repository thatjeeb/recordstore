export const isPowerUser = (): boolean => {
  return !!localStorage.getItem('recordStorePowerUser');
}