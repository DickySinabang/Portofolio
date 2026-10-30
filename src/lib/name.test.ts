import { describe, expect, it } from 'vitest'
import { getDisplaySize, splitName } from './name'

describe('splitName', () => {
  it('puts the last word on its own line', () => {
    expect(splitName('Ada Lovelace')).toEqual(['Ada', 'Lovelace'])
    expect(splitName('Muhammad Dicky Sinabang')).toEqual(['Muhammad Dicky', 'Sinabang'])
  })

  it('balances the two lines for longer names', () => {
    expect(splitName('Muhammad Dicky Sinabang Putra')).toEqual(['Muhammad Dicky', 'Sinabang Putra'])
    expect(splitName('Ana Maria de la Cruz')).toEqual(['Ana Maria', 'de la Cruz'])
  })

  it('keeps a single word on one line', () => {
    expect(splitName('Cher')).toEqual(['Cher'])
  })

  it('ignores extra whitespace and handles an empty name', () => {
    expect(splitName('  Ada   Lovelace ')).toEqual(['Ada', 'Lovelace'])
    expect(splitName('   ')).toEqual([])
  })
})

describe('getDisplaySize', () => {
  it('uses the largest size for short names', () => {
    expect(getDisplaySize(['Ada', 'Lovelace'])).toBe('xl')
  })

  it('steps down as the longest line grows', () => {
    expect(getDisplaySize(['Sinabangputra'])).toBe('lg')
    expect(getDisplaySize(['Muhammad Dicky', 'Sinabang'])).toBe('md')
    expect(getDisplaySize(['Wolfeschlegelsteinhausen'])).toBe('sm')
  })

  it('copes with no lines', () => {
    expect(getDisplaySize([])).toBe('xl')
  })
})
