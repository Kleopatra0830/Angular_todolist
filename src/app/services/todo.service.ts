import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';

interface TodoList {
  id: number;
  name: string;
  todos: Todo[];
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todoLists: TodoList[] = [];
  private nextListId = 1;
  private nextTodoId = 1;

  getTodoLists(): TodoList[] {
    return this.todoLists;
  }

  addTodoList(name: string): void {
    this.todoLists.push({ id: this.nextListId++, name, todos: [] });
  }

  addTodoToList(listId: number, title: string): void {
    const list = this.todoLists.find(list => list.id === listId);
    if (list) {
      list.todos.push({ id: this.nextTodoId++, title, completed: false });
    }
  }

  deleteTodoFromList(listId: number, todoId: number): void {
    const list = this.todoLists.find(list => list.id === listId);
    if (list) {
      list.todos = list.todos.filter(todo => todo.id !== todoId);
    }
  }

  toggleComplete(listId: number, todoId: number): void {
    const list = this.todoLists.find(list => list.id === listId);
    if (list) {
      const todo = list.todos.find(todo => todo.id === todoId);
      if (todo) {
        todo.completed = !todo.completed;
      }
    }
  }

  updateTodoTitle(listId: number, todoId: number, title: string): void {
    const list = this.todoLists.find(list => list.id === listId);
    if (list) {
      const todo = list.todos.find(todo => todo.id === todoId);
      if (todo) {
        todo.title = title;
      }
    }
  }

  deleteTodoList(listId: number): void {
    this.todoLists = this.todoLists.filter(list => list.id !== listId);
  }
}
