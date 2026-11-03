import { useState } from 'react'
import {
  Brain,
  Cpu,
  Globe,
  Server,
  Smartphone,
  type LucideIcon,
} from 'lucide-react'
import type { ProjectCategory, ProjectImage } from '../../types/portfolio'

const categoryIcons: Record<ProjectCategory, LucideIcon> = {
  web: Globe,
  backend: Server,
  mobile: Smartphone,
  iot: Cpu,
  'machine-learning': Brain,
}

type ProjectThumbnailProps = {
  image?: ProjectImage
  category: ProjectCategory
}

export function ProjectThumbnail({ image, category }: ProjectThumbnailProps) {
  // Remember an image that failed to load so we can swap in the placeholder.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (image && image.src !== failedSrc) {
    return (
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        onError={() => setFailedSrc(image.src)}
        className="aspect-video w-full border-b border-line object-cover transition-transform duration-500 group-hover:scale-105"
      />
    )
  }

  const Icon = categoryIcons[category]

  return (
    <div
      aria-hidden="true"
      className="flex aspect-video w-full flex-col items-center justify-center gap-2 border-b border-line bg-[radial-gradient(circle_at_70%_30%,color-mix(in_srgb,var(--accent)_28%,transparent),transparent_55%),radial-gradient(circle_at_20%_80%,color-mix(in_srgb,var(--accent-2)_22%,transparent),transparent_50%)] bg-background/60 text-muted"
    >
      <span className="grid size-14 place-items-center rounded-full border border-accent/40 bg-background/50 shadow-[0_0_1.5rem_color-mix(in_srgb,var(--accent)_35%,transparent)]">
        <Icon className="size-7 text-accent" />
      </span>
      <span className="text-xs">Screenshot coming soon</span>
    </div>
  )
}