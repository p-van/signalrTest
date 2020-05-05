var path = require('path');

module.exports = {
    entry:{
        app: './client/index.ts'
    },

    output:{
        filename: '[name].js',
        //path: path.resolve(__dirname, "js"),
        path: path.resolve(__dirname, "../SignalTest/SignalTest/wwwroot/js"),
    },

    module:{
        rules:[
            {
                test: /\.ts$/,
                use: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
      },
}