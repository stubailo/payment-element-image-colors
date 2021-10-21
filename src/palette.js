import Color from "color";

// Returns variables
export function paletteOne(colors, colorMode) {
  let numDarkColors = 0;
  colors.forEach((c) => {
    console.log(Color(c).hsl().object());
    if (Color(c).hsl().object().l < 45) {
      numDarkColors++;
    }
  });
  console.log("numdark", numDarkColors);
  let darkMode = numDarkColors > colors.length / 2;
  if (colorMode === "dark") {
    darkMode = true;
  } else if (colorMode === "light") {
    darkMode = false;
  }

  const mutateColors = [...colors];
  const darkestColor = colors.reduce((a, b) =>
    Color(a).hsl().object().l < Color(b).hsl().object().l ? a : b
  );
  remove(mutateColors, darkestColor);
  const lightestColor = mutateColors.reduce((a, b) =>
    Color(a).hsl().object().l > Color(b).hsl().object().l ? a : b
  );
  remove(mutateColors, lightestColor);

  const brightestColor = mutateColors.reduce((a, b) =>
    Color(a).hsl().object().s > Color(b).hsl().object().s ? a : b
  );
  remove(mutateColors, brightestColor);

  const secondBrightestColor = mutateColors.reduce((a, b) =>
    Color(a).hsl().object().s > Color(b).hsl().object().s ? a : b
  );

  const pageBackground = darkMode ? "black" : "white";

  const colorBackground = darkMode ? darkestColor : lightestColor;
  const colorPrimary = contrastize(brightestColor, colorBackground);
  const colorText = contrastize(
    darkMode ? lightestColor : darkestColor,
    pageBackground
  );

  const appearance = {
    theme: "stripe",

    variables: {
      colorBackground,
      colorPrimary,
      colorText,
    },

    rules: {
      ".Tab": {
        color: contrastize(secondBrightestColor, colorBackground),
      },
    },
  };

  const other = {
    pageBackground,
  };
  return { appearance, other };
}

// returns a better foreground color for the background
function contrastize(foreground, background) {
  let fg = Color(foreground);
  const bg = Color(background);

  let iterations = 0;
  if (bg.isDark()) {
    // need 4.5 contrast
    while (fg.contrast(bg) < 4.5 && iterations < 5) {
      fg = fg.lighten(0.1);
      iterations++;
    }
  } else if (bg.isLight()) {
    // need 4.5 contrast
    while (fg.contrast(bg) < 4.5 && iterations < 5) {
      fg = fg.darken(0.1);
      iterations++;
    }
  }

  const rgb = fg.rgb().string();
  return rgb;
}

// mutates array
function remove(arr, x) {
  const i = arr.indexOf(x);
  if (i > -1) {
    arr.splice(i, 1);
  }
}
