import { useCallback, useState } from "react";

import logo from "./logo.svg";
import "./App.css";

function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const [imageData, setImageData] = useState("");

  const validTypes = ["image/jpeg", "image/png", "image/gif"];

  const handleDrop = useCallback((event) => {
    event.preventDefault();

    const files = event.dataTransfer.files;

    if(!files.length) {
      setErrorMessage("no files");
      throw new Error("no files");
    }

    [...files].forEach((file) => {
      if (!validTypes.includes(file.type)) {
        setErrorMessage("not an image!");
        throw new Error("not an image");
      }

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageData(reader.result);
      }, false);

      reader.readAsDataURL(file);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={imageData} className="App-logo" alt="logo" />
        <p>Error: {errorMessage}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div
          style={{
            width: "200px",
            height: "200px",
            margin: "0 auto",
            background: "green",
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={handleDrop}
        >
          Drop image here
        </div>
      </header>
    </div>
  );
}

export default App;
