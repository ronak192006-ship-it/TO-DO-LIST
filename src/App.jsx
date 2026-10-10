import { useEffect, useState } from "react";

const initialTasks = [
    { id: 1, text: " Example-Task 1", completed: true },
    { id: 2, text: "Example-Task 2", completed: false },
    { id: 3, text: "Example-Task 3", completed: false },
];

function App() {
    const [tasks, setTasks] = useState(() => {
        try {
            const saved = localStorage.getItem("my-tasks");
            return saved ? JSON.parse(saved) : initialTasks;
        } catch {
            return initialTasks;
        }
    });
    const [taskInput, setTaskInput] = useState("");
    const [filter, setFilter] = useState("all");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    useEffect(() => {
        localStorage.setItem("my-tasks", JSON.stringify(tasks));
    }, [tasks]);

    const completeCount = tasks.filter((task) => task.completed).length;
    const activeCount = tasks.filter((task) => !task.completed).length;
    const progress = tasks.length ? (completeCount / tasks.length) * 100 : 0;

    const filterTasks = () => {
        if (filter === "active") return tasks.filter((task) => !task.completed);
        if (filter === "completed") return tasks.filter((task) => task.completed);
        return tasks;
    };

    const addTask = (event) => {
        event.preventDefault();
        const newText = taskInput.trim();
        if (!newText) return;

        setTasks((previousTasks) => [
            ...previousTasks,
            { id: Date.now(), text: newText, completed: false },
        ]);
        setTaskInput("");
    };

    const toggleTaskCompletion = (id) => {
        setTasks((previousTasks) =>
            previousTasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id) => {
        setTasks((previousTasks) => previousTasks.filter((task) => task.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setEditingText("");
        }
    };

    const startEditing = (id, text) => {
        setEditingId(id);
        setEditingText(text);
    };

    const saveEditedTask = (id) => {
        const newText = editingText.trim();
        if (!newText) return;

        setTasks((previousTasks) =>
            previousTasks.map((task) =>
                task.id === id ? { ...task, text: newText } : task
            )
        );
        setEditingId(null);
        setEditingText("");
    };

    return (
        <div>
            <h1>To-do List</h1>
            <p>{activeCount} tasks remaining</p>
            <progress value={progress} max="100" aria-label="Task completion progress" />

            <form onSubmit={addTask}>
                <input
                    type="text"
                    value={taskInput}
                    onChange={(event) => setTaskInput(event.target.value)}
                    placeholder="Add a task"
                    aria-label="New task"
                />
                <button type="submit">Add task</button>
            </form>

            <div aria-label="Filter tasks">
                {["all", "active", "completed"].map((filterOption) => (
                    <button
                        key={filterOption}
                        type="button"
                        onClick={() => setFilter(filterOption)}
                        aria-pressed={filter === filterOption}
                    >
                        {filterOption[0].toUpperCase() + filterOption.slice(1)}
                    </button>
                ))}
            </div>

            <ul>
                {filterTasks().map((task) => (
                    <li key={task.id}>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(task.id)}
                            aria-label={`Mark ${task.text} as ${task.completed ? "active" : "completed"}`}
                        />
                        {editingId === task.id ? (
                            <>
                                <input
                                    value={editingText}
                                    onChange={(event) => setEditingText(event.target.value)}
                                    aria-label="Edit task"
                                />
                                <button type="button" onClick={() => saveEditedTask(task.id)}>
                                    Save
                                </button>
                                <button type="button" onClick={() => setEditingId(null)}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <span>{task.text}</span>
                                <button type="button" onClick={() => startEditing(task.id, task.text)}>
                                    Edit
                                </button>
                            </>
                        )}
                        <button type="button" onClick={() => deleteTask(task.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;