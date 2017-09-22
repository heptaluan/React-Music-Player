import 'react-hot-loader/patch';
import React from 'react';
import ReactDOM from 'react-dom';

// 浏览器实时热更新
import { AppContainer } from 'react-hot-loader';

// 只是简单的使用 <AppContainer> 组件包裹了一下 <Root> 组件，可以使其热更新
// 业务逻辑等代码主要还是放在 <Root> 组件当中
import Root from './root';

// 只需要将组件使用 <AppContainer> 包裹起来即可
const render = Component => {
	ReactDOM.render(
		<AppContainer>
			<Component />
		</AppContainer>,
		document.querySelector('#root')
	);
}

render(Root);

if (module.hot) {
	module.hot.accept('./root', () => { render(Root) });
}
