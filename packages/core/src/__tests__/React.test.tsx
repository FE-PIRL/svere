import React from "react";
import ReactDOM from "react-dom";

import { reactify } from "../../src/index";
import SvelteComponent from "../../../../examples/dist";
import { act } from "react-dom/test-utils";

describe("React", () => {
  let container: any;
  const name = "ben";

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it("should render", async () => {
    const ReactComponent = reactify(SvelteComponent);

    // render the component
    act(() => {
      ReactDOM.render(<ReactComponent name={name} />, container);
    });

    expect(container).toMatchSnapshot();
  });

  it("count increments when button is clicked", async () => {
    const ReactComponent = reactify(SvelteComponent);

    // render the component
    act(() => {
      ReactDOM.render(<ReactComponent name={name} />, container);
    });

    const button = container.querySelector("button");
    expect(button.textContent).toBe("count: 0");

    // Test second render and componentDidUpdate
    await act(async () => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(button.textContent).toBe("count: 1");
  });

  it("listen custom event", async () => {
    const ReactComponent = reactify(SvelteComponent);

    const handleSomeEvent = (e: any) => {
      expect(e.detail).toBe(1);
    };

    // render the component
    await act(async () => {
      ReactDOM.render(
        <ReactComponent name={name} onSomeEvent={handleSomeEvent} />,
        container
      );
    });

    const button = container.querySelector("button");

    // Test second render and componentDidUpdate
    await act(async () => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
  });
});
