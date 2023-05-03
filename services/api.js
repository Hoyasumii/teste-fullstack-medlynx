const axios = require('axios');

module.exports = axios.create({
    baseURL: 'https://comercial.medlynx.com.br/api_devtests2022_2/api/'
})