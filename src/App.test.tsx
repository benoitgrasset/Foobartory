import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

const params = {
  foo: 0,
  bar: 0,
  foobar: 0
}

test('it renders correctly 2 robots', async () => {
  render(<App nbRobots={2} params={params} />);
  const container = screen.getByTestId("robot-container");
  expect(container).toBeInTheDocument();
  const robots = await screen.findAllByTestId('robot');
  expect(robots).toHaveLength(2);
});


test('button to buy robots is disabled if not enough ressources', () => {
  render(<App nbRobots={2} params={params} />);
  const button = screen.getByText("Acheter robot")
  expect(button).toHaveAttribute("disabled")
});

test('+1 foo is added when mining', () => {
  render(<App nbRobots={2} params={params} />);
  const nbFoos = screen.getByTestId("foo");
  expect(nbFoos).toHaveTextContent('0')
  const buttons = screen.getAllByTestId("mine-foo")
  expect(buttons).toHaveLength(2);
  fireEvent.click(buttons[0])
  expect(nbFoos).toHaveTextContent('1')
});

test('+1 bar is added when mining', () => {
  render(<App nbRobots={2} params={params} />);
  const nbBars = screen.getByTestId("bar");
  expect(nbBars).toHaveTextContent('0')
  const buttons = screen.getAllByTestId("mine-bar")
  expect(buttons).toHaveLength(2);
  fireEvent.click(buttons[0])
  expect(nbBars).toHaveTextContent('1')
});

test('foobar building', () => {
  render(<App nbRobots={2} params={{ foo: 1, bar: 1, foobar: 0 }} />);
  const nbFoobars = screen.getByTestId("foobar");
  expect(nbFoobars).toHaveTextContent('0')
  const buttons = screen.getAllByTestId("build-foobar")
  fireEvent.click(buttons[0])
  const newBbFoobars = screen.getByTestId("foobar");
  expect(newBbFoobars).toHaveTextContent('1')
});


test('it adds an other robot', async () => {
  render(<App nbRobots={2} params={{ foo: 6, bar: 0, foobar: 3 }} />);
  const robots = await screen.findAllByTestId('robot');
  expect(robots).toHaveLength(2);
  const button = screen.getByText("Acheter robot")
  expect(button).not.toHaveAttribute("disabled")
  fireEvent.click(button)
  const newRobots = await screen.findAllByTestId('robot');
  expect(newRobots).toHaveLength(3);
});
