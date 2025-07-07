import React, { useState, useEffect } from "react";

function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);
  const apiUrl = "http://localhost:4000";

  // edit state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Fetch all todos on component load
  useEffect(() => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => {
        console.log(err);
        setError("Failed to load todos");
      });
  }, []);

  function handleSubmit() {
    if (title?.trim() !== "" && description?.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          setTodos([...todos, data]);
          setMessage("Item added successfully");
          setTimeout(() => {
            setMessage("");
          }, 3000);
          setError("");
          setTitle("");
          setDescription("");
        })
        .catch((err) => {
          console.error(err);
          setError("Something went wrong");
          setMessage("");
        });
    } else {
      setError("Title and description cannot be empty");
      setTimeout(() => {
        setError("");
      }, 3000);
      setMessage("");
    }
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete.")) {
      fetch(apiUrl + "/todos/" + id, {
        method: "DELETE",
      }).then(() => {
        const updatedTodo = todos.filter((todo) => todo._id !== id);
        setTodos(updatedTodo);
      });
    }
  };

  const handleUpdate = () => {
    if (editTitle?.trim() !== "" && editDescription?.trim() !== "") {
      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          setTodos(todos.map((todo) => (todo._id === editId ? data : todo)));
          setMessage("Item updated successfully");
          setTimeout(() => {
            setMessage("");
          }, 3000);
          setError("");
          setEditId(-1);
          setEditTitle("");
          setEditDescription("");
        })
        .catch((err) => {
          console.error(err);
          setError("Something went wrong");
          setMessage("");
        });
    } else {
      setError("Title and description cannot be empty");
      setTimeout(() => {
        setError("");
      }, 3000);
      setMessage("");
    }
  };

  const handleEdit = (todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  const handleEditCancel = () => {
    setEditId(-1);
    setEditTitle("");
    setEditDescription("");
  };

  return (
    <>
      <div
        className="row d-flex justify-content-center p-0"
        style={{
          height: "60px", // adjust height as needed
        }}
      >
        <div
          style={{ backgroundColor: "yellow", height: "33.3%", width: "100%" }}
        ></div>
        <div
          style={{ backgroundColor: "red", height: "33.3%", width: "100%" }}
        ></div>
        <div
          style={{ backgroundColor: "yellow", height: "33.3%", width: "100%" }}
        ></div>
      </div>
      <div className="mt-5">
        <div className="row mt-5 px-4 ">
          <h3 style={{ color: "yellow" }}>Add Items</h3>
          {message && <p className="text-success">{message}</p>}
          {error && <p className="text-danger">{error}</p>}
          <div className="form-group d-flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="form-control"
            />
            <input
              type="text"
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="form-control"
            />
            <button className="btn btn-primary" onClick={handleSubmit}>
              Submit
            </button>
          </div>

          <div>
            <h4 style={{ color: "yellow" }}>Todo List</h4>
            {todos.length > 0 ? (
              <ol className="list-group list-group-numbered">
                {todos.map((todo, index) => (
                  <li
                    key={todo._id || index}
                    className="list-group-item d-flex mb-3"
                  >
                    <div className="ms-2 me-auto">
                      {editId === -1 || editId !== todo._id ? (
                        <>
                          <div className="fw-bold">{todo.title}</div>
                          {todo.description}
                        </>
                      ) : (
                        <div className="form-group d-flex gap-2 mb-3">
                          <input
                            type="text"
                            placeholder="Title"
                            onChange={(e) => setEditTitle(e.target.value)}
                            value={editTitle}
                            className="form-control"
                          />
                          <input
                            type="text"
                            placeholder="Description"
                            onChange={(e) => setEditDescription(e.target.value)}
                            value={editDescription}
                            className="form-control"
                          />
                        </div>
                      )}
                    </div>
                    <span>
                      {editId === -1 || editId !== todo._id ? (
                        <>
                          <button
                            className="btn btn-warning me-2"
                            onClick={() => handleEdit(todo)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(todo._id)}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-primary me-2"
                            onClick={handleUpdate}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={handleEditCancel}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p style={{ fontFamily: "sans-serif", color: "red" }}>
                No todos found.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default Todo;
