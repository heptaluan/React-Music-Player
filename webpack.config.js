const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	entry: [
		'webpack-dev-server/client?http://0.0.0.0:8000', 'webpack/hot/only-dev-server', './app/index.js'
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	devServer: {
		contentBase: './dist',
		hot: true,
		open: true
	},

	// HtmlWebpackPlugin html 模版插件
	// 可以根据模版自动生成 index.html 文件，不需要去操心怎么引入相关 js，直接交给插件去管理
	plugins: [
		new HtmlWebpackPlugin({ template: './index.tpl.html' }),
		new webpack.HotModuleReplacementPlugin()
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: 'react-hot-loader/webpack'
					}, {
						loader: 'babel-loader'
					}
				],
				exclude: /node_modules/
			}, {
				test: /\.css/,
				use: ['style-loader', 'css-loader']
			}, {
				test: /\.scss$/,
				use: [
					{
						loader: "style-loader"
					}, {
						loader: "css-loader"
					}, {
						loader: "sass-loader"
					}
				]
			}
		]
	}
};
