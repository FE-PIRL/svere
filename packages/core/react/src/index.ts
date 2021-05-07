import React, { useRef, useEffect, useState } from "react";
import resolveWrapperProps from "../../utils";

export default (Component: any, wrapperProps?: WrapperProps) => (props: {
  [x: string]: any;
}) => {
  const container = useRef<HTMLElement>(null);
  const component = useRef<HTMLElement | null>(null);

  const [mounted, setMount] = useState(false);

  useEffect(() => {
    const onRegex = /on([A-Z]{1,}[a-zA-Z]*)/;
    const watchRegex = /watch([A-Z]{1,}[a-zA-Z]*)/;

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
      const update = ((component.current as unknown) as SvelteComponent)?.$$
        .update;
      if (update) {
        ((component.current as unknown) as SvelteComponent).$$.update = function () {
          watchers.forEach(([name, callback]) => {
            const index = ((component.current as unknown) as SvelteComponent)
              ?.$$.props[name];
            const prop = ((component.current as unknown) as SvelteComponent)?.$$
              .ctx[index];
            prop && callback(prop);
          });
          update.apply(null, arguments);
        };
      }
    }

    return () => {
      ((component.current as unknown) as SvelteComponent)?.$destroy();
    };
  }, []);

  useEffect(() => {
    if (!mounted) {
      setMount(true);
      return;
    }

    ((component.current as unknown) as SvelteComponent)?.$set(props);
  }, [props]);

  wrapperProps = resolveWrapperProps(wrapperProps);

  return React.createElement(wrapperProps?.element, {
    ref: container,
    id: wrapperProps?.id,
    className: wrapperProps?.className,
    style: { ...wrapperProps?.styles },
  });
};
