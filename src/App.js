import { useCallback, useState, useRef, useEffect } from "react";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ColorThief from "colorthief";
import "purecss/build/pure-min.css";

import { paletteOne } from "./palette";
import { Colors } from "./Colors";
import { RadioButtonGroup } from "./ButtonGroup";

import "./App.css";

const stripePromise = loadStripe(
  "pk_test_51JmkY3IMJjsLxmkR84RlI2s5tIt8eWATgq1nHykamhrOp7hwbue7zQRDVibnk9iXik67STVqANcOQqWwZvkW9q6500xrwvBKXG"
);

const colorThief = new ColorThief();

function App() {
  const initialImage = "/drop-here.jpg";
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
      throw new Error("no files");
    }

    [...files].forEach((file) => {
      if (!validTypes.includes(file.type)) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              <div className="pure-u-1-2 padding-right-thumb">
                <p className="unsplash-image-caption">
                  <a href="https://unsplash.com/@memory_terra">Alex Diaz</a>
                </p>

                <img
                  className="thumb"
                  src="/alex-diaz.jpg"
                  alt="Straight highway with a forest on both sides, in the fall."
                  onClick={() => {
                    setImageData("/alex-diaz.jpg");
                  }}
                />
              </div>
              <div className="pure-u-1-2 padding-right-thumb">
                <p className="unsplash-image-caption">
                  <a href="https://unsplash.com/@dancristianp">
                    Dan-Cristian Pădureț
                  </a>
                </p>
                <img
                  className="thumb"
                  src="/dan-cristian-paduret.jpg"
                  alt="Abstract pattern of several different paint colors swirling around."
                  onClick={() => {
                    setImageData("/dan-cristian-paduret.jpg");
                  }}
                />
              </div>
            </div>
            <div className="pure-g">
              <div className="pure-u-1-2 padding-right-thumb">
                <p className="unsplash-image-caption">
                  <a href="https://unsplash.com/@mrrrk_smith">
                    John-Mark Smith
                  </a>
                </p>
                <img
                  className="thumb"
                  src="/john-mark-smith.jpg"
                  alt="Close-up of a field of tulips."
                  onClick={() => {
                    setImageData("/john-mark-smith.jpg");
                  }}
                />
              </div>
              <div className="pure-u-1-2 padding-right-thumb">
                <p className="unsplash-image-caption">
                  <a href="https://unsplash.com/@7bbbailey">Barth Bailey</a>
                </p>
                <img
                  className="thumb"
                  src="/barth-bailey.jpg"
                  alt="Bryce Canyon with orange rocks."
                  onClick={() => {
                    setImageData("/barth-bailey.jpg");
                  }}
                />
              </div>
            </div>
          </div>

          <div className="pure-u-1-2 padded">
            <h2>Image</h2>
            <p>Drag to upload your own, or click one on the left</p>

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
          Payment Element configuration through color extraction demo
          <br />
          Sashko Stubailo, Oct 2021
          <br />
          See the code on GitHub
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
