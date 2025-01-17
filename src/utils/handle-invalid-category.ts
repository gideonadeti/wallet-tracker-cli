import readlineSync from "readline-sync";

export const handleInvalidCategory = (
  categories: any,
  category: string,
  type: string
) => {
  console.error(
    `Invalid category for ${type}. Available ${type} categories:\n${categories[
      type
    ]
      .map((category: string, index: number) => `${index + 1}. ${category}`)
      .join("\n")}`
  );

  const addCategory = readlineSync.question(
    `Do you want to add "${category}" as a new ${type} category? (Y/n): `
  );

  if (addCategory === "Y" || addCategory === "y" || addCategory === "") {
    categories[type].push(category);

    console.log(`Category "${category}" added to ${type} categories.`);
  } else {
    console.error("Operation cancelled. No record added.");
    process.exit(1);
  }
};
