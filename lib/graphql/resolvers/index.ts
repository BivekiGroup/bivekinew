import { authResolvers } from './authResolvers';
import { userResolvers } from './userResolvers';
import { dadataResolvers } from './dadataResolvers';
import { projectResolvers } from './projectResolvers';
import { taskResolvers } from './taskResolvers';
import { reportResolvers } from './reportResolvers';
import { contactResolvers } from './contactResolvers';
import { notificationResolvers } from './notificationResolvers';
import { activityResolvers } from './activityResolvers';
import { fileResolvers } from './fileResolvers';
import { settingsResolvers } from './settingsResolvers';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...dadataResolvers.Query,
    ...projectResolvers.Query,
    ...taskResolvers.Query,
    ...reportResolvers.Query,
    ...contactResolvers.Query,
    ...notificationResolvers.Query,
    ...activityResolvers.Query,
    ...fileResolvers.Query,
    ...settingsResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...userResolvers.Mutation,
    ...projectResolvers.Mutation,
    ...taskResolvers.Mutation,
    ...reportResolvers.Mutation,
    ...contactResolvers.Mutation,
    ...notificationResolvers.Mutation,
    ...fileResolvers.Mutation,
    ...settingsResolvers.Mutation,
  },
  Project: projectResolvers.Project,
  Task: taskResolvers.Task,
  Activity: activityResolvers.Activity,
};
