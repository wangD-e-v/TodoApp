"use client";

import { useState, memo, useCallback } from "react";
import { Plus, Trash2, Pencil, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  isEditing: boolean;
}

// 2. Interface Definitions for Better Type Safety
interface ITodoItem {
  todo: Todo;
  toggleTodo: (id: number) => void;
  updateTodoText: (id: number, newText: string) => void;
  startEditing: (id: number) => void;
  saveTodoEdit: (id: number) => void;
  removeTodo: (id: number) => void;
}

// 1. Component Splitting & Memoization
const TodoItem = memo(
  // TodoItem component extracted and memoized to prevent unnecessary re-renders
  ({
    todo,
    toggleTodo,
    updateTodoText,
    startEditing,
    saveTodoEdit,
    removeTodo,
  }: ITodoItem) => {
    return (
      <li className="flex items-center justify-between bg-gray-100 p-3 rounded">
        <div className="flex items-center flex-grow mr-2">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => toggleTodo(todo.id)}
            className="mr-2"
          />
          {todo.isEditing ? (
            <Input
              type="text"
              value={todo.text}
              onChange={(e) => updateTodoText(todo.id, e.target.value)}
              className="flex-grow"
              autoFocus
            />
          ) : (
            <span
              className={`${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {todo.text}
            </span>
          )}
        </div>
        <div className="flex">
          {todo.isEditing ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => saveTodoEdit(todo.id)}
              className="mr-1"
            >
              <Check className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => startEditing(todo.id)}
              className="mr-1"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeTodo(todo.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </li>
    );
  }
);
TodoItem.displayName = "TodoItem";

// Add new interface for the input component
interface TodoInputProps {
  onAdd: (text: string) => void;
}

// 3. Separate Input Component with Memoization
const TodoInput = memo(({ onAdd }: TodoInputProps) => {
  // 4. State Management Optimization
  // Moved newTodo state from parent component to TodoInput component
  const [newTodo, setNewTodo] = useState("");

  const handleAdd = () => {
    if (newTodo.trim() !== "") {
      onAdd(newTodo.trim());
      setNewTodo("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  return (
    <div className="flex mb-4">
      <Input
        type="text"
        value={newTodo}
        onChange={handleChange}
        placeholder="Add a new todo"
        className="flex-grow mr-2"
      />
      <Button onClick={handleAdd}>
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </div>
  );
});
TodoInput.displayName = "TodoInput";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Move addTodo logic to accept text parameter
  // 5. useCallback for Event Handlers
  const addTodo = useCallback((text: string) => {
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text, completed: false, isEditing: false },
    ]);
  }, []);

  const toggleTodo = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const removeTodo = useCallback((id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const startEditing = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: true } : todo
      )
    );
  };

  const updateTodoText = (id: number, newText: string) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  const saveTodoEdit = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: false } : todo
      )
    );
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <TodoInput onAdd={addTodo} />
      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleTodo={toggleTodo}
            updateTodoText={updateTodoText}
            startEditing={startEditing}
            saveTodoEdit={saveTodoEdit}
            removeTodo={removeTodo}
          />
        ))}
      </ul>
    </div>
  );
}
