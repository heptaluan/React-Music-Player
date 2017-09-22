import React, { Component } from 'react';
import './progress.scss';

// 进度条组件
class Progress extends Component {

	constructor(props) {
		super(props);
		this.setProgress = this.setProgress.bind(this);
	}

	// 将进度条当前进度返回给父组件（鼠标所点击的位置）
	setProgress(e) {
		// 进度条当前位置 = （鼠标当前位置 - 进度条距离左边窗口距离） / 总进度条长度
		let settedProgress = (e.pageX - this.refs.propgressBar.getBoundingClientRect().left) / this.refs.propgressBar.clientWidth;

		// setProgress 方法是 Player 组件通过 props 传递下来的（用于子组件向父组件传递数据）
		this.props.setProgress && this.props.setProgress(settedProgress);
	}

	render() {

		// 通过传递过来的 props 设置 style 样式
		let barStyle = {
			width: `${this.props.progress}%`,
			background: this.props.barColor
		};

		return (
			<div ref="propgressBar" onClick={this.setProgress} className="components-progress" >
				<div className="progress" style={barStyle}></div>
			</div>
		);
	}
}

export default Progress;
