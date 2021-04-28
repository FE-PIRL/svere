import React, { useRef, useEffect, useState } from "react";

// dynamically create a react element by a svelte element
export const reactify = (Component: any, style = {}, tag = "span") => (props: {
  [x: string]: any;
}) => {
  const container = useRef(null);
  const component = useRef(null);

  const [mounted, setMount] = useState(false);

  useEffect(() => {
    const eventRegex = /on([A-Z]{1,}[a-zA-Z]*)/;
    const watchRegex = /watch([A-Z]{1,}[a-zA-Z]*)/;

    component.current = new Component({ target: container.current, props });

    let watchers: any[][] = [];
    for (const key in props) {
      const eventMatch = key.match(eventRegex);
      const watchMatch = key.match(watchRegex);

      if (eventMatch && typeof props[key] === "function") {
        ((component.current as unknown) as Component)?.$on(
          `${eventMatch[1][0].toLowerCase()}${eventMatch[1].slice(1)}`,
          props[key]
        );
      }

      if (watchMatch && typeof props[key] === "function") {
        watchers.push([
          `${watchMatch[1][0].toLowerCase()}${watchMatch[1].slice(1)}`,
          props[key],
        ]);
      }
    }

    if (watchers.length) {
      const update = ((component.current as unknown) as Component)?.$$.update;
      if (update) {
        ((component.current as unknown) as Component).$$.update = function () {
          watchers.forEach(([name, callback]) => {
            const index = ((component.current as unknown) as Component)?.$$
              .props[name];
            callback(
              ((component.current as unknown) as Component)?.$$.ctx[index]
            );
          });
          update.apply(null, arguments);
        };
      }
    }

    return () => {
      ((component.current as unknown) as Component)?.$destroy();
    };
  }, []);

  useEffect(() => {
    if (!mounted) {
      setMount(true);
      return;
    }

    ((component.current as unknown) as Component)?.$set(props);
  }, [props]);

  return React.createElement(tag, { ref: container, style });
};
