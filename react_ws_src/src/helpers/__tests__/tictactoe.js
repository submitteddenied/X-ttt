jest.unmock('../tictactoe.js')
import { game_result, possible_moves } from '../tictactoe'

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

    it('returns unfinished when outer game is not finished', () => {
      const outer_game = {
        c1: {c1: 'x', c4: 'o', c7: 'o'},
        c2: {c5: 'x', c7: 'x', c9: 'o'},
        c3: {c5: 'o', c7: 'x'},
        c4: {c2: 'o', c5: 'x', c6: 'x', c7: 'x'},
        c5: {c2: 'o', c4: 'o', c5: 'x', c7: 'o', c8: 'o', c9: 'o'},
        c6: {c3: 'o', c4: 'o', c5: 'x'},
        c7: {c1: 'x', c2: 'x', c3: 'x', c6: 'o', c7: 'o', c9: 'o'},
        c8: {c1: 'x'},
        c9: {c4: 'x', c5: 'x', c6: 'x'}
      }

      const result = game_result(outer_game)
      expect(result.winner).toBeUndefined()
      expect(result.fin).toBe(false)
      expect(result.set).toEqual([])
    })
  })
})

describe('possible_moves', () => {
  it('returns all moves for an empty game', () => {
    const moves = possible_moves({}, 1)

    expect(moves).toEqual([['c1'], ['c2'], ['c3'], 
                           ['c4'], ['c5'], ['c6'],
                           ['c7'], ['c8'], ['c9']])
  })

  it('only returns available moves', () => {
    const moves = possible_moves({c1: 'x', c5: 'o'}, 1)

    expect(moves).toEqual([['c2'], ['c3'], 
                           ['c4'], ['c6'],
                           ['c7'], ['c8'], ['c9']])
  })

  it('returns no moves for a completed game', () => {
    const moves = possible_moves({
      c1: 'x',
      c5: 'x',
      c9: 'x'
    }, 1)

    expect(moves).toEqual([])
  })

  describe('recursive games', () => {
    it('returns all moves for an empty game', () => {
      const moves = possible_moves({}, 2)

      expect(moves.length).toBe(81)
      expect(moves[0]).toEqual(['c1', 'c1'])
    })

    it('returns only the available moves', () => {
      const subgame = { //Only one move available
        c1: 'o',
        c2: 'x',
        c3: 'o',
        c4: 'x',
        c5: 'o',
        c6: 'x',
        c7: 'x',
        c8: 'o',
      }

      const moves = possible_moves({
        c1: subgame,
        c2: subgame,
        c3: subgame,
        c4: subgame,
        c5: subgame,
        c6: subgame,
        c7: subgame,
        c8: subgame,
        c9: subgame
      }, 2)
      expect(moves).toEqual([
        ['c1', 'c9'],
        ['c2', 'c9'],
        ['c3', 'c9'],
        ['c4', 'c9'],
        ['c5', 'c9'],
        ['c6', 'c9'],
        ['c7', 'c9'],
        ['c8', 'c9'],
        ['c9', 'c9']
      ])
    })

    it('only returns moves from the next game when set', () => {
    const moves = possible_moves({}, 2, 'c1')

    expect(moves).toEqual([['c1', 'c1'],
                           ['c1', 'c2'],
                           ['c1', 'c3'], 
                           ['c1', 'c4'],
                           ['c1', 'c5'],
                           ['c1', 'c6'],
                           ['c1', 'c7'],
                           ['c1', 'c8'],
                           ['c1', 'c9']])
    })
  })
})