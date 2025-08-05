import React, { useState, useEffect } from 'react';

const Todo = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = "http://localhost:8000";

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(`${apiUrl}/todos`)
            .then(res => res.json())
            .then(data => setTodos(data))
            .catch(() => setError("⚠️ Failed to load todos"));
    };

    const handleSubmit = () => {
        setError("");
        if (title.trim() && description.trim()) {
            fetch(`${apiUrl}/todos`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            })
                .then(res => res.json())
                .then(data => {
                    setTodos([...todos, data]);
                    setMessage("✅ Item added successfully!");
                    setTitle("");
                    setDescription("");
                    setTimeout(() => setMessage(""), 3000);
                })
                .catch(() => setError("⚠️ Network error occurred."));
        } else {
            setError("⚠️ Title and Description cannot be empty.");
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            fetch(`${apiUrl}/todos/${id}`, { method: "DELETE" })
                .then(() => {
                    setTodos(todos.filter(todo => todo._id !== id));
                    setMessage("🗑️ Item deleted successfully.");
                    setTimeout(() => setMessage(""), 3000);
                })
                .catch(() => setError("❌ Failed to delete item."));
        }
    };

    const startEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleUpdate = () => {
        if (editTitle.trim() && editDescription.trim()) {
            fetch(`${apiUrl}/todos/${editId}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            })
                .then(res => res.json())
                .then(updated => {
                    setTodos(todos.map(todo => todo._id === editId ? updated : todo));
                    setMessage("✏️ Item updated successfully.");
                    setEditId(null);
                    setEditTitle("");
                    setEditDescription("");
                    setTimeout(() => setMessage(""), 3000);
                })
                .catch(() => setError("❌ Failed to update item."));
        } else {
            setError("⚠️ Edit fields cannot be empty.");
        }
    };

    const handleEditCancel = () => {
        setEditId(null);
        setEditTitle("");
        setEditDescription("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-6 font-sans">
            <div className="max-w-4xl mx-auto bg-purple/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-white/10">
                <h1 className="text-4xl font-bold text-center mb-6 animate-bounce ">🌟 To-Do App </h1>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold">Add Item</h3>
                    {message && <p className="text-green-300 font-medium mt-1">{message}</p>}
                    {error && <p className="text-red-300 font-medium mt-1">{error}</p>}
                    <div className="flex flex-col md:flex-row gap-4 mt-3">
                        <input
                            className="flex-1 px-4 py-2 rounded-lg bg-white text-black shadow-sm focus:outline-purple-600 focus:ring-2 focus:ring-indigo-700"
                            type="text"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            placeholder="Title"
                        />
                        <input
                            className="flex-1 px-4 py-2 rounded-lg bg-white text-black shadow-sm focus:outline-purple-600 focus:ring-2 focus:ring-pink-400"
                            type="text"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            placeholder="Description"
                        />
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold shadow-md transition-transform transform hover:scale-105"
                        >
                            Submit
                        </button>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Tasks</h3>
                    <ul className="space-y-5">
                        {todos.map((item) => (
                            <li
                                key={item._id}
                                className="p-5 rounded-xl bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-pink-500/20 backdrop-blur-md shadow-lg border border-white/20 hover:scale-[1.02] transition-all duration-200"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                    <div className="flex flex-col gap-2 w-full">
                                        {editId !== item._id ? (
                                            <>
                                                <span className="text-lg font-bold">{item.title}</span>
                                                <span className="text-sm">{item.description}</span>
                                            </>
                                        ) : (
                                            <>
                                                <input
                                                    className="px-4 py-2 rounded-md text-black bg-white"
                                                    type="text"
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    placeholder="Edit Title"
                                                />
                                                <input
                                                    className="px-4 py-2 rounded-md text-black bg-white mt-2"
                                                    type="text"
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    placeholder="Edit Description"
                                                />
                                            </>
                                        )}
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-2">
                                        {editId !== item._id ? (
                                            <>
                                                <button
                                                    onClick={() => startEdit(item)}
                                                    className="px-3 py-1 bg-yellow-300 hover:bg-yellow-400 text-black font-semibold rounded-full transition hover:scale-105"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition hover:scale-105"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={handleUpdate}
                                                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition hover:scale-105"
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    onClick={handleEditCancel}
                                                    className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-black rounded-full font-semibold transition hover:scale-105"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Todo;