import type { SkillCategory } from '../types/portfolio'

/** Categories with no skills are dropped, so no empty boxes are ever shown. */
export function getVisibleSkillCategories(categories: SkillCategory[]): SkillCategory[] {
  return categories.filter((category) => category.skills.length > 0)
}

/**
 * Picks up to `limit` skills you have actually used, taking one from each
 * category in turn so the selection is varied (not five languages in a row).
 */
export function pickUsedSkills(categories: SkillCategory[], limit: number): string[] {
  const queues = getVisibleSkillCategories(categories).map((category) =>
    category.skills.filter((skill) => skill.status === 'used').map((skill) => skill.name),
  )

  const picked: string[] = []
  for (let round = 0; picked.length < limit; round++) {
    let addedThisRound = false
    for (const queue of queues) {
      if (picked.length < limit && queue[round] !== undefined) {
        picked.push(queue[round])
        addedThisRound = true
      }
    }
    if (!addedThisRound) break
  }
  return picked
}
