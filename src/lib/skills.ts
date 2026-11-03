import type { Skill, SkillCategory } from '../types/portfolio'

export function getVisibleSkillCategories(categories: SkillCategory[]): SkillCategory[] {
  return categories.filter((category) => category.skills.length > 0)
}


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

export function getAllSkills(categories: SkillCategory[]): Skill[] {
  const seen = new Set<string>()
  const skills: Skill[] = []
  for (const category of getVisibleSkillCategories(categories)) {
    for (const skill of category.skills) {
      const key = skill.name.trim().toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      skills.push(skill)
    }
  }
  return skills
}