import { mount } from "@vue/test-utils";

import toVue3 from "../index";
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
    const VueComponent = toVue3(SvelteComponent);

    const wrapper = mount(VueComponent, { props: { name } });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it("count increments when button is clicked", async () => {
    const VueComponent = toVue3(SvelteComponent);

    const wrapper = mount(VueComponent, { props: { name } });
    expect(wrapper.find("button").text()).toBe("count: 0");

    await wrapper.find("button").trigger("click");

    expect(wrapper.find("button").text()).toBe("count: 1");
  });

  //listeners has not been supported for now
/*  it("watch internal props changes and execute the callback", async () => {
    const VueComponent = toVue3(SvelteComponent);

    const handleSomeEvent = (name: string) => {
      console.log(name)
      expect(name).toBe("yasin");
    };
    const wrapper = mount(VueComponent, {
      listeners: {
        "watch:name": handleSomeEvent,
      },
    });

    await wrapper.find("button").trigger("click");
  });

  it("listen custom event", async () => {
    const VueComponent = toVue3(SvelteComponent);

    const handleSomeEvent = (e: any) => {
      console.log(e.detail);
      expect(e.detail).toBe(1);
    };

    const wrapper = mount(VueComponent, {
      listeners: {
        someEvent: handleSomeEvent,
      },
    });

    await wrapper.find("button").trigger("click");
  });*/

  it("custom wrapper", async () => {
    const wrapperProps = {
      element: "section",
      className: "section-css",
      id: "svelte-vue3",
      styles: {
        border: "1px solid gray",
      },
    };
    const VueComponent = toVue3(SvelteComponent, wrapperProps);

    const wrapper = mount(VueComponent, { props: { name } });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
