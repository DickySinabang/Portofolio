import { projectCategoryLabels, type ProjectFilterValue } from '../../lib/projects'
import type { ProjectCategory } from '../../types/portfolio'

type ProjectFilterProps = {
  categories: ProjectCategory[]
  active: ProjectFilterValue
  onChange: (value: ProjectFilterValue) => void
}

export function ProjectFilter({ categories, active, onChange }: ProjectFilterProps) {
  const options: { value: ProjectFilterValue; label: string }[] = [
    { value: 'all', label: 'All' },
    ...categories.map((category) => ({
      value: category,
      label: projectCategoryLabels[category],
    })),
  ]

  return (
    <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option.value === active
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={selected}
            className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
              selected
                ? 'border-accent bg-accent font-medium text-accent-fg'
                : 'border-line bg-surface text-muted hover:border-accent hover:text-foreground'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}