interface CategoryFilterProps {
  categories: string[]
  selectedCategories: string[]
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ categories, selectedCategories, onCategoryChange }: CategoryFilterProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      {categories.map((category) => (
        <div key={category} className="flex items-center mb-2">
          <input
            type="checkbox"
            id={category}
            checked={selectedCategories.includes(category)}
            onChange={() => onCategoryChange(category)}
            className="mr-2"
          />
          <label htmlFor={category}>{category}</label>
        </div>
      ))}
    </div>
  )
}

