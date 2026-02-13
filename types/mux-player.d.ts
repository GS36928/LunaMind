import React from "react";

declare global {
  namespace ReactJSX {
    interface IntrinsicElements {
      "mux-player": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "playback-id"?: string;
        "stream-type"?: "on-demand" | "live";
        autoplay?: boolean;
        controls?: boolean;
        width?: string | number;
        height?: string | number;
        "primary-color"?: string;
      };
    }
  }
}
