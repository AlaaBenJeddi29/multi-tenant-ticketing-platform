export function toCategoryResponse(
  category: any
) {
  return {
    id: category.id,
    name: category.name,
    description:
      category.description,
    isActive: category.isActive,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export function toCategoriesResponse(
  categories: any[]
) {
  return categories.map(
    toCategoryResponse
  );
}