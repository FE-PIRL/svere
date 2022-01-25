import { render, fireEvent } from "@testing-library/svelte";
import App from "../Component.svelte";

test("should render", () => {
  const results = render(App, { props: { name: "world" } });

  expect(() => results.getByText("Hello world!")).not.toThrow();
});


// Note: This is as an async test as we are using `fireEvent`
test('count increments when button is clicked', async () => {
  const results = render(App, { props: { name: "world" } });
  const button = results.getByText('add count: 0');

  // Using await when firing events is unique to the svelte testing library because
  // we have to wait for the next `tick` so that Svelte flushes all pending state changes.
  await fireEvent.click(button);

  expect(button).toHaveTextContent('add count: 1');
})


test('listen custom event', async () => {
  const results = render(App, { props: { name: "world" } });
  const button = results.getByText('add count: 0');

  results.component.$on('someEvent', e=>{
    expect(e.detail).toBe(1);
  })

  await fireEvent.click(button);
})