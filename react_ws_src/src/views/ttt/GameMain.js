import React, {Component} from 'react'

import io from 'socket.io-client'

import TweenMax from 'gsap'

import rand_arr_elem from '../../helpers/rand_arr_elem'
import rand_to_fro from '../../helpers/rand_to_fro'
import GameBoard from './GameBoard'
import { game_result, possible_moves } from '../../helpers/tictactoe'

export default class SetName extends Component {

	constructor (props) {
		super(props)

		this.win_sets = [
			['c1', 'c2', 'c3'],
			['c4', 'c5', 'c6'],
			['c7', 'c8', 'c9'],

			['c1', 'c4', 'c7'],
			['c2', 'c5', 'c8'],
			['c3', 'c6', 'c9'],

			['c1', 'c5', 'c9'],
			['c3', 'c5', 'c7']
		]

		const default_state = {
			win_cells: [],
			cell_vals: {},
			next_turn_ply: true,
			next_turn_cell: undefined
		}

		if (this.props.game_type != 'live')
			this.state = Object.assign({
				game_play: true,
				game_stat: 'Start game'
			}, default_state)
		else {
			this.sock_start()

			this.state = Object.assign({
				game_play: false,
				game_stat: 'Connecting'
			}, default_state)
		}
	}

//	------------------------	------------------------	------------------------

	componentDidMount () {
    	TweenMax.from('#game_stat', 1, {display: 'none', opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeIn})
    	TweenMax.from('#game_board', 1, {display: 'none', opacity: 0, x:-200, y:-200, scaleX:0, scaleY:0, ease: Power4.easeIn})
	}

	//	------------------------	------------------------	------------------------
	//	------------------------	------------------------	------------------------

	sock_start () {

		this.socket = io(app.settings.ws_conf.loc.SOCKET__io.u);

		this.socket.on('connect', function(data) { 
			// console.log('socket connected', data)

			this.socket.emit('new player', { name: app.settings.curr_user.name });

		}.bind(this));

		this.socket.on('pair_players', function(data) { 
			// console.log('paired with ', data)

			this.setState({
				next_turn_ply: data.mode=='m',
				game_play: true,
				game_stat: 'Playing with ' + data.opp.name
			})

		}.bind(this));


		this.socket.on('opp_turn', this.turn_opp_live.bind(this));



	}

	//	------------------------	------------------------	------------------------
	//	------------------------	------------------------	------------------------

	componentWillUnmount () {

		this.socket && this.socket.disconnect();
	}

	//	------------------------	------------------------	------------------------

	cell_cont (c) {
		const { cell_vals } = this.state

		return (<div>
			{cell_vals && cell_vals[c] == 'x' && <i className="fa fa-times fa-5x"></i>}
			{cell_vals && cell_vals[c] == 'o' && <i className="fa fa-circle-o fa-5x"></i>}
		</div>)
	}

	//	------------------------	------------------------	------------------------

	render () {
		return (
			<div id='GameMain'>

				<h1>Play {this.props.game_type}</h1>

				<div id="game_stat">
					<div id="game_stat_msg">{this.state.game_stat}</div>
					{this.state.game_play && <div id="game_turn_msg">{this.state.next_turn_ply ? 'Your turn' : 'Opponent turn'}</div>}
				</div>
				<div style={{ width: '400px', height: '400px' }}>
					<GameBoard cell_vals={this.state.cell_vals} 
										 cell_click={this.click_cell.bind(this)} 
										 next_turn_cell={this.state.next_turn_cell}
										 win_cells={this.state.win_cells} 
										 level={this.props.levels - 1} />
				</div>

				<button type='submit' onClick={this.end_game.bind(this)} className='button'><span>End Game <span className='fa fa-caret-right'></span></span></button>

			</div>
		)
	}

	//	------------------------	------------------------	------------------------
	//	------------------------	------------------------	------------------------

	click_cell (cells) {
		console.log(JSON.stringify(cells))
		if (!this.state.next_turn_ply || !this.state.game_play) return

		const cell_val = cells.reduce((games, cell_id) => {
			if (games && games[cell_id]) {
				return games[cell_id]
			}
			return undefined
		}, this.state.cell_vals)

		if (cell_val) return

		if (this.state.next_turn_cell) {
			for(let i = 0; i < this.state.next_turn_cell.length; i++) {
				if(this.state.next_turn_cell[i] != cells[i]) {
					return
				}
			}
		}

		this.set_cell_value(cells, 'x')

		if (this.props.game_type != 'live')
			this.check_turn(cells)
		else
			this.turn_ply_live(cells)
	}

	//	------------------------	------------------------	------------------------
	//	------------------------	------------------------	------------------------

	turn_ply_comp(cell_id) {
		// TweenMax.from(this.refs[cell_id], 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})


		// this.setState({
		// 	cell_vals: cell_vals,
		// 	next_turn_ply: false
		// })

		// setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));
	}

	//	------------------------	------------------------	------------------------

	set_cell_value(cell_path, val) {
		let game = this.state.cell_vals
		for (let i = 0; i < cell_path.length - 1; i++) {
			if(!game[cell_path[i]]) {
				game[cell_path[i]] = {}
			}
			game = game[cell_path[i]]
		}
		game[cell_path[cell_path.length - 1]] = val
	}

	turn_comp() {
		const available_moves = possible_moves(this.state.cell_vals, this.props.levels, this.state.next_turn_cell)

		const c = rand_arr_elem(available_moves)

		this.set_cell_value(c, 'o')

		// TweenMax.from(this.refs[c], 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})


		// this.setState({
		// 	cell_vals: cell_vals,
		// 	next_turn_ply: true
		// })

		this.check_turn(c)
	}


	//	------------------------	------------------------	------------------------
	//	------------------------	------------------------	------------------------

	turn_ply_live(cells) {
		// TweenMax.from(this.refs[cell_id], 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})

		this.socket.emit('ply_turn', { cell_id: cells });

		// this.setState({
		// 	cell_vals: cell_vals,
		// 	next_turn_ply: false
		// })

		// setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

		this.check_turn(cells)
	}

	//	------------------------	------------------------	------------------------

	turn_opp_live(data) {
		const cells = data.cell_id
		this.set_cell_value(cells, 'o')

		// TweenMax.from(this.refs[c], 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})


		// this.setState({
		// 	cell_vals: cell_vals,
		// 	next_turn_ply: true
		// })


		this.check_turn(cells)
	}

	//	------------------------	------------------------	------------------------
	//	------------------------	------------------------	------------------------
	//	------------------------	------------------------	------------------------

	check_turn (last_move) {

		const { cell_vals } = this.state


		if (this.props.game_type!='live')
			this.state.game_stat = 'Play'

		const result = game_result(cell_vals)
		let win = !!result.winner
		let set = result.set
		let fin = result.fin

		// win && console.log('win set: ', set)

		if (win) {
			// this.refs[set[0]].classList.add('win')
			// this.refs[set[1]].classList.add('win')
			// this.refs[set[2]].classList.add('win')

			// TweenMax.killAll(true)
			// TweenMax.from('td.win', 1, {opacity: 0, ease: Linear.easeIn})

			console.log(result)
			this.setState({
				game_stat: (result.winner == 'x' ? 'You' : 'Opponent') + ' win',
				game_play: false,
				win_cells: set
			})

			this.socket && this.socket.disconnect();

		} else if (fin) {
			console.log(result)
			this.setState({
				game_stat: 'Draw',
				game_play: false
			})

			this.socket && this.socket.disconnect();

		} else {
			if(this.props.levels > 1) {
				//force the next turn to be in the given cell if that game can be played in
				const last_cell = last_move[last_move.length - 1]
				const subgame = cell_vals[last_cell]
				const subgame_result = game_result(subgame)
				if(!subgame_result.fin) {
					this.state.next_turn_cell = [last_cell]
				} else {
					this.state.next_turn_cell = undefined
				}
			}
			this.props.game_type!='live' && this.state.next_turn_ply && setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

			this.setState({
				next_turn_ply: !this.state.next_turn_ply
			})
		}

	}

	//	------------------------	------------------------	------------------------

	end_game () {
		this.socket && this.socket.disconnect();

		this.props.onEndGame()
	}
}
