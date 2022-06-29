import logo from "./logo.svg";
import "./App.css";

import { useEffect } from "react";
import { LineChart } from "recharts";

function App() {
  useEffect(() => {
    const client = new WebSocket("ws://localhost:8080/ws");
    client.onopen = () => {
      client.send("hello from client");
    };
    client.onmessage = (msg) => {
      console.log("src/App.js", "receive data ", msg);
    };
  });
  return (
    <div className="App">
      <LineChart></LineChart>
    </div>
  );
}

export default App;
