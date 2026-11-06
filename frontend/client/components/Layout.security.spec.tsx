import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import Layout from "./Layout";

describe("SEC-02: enlaces públicos externos", () => {
  it("utiliza HTTPS para las redes sociales de STGlobal", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
    for (const network of ["linkedin", "facebook", "twitter"]) {
      expect(markup).toContain('href="https://stglobal.tech/' + network + '"');
    }
    expect(markup).not.toContain('href="http://stglobal.tech/');
  });
});
