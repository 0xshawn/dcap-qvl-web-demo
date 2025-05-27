import { setupCounter } from "./counter.ts";
import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";

import init, { js_verify, js_get_collateral } from "@phala/dcap-qvl-web";
import wasm from "@phala/dcap-qvl-web/dcap-qvl-web_bg.wasm";

const PCCS_URL = "https://pccs.phala.network/tdx/certification/v4";

async function fetchQuoteAsUint8Array(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

init(wasm).then(() => {
  console.log("Phala DCAP QVL initialized!");
  // You can now use js_verify, js_get_collateral, etc.
  fetchQuoteAsUint8Array("/sample/tdx_quote").then(async (rawQuote) => {
    const quoteCollateral = await js_get_collateral(PCCS_URL, rawQuote);
    
    // Current timestamp
    const now = BigInt(Math.floor(Date.now() / 1000));

    // Call the js_verify function
    const result = js_verify(rawQuote, quoteCollateral, now);
    console.log("Verification Result:", result);
  });
}).catch((error) => {
  console.error("Error:", error);
});

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
