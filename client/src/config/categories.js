// Same list as server/src/models/todo.js
export const CATEGORIES = [
  { id: 'work', label: 'Work' },
  { id: 'home', label: 'Home' },
  { id: 'study', label: 'Study' },
  { id: 'errands', label: 'Errands' },
]

export const categoryLabel = (id) =>
  CATEGORIES.find((category) => category.id === id)?.label ?? 'Other'
