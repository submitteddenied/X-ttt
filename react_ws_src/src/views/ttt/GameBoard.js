import React, { Component } from 'react'
import { game_result } from '../../helpers/tictactoe'

export default class GameBoard extends Component {
	constructor(props) {
		super(props)
	}

	cell_click(e) {
		const cell_id = e.currentTarget.dataset.cell
		this.props.cell_click([cell_id])
	}

	subgame_click(game_id, cells) {
		this.props.cell_click([game_id].concat(cells))
	}

	cell(id, winning_cells) {
		const cell_vals = this.props.cell_vals
		const cell_classes = ['game_cell']
		if(winning_cells.indexOf(id) != -1) {
			cell_classes.push('win')
		}
		if(this.props.level == 0) {
			const icon = {
				'x': 'fa-times',
				'o': 'fa-circle-o'
			}

			return (<div className={cell_classes.join(' ')} data-cell={id} onClick={this.cell_click.bind(this)}>
				<i className={['fa', icon[cell_vals[id]]].join(' ')}></i>
			</div>)
		} else {
			if(this.props.next_turn_cell && this.props.next_turn_cell[0] == id) {
				cell_classes.push('next')
			}
			//TODO: Pass down the next turn cell if length > 1
			return <div className={cell_classes.join(' ')}>
				<div className='inner_wrap'>
					<GameBoard 
						cell_vals={cell_vals[id] || {}} 
						cell_click={(cells) => {this.subgame_click(id, cells)}} 
						win_cells={[]} 
						level={this.props.level - 1} />
				</div>
			</div>
		}
	}

	render() {
		const win_cells = game_result(this.props.cell_vals).set

		return (
			<div className={'game_board level-' + this.props.level}>
				<div className='game_row'>
					{this.cell('c1', win_cells)}
					{this.cell('c2', win_cells)}
					{this.cell('c3', win_cells)}
				</div>
				<div className='game_row'>
					{this.cell('c4', win_cells)}
					{this.cell('c5', win_cells)}
					{this.cell('c6', win_cells)}
				</div>
				<div className='game_row'>
					{this.cell('c7', win_cells)}
					{this.cell('c8', win_cells)}
					{this.cell('c9', win_cells)}
				</div>
			</div>
		)
	}
}