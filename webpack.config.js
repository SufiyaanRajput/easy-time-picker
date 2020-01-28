const path = require('path');

module.exports = (env) => {
  const isProduction = env === 'production';

  return{
    mode: 'production',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'index.js',
      libraryTarget: 'umd'
    },
    module: {
      rules: [{
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      }, {
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
        test: /.scss$/,
      }]
    },
    resolve: {
      alias: {
        'react': path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom')
      }
    },
    externals: {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'React',
        root: 'React'
      },
      'react-dom': {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'React',
        root: 'React'
      }
    },
    devtool: isProduction ? 'source-map' : 'inline-source-map'
  }
};