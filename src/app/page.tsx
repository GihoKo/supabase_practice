"use client";
import supabaseClient from "@/utils/supabaseClient";
import { useEffect, useState } from "react";

export default function Home() {
    const [task, setTask] = useState("");
    const [data, setData] = useState([]);

    const getTasks = async () => {
        const { data: response, error } = await supabaseClient
            .from("todos")
            .select("*");

        if (error) {
            console.error("Error getting tasks:", error);
        } else {
            setData(response);
        }
    };

    const addTask = async () => {
        const { data: response, error } = await supabaseClient
            .from("todos")
            .insert([{ task }])
            .select();

        if (error) {
            console.error("Error adding task:", error);
        } else {
            setData([...data, ...response]);
            setTask("");
        }
    };

    const toggleComplete = async (id, isComplete) => {
        const { data: updatedData, error } = await supabaseClient
            .from("todos")
            .update({
                is_complete: !isComplete,
            })
            .eq("id", id) // eq는 equal의 약자로, id가 일치하는 것을 찾는다.
            .select();

        if (error) {
            console.error("Error toggling task:", error);
        } else {
            console.log(updatedData);
            setData(
                data.map((todo) => (todo.id === id ? updatedData[0] : todo))
            );
        }
    };

    const deleteTask = async (id) => {
        const { data: deletedData, error } = await supabaseClient
            .from("todos")
            .delete()
            .eq("id", id)
            .select();

        if (error) {
        } else {
            console.log(deletedData);
            setData(data.filter((todo) => todo.id !== id));
        }
    };

    useEffect(() => {
        getTasks();
    }, []);

    return (
        <div>
            <h1>Supabase CRUD</h1>
            <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="New task"
            />
            <button onClick={addTask}>Add Task</button>
            <ul>
                {data.map((todo) => (
                    <li key={todo.id}>
                        <span
                            style={{
                                textDecoration: todo.is_complete
                                    ? "line-through"
                                    : "none",
                            }}
                        >
                            {todo.task}
                        </span>
                        <button
                            onClick={() =>
                                toggleComplete(todo.id, todo.is_complete)
                            }
                        >
                            {todo.is_complete ? "Undo" : "Complete"}
                        </button>
                        <button onClick={() => deleteTask(todo.id)}>
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
