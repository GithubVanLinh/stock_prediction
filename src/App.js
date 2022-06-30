import logo from "./logo.svg";
import "./App.css";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function App() {
  const [chartData, setChartData] = useState({
    stock: [],
    predict: [],
  });

  useEffect(() => {
    const client = new WebSocket("ws://localhost:8080/ws");
    client.onopen = () => {
      client.send("hello from client");
    };
    client.onmessage = (msg) => {
      console.log("src/App.js", "receive data ", msg.data);
      const data = msg.data;
      const obj = JSON.parse(data);
      if (obj.type && obj.type === "init") {
        console.log("src/App.js", "init", obj.stock.length);
        const len = obj.stock.length;
        const record90 = obj.stock.slice(len - 40, len);
        const validData = record90.map((v) => ({
          datetime: v.datetime,
          price: v.close,
        }));

        const predict10 = obj.predict.map((v, i) => ({
          datetime: `${(i + 1) * 5} minutes later`,
          price: v,
        }));

        setChartData({ stock: validData, predict: predict10 });
      }
      if (obj.type && obj.type === "new") {
        console.log("src/App.js", "chartData", chartData);
        console.log("src/App.js", "obj.stock", obj.stock);
        const len = obj.stock.length;
        const record90 = obj.stock.slice(len - 40, len);
        const validData = record90.map((v) => ({
          datetime: v.datetime,
          price: v.close,
        }));

        console.log("src/App.js", "chartData ", chartData.stock);
        const predict10 = obj.predict.price.map((v, i) => ({
          datetime: `${(i + 1) * obj.predict.interval} minutes later`,
          price: v,
        }));
        console.log("src/App.js", "stock90", validData);
        // console.log("src/App.js", "obj", obj);
        setChartData({ stock: validData, predict: predict10 });
      }
    };
  }, []);

  console.log("src/App.js", "chartData", chartData);
  const percent =
    (chartData.stock.length - 1) *
    (100 / (chartData.predict.length + chartData.stock.length - 1));

  return (
    <div
      className="App"
      style={{ justifyContent: "center", alignItems: "center", width: "100%" }}
    >
      <h1>AAPL</h1>
      <h2>red: predict</h2>
      <LineChart
        width={1200}
        height={500}
        data={[...chartData.stock, ...chartData.predict]}
      >
        <defs>
          <linearGradient id="colorUv" x1="0%" y1="0" x2="100%" y2="0">
            <stop offset="0%" stopColor="blue" />
            <stop offset={`${percent}%`} stopColor="blue" />
            <stop offset={`${percent}%`} stopColor="red" />
            <stop offset={`${100}%`} stopColor="red" />
          </linearGradient>
        </defs>
        <Line
          type="monotone"
          dataKey="price"
          stroke="url(#colorUv)"
          strokeWidth={3}
          dot={false}
          activeDot={false}
        />
        <XAxis dataKey="datetime" />
        <Tooltip />
      </LineChart>
    </div>
  );
}

export default App;
