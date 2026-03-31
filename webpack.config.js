import path from 'path'
import { fileURLToPath } from 'url'
import { readdirSync } from 'fs'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { config } from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

config({ path: path.resolve(__dirname, '.env') })

const { DefinePlugin } = webpack

const isProd = process.env.NODE_ENV === 'production'

const pagesDir = path.resolve(__dirname, 'src/pages')
const pageFiles = readdirSync(pagesDir).filter((f) => f.endsWith('.pug'))

const htmlPlugins = pageFiles.map((file) => {
  const name = path.basename(file, '.pug')
  return new HtmlWebpackPlugin({
    template: path.resolve(pagesDir, file),
    filename: `${name}.html`,
    title: `Mapty - ${name.charAt(0).toUpperCase() + name.slice(1)}`,
    minify: false,
  })
})

export default {
  mode: isProd ? 'production' : 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',
    clean: true,
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 3000,
    open: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: {
              pretty: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    ...htmlPlugins,
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
    new DefinePlugin({
      'process.env.APP_NAME': JSON.stringify(process.env.APP_NAME || 'Mapty'),
      'process.env.API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:8080'),
      'process.env.ENV': JSON.stringify(isProd ? 'production' : 'development'),
    }),
  ],
}
