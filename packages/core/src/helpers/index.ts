const resolveWrapperProps = (wrapperProps?: WrapperProps) => ({
    element: "div",
    id: "svelte-wrapper",
    ...wrapperProps
});
export default resolveWrapperProps