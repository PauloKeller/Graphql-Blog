const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema')
const mongoose = require('mongoose')

const app = express()
const port = 8080

mongoose.connect('mongodb://mongodb:27017/blog-app')
mongoose.connection.once('open', () => {
    console.log('connected to database')
})

mongoose.connection.on('error', err => {
    console.log(err);
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(port, () => {
    console.log(`now listening for requests on port ${port}`)
})
