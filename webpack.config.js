import path from 'path'
import { fileURLToPath } from 'url'
import { readdirSync } from 'fs'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { config } from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isProd = process.env.NODE_ENV === 'production'

const envFile = isProd ? '.env.production' : '.env.development'
config({ path: path.resolve(__dirname, envFile) })
config({ path: path.resolve(__dirname, '.env') })

const { DefinePlugin } = webpack

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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@state': path.resolve(__dirname, 'src/state'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
    extensions: ['.js', '.json'],
  },
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
    liveReload: true,
    watchFiles: ['src/**/*.pug', 'src/**/*.css', 'src/**/*.js'],
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
      // ... tus reglas de pug y css ...
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              outputPath: 'assets/images/',
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets',
          to: 'assets/images',
        },
      ],
    }),
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
