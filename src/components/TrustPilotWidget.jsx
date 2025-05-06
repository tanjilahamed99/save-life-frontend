"use client";

import React, { useEffect } from "react";

const TrustPilotWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center items-center pt-10">
      <div
        className="trustpilot-widget"
        data-locale="nl-NL"
        data-template-id='56278e9abfbbba0bdcd568bc' // Public template ID
        data-businessunit-id='665a3a4ff278f22f2d472f75' // Public business unit ID
        data-style-height="0px"
        data-style-width="100%"
        data-theme="light">
        <a
          href="https://www.trustpilot.com/review/benzobestellen.com"
          target="_blank"
          rel="noopener noreferrer">
          Trustpilot Reviews
        </a>
      </div>
    </div>
  );
};

export default TrustPilotWidget;
