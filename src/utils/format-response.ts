export const formatAddResponse = (
  id: number,
  amount: number,
  category: string,
  description?: string
) => {
  let message = `A record with an amount of $${amount.toFixed(2)}`;

  if (description) {
    message += ` and description '${description}'`;
  }

  message += ` has been added to the '${category}' category.\nUse ID ${id} to view, edit, or delete this record in the future.`;

  return message;
};
