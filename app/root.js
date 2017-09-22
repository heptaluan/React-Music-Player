import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Header from './components/header';
import Player from './containers/player';
import MusicList from './containers/musicList';
import Pubsub from 'pubsub-js';

// 音乐列表（需要添加大括号，default 导出则不需要）
import { MUSIC_LIST } from './config/musiclist';

// 根组件
class Root extends Component {

	// 构造函数中初始化参数
	constructor(props) {
		super(props)

		// 初始化参数
		// musicList - 歌单列表
		// cuerrentMusicItem - 当前播放（默认第 0 首）
		// cycleModel - 默认播放模式（列表播放）
		this.state = {
			musicList: MUSIC_LIST,
			cuerrentMusicItem: MUSIC_LIST[0],
			cycleModel: 'cycle'
		}
	}

	// 开始播放函数
	playMusic() {
		$('#player').jPlayer('setMedia', {
			mp3: this.state.cuerrentMusicItem.file
		}).jPlayer('play');
	}

	// 播放下一首
	// 根据下方的 $.jPlayer.event.ended 音乐结束事件后传入的 type 来进行不同的操作
	// 默认是播放下一曲
	playNext(type = 'next') {

		// 当前播放的位置
		let index = this.findMusicIndex(this.state.cuerrentMusicItem);
		let newIndex = null;
		let musicListLength = this.state.musicList.length;

		// 根据 type 决定播放模式
		switch (type) {
			case 'cycle':
				newIndex = (index + 1) % musicListLength;
				break;
			case 'once':
				newIndex = index;
				break;
			case 'random':
				newIndex = Math.round(Math.random() * musicListLength);
				break;
			case 'prev':
				newIndex = (index - 1 + musicListLength) % musicListLength;
				break;
			default:
				// 小技巧：播放到最后一首后，取模后会自动跳转到第一首（上面的 prev 类似）
				newIndex = (index + 1) % musicListLength;
		}

		// 根据 newIndex 来设置当前的播放
		this.setState({
			cuerrentMusicItem: this.state.musicList[newIndex]
		});

		// 开启播放
		this.playMusic();
	}

	// 找到当前播放的歌曲在播放列表当中的位置（index）
	findMusicIndex(musicItem) {
		return this.state.musicList.indexOf(musicItem);
	}

	// 生命周期函数钩子（组件渲染完成 已经出现在 dom 文档中）
	componentDidMount() {

		// 初始化 jPlayer 播放器，并设置一些属性
		$('#player').jPlayer({
			supplied: 'mp3',
			wmode: 'window'
		});

		// 调用播放函数，开始播放
		this.playMusic(this.state.cuerrentMusicItem);

		// 当前音乐播放完毕事件，调用 playNext() 播放下一首
		// 再根据 cycleModel 来判断是单曲循环还是下一首还是随机播放
		$('#player').bind($.jPlayer.event.ended, (e) => {
			switch (this.state.cycleModel) {
				case 'cycle':
					this.playNext('cycle');
					break;
				case 'once':
					this.playNext('once');
					break;
				case 'random':
					this.playNext('random');
					break;
			}
		});

		// 设置订阅器，监听来自 MusicList 和 Player 组件发送过来的事件再进行处理（歌曲切换操作）
		Pubsub.subscribe('CHOOSE_MUSIC', (msg, musicItem) => {

			// 设定为当前选中的
			this.setState({
				cuerrentMusicItem: musicItem
			});

			// 并且播放
			this.playMusic();
		});

		// 同上（歌单删除操作）
		Pubsub.subscribe('DELETE_MUSIC', (msg, musicItem) => {
			this.setState({
				musicList: this.state.musicList.filter(item => musicItem !== item)
			});
		});

		// 同上（上一首）
		Pubsub.subscribe('PREV_MUSIC', (msg) => {
			this.playNext('prev');
		});

		// 同上（下一首）
		Pubsub.subscribe('NEXT_MUSIC', (msg) => {
			this.playNext('next');
		});

		// 同上（切换歌曲播放模式）
		Pubsub.subscribe('CHANGE_CYCLE_MODEL', (msg) => {
			const MODEL = ['cycle', 'once', 'random'];
			let currentModel = MODEL.indexOf(this.state.cycleModel);
			let newModel = (currentModel + 1) % 3;
			this.setState({
				cycleModel: MODEL[newModel]
			});
		});
	}

	// 生命周期函数钩子（组件移除的时候解除绑定的事件）
	componentWillUnMount() {
		Pubsub.unSubscribe('CHOOSE_MUSIC');
		Pubsub.unSubscribe('DELETE_MUSIC');
		$('#player').unbind($.jPlayer.event.ended);
		Pubsub.unSubscribe('PREV_MUSIC');
		Pubsub.unSubscribe('NEXT_MUSIC');
		Pubsub.unSubscribe('CHANGE_CYCLE_MODEL');
	}

	// 渲染
	render() {

		// 传递对应的参数
		// 播放器页面（主页）
		const Home = () => (
			<Player cycleModel={this.state.cycleModel} cuerrentMusicItem={this.state.cuerrentMusicItem} />
		);

		// 同上
		// 歌单页面（列表页）
		const List = () => (
			<MusicList cuerrentMusicItem={this.state.cuerrentMusicItem} musicList={this.state.musicList} />
		);

		// 然后利用 <Router> 进行渲染
		return (
			<Router>
				<div>
					<Header />
					<Route exact path="/" component={Home} />
					<Route path="/list" component={List} />
				</div>
			</Router>
		);
	}
}

export default Root;
