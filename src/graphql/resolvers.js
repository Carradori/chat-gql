const resolvers = {
	Query: {
		getUsers: () => {
			const users = [
				{
					username: "Felipe",
					email: "felipe@carradori.com",
				},
				{
					username: "Gerson",
					email: "gerson@carradori.com",
				},
			];
			return users;
		},
	},
};

export default resolvers;
