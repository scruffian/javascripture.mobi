/**
 * External dependencies
 */
var webpack = require( 'webpack' ),
	path = require( 'path' );

module.exports = {
	entry: {
		'bundle' : [
			'./src',
		]
    },
	output: {
		path: path.join( __dirname, 'build' ),
		publicPath: '/build/',
		filename: '[name].js',
		devtoolModuleFilenameTemplate: 'app:///[resource-path]'
	},
	module: {
		loaders: [
			{
				test:   /\.jsx?$/,
				loader: 'babel-loader',
				include: path.join( __dirname, '/src' )
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin( {
			'process.env': {
				WPCOM_API_KEY: '"' + process.env.WPCOM_API_KEY + '"'
			}
		} )
	],
	resolve: {
		extensions: [ '', '.json', '.js', '.jsx' ]
	},
	devServer: {
		port: 7777,
		historyApiFallback: true
	},
	node: {
		console: false,
		process: true,
		global: true,
		Buffer: true,
		__filename: 'mock',
		__dirname: 'mock',
		fs: 'empty'
	},
};
