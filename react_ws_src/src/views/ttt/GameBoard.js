import React, { Component } from 'react'

export default class GameBoard extends Component {
	constructor(props) {
		super(props)
	}

	cell_click(e) {
		const cell_id = e.currentTarget.dataset.cell
		this.props.cell_click(cell_id)
	}

	cell(id) {
		const cell_vals = this.props.cell_vals
		const icon = {
			'x': 'fa-times',
			'o': 'fa-circle-o'
		}
		const win_class = this.props.win_cells.indexOf(id) != -1 ? 'win' : ''
		const icon_size_class = this.props.level && this.props.level > 0 ? 'fa-1x' : 'fa-5x'

		return (<div className={'game_cell ' + win_class} data-cell={id} onClick={this.cell_click.bind(this)}>
			<i className={['fa', icon_size_class, icon[cell_vals[id]]].join(' ')}></i>
		</div>)
	}

	render() {
		return (
			<div className='game_board'>
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