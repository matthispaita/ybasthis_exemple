const cheminRacine = __dirname + '/../';
console.log('Démarage de webPack: ', cheminRacine);
module.exports =
{
	context: cheminRacine,
	entry: "./remote/api/ybasthis.js",
	output:
	{
		path: cheminRacine + "./remote/",
		filename: "build.js",
		devtoolLineToLine : false
	},
	module :
	{
		rules:
		[
			{
				test   : /.js$/,
				use:
				{
					loader: 'babel-loader',
					options:
					{
						presets: ['es2015']
					}
				}
			}
		]
	},
	profile: true,
	devtool: "inline-source-map"
};