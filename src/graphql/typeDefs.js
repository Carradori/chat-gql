import { gql } from "apollo-server";

export default gql`
	type User {
		username: String!
		email: String!
	}
	type Query {
		getUsers: [User]!
	}
`;
