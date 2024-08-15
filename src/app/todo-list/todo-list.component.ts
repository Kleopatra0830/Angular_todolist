import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Todo } from '../models/todo.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {
  newListName = '';
  todoLists = this.todoService.getTodoLists();
  newTodos: { [key: number]: string } = {};  // Store newTodo values by list ID

  constructor(private todoService: TodoService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  addTodoList(): void {
    if (this.newListName.trim()) {
      this.todoService.addTodoList(this.newListName.trim());
      this.newListName = '';
      this.newTodos = {};  // Reset the newTodos map for fresh input fields
      this.cdr.detectChanges(); // Update the view after adding the list
    }
  }

  addTodoToList(listId: number): void {
    const newTodo = this.newTodos[listId]?.trim();
    if (newTodo) {
      this.todoService.addTodoToList(listId, newTodo);
      this.newTodos[listId] = '';  // Clear the specific input after adding
      this.cdr.detectChanges(); // Update the view after adding the todo
    }
  }

  toggleComplete(listId: number, todoId: number, event: any): void {
    this.ngZone.run(() => {
      const list = this.todoLists.find(list => list.id === listId);
      if (list) {
        const todo = list.todos.find(todo => todo.id === todoId);
        if (todo) {
          todo.completed = event.target.checked; // Directly set the completed status
          this.cdr.detectChanges(); // Force change detection immediately after the state change
        }
      }
    });
  }
  
  

  updateTodoTitle(listId: number, todoId: number, title: string): void {
    this.todoService.updateTodoTitle(listId, todoId, title);
    this.cdr.detectChanges(); // Update the view after updating the title
  }

  deleteTodoFromList(listId: number, todoId: number): void {
    if (confirm('Are you sure you want to delete this todo?')) {
      this.todoService.deleteTodoFromList(listId, todoId);
      this.cdr.detectChanges(); // Update the view after deleting the todo
    }
  }

  deleteTodoList(listId: number): void {
    if (confirm('Are you sure you want to delete this list?')) {
      this.todoService.deleteTodoList(listId);
      this.todoLists = this.todoService.getTodoLists(); // Update the local list
      delete this.newTodos[listId];  // Clean up input state for the deleted list
      this.cdr.detectChanges(); // Update the view after deleting the list
    }
  }

  allCompleted(list: { todos: Todo[] }): boolean {
    const completed = list.todos.length > 0 && list.todos.every(todo => todo.completed);
    console.log(`List todos:`, list.todos);
    console.log(`All todos completed: `, completed);
    return completed;
  }

  showSuccess(): void {
    alert('Congrats! You’re all done!!');
  }

  drop(event: CdkDragDrop<Todo[]>, list: { todos: Todo[] }): void {
    moveItemInArray(list.todos, event.previousIndex, event.currentIndex);
    this.cdr.detectChanges(); // Update the view after changing the order
  }
}
