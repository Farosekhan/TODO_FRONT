import React from 'react'
import Todo from "./Todo";
function App() {
  return (
    <>
      <div
        className="container-fluid"
        style={{
          backgroundImage: `url("https://live.staticflickr.com/65535/54187467243_7cc951bc7d_b.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <Todo />
      </div>
    </>
  );
}
export default App