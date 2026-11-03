import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { Search } from 'lucide-react'
import { navItems, profile, projects } from '../../data/portfolio'
import { useTheme } from '../../hooks/useTheme'
import { features } from '../../lib/features'
import { buildCommands, filterCommands, type PaletteCommand } from '../../lib/commands'

type PaletteBodyProps = { onClose: () => void }

function PaletteBody({ onClose }: PaletteBodyProps) {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  const commands = useMemo(
    () => buildCommands({ navItems, projects, profile, theme, terminal: features.terminal }),
    [theme],
  )
  const results = useMemo(() => filterCommands(commands, query), [commands, query])
  const safeIndex = Math.min(activeIndex, Math.max(results.length - 1, 0))
  const activeCommand = results[safeIndex]

  // Keep the highlighted row visible when navigating a long list with the arrows.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [safeIndex, results])

  function run(command: PaletteCommand) {
    onClose()
    const { action } = command
    switch (action.type) {
      case 'navigate':
        navigate(action.to)
        break
      case 'external':
        window.open(action.href, '_blank', 'noopener,noreferrer')
        break
      case 'mailto':
        window.location.assign(action.href)
        break
      case 'theme':
        toggleTheme()
        break
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((safeIndex + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((safeIndex - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      run(results[safeIndex])
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 border-b border-line px-4 focus-within:border-accent">
        <Search aria-hidden="true" className="size-5 shrink-0 text-muted" />
        <input
          autoFocus
          type="text"
          role="combobox"
          aria-label="Search commands"
          aria-expanded={results.length > 0}
          aria-controls="palette-list"
          aria-autocomplete="list"
          aria-activedescendant={
            activeCommand ? `palette-option-${activeCommand.id}` : undefined
          }
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(0)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search sections, projects, links..."
          autoComplete="off"
          spellCheck={false}
          className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted"
        />
      </div>

      {results.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-muted">No matching commands.</p>
      ) : (
        <ul
          id="palette-list"
          ref={listRef}
          role="listbox"
          aria-label="Commands"
          className="max-h-80 overflow-y-auto p-2"
        >
          {results.map((command, index) => {
            const active = index === safeIndex
            return (
              <li
                key={command.id}
                id={`palette-option-${command.id}`}
                role="option"
                aria-selected={active}
                data-active={active}
                onClick={() => run(command)}
                onPointerMove={() => setActiveIndex(index)}
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm ${
                  active ? 'bg-accent text-accent-fg' : 'text-foreground'
                }`}
              >
                <span className="truncate">{command.label}</span>
                <span
                  className={`shrink-0 font-mono text-xs ${
                    active ? 'text-accent-fg' : 'text-muted'
                  }`}
                >
                  {command.group}
                </span>
              </li>
            )
          })}
        </ul>
      )}

      <div className="border-t border-line px-4 py-2 text-xs text-muted">
        ↑↓ navigate · Enter select · Esc close
      </div>
    </div>
  )
}

type CommandPaletteProps = {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Sync React's "open" state with the native dialog.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command palette"
      onClose={onClose}
      // A click on the dark backdrop targets the dialog itself, not its content.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="mx-auto mt-[12vh] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-xl border border-line bg-surface text-foreground shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      {open && <PaletteBody onClose={onClose} />}
    </dialog>
  )
}