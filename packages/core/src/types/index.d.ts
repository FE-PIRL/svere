interface ComponentOptions {
    target: HTMLElement | null;
    anchor?: HTMLElement | null;
    props?: {};
    hydrate?: boolean;
    intro?: boolean;
}

interface Component {
    new (options: ComponentOptions): any;
    // client-side methods
    $set(props: {}): void;
    $on(event: string, callback: (event: CustomEvent) => void): void;
    $destroy(): void;

    // server-side methods
    render(props?: {}): {
        html: string;
        css: { code: string; map: string | null };
        head?: string;
    };
}