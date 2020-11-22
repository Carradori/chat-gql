const { ApolloServer } = require("apollo-server");
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");

const { sequelize } = require("../models");

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

server.listen().then(({ url }) => {
	console.log(`Server started on port ${url}`);

	sequelize
		.authenticate()
		.then(() => console.log("Database connected"))
		.catch((err) => console.log(err));
});
