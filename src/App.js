import { useCallback, useState, useRef, useEffect } from "react";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ColorThief from "colorthief";
import "purecss/build/pure-min.css";

import { paletteOne } from "./palette";
import { Colors } from "./Colors";
import { RadioButtonGroup, Button } from "./ButtonGroup";

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
  const [originalColorScheme, setOriginalColorScheme] = useState([]);
  const [colorMode, setColorMode] = useState("auto");
  const [baseTheme, setBaseTheme] = useState("flat");

  const validTypes = ["image/jpeg", "image/png", "image/gif"];

  const handleImageReady = useCallback((imageData) => {
    setImageData(imageData);
  }, []);

  useEffect(() => {
    if (imageData !== initialImage && imageRefContainer.current.src) {
      // wait until image actually renders
      const colors = colorThief.getPalette(imageRefContainer.current, 7);
      console.log("colors", colors);
      const colorScheme = colors.map((c) => `rgb(${c[0]},${c[1]},${c[2]})`);
      setOriginalColorScheme(colorScheme);
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
        <ElementsFromPalette
          key={i}
          palette={palette}
          colors={originalColorScheme}
          colorMode={colorMode}
          baseTheme={baseTheme}
        />
      ))}
      <div className="config-ui">
        <div className="pure-g">
          <div className="pure-u-1-4 padded">
            <h2>Demo images</h2>
            <div className="pure-g">
              <div className="pure-u-1-2">
                A Photo by{" "}
                <a href="https://unsplash.com/@memory_terra?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
                  Alex Diaz
                </a>{" "}
                on{" "}
                <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
                  Unsplash
                </a>
              </div>
              <div className="pure-u-1-2">
                Photo by{" "}
                <a href="https://unsplash.com/@dancristianp?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
                  Dan-Cristian Pădureț
                </a>{" "}
                on{" "}
                <a href="https://unsplash.com/s/photos/colorful?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
                  Unsplash
                </a>
              </div>
            </div>
            <div className="pure-g">
              <div className="pure-u-1-2">
                Photo by{" "}
                <a href="https://unsplash.com/@mrrrk_smith?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
                  John-Mark Smith
                </a>{" "}
                on{" "}
                <a href="https://unsplash.com/s/photos/colorful?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
                  Unsplash
                </a>
                <img src="https://images.unsplash.com/photo-1488928741225-2aaf732c96cc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2670&q=80" />
              </div>
              <div className="pure-u-1-2">D</div>
            </div>
          </div>

          <div className="pure-u-1-2 padded">
            <h2>Image</h2>
            <p>Drag to upload your own, or select one on the left</p>

            <div className="pure-g">
              <div className="pure-u-2-3" style={{ paddingRight: "12px" }}>
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
              </div>
              <div className="pure-u-1-3">
                <Colors colors={originalColorScheme} />
              </div>
            </div>
          </div>

          <div className="pure-u-1-4 padded">
            <h2>Config</h2>
            <p>Color mode</p>
            <RadioButtonGroup
              value={colorMode}
              onChange={setColorMode}
              options={[
                { label: "Auto", value: "auto" },
                { label: "Light mode", value: "light" },
                { label: "Dark mode", value: "dark" },
              ]}
            />

            <p>Base theme</p>
            <RadioButtonGroup
              value={baseTheme}
              onChange={setBaseTheme}
              options={[
                { label: "Flat", value: "flat" },
                { label: "Stripe", value: "stripe" },
                { label: "Night", value: "night" },
              ]}
            />
          </div>
        </div>
        <p>
          Payment Element configuration through color extraction demo by Sashko
          Stubailo, Oct 2021
        </p>
      </div>
    </div>
  );
}

function ElementsFromPalette({ palette, colors, colorMode, baseTheme }) {
  const { appearance, other } =
    colors.length > 0
      ? palette(colors, colorMode)
      : { appearance: {}, other: { pageBackground: "white" } };

  appearance.theme = baseTheme;

  const options = {
    // passing the client secret obtained from the server
    clientSecret:
      "pi_3JmkcKIMJjsLxmkR0TdQ4qVr_secret_1UlXCMDRePvMcnJLCaccNk8Zv",
    appearance,
  };

  return (
    <div
      className="elements-background"
      style={{ backgroundColor: other.pageBackground }}
    >
      <div className="elements-container">
        <Elements stripe={stripePromise} options={options}>
          <PaymentElement />
        </Elements>
      </div>
    </div>
  );
}

export default App;
