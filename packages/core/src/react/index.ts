import React, { useRef, useEffect, useState }  from "react";
import resolveWrapperProps from "../helpers";

export default (Component: SvelteComponentConstructor, _wrapperProps?: WrapperProps) => (props: {
  [x: string]: any;
}) => {
  const container = useRef<HTMLElement>(null);
  const component = useRef<SvelteComponent | null>(null);

  const [mounted, setMount] = useState(false);

  useEffect(() => {
    const onRegex = /on([A-Z]+[a-zA-Z]*)/;
    const watchRegex = /watch([A-Z]+[a-zA-Z]*)/;

    component.current = new Component({ target: container.current, props });

    let watchers: any[][] = [];
    for (const key in props) {
      const onMatch = key.match(onRegex);
      const watchMatch = key.match(watchRegex);

      if (onMatch && typeof props[key] === "function") {
        ((component.current as unknown) as SvelteComponent)?.$on(
            `${onMatch[1][0].toLowerCase()}${onMatch[1].slice(1)}`,
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
      if (component.current?.$$.update) {
        const update = component.current?.$$.update;
        component.current.$$.update = function () {
          watchers.forEach(([name, callback]) => {
            const index = component.current?.$$.props[name];
            const prop = component.current?.$$.ctx[index];
            prop && callback(prop);
          });
          update.apply(null, arguments);
        };
      }
    }

    return () => component.current?.$destroy();
  }, []);

  useEffect(() => {
    if (!mounted) {
      setMount(true);
      return;
    }

    component.current?.$set(props);
  }, [props]);

  const wrapperProps = resolveWrapperProps(_wrapperProps);

  return React.createElement(wrapperProps.element, {
    ref: container,
    ...wrapperProps
  });
};
