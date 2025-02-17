import HtmlWebpackPlugin from 'html-webpack-plugin'

const prod = process.env.NODE_ENV === 'production'

export default {
  mode: prod ? 'production' : 'development',
  devtool: prod ? undefined : 'source-map',
  entry: './src/index.tsx',
  output: {
    path: import.meta.dirname + '/docs/',
    filename: 'index.js',
    // publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.ts', '.tsx', '.js', '.json'],
        },
        use: 'ts-loader',
      },
      {
        test: /\.(s(a|c)ss|css)$/i,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  devServer: {
    historyApiFallback: true,
  },
}

