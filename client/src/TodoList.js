import React, { useState, useEffect } from "react";
import axios from "axios";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoText, setEditingTodoText] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/tasks");
      setTodos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() !== "") {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString();
      const formattedTime = currentDate.toLocaleTimeString();
      try {
        const response = await axios.post("/api/tasks", {
          task: newTodo,
          completed: false,
        });
        const newTodoItem = {
          id: Date.now(),
          _id: response.data._id,
          task: newTodo,
          completed: false,
          date: formattedDate,
          time: formattedTime,
        };
        setTodos([...todos, newTodoItem]);
        setNewTodo("");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditTodo = (id) => {
    setEditingTodoId(id);
    const todo = todos.find((todo) => todo._id === id);
    setEditingTodoText(todo.task);
  };

  const handleSaveTodo = async () => {
    try {
      await axios.put(`/api/tasks/${editingTodoId}`, {
        task: editingTodoText,
      });
      const updatedTodos = todos.map((todo) =>
        todo._id === editingTodoId ? { ...todo, task: editingTodoText } : todo
      );
      setTodos(updatedTodos);
      setEditingTodoId(null);
      setEditingTodoText("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditingTodoText("");
  };

  const handleToggleComplete = async (id) => {
    try {
      const todo = todos.find((todo) => todo._id === id);
      await axios.put(`/api/tasks/${id}`, {
        task: todo.task,
        completed: !todo.completed,
      });
      const updatedTodos = todos.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (editingTodoId) {
        handleSaveTodo();
      } else {
        handleAddTodo();
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      <div className="flex mb-4">
        <input
          type="text"
          className="border border-gray-300 rounded px-4 py-2 w-full mr-2"
          placeholder="Enter a todo"
          value={newTodo}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleAddTodo}
        >
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex items-center mb-2 bg-white rounded border border-gray-300 p-2"
          >
            <input
              type="checkbox"
              className="mr-2"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo._id)}
            />
            <div>
              <p className=" text-sm mr-1 text-gray-500 mb-1">{todo.date}</p>

              {editingTodoId === todo._id ? (
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 mb-1"
                  value={editingTodoText}
                  onChange={(e) => setEditingTodoText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              ) : (
                <p
                  className={`flex mb-1 ${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.task}
                </p>
              )}
              <p className="text-sm mr-6 text-gray-500">{todo.time}</p>
            </div>
            <div className="ml-auto">
              {editingTodoId === todo._id ? (
                <>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded mr-2"
                    onClick={handleSaveTodo}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleEditTodo(todo._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDeleteTodo(todo._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
