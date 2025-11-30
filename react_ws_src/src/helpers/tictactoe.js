const win_sets = [
	['c1', 'c2', 'c3'],
	['c4', 'c5', 'c6'],
	['c7', 'c8', 'c9'],

	['c1', 'c4', 'c7'],
	['c2', 'c5', 'c8'],
	['c3', 'c6', 'c9'],

	['c1', 'c5', 'c9'],
	['c3', 'c5', 'c7']
]

function for_each_cell(cb) {
	for(let i = 1; i <= 9; i++) {
		cb('c' + i)
	}
}

export function game_result(game) {
	game = game || {}
	const resolved_game = Object.keys(game).reduce((memo, cell) => {
		if(typeof game[cell] == 'string') {
			memo[cell] = {winner: game[cell], fin: true}
		} else {
			const subgame_result = game_result(game[cell])
			memo[cell] = {winner: subgame_result.winner, fin: subgame_result.fin}
		}

		return memo
	}, {})

	for(let i = 0; i < win_sets.length; i++) {
		const set = win_sets[i]
		const cell_winners = set.map((cell) => {
			return resolved_game[cell] && resolved_game[cell].winner
		})
		if(cell_winners[0] && cell_winners[0] == cell_winners[1] && cell_winners[0] == cell_winners[2]) {
			return {
				winner: cell_winners[0],
				fin: true,
				set
			}
		}
	}

	let fin = true
	for_each_cell((cell) => {
		if(!resolved_game[cell] || resolved_game[cell].fin == false) {
			fin = false
		}
	})

	return {fin, set: []}
}

export function possible_moves(game, levels, next_subgame) {
	const moves = []
	if(levels == 1) {
		const result = game_result(game)
		if(result.fin) {
			return []
		}
		for_each_cell((cell) => {
			if(!game[cell]) {
				moves.push([cell])
			}
		})
		return moves
	}

	//recursive
	if(next_subgame) {
		const subgame = game[next_subgame] || {}
		//TODO: Handle next_subgame when levels > 2
		return possible_moves(subgame, levels - 1).map((move) => [next_subgame].concat(move))
	}

	for_each_cell((cell) => {
		const subgame = game[cell] || {}
		const subgame_moves = possible_moves(subgame, levels - 1)
		moves.push(...subgame_moves.map((move) => [cell].concat(move)))
	})

	return moves
}