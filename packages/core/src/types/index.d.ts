interface ComponentOptions {
  target: HTMLElement | null;
  anchor: HTMLElement | null;
}

type SvelteComponent = import('svelte').SvelteComponent;

type SvelteComponentConstructor = new(ComponentOptions) => SvelteComponent;

type WrapperProps = {
  element?: string | FunctionComponent<{}> | ComponentClass<{}, any>;
  id?: string;
  className?: string;
  styles?: {};
};
