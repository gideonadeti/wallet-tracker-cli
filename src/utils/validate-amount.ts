export const validateAmount = (amount: string) => {
  const parsed = parseFloat(amount);

  return isNaN(parsed) ? null : parsed;
};
