import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { about, experience, profile, projects, skillCategories } from '../../data/portfolio'
import { runTerminalCommand, terminalCommands } from '../../lib/terminal'
import { Section } from '../ui/Section'

type Entry = { id: number; command: string; lines: string[] }

const context = { profile, about, skillCategories, experience, projects }

export function TerminalSection() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const [value, setValue] = useState('')
  const outputRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)

  // Scroll only the terminal's own output, never the whole page.
  useEffect(() => {
    const output = outputRef.current
    if (output) output.scrollTop = output.scrollHeight
  }, [entries])

  function run(raw: string) {
    const command = raw.trim()
    if (!command) return

    const result = runTerminalCommand(command, context)
    setHistory((current) => [...current, command])
    setHistoryIndex(null)

    if ('clear' in result) {
      setEntries([])
      return
    }

    const id = nextId.current++
    setEntries((current) => [...current, { id, command, lines: result.lines }])
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    run(value)
    setValue('')
  }

  // Up and Down arrows walk through previously typed commands.
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowUp') {
      if (history.length === 0) return
      event.preventDefault()
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(next)
      setValue(history[next])
    } else if (event.key === 'ArrowDown') {
      if (historyIndex === null) return
      event.preventDefault()
      const next = historyIndex + 1
      if (next >= history.length) {
        setHistoryIndex(null)
        setValue('')
      } else {
        setHistoryIndex(next)
        setValue(history[next])
      }
    }
  }

  return (
    <Section id="terminal" eyebrow="Terminal" title="Ask my portfolio">
      <p className="mb-6 max-w-2xl text-muted">
        An interactive terminal that answers from the same data as the rest of this
        site. Type a command, or tap one below.
      </p>

      <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_0_60px_-30px_var(--accent-2)]">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span aria-hidden="true" className="size-2.5 rounded-full bg-line" />
          <span aria-hidden="true" className="size-2.5 rounded-full bg-line" />
          <span aria-hidden="true" className="size-2.5 rounded-full bg-line" />
          <span className="ml-2 font-mono text-xs text-muted">portfolio-cli</span>
        </div>

        <div
          ref={outputRef}
          role="log"
          aria-label="Terminal output"
          tabIndex={0}
          className="h-80 overflow-y-auto p-4 font-mono text-[13px] leading-6 text-muted"
        >
          <p>Welcome. Type &lsquo;help&rsquo; to see what I can answer.</p>
          {entries.map((entry) => (
            <div key={entry.id} className="mt-3">
              <p className="text-foreground">
                <span aria-hidden="true" className="text-accent-2">
                  ${' '}
                </span>
                {entry.command}
              </p>
              {entry.lines.map((line, index) => (
                <p key={index} className="break-words whitespace-pre-wrap">
                  {line || '\u00A0'}
                </p>
              ))}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-line px-4">
          <span aria-hidden="true" className="font-mono text-sm text-accent-2">
            $
          </span>
          <label htmlFor="terminal-input" className="sr-only">
            Type a command
          </label>
          <input
            id="terminal-input"
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="help"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="h-12 w-full bg-transparent font-mono text-sm outline-none placeholder:text-muted"
          />
        </form>
      </div>

      <ul aria-label="Quick commands" className="mt-4 flex flex-wrap gap-2">
        {terminalCommands.map((item) => (
          <li key={item.name}>
            <button
              type="button"
              onClick={() => run(item.name)}
              className="rounded-lg border border-line bg-surface px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-foreground"
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </Section>
  )
}