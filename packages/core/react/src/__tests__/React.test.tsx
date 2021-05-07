import React from "react";
import ReactDOM from "react-dom";

import { toReact } from "../../src/index";
import SvelteComponent from "../../../../../examples/dist";
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
    const ReactComponent = toReact(SvelteComponent);

    // render the component
    act(() => {
      ReactDOM.render(<ReactComponent name={name} />, container);
    });

    expect(container).toMatchSnapshot();
  });

  it("count increments when button is clicked", async () => {
    const ReactComponent = toReact(SvelteComponent);

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

  it("watch internal props changes and execute the callback", async () => {
    const ReactComponent = toReact(SvelteComponent);

    const handleSomeEvent = (name: string) => {
      //console.log(name)
      expect(name).toBe("yasin");
    };

    // render the component
    await act(async () => {
      ReactDOM.render(
        <ReactComponent name={name} watchName={handleSomeEvent} />,
        container
      );
    });

    const button = container.querySelector("button");

    // Test second render and componentDidUpdate
    await act(async () => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
  });

  it("listen custom event", async () => {
    const ReactComponent = toReact(SvelteComponent);

    const handleSomeEvent = (e: any) => {
      //console.log(e.detail)
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

  it("custom wrapper", async () => {
    const wrapperProps = {
      element: "section",
      className: "section-css",
      id: "svelte-react",
      styles: {
        border: "1px solid gray",
      },
    };
    const ReactComponent = toReact(SvelteComponent, wrapperProps);

    // render the component
    act(() => {
      ReactDOM.render(<ReactComponent name={name} />, container);
    });

    expect(container).toMatchSnapshot();
  });
});
