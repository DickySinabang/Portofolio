import type { SkillCategory } from '../types/portfolio'

/** Categories with no skills are dropped, so no empty boxes are ever shown. */
export function getVisibleSkillCategories(categories: SkillCategory[]): SkillCategory[] {
  return categories.filter((category) => category.skills.length > 0)
}