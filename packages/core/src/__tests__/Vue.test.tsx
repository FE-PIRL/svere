//import Vue  from 'vue';
import { shallowMount } from "@vue/test-utils";

import { toVue } from "../../src/index";
import SvelteComponent from "../../../../examples/dist";

describe("Vue", () => {
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
    const VueComponent = toVue(SvelteComponent);

    const wrapper = shallowMount(VueComponent({ name }));

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("count increments when button is clicked", async () => {});

  it("listen custom event", async () => {});

  it("custom wrapper", async () => {
    const wrapperProps = {
      element: "section",
      className: "section-css",
      id: "svelte-react-1",
      styles: {
        border: "1px solid gray",
      },
    };
    const VueComponent = toVue(SvelteComponent, wrapperProps);

    const wrapper = shallowMount(VueComponent({ name }));

    expect(wrapper.html()).toMatchSnapshot();
  });
});
