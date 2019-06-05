import * as webpack from 'webpack';
import * as HtmlWebPackPlugin from 'html-webpack-plugin';

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: './src/index.html'
});

const config: webpack.Configuration = {
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devServer: {
    port: 9000,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      }
    ]
  },
  plugins: [htmlWebpackPlugin]
};

export default config;
