import React from "react";
import ReactDOM from 'react-dom';

import { reactify } from '../../src/index';
import SvelteComponent from '../../../../examples/dist';
import { act } from 'react-dom/test-utils';

describe('React', () => {
    let container:any;
    const name = "ben"

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    it('reactify', () => {
        const ReactComponent = reactify(SvelteComponent)

        // render the component
        act(() => {
            ReactDOM.render(<ReactComponent name={name}/>, container);
        });

        expect(container).toMatchSnapshot();
    });
});