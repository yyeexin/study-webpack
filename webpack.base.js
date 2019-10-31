const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //抽离css样式为单独文件
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	entry: './src/index.js',
	output: {
		filename: '[name].[hash:8].js', //打包后的文件名
		path: path.resolve(__dirname, 'dist') //路径必须是一个决定路径
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html',
			filename: 'index.html',
			hash: true,
			minify: {
				removeAttributeQuotes: true, //删除双引号
				collapseWhitespace: true //折叠成一行
			}
		}),
		new MiniCssExtractPlugin({
			filename: 'css/main.css'
		}),
		new webpack.IgnorePlugin(/\.\/locale/, /moment/), //忽略moment内容自动引入所有语言包的行为,减小打包体积
		new webpack.DllReferencePlugin({
			//引用动态链接库
			manifest: path.resolve(__dirname, 'dll', 'manifest.json')
		}),
		new CopyWebpackPlugin([
			{
				from: './dll',
				to: path.resolve(__dirname, './dist/dll'),
				toType: 'dir',
				ignore: 'manifest.json'
			}
		])
	],
	externals: {
		//告诉webpack,此模块是外部引用的 并不需要打包 例如引入外部cdn资源
		jquery: '$'
	},
	resolve: {
		extensions: ['.js', '.css', '.json'], //省略文件后缀名
		alias: {
			image: path.resolve(__dirname, './src/image')
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/, // 加快编译速度，不包含node_modules文件夹内容
				include: path.resolve(__dirname, './src'),
				use: 'babel-loader'
			},
			{
				test: /\.(css|less)$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader', 'postcss-loader']
			},
			{
				test: /\.(jpg|png|gif|svg)$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 1,
						outputPath: 'image'
					}
				}
			}
		],
		noParse: /jquery/ //不去解析这个包的内部依赖,加快解析速度
	}
}