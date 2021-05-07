import Vue from "vue";
import resolveWrapperProps from "../helpers";

export default (Component: any, wrapperProps?: WrapperProps) => {
    wrapperProps = resolveWrapperProps(wrapperProps);

    return Vue.component(wrapperProps.id as string, {
        render(createElement) {
            return createElement(wrapperProps?.element, {
                ref: "container",
                class: wrapperProps?.className,
                attrs: { id: wrapperProps?.id },
                style: { ...wrapperProps?.styles },
            });
        },
        data() {
            return {
                comp: null,
            };
        },
        mounted() {
            this.comp = new Component({
                target: this.$refs.container,
                props: this.$attrs,
            });

            let watchers: any[][] = [];

            for (const key in this.$listeners) {
                (this as any).comp.$on(key, this.$listeners[key]);

                const watchRe = /watch:([^]+)/;
                const watchMatch = key.match(watchRe);

                if (watchMatch && typeof this.$listeners[key] === "function") {
                    watchers.push([
                        `${watchMatch[1][0].toLowerCase()}${watchMatch[1].slice(1)}`,
                        this.$listeners[key],
                    ]);
                }
            }

            if (watchers.length) {
                let comp = (this as any).comp;
                const update = (this as any).comp.$$.update;

                (this as any).comp.$$.update = function () {
                    watchers.forEach(([name, callback]) => {
                        const index = comp.$$.props[name];
                        const prop = comp.$$.ctx[index];
                        prop && callback(prop);
                    });
                    update.apply(null, arguments);
                };
            }
        },
        updated() {
            (this as any).comp.$set(this.$attrs);
        },
        destroyed() {
            (this as any).comp.$destroy();
        },
    });
};
