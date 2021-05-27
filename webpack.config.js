const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, options) => {
  const { mode } = options;
  const IS_DEVELOPMENT = mode === 'development';

  if (!IS_DEVELOPMENT) {
    clearOutputDir('./www/js/');
    clearOutputDir('./www/css/');
    clearOutputDir('./www/res/');
  }

  const rules = [
    {
      test: /\.(hbs)$/,
      use: ['raw-loader'],
    },
    {
      test: /\.(sa|sc|c)ss$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '../',
        },
      },
      'css-loader',
      'postcss-loader',
      'sass-loader',
      ],
    },
    {
      test: /\.(png|svg|jpg|jpeg|ico|ttf|webp|eot|woff)(\?.*)?$/,
      loader: 'file-loader',
      options: {
        outputPath(url, res, ctx) {
          res = path.relative(ctx, res).replace(/^src/, '');
          return `../${res}`;
        },
        name: '[name].[ext]',
        publicPath(...args) {
          return this.outputPath(...args).replace('../', '..');
        },
      },
    },
  ];

  const babel = {
    test: /\.m?js$/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  };

  if (!IS_DEVELOPMENT) {
    rules.push(babel);
  }

  const mainConfig = {
    stats: 'minimal',
    watchOptions: {
      ignored: [
        '**/node_modules',
        '**/server',
        '**/public',
        '**/tools',
      ],
    },
    mode,
    entry: {
      main: './src/main.js',
      // sw: './src/sw.js',
    },
    output: {
      path: path.resolve(__dirname, 'www/js/'),
      filename: '[name].min.js',
      chunkFilename: '[name].chunk.js',
      publicPath: './js/',
    },
    module: {
      rules,
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '../css/[name].css',
        chunkFilename: '../css/[id].css',
      }),
    ],
    externals: [
      (function externals() {
        const IGNORES = [
          'electron',
        ];
        return function ignore({ request }, callback) {
          if (IGNORES.indexOf(request) >= 0) {
            return callback(null, `require('${request}')`);
          }
          return callback();
        };
      }()),
    ],
    optimization: {
      minimizer: [new TerserPlugin({
        extractComments: false,
      })],
    },
  };

  return [
    mainConfig,
  ];
};

function clearOutputDir(dir) {
  fs.rmdir(path.resolve(__dirname, dir), {
    recursive: true,
  }, (err) => {
    if (err) throw (err instanceof Error ? err : new Error(err));
  });
}
