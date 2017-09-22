import React, { Component } from 'react';

// 进度条组件
import Progress from '../components/progress';

import { Link } from 'react-router-dom';

// 订阅者模式
import Pubsub from 'pubsub-js';
import './player.scss';

// mp3 文件的总时长
let musicDuration = null;

// 播放器组件
class Player extends Component {

	// 初始化参数
	constructor(props) {
		super(props),

		// 设置默认值
		// isPlay - 自动播放
		// leftTime - 时间
		this.state = {
			progress: 0,
			volume: 0,
			isPlay: true,
			leftTime: ''
		}

		// 函数绑定 this
		this.setProgress = this.setProgress.bind(this);
		this.setVolume = this.setVolume.bind(this);
		this.play = this.play.bind(this);
		this.prev = this.prev.bind(this);
		this.next = this.next.bind(this);
		this.changeCycleModel = this.changeCycleModel.bind(this);
	}

	// 生命周期函数钩子
	componentDidMount() {
		
		$('#player').bind($.jPlayer.event.timeupdate, (e) => {

			// 得到 mp3 总时长（信息都储存在 e 当中）
			musicDuration = e.jPlayer.status.duration;

			// volume - 音量
			// progress - 播放进度
			// leftTime - 歌曲时间
			this.setState({
				volume: e.jPlayer.options.volume * 100,
				progress: e.jPlayer.status.currentPercentAbsolute,
				leftTime: this.formatTime(musicDuration * (1 - e.jPlayer.status.currentPercentAbsolute / 100))
			});
		});

	}

	// 利用回调函数的方式，通过 props 将一个函数传递给子组件，用来得到子组件传递过来的数据
	// 设置进度条当前的进度（通过子组件传递过来的鼠标当前位置来设定）
	setProgress(pgs) {
		$('#player').jPlayer(this.state.isPlay ? 'play' : 'pause', musicDuration * pgs);
	}

	// 同上
	setVolume(pgs) {
		$('#player').jPlayer('volume', pgs);
	}

	// 播放/暂停
	play() {
		$('#player').jPlayer(this.state.isPlay ? 'pause' : 'play');
		this.setState({ isPlay: !this.state.isPlay });
	}

	// 利用 Pubsub，仅发送一个事件，不做逻辑处理，交由事件订阅者来进行处理（上一首）
	prev() {
		Pubsub.publish('PREV_MUSIC');
	}

	// 同上（下一首）
	next() {
		Pubsub.publish('NEXT_MUSIC');
	}

	// 同上（改变播放模式，单曲循环等）
	changeCycleModel() {
		Pubsub.publish('CHANGE_CYCLE_MODEL');
	}

	// 格式化事件
	formatTime(time) {
		time = Math.floor(time);
		let minutes = Math.floor(time / 60);
		let seconds = Math.floor(time % 60);
		seconds = seconds < 10 ? `0${seconds}` : seconds;
		return `${minutes}:${seconds}`;
	}

	// 钩子函数（移除时解除绑定）
	componentWillUnmount() {
		$('#player').unbind($.jPlayer.event.timeupdate);
	}

	// 将数据通过 props 传递给 Progress 组件
	render() {
		return (
			<div className="container-player">
				<h1 className="caption">
					<Link to="/list">歌单列表 &gt;</Link>
				</h1>
				<div className="mt20 row">
					<div className="controll-wrapper">
						{/* 标题 */}
						<h2 className="music-title">
							{this.props.cuerrentMusicItem.title}
						</h2>
						{/* 作者 */}
						<h3 className="music-artist mt10">
							{this.props.cuerrentMusicItem.artist}
						</h3>
						<div className="row mt20">
							{/* 音乐时长 */}
							<div className="left-time -col-auto">{this.state.leftTime}</div>
							<div className="volume-container">
								<i className="icon-volume rt" style={{ top: 5, left: -5 }}></i>
								<div className="volume-wrapper">
									{/* 音量进度条 */}
									<Progress progress={this.state.volume} setProgress={this.setVolume} barColor='red' />
								</div>
							</div>
						</div>
						<div style={{ height: 10, lineHeight: '10px', marginTop: '20px' }}>
							{/* 播放进度条 */}
							<Progress progress={this.state.progress} setProgress={this.setProgress} barColor='green' />
						</div>
						<div className="mt35 row">
							<div>
								{/* 上一首 */}
								<i onClick={this.prev} className="icon prev"></i>
								{/* 播放/暂停 的时候切换按钮样式 */}
								<i onClick={this.play} className={`icon ml20 ${this.state.isPlay ? 'pause' : 'play'}`} > </i>
								{/* 下一首 */}
								<i onClick={this.next} className="icon next ml20"></i>
							</div>
							{/* 播放模式切换（单曲循环，随机播放，列表播放） */}
							<div className="-col-auto">
								<i onClick={this.changeCycleModel} className={`icon repeat-${this.props.cycleModel}`} ></i>
							</div>
						</div>
					</div>
					{/* 封面信息 */}
					<div className={`-col-auto cover ${this.state.isPlay ? 'rotation' : ''}`}>
						<img src={this.props.cuerrentMusicItem.cover} alt={this.props.cuerrentMusicItem.title} />
					</div>
				</div>
			</div>
		);
	}
}

export default Player;
