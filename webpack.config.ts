import { Configuration, HotModuleReplacementPlugin, ProvidePlugin } from 'webpack'
import { merge } from 'webpack-merge'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import DotEnv from 'dotenv-webpack'
import path from 'path'

const baseConfig: Configuration = {
    entry: {
        main: path.resolve('src', 'index.tsx'),
    },
    target: 'web',
    output: {
        publicPath: '/',
    },
    resolve: {
        extensions: ['.json', '.js', '.jsx', '.ts', '.tsx', '.css', '.scss'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                    },
                    {
                        loader: 'sass-loader',
                    },
                ],
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                oneOf: [
                    {
                        dependency: { not: ['url'] }, // exclude new URL calls
                        use: ['@svgr/webpack', 'new-url-loader'],
                    },
                    {
                        type: 'asset', // export a data URI or emit a separate file
                    },
                ],
            },
        ],
    },
}
const devServerConfig = {
    devServer: {
        historyApiFallback: true,
        port: 3000,
        compress: true,
        open: true,
        hot: true,
        static: {
            directory: path.resolve('public'),
            publicPath: '/',
        },
        client: {
            logging: 'info',
            overlay: true,
        },
    },
    plugins: [new HotModuleReplacementPlugin()],
}

const plugins: Configuration = {
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve('src', 'index.html'),
            title: 'Kor Trade',
        }),
        new MiniCssExtractPlugin(),
        new DotEnv(),
    ],
}
const composed = merge([baseConfig, devServerConfig, plugins])

export default composed
