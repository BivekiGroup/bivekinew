import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs } from '@/lib/graphql/typeDefs';
import { resolvers } from '@/lib/graphql/resolvers';
import { createContext, GraphQLContext } from '@/lib/graphql/context';

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  formatError: (error) => {
    // Логируем ошибки в консоль для отладки
    console.error('GraphQL Error:', error);

    // Возвращаем безопасное сообщение об ошибке
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
      extensions: {
        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      },
    };
  },
});

const handler = startServerAndCreateNextHandler(server, {
  context: createContext,
});

export async function GET(request: Request) {
  return handler(request);
}

export async function POST(request: Request) {
  return handler(request);
}
