const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { User } = require("../../models");

module.exports = {
	Query: {
		getUsers: async () => {
			try {
				const users = await User.findAll({});

				return users;
			} catch (error) {
				console.log(error);
			}
		},
		login: async (_, args) => {
			const { username, password } = args;
			let errors = {};
			try {
				if (username.trim() === "")
					errors.username = "Username must not be empty";
				if (password === "") errors.password = "Password must not be empty";

				if (Object.keys(errors).length > 0) {
					throw new UserInputError("bad input", { errors });
				}

				const user = await User.findOne({
					where: { username },
				});

				if (!user) {
					errors.username = "User not found";
					throw new UserInputError("user not found", { errors });
				}

				const hashedPassword = await bcrypt.compare(password, user.password);

				if (hashedPassword) {
					errors.password = "Login faild";
					throw new AuthenticationError("login faild", { errors });
				}

				const token = jwt.sign(
					{
						username,
					},
					process.env.JWT_SECRET,
					{ expiresIn: "24h" }
				);

				return {
					...user.toJSON(),
					createdAt: user.createdAt.toISOString(),
					token,
				};
			} catch (error) {
				console.log(error);
				throw error;
			}
		},
	},
	Mutation: {
		register: async (_, args) => {
			let { username, email, password, confirmPassword } = args;
			let errors = {};
			try {
				if (email.trim() === "") errors.email = "Email must not be empty";
				if (username.trim() === "")
					errors.username = "Username must not be empty";
				if (password.trim() === "")
					errors.password = "Password must not be empty";
				if (confirmPassword.trim() === "")
					errors.confirmPassword = "Confirm password must not be empty";
				if (confirmPassword !== password)
					errors.confirmPassword = "Password does not match";

				//TODO: check if username / email exists
				// const userByUsername = await User.findOne({ where: { username } });
				// const userByEmail = await User.findOne({ where: { email } });

				// if (userByUsername) errors.username = "Username is taken";
				// if (userByEmail) errors.email = "Email is taken";

				if (Object.keys(errors).length > 0) {
					throw errors;
				}

				password = await bcrypt.hash(password, 6);
				const user = await User.create({
					username,
					email,
					password,
				});

				return user;
			} catch (error) {
				if (error.name === "SequelizeUniqueConstraintError") {
					error.errors.forEach((err) => {
						const path = err.path.split(".")[1];
						errors[path] = `${path} is already taken`;
					});
				} else if (error.name === "SequelizeValidationError") {
					error.errors.forEach((err) => {
						errors[err.path] = err.message;
					});
				}
				throw new UserInputError("Bad input", { errors });
			}
		},
	},
};
