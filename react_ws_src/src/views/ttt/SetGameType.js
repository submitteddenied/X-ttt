import React, {Component} from 'react'

export default class SetGameType extends Component {

	constructor (props) {
		super(props)

		this.state = {}
	}

//	------------------------	------------------------	------------------------

	render () {
		return (
			<div id='SetGameType'>

				<h1>Choose game type</h1>

				<h2>Standard</h2>
				<button type='submit' data-levels={1} onClick={this.selTypeLive.bind(this)} className='button long'><span>Live against another player <span className='fa fa-caret-right'></span></span></button>
				<button type='submit' data-levels={1} onClick={this.selTypeComp.bind(this)} className='button long'><span>Against a computer <span className='fa fa-caret-right'></span></span></button>

				<h2>Ultimate</h2>
				<button type='submit' data-levels={2} onClick={this.selTypeLive.bind(this)} className='button long'><span>Live against another player <span className='fa fa-caret-right'></span></span></button>
				<button type='submit' data-levels={2} onClick={this.selTypeComp.bind(this)} className='button long'><span>Against a computer <span className='fa fa-caret-right'></span></span></button>

			</div>
		)
	}

//	------------------------	------------------------	------------------------

	selTypeLive (e) {
		// const { name } = this.refs
		// const { onSetType } = this.props
		// onSetType(name.value.trim())

		const levels = parseInt(e.currentTarget.dataset.levels)
		this.props.onSetType('live', levels)
	}

//	------------------------	------------------------	------------------------

	selTypeComp (e) {
		// const { name } = this.refs
		// const { onSetType } = this.props
		// onSetType(name.value.trim())

		const levels = parseInt(e.currentTarget.dataset.levels)
		this.props.onSetType('comp', levels)
	}

}
