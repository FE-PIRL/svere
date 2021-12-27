import {defineComponent, h, onDeactivated, onMounted, onUpdated, ref} from "vue";
import resolveWrapperProps from "../helpers";

export default (Component: SvelteComponentConstructor, _wrapperProps?: WrapperProps) => {
    const wrapperProps = resolveWrapperProps(_wrapperProps);

    return defineComponent({
        name: wrapperProps.id,
        setup(props, ctx) {
            const container = ref<HTMLElement | null>(null);
            const component = ref<SvelteComponent | null>(null);

            onMounted(() => {
                const onRegex = /on([A-Z]+[a-zA-Z]*)/;
                const watchRegex = /watch([A-Z]+[a-zA-Z]*)/;

                component.value = new Component({
                    target: container.value,
                    props: ctx.attrs,
                });

                let watchers: any[][] = [];
                for (const key in ctx.attrs) {
                    const onMatch = key.match(onRegex);
                    const watchMatch = key.match(watchRegex);

                    if (onMatch && typeof ctx.attrs[key] === "function") {
                        component.value.$on(
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
                    if (component.value.$$.update) {
                        const update = component.value.$$.update;
                        component.value.$$.update = function () {
                            watchers.forEach(([name, callback]) => {
                                const index = component.value.$$.props[name];
                                const prop = component.value.$$.ctx[index];
                                prop && callback(prop);
                            });
                            update.apply(null, arguments);
                        };
                    }
                }

                return () => component.value.$destroy();
            });

            onUpdated(() => component.value?.$set(ctx.attrs));

            onDeactivated(() => component.value?.$destroy());

            return {
                component,
                container,
            };
        },
        render() {
            const children = {
                ref: "container",
                id: wrapperProps.id,
                style: {...wrapperProps.styles},
                class: wrapperProps.className,
            };
            return h(wrapperProps.element, children);
        },
    });
};
