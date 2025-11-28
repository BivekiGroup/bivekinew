import { gql } from 'graphql-tag';

export const typeDefs = gql`
  enum UserRole {
    CUSTOMER
    DEVELOPER
    ADMIN
  }

  enum ClientType {
    INDIVIDUAL
    LEGAL_ENTITY
    ENTREPRENEUR
  }

  enum ProjectStatus {
    PLANNING
    IN_PROGRESS
    ON_HOLD
    COMPLETED
    CANCELLED
  }

  enum TaskStatus {
    TODO
    IN_PROGRESS
    REVIEW
    DONE
    CANCELLED
  }

  enum TaskPriority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  enum ContactStatus {
    NEW
    IN_PROGRESS
    COMPLETED
    REJECTED
  }

  enum NotificationType {
    TASK_ASSIGNED
    TASK_UPDATED
    TASK_COMPLETED
    PROJECT_CREATED
    PROJECT_UPDATED
    PROJECT_COMPLETED
    DEADLINE_APPROACHING
    COMMENT_ADDED
    FILE_UPLOADED
    SYSTEM
  }

  enum ActivityType {
    PROJECT_CREATED
    PROJECT_UPDATED
    PROJECT_STATUS_CHANGED
    TASK_CREATED
    TASK_UPDATED
    TASK_STATUS_CHANGED
    TASK_ASSIGNED
    FILE_UPLOADED
    COMMENT_ADDED
    USER_JOINED
  }

  enum FileType {
    AVATAR
    DOCUMENT
    IMAGE
    ARCHIVE
    OTHER
  }

  type User {
    id: ID!
    email: String!
    role: UserRole!
    name: String
    createdAt: String!
    updatedAt: String!
    isActive: Boolean!

    # Новые поля профиля
    phone: String
    avatar: String

    # Реквизиты
    clientType: ClientType
    inn: String
    bik: String
    accountNumber: String
    fullName: String
    companyName: String
    kpp: String
    ogrn: String
    legalAddress: String
    bankName: String
    corrAccount: String
  }

  type AuthCodeResponse {
    success: Boolean!
    message: String!
    expiresAt: String
  }

  type LoginResponse {
    success: Boolean!
    message: String!
    token: String
    user: User
  }

  type Session {
    id: ID!
    userId: String!
    expiresAt: String!
    createdAt: String!
  }

  type LogoutResponse {
    success: Boolean!
    message: String!
  }

  type CreateUserResponse {
    success: Boolean!
    message: String!
    user: User
  }

  input CreateUserInput {
    email: String!
    role: UserRole!
    name: String
    clientType: ClientType
    inn: String
    bik: String
    accountNumber: String
    fullName: String
    companyName: String
    kpp: String
    ogrn: String
    legalAddress: String
    bankName: String
    corrAccount: String
  }

  input UpdateProfileInput {
    name: String
    phone: String
    avatar: String
    clientType: ClientType
    inn: String
    bik: String
    accountNumber: String
    fullName: String
    companyName: String
    kpp: String
    ogrn: String
    legalAddress: String
    bankName: String
    corrAccount: String
  }

  type DaDataPartyData {
    inn: String!
    kpp: String
    ogrn: String
    companyName: String!
    legalAddress: String!
  }

  type DaDataBankData {
    bik: String!
    bankName: String!
    corrAccount: String
  }

  type Project {
    id: ID!
    name: String!
    description: String
    status: ProjectStatus!
    customerId: ID!
    customer: User!
    startDate: String
    dueDate: String
    completedAt: String
    createdAt: String!
    updatedAt: String!
    tasks: [Task!]!
    tasksCount: Int!
    completedTasksCount: Int!
    progress: Int!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    priority: TaskPriority!
    projectId: ID!
    project: Project!
    assigneeId: ID
    assignee: User
    timeSpent: Float
    workDate: String
    dueDate: String
    completedAt: String
    createdAt: String!
    updatedAt: String!
  }

  input CreateProjectInput {
    name: String!
    description: String
    customerId: ID!
    startDate: String
    dueDate: String
  }

  input UpdateProjectInput {
    name: String
    description: String
    status: ProjectStatus
    startDate: String
    dueDate: String
  }

  input CreateTaskInput {
    title: String!
    description: String
    projectId: ID!
    priority: TaskPriority
    assigneeId: ID
    timeSpent: Float
    workDate: String
    dueDate: String
  }

  input UpdateTaskInput {
    title: String
    description: String
    status: TaskStatus
    priority: TaskPriority
    assigneeId: ID
    timeSpent: Float
    workDate: String
    dueDate: String
  }

  type TaskReport {
    task: Task!
    projectName: String!
    customerName: String!
  }

  type ProjectTasksReport {
    project: Project!
    tasks: [Task!]!
    totalTimeSpent: Float!
    completedTasksCount: Int!
  }

  type ExportReportResponse {
    success: Boolean!
    url: String!
    fileName: String!
    totalReports: Int!
    totalHours: Float!
  }

  type ContactForm {
    id: ID!
    name: String!
    email: String!
    phone: String
    project: String!
    status: ContactStatus!
    ipAddress: String
    userAgent: String
    createdAt: String!
    updatedAt: String!
  }

  input SubmitContactFormInput {
    name: String!
    email: String!
    phone: String
    project: String!
  }

  type SubmitContactFormResponse {
    success: Boolean!
    message: String!
  }

  type Notification {
    id: ID!
    type: NotificationType!
    title: String!
    message: String!
    read: Boolean!
    userId: ID!
    user: User!
    projectId: ID
    taskId: ID
    link: String
    createdAt: String!
  }

  type Activity {
    id: ID!
    type: ActivityType!
    description: String!
    userId: ID!
    user: User!
    projectId: ID
    project: Project
    taskId: ID
    task: Task
    metadata: String
    createdAt: String!
  }

  type File {
    id: ID!
    name: String!
    type: FileType!
    mimeType: String!
    size: Int!
    url: String!
    key: String!
    userId: ID!
    user: User!
    projectId: ID
    project: Project
    taskId: ID
    task: Task
    createdAt: String!
  }

  type UserSettings {
    id: ID!
    userId: ID!
    emailNotifications: Boolean!
    taskNotifications: Boolean!
    projectNotifications: Boolean!
    deadlineNotifications: Boolean!
    theme: String!
    language: String!
    createdAt: String!
    updatedAt: String!
  }

  type NotificationStats {
    total: Int!
    unread: Int!
  }

  input UpdateUserSettingsInput {
    emailNotifications: Boolean
    taskNotifications: Boolean
    projectNotifications: Boolean
    deadlineNotifications: Boolean
    theme: String
    language: String
  }

  type Query {
    me: User
    users: [User!]!
    user(id: ID!): User

    # DaData queries
    findPartyByInn(inn: String!): DaDataPartyData
    findBankByBik(bik: String!): DaDataBankData

    # Project queries
    projects: [Project!]!
    project(id: ID!): Project
    myProjects: [Project!]!

    # Task queries
    tasks(projectId: ID!): [Task!]!
    task(id: ID!): Task
    myTasks: [Task!]!

    # Reports
    tasksReport(startDate: String!, endDate: String!, projectId: ID): [TaskReport!]!
    projectTasksReport(projectId: ID!, startDate: String, endDate: String): ProjectTasksReport!

    # Contact forms
    contactForms: [ContactForm!]!
    contactForm(id: ID!): ContactForm

    # Notifications
    notifications(limit: Int, offset: Int): [Notification!]!
    notificationStats: NotificationStats!
    unreadNotifications: [Notification!]!

    # Activities
    activities(projectId: ID, limit: Int, offset: Int): [Activity!]!
    myActivities(limit: Int, offset: Int): [Activity!]!

    # Files
    files(projectId: ID, taskId: ID): [File!]!
    file(id: ID!): File

    # User Settings
    mySettings: UserSettings
  }

  type Mutation {
    # Запросить код авторизации
    requestAuthCode(email: String!): AuthCodeResponse!

    # Войти с кодом
    login(email: String!, code: String!): LoginResponse!

    # Выйти из системы
    logout: LogoutResponse!

    # Создать пользователя (только для админа)
    createUser(input: CreateUserInput!): CreateUserResponse!

    # Обновить пользователя (только для админа)
    updateUser(id: ID!, email: String, name: String, role: UserRole, isActive: Boolean): User

    # Обновить реквизиты пользователя (только для админа)
    updateUserRequisites(id: ID!, input: UpdateProfileInput!): User

    # Удалить пользователя (только для админа)
    deleteUser(id: ID!): Boolean!

    # Обновить свой профиль
    updateProfile(input: UpdateProfileInput!): User!

    # Project mutations
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Boolean!

    # Task mutations
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!

    # Report mutations
    exportReport(startDate: String!, endDate: String!, projectId: ID): ExportReportResponse!

    # Contact form mutations
    submitContactForm(input: SubmitContactFormInput!): SubmitContactFormResponse!
    updateContactFormStatus(id: ID!, status: ContactStatus!): ContactForm!

    # Notification mutations
    markNotificationAsRead(id: ID!): Notification!
    markAllNotificationsAsRead: Boolean!
    deleteNotification(id: ID!): Boolean!

    # File mutations
    deleteFile(id: ID!): Boolean!

    # User Settings mutations
    updateMySettings(input: UpdateUserSettingsInput!): UserSettings!
  }
`;
