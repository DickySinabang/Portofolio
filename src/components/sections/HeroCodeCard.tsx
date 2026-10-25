import { about, profile } from '../../data/portfolio'

function CodeValue({ value }: { value: string | string[] }) {
  if (typeof value === 'string') {
    return <span className="text-accent">{JSON.stringify(value)},</span>
  }

  return (
    <>
      <span>[</span>
      {value.map((item) => (
        <span key={item} className="block pl-4 text-accent">
          {JSON.stringify(item)},
        </span>
      ))}
      <span>],</span>
    </>
  )
}


export function HeroCodeCard() {
  const developer: Record<string, string | string[]> = {
    name: profile.name,
    role: profile.title,
    education: `${about.education.degree}, ${about.education.institution}`,
    interests: about.interests,
  }

  return (
    <div
      aria-hidden="true"
      className="min-w-0 overflow-hidden rounded-lg border border-line bg-surface"
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
        <span className="ml-2 font-mono text-xs text-muted">developer.ts</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-7 text-muted">
        <code>
          <span className="text-accent">const</span> developer = {'{'}
          {Object.entries(developer).map(([key, value]) => (
            <span key={key} className="block pl-4">
              <span className="text-foreground">{key}</span>: <CodeValue value={value} />
            </span>
          ))}
          {'}'}
        </code>
      </pre>
    </div>
  )
}