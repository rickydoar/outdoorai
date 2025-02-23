interface CategoryFilterProps {
  categories: string[]
  selectedCategories: string[]
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ categories, selectedCategories, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-[#1f513f]">Categories</h2>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category} className="flex items-center">
            <input
              type="checkbox"
              id={category}
              checked={selectedCategories.includes(category)}
              onChange={() => onCategoryChange(category)}
              className="mr-2 form-checkbox h-5 w-5 text-[#1f513f] rounded border-gray-300 focus:ring-[#1f513f]"
            />
            <label htmlFor={category} className="text-gray-700 cursor-pointer">
              {category}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

