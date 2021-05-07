import { h, defineComponent, ref, onMounted, onUpdated, onDeactivated } from "vue";
import resolveWrapperProps from "../../utils";

export default (Component: any, wrapperProps?: WrapperProps) => {
    wrapperProps = resolveWrapperProps(wrapperProps);

    return defineComponent({
        name: wrapperProps.id as string,
        setup(props, ctx) {
            const container = ref(null);
            const component = ref(null);

            onMounted(() => {
                const onRegex = /on([A-Z]{1,}[a-zA-Z]*)/;
                const watchRegex = /watch([A-Z]{1,}[a-zA-Z]*)/;

                component.value = new Component({
                    target: container.value,
                    props: ctx.attrs,
                });

                let watchers: any[][] = [];
                for (const key in ctx.attrs) {
                    const onMatch = key.match(onRegex);
                    const watchMatch = key.match(watchRegex);

                    if (onMatch && typeof ctx.attrs[key] === "function") {
                        ((component.value as unknown) as SvelteComponent)?.$on(
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
                    const update = ((component.value as unknown) as SvelteComponent)?.$$
                        .update;
                    if (update) {
                        ((component.value as unknown) as SvelteComponent).$$.update = function () {
                            watchers.forEach(([name, callback]) => {
                                const index = ((component.value as unknown) as SvelteComponent)
                                    ?.$$.props[name];
                                const prop = ((component.value as unknown) as SvelteComponent)
                                    ?.$$.ctx[index];
                                prop && callback(prop);
                            });
                            update.apply(null, arguments);
                        };
                    }
                }

                return () => {
                    ((component.value as unknown) as SvelteComponent)?.$destroy();
                };
            });

            onUpdated(() => {
                ((component.value as unknown) as SvelteComponent)?.$set(ctx.attrs);
            });

            onDeactivated(()=>{
                ((component.value as unknown) as SvelteComponent)?.$destroy();
            });

            return {
                component,
                container,
            };
        },
        render() {
            const childrenDefaults = {
                ref: "container",
                id: wrapperProps?.id,
                style: { ...wrapperProps?.styles },
            };
            const children = wrapperProps?.className
                ? Object.assign({}, childrenDefaults, {
                    class: wrapperProps?.className,
                })
                : childrenDefaults;
            return h(wrapperProps?.element, children);
        },
    });
};
