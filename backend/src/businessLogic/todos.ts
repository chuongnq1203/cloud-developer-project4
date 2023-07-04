import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('TodosAcess')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()

// Write get todos function
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  logger.info('Get todos for user function called')
  return todosAccess.getAllTodos(userId)
}

// Update Todo
export async function updateTodo(
  todoId: string,
  userId: string,
  updateTodoRequest: UpdateTodoRequest
): Promise<TodoUpdate> {
  return await todosAccess.updateTodo(todoId, userId, updateTodoRequest)
}

// Write create todo function
export async function createTodo(
  newTodo: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info('Create todo function called')

  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
  const newItem = {
    userId,
    todoId,
    createdAt,
    done: false,
    attachmentUtils: s3AttachmentUrl,
    ...newTodo
  }

  return await todosAccess.createTodoItem(newItem)
}

// Delete Todo
export async function deleteTodo(
  userId: string,
  todoId: string
): Promise<string> {
  return todosAccess.deleteTodo(userId, todoId)
}

// Upload Image
export async function createAttachmentUrl(
  userId: string,
  todoId: string
): Promise<string> {
  logger.info('Create attachment function called by user', userId, todoId)
  todosAccess.updateTodoAttachmentUrl(userId, todoId)
  return attachmentUtils.getUploadUrl(todoId)
}
