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

export function game_result(game) {
	const resolved_game = Object.keys(game).reduce((memo, cell) => {
		if(typeof game[cell] == 'string') {
			memo[cell] = game[cell]
		} else {
			const subgame_result = game_result(game[cell])
			memo[cell] = subgame_result.winner
		}

		return memo
	}, {})

	for(let i = 0; i < win_sets.length; i++) {
		const set = win_sets[i]
		if(resolved_game[set[0]] && resolved_game[set[0]] == resolved_game[set[1]] && resolved_game[set[0]] == resolved_game[set[2]]) {
			return {
				winner: resolved_game[set[0]],
				fin: true,
				set
			}
		}
	}

	let fin = true
	for(let i = 1; i <= 9; i++) {
		if(!game['c' + i]) {
			fin = false
		}
	}

	return {fin, set: []}
}