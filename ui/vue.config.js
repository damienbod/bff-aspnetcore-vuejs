const { defineConfig } = require('@vue/cli-service')
const fs = require('fs')

module.exports = defineConfig({
  transpileDependencies: true,
	devServer: {
		host: 'localhost',
		server: {
			type: 'https',
			options: {
				key: fs.readFileSync('./certs/dev_localhost.key'),
				cert: fs.readFileSync('./certs/dev_localhost.pem'),
			}
		}
	}
})
