jest.unmock('../tictactoe.js')
import { game_result } from '../tictactoe'

describe('game_result', () => {
  it('returns in progress for empty game', () => {
    const result = game_result({})
    expect(result.winner).toBeUndefined()
    expect(result.fin).toBe(false)
    expect(result.set).toEqual([])
  })

  it('returns in progress for an unfinished game', () => {
    const result = game_result({
      c1: 'o',
      c2: 'x',
      c3: 'o',
      c5: 'x'
    })

    expect(result.winner).toBeUndefined()
    expect(result.fin).toBe(false)
    expect(result.set).toEqual([])
  })

  it('returns win for a finished game', () => {
    const result = game_result({
      c1: 'o',
      c2: 'o',
      c3: 'o'
    })

    expect(result.winner).toEqual('o')
    expect(result.fin).toBe(true)
    expect(result.set).toEqual(['c1', 'c2', 'c3'])
  })

  it('returns win for a finished game', () => {
    const result = game_result({
      c1: 'x',
      c5: 'x',
      c9: 'x'
    })

    expect(result.winner).toEqual('x')
    expect(result.fin).toBe(true)
    expect(result.set).toEqual(['c1', 'c5', 'c9'])
  })

  it('returns finished for a draw', () => {
    const result = game_result({
      c1: 'o',
      c2: 'x',
      c3: 'o',
      c4: 'x',
      c5: 'o',
      c6: 'x',
      c7: 'x',
      c8: 'o',
      c9: 'x',
    })

    expect(result.winner).toBeUndefined()
    expect(result.fin).toBe(true)
    expect(result.set).toEqual([])
  })

  describe('nested games', () => {
    it('recursively handles nested games', () => {
      const g1 = {c1: 'x', c2: 'x', c3: 'x'}
      const g2 = {c1: 'x', c2: 'x', c3: 'x'}
      const g3 = {c1: 'x', c2: 'x', c3: 'x'}
      const outer_game = {c1: g1, c2: g2, c3: g3}

      const result = game_result(outer_game)
      expect(result.winner).toBe('x')
      expect(result.fin).toBe(true)
      expect(result.set).toEqual(['c1', 'c2', 'c3'])
    })

    it('returns unfinished when outer game is not finished', () => {
      const g1 = {c1: 'x', c2: 'x', c3: 'x'}
      const g2 = {c1: 'x', c2: 'o'}
      const g3 = {c1: 'o', c2: 'o', c3: 'o'}
      const outer_game = {c1: g1, c2: g2, c3: g3}

      const result = game_result(outer_game)
      expect(result.winner).toBeUndefined()
      expect(result.fin).toBe(false)
      expect(result.set).toEqual([])
    })
  })
})