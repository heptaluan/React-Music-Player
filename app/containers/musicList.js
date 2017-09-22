import React, { Component } from 'react';
import MusiclistItem from '../components/musicListItem';
import './musicList.scss';


// 整合 MusiclistItem 后形成的 列表页组件（类似于 ul）
class Musiclist extends Component {

	constructor(props) {
		super(props)
	}

	render() {

		// 循环渲染（需要加上 key 属性）
		let listElements = this.props.musicList.map((item) => {

			// focus 属性用于标注当前播放的是哪一首歌曲（返回的是一个布尔值）
			return (
				<MusiclistItem focus={item === this.props.cuerrentMusicItem} key={item.id} musicItem={item} />
			);
		});

		return (
			<div className="listBox">
				<ul>
					{listElements}
				</ul>
			</div>
		);
	}
}

export default Musiclist;
