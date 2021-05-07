import { shallowMount } from "@vue/test-utils";

import toVue from "../../src/index";
import SvelteComponent from "../../../../../examples/dist";

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

    const wrapper = shallowMount(VueComponent,{propsData: { name }});

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("count increments when button is clicked", async () => {
    const VueComponent = toVue(SvelteComponent);

    const wrapper = shallowMount(VueComponent,{propsData: { name }});
    expect(wrapper.find("button").text()).toBe("count: 0");

    await wrapper.find("button").trigger("click");

    expect(wrapper.find("button").text()).toBe("count: 1");
  });

  it("watch internal props changes and execute the callback", async () => {
    const VueComponent = toVue(SvelteComponent);

    const handleSomeEvent = (name: string) => {
      //console.log(name)
      expect(name).toBe("yasin");
    };
    const wrapper = shallowMount(VueComponent, {
      propsData: { name },
      listeners: {
        "watch:name": handleSomeEvent,
      },
    });

    await wrapper.find("button").trigger("click");
  });

  it("listen custom event", async () => {
    const VueComponent = toVue(SvelteComponent);

    const handleSomeEvent = (e: any) => {
      //console.log(e.detail);
      expect(e.detail).toBe(1);
    };

    const wrapper = shallowMount(VueComponent, {
      propsData: { name },
      listeners: {
        someEvent: handleSomeEvent,
      },
    });

    await wrapper.find("button").trigger("click");
  });

  it("custom wrapper", async () => {
    const wrapperProps = {
      element: "section",
      className: "section-css",
      id: "svelte-vue2",
      styles: {
        border: "1px solid gray",
      },
    };
    const VueComponent = toVue(SvelteComponent, wrapperProps);

    const wrapper = shallowMount(VueComponent,{propsData: { name }});

    expect(wrapper.html()).toMatchSnapshot();
  });
});
