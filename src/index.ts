import { buildSchema } from "type-graphql";
import express from "express";
import { graphqlHTTP } from "express-graphql"; //NOTE: Deprecated. NPM Package is now graphql-http, but should update to Appolo server anyways
import "reflect-metadata";

import { UsersResolver } from "../users/users.resolvers";

async function main() {
    const schema = await buildSchema({
        resolvers: [UsersResolver],
        emitSchemaFile: true,
    });
    
    const app = express();

    app.use(
        "/graphql",
        graphqlHTTP({
            schema: schema,
            graphiql: true,
        }),
    );

    const PORT = 8888;
    app.listen(PORT);
    
    console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
};

main();