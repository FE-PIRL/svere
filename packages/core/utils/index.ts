const defaultWrapperProps = {
    element: "div",
    id: "svelte-wrapper",
};

const resolveWrapperProps = (wrapperProps?: WrapperProps) => {
    if (!wrapperProps) {
        return defaultWrapperProps;
    } else {
        return Object.assign({}, defaultWrapperProps, wrapperProps);
    }
};
export default resolveWrapperProps