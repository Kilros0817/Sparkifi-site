import React from "react";
import logo from "../logo.svg";

export default function Home() {
  return (
    <div>
      <div className="text-gray-500 font-mono bg-gray-100">
        <div className="space-y-4 p-28 bg-white max-w-5xl mx-auto">
          <p className="mb-10">
            <a
              href="mailto:info@sparkifi.xyz"
              className="no-underline titlelink text-3xl"
            >
              SparkiFi
            </a>
          </p>
          <p className="font-thin">
            SparkiFi is an independent infrastructure provider on the{" "}
            <span className="font-medium">Songbird</span> and{" "}
            <span className="font-medium">Flare</span> ecosystems. We provide the
            highest quality and lowest cost data delegate services.
          </p>
          <p className="font-thin">
            Delegate to us at&nbsp;
            <a
              className="no-underline titlelink"
              href="https:songbird-explorer.flare.network/address/0x153aD30381b11DCE62f349c97a54c2a58956B992"
              target="_blank"
              rel="noreferrer"
            >
              0x029290c564Ef921c56a784AA16C97E930dAF7372
            </a>
          </p>

          <div className="absolute bottom-0 pb-8">
            <p className="font-thin text-xs">
              Copyright 2021 SparkiFi |
              <a
                href="mailto:info@sparkifi.xyz"
                className="transition duration-700 ease-in-out hover:text-red-500"
                target="_blank"
                rel="noreferrer"
              >
                Contact us
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
