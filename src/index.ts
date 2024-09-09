import { buildSchema } from "graphql";
import express from "express";
import { graphqlHTTP } from "express-graphql";
const app = express();

//NOTE: defining our own data to play with instead of pulling it in from a database. 
const users = [
    {
        id: 1,
        name: "Jakob",
        email: "jakob@gmail.com"
    },
    {
        id: 2,
        name: "David",
        email: "david@gmail.com"
    },
    {
        id: 3,
        name: "Neil",
        email: "neil@gmail.com"
    },
]; 

//NOTE: graphQL schemas are kind of like a set of rules for what data can exist, what their properties are, how to create/update/delete that data, and how to read it. 
const schema = buildSchema(`
    input UserInput {
        email: String!
        name: String!

    }

    type User {
        id: Int! 
        name: String!
        email: String!
    }

    type Mutation {
        createUser(input: UserInput): User
        updateUser(id: Int!, input: UserInput): User
    }

    type Query {
        getUser(id: String): User
        getUsers: [User]
    }
`);

type User = {
    id: number 
    name: string
    email: string
};

type UserInput = Pick<User, "email" | "name">;

const getUser = (args: { id:number }): User | undefined => {
    return users.find(u => u.id === args.id); //Is .find() the most efficient method for this? 
};

const getUsers = (): User[] => users;

const createUser = (args: { input: UserInput }): User => {
    const user = {
        id: users.length + 1, //NOTE: Add uuid here later
        ...args.input,
    };
    users.push(user);

    return user;
};

const updateUser = (args: { user: User }): User => {
    const index = users.findIndex(u => u.id === args.user.id);
    const targetUser = users[index];

    if (targetUser) {
        users[index] = args.user
    } else {
        console.log("Error: target user could not be found"); //NOTE: What type of error handling should actually happen here in a production app? 
    };

    return targetUser;
};

//NOTE: Assigning function to an object like this is for organizational purposes. Calling it "root" is mostly arbitrary 
const root = {
    getUser,
    getUsers,
    createUser,
    updateUser,
};

app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    }),
);

const PORT = 8888;
app.listen(PORT);

console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);