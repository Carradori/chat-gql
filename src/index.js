import { ApolloServer } from "apollo-server";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";

import { sequelize } from "../models";

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
