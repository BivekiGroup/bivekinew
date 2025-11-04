import { authResolvers } from './authResolvers';
import { userResolvers } from './userResolvers';
import { dadataResolvers } from './dadataResolvers';
import { projectResolvers } from './projectResolvers';
import { taskResolvers } from './taskResolvers';
import { reportResolvers } from './reportResolvers';
import { contactResolvers } from './contactResolvers';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...dadataResolvers.Query,
    ...projectResolvers.Query,
    ...taskResolvers.Query,
    ...reportResolvers.Query,
    ...contactResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...userResolvers.Mutation,
    ...projectResolvers.Mutation,
    ...taskResolvers.Mutation,
    ...reportResolvers.Mutation,
    ...contactResolvers.Mutation,
  },
  Project: projectResolvers.Project,
  Task: taskResolvers.Task,
};
