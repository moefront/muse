'use strict';

let path = require('path');
let srcPath = path.join(__dirname, '/../src/');

module.exports = {
	devtool: 'eval',
	module: {
		rules: [
			{
				test: /\.(ts|tsx|js|jsx)$/,
				loader: 'istanbul-instrumenter-loader',
				include: [path.join(__dirname, '/../src')],
				exclude: '/node_modules/',
				options: {
					esModules: true
				}				
			},
			{
				test: /\.(png|jpg|gif|woff|woff2|css|sass|scss|less|styl)$/,
				loader: 'null-loader'
			},
			{
				test: /\.(js|jsx)$/,
				loader: 'babel-loader',
				include: [
					path.join(__dirname, '/../src'),
					path.join(__dirname, '/../test')
				]
			},
			{
				test: /\.(ts|tsx)$/,
				loader: 'ts-loader',
				include: [
					path.join(__dirname, '/../src')
				]
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		alias: {
			actions: srcPath + 'actions/',
			helpers: path.join(__dirname, '/../test/helpers'),
			components: srcPath + 'components/',
			sources: srcPath + 'sources/',
			stores: srcPath + 'stores/',
			styles: srcPath + 'styles/',
			config: srcPath + 'config/' + process.env.REACT_WEBPACK_ENV
		}
	}
};