import React, { Component } from 'react'

export default class GameBoard extends Component {
	constructor(props) {
		super(props)
	}

	cell_click(e) {
		const cell_id = e.currentTarget.dataset.cell
		this.props.cell_click(cell_id)
	}

	subgame_click(game_id, cells) {
		this.props.cell_click([game_id].concat(cells))
	}

	cell(id) {
		const cell_vals = this.props.cell_vals
		const win_class = this.props.win_cells.indexOf(id) != -1 ? 'win' : ''
		if(this.props.level == 0) {
			const icon = {
				'x': 'fa-times',
				'o': 'fa-circle-o'
			}

			return (<div className={'game_cell ' + win_class} data-cell={id} onClick={this.cell_click.bind(this)}>
				<i className={['fa', icon[cell_vals[id]]].join(' ')}></i>
			</div>)
		} else {
			return <div className={'game_cell ' + win_class}>
				<div className='inner_wrap'>
					<GameBoard cell_vals={cell_vals[id] || {}} cell_click={(cells) => {this.subgame_click(id, cells)}} win_cells={[]} level={this.props.level - 1} />
				</div>
			</div>
		}
	}

	render() {
		return (
			<div className={'game_board level-' + this.props.level}>
				<div className='game_row'>
					{this.cell('c1')}
					{this.cell('c2')}
					{this.cell('c3')}
				</div>
				<div className='game_row'>
					{this.cell('c4')}
					{this.cell('c5')}
					{this.cell('c6')}
				</div>
				<div className='game_row'>
					{this.cell('c7')}
					{this.cell('c8')}
					{this.cell('c9')}
				</div>
			</div>
		)
	}
}