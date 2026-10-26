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
      className="flex aspect-video w-full flex-col items-center justify-center gap-2 border-b border-line bg-background text-muted"
    >
      <Icon className="size-8 text-accent" />
      <span className="text-xs">Screenshot coming soon</span>
    </div>
  )
}