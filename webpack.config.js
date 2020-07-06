const path = require('path');

module.exports = {
    mode: "development",
    devtool: "inline-source-map",

    entry: {
        content: './src/app/content.tsx',
        background: './src/app/background.ts',
        popup: './src/ui/popup.tsx',
    },

    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: '[name].js'
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".svg"]
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                  'file-loader?limit=100000',
                  {
                    loader: 'img-loader',
                    options: {
                      enabled: true,
                      optipng: true
                    }
                  }
                ]
              }
        ]
    },
};
