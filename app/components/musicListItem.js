import React, { Component } from 'react';
import './musicListItem.scss';

// 使用 Pubsub 这个包来进行 订阅/发布 信息（可以简单的理解为简化版的 redux）
import Pubsub from 'pubsub-js';

// 列表当中的单独的每一项组件（类似于 li）
class MusiclistItem extends Component {

	constructor(props) {
		super(props)
	}

	// 利用 Pubsub，仅发送一个事件，不做逻辑处理，交由事件订阅者来进行处理
	chooseMusic(musicItem) {
		Pubsub.publish('CHOOSE_MUSIC', musicItem);
	}

	// 同上
	deleteMudic(musicItem, e) {

		// 因为删除的点击事件嵌套在 li 当中，所以需要阻止冒泡
		e.stopPropagation();
		Pubsub.publish('DELETE_MUSIC', musicItem);
	}

	render() {

		// 通过 props 来获取每一项对应的信息
		let musicItem = this.props.musicItem;

		return (
				<li
					key={musicItem.key}
					onClick={this.chooseMusic.bind(this, musicItem)}
					className={`components-musiclistitem row ${this.props.focus ? 'focus' : ''}`}
				>
					<p><strong>{musicItem.title}</strong> - {musicItem.artist}</p>
					<p
						onClick={this.deleteMudic.bind(this, musicItem)}
						className="-col-auto delete"
					></p>
				</li>
		)
	}

}

export default MusiclistItem;
