import { useCallback, useState, useRef, useEffect } from "react";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ColorThief from "colorthief";

import { paletteOne } from "./palette";

import "./App.css";

const stripePromise = loadStripe(
  "pk_test_51JmkY3IMJjsLxmkR84RlI2s5tIt8eWATgq1nHykamhrOp7hwbue7zQRDVibnk9iXik67STVqANcOQqWwZvkW9q6500xrwvBKXG"
);

const colorThief = new ColorThief();

function App() {
  const initialImage = "/drop-here.jpg";
  const [errorMessage, setErrorMessage] = useState("");
  const [imageData, setImageData] = useState(initialImage);
  const imageRefContainer = useRef(null);
  const [hexColors, setHexColors] = useState([]);

  const validTypes = ["image/jpeg", "image/png", "image/gif"];

  const handleImageReady = useCallback((imageData) => {
    setImageData(imageData);
  }, []);

  useEffect(() => {
    if (imageData !== initialImage && imageRefContainer.current.src) {
      // wait until image actually renders
      const colors = colorThief.getPalette(imageRefContainer.current, 5);
      console.log("colors", colors);
      setHexColors(colors.map((c) => `rgb(${c[0]},${c[1]},${c[2]})`));
    }
  }, [imageData]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();

    const files = event.dataTransfer.files;

    if (!files.length) {
      setErrorMessage("no files");
      throw new Error("no files");
    }

    [...files].forEach((file) => {
      if (!validTypes.includes(file.type)) {
        setErrorMessage("not an image!");
        throw new Error("not an image");
      }

      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          handleImageReady(reader.result);
        },
        false
      );

      reader.readAsDataURL(file);
    });
  }, []);

  const palettes = [paletteOne];

  return (
    <div className="App">
      {palettes.map((palette, i) => (
        <ElementsFromPalette key={i} palette={palette} colors={hexColors} />
      ))}
      <header className="App-header">
        <img
          ref={imageRefContainer}
          src={imageData}
          className="App-logo"
          alt="logo"
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={handleDrop}
        />
        <div className="colors-container">
          {hexColors.map((hexColor, i) => (
            <div
              key={i}
              style={{
                width: "200px",
                height: "30px",
                backgroundColor: hexColor,
              }}
            >
              {i} {hexColor}
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

function ElementsFromPalette({ palette, colors }) {
  const { appearance, other } =
    colors.length > 0
      ? palette(colors)
      : { appearance: {}, other: { pageBackground: "white" } };

  const options = {
    // passing the client secret obtained from the server
    clientSecret:
      "pi_3JmkcKIMJjsLxmkR0TdQ4qVr_secret_1UlXCMDRePvMcnJLCaccNk8Zv",
    appearance,
  };

  return (
    <div
      className="elements-container"
      style={{ backgroundColor: other.pageBackground }}
    >
      <Elements stripe={stripePromise} options={options}>
        <PaymentElement />
      </Elements>
    </div>
  );
}

export default App;
