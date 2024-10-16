// components/AnimatedTitle.tsx
"use client";

import { useEffect } from "react";

const AnimatedTitle = () => {
  useEffect(() => {
    const titles = [
      "ＶＥＬＯＣＩＲＥＰＯＲＴ ",
      "ＥＬＯＣＩＲＥＰＯＲＴ-",
      "ＬＯＣＩＲＥＰＯＲＴ--",
      "ＯＣＩＲＥＰＯＲＴ---Ｖ",
      "ＣＩＲＥＰＯＲＴ---ＶＥ",
      "ＩＲＥＰＯＲＴ---ＶＥＬ",
      "ＲＥＰＯＲＴ---ＶＥＬＯ",
      "ＥＰＯＲＴ---ＶＥＬＯＣ",
      "ＰＯＲＴ---ＶＥＬＯＣＩ",
      "ＯＲＴ---ＶＥＬＯＣＩＲ",
      "ＲＴ---ＶＥＬＯＣＩＲＥ",
      "Ｔ---ＶＥＬＯＣＩＲＥＰ",
      "--ＶＥＬＯＣＩＲＥＰＯ",
      "-ＶＥＬＯＣＩＲＥＰＯＲ",
      "ＶＥＬＯＣＩＲＥＰＯＲＴ ",
    ];

    let index = 0;
    const intervalId = setInterval(() => {
      document.title = titles[index];
      index = (index + 1) % titles.length;
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return null; // This component only handles side-effects, so no UI is needed
};

export default AnimatedTitle;
