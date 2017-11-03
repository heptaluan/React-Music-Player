一个使用 `React` 搭建的网页版 `Music Player`，`SPA` 单页应用，播放器和音乐列表互相分离，播放时不影响选择歌曲

使用 `react-hot` 进行热更新，利用 `html-webpack-plugin` 来自动生成模版文件，由于采用的本地数据接口并且数据量不是很多，所以使用了 `PubSubJS` 来替代 `Redux`（原理类似 `redux`，利用 `Pubsub.subscribe()` 方法监听传递过来的对应 `action` 来进行操作）

----

### Use

```js
npm install
```

```js
node server
```

访问 ```localhost:8000```
