import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { unmountComponentAtNode } from "react-dom";
import { act, isElementOfType } from 'react-dom/test-utils';
import { Button, Form } from 'react-bootstrap';
import userEvent from '@testing-library/user-event';
import { click } from '@testing-library/user-event/dist/click';

let container: any = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

it("renders the initial UI", () => {
  act(() => {
    render(<App />, container)
  });
  const linkElement = screen.getByText(/Pokemon/i);
  expect(linkElement).toBeInTheDocument();
  const inputElement = screen.getByRole('textbox', { name: "Pokemon Search" });
  expect(inputElement).toBeTruthy();
  const buttonElement = screen.getByRole('button', { name: /search/i });
  expect(buttonElement).toBeTruthy();
});


it("fails to render a pokemon because of shakespeare rate limit", async () => {
  act(() => {
    render(<App />, container)
  });

  const shakespeareErrorData = {
    error:"Too Many Requests: Rate limit of 5 requests per hour exceeded. Please wait for 1 hour."
  };
  
  const spy = jest.spyOn(global, "fetch").mockImplementation(jest.fn(() => Promise.resolve({
    ok: false,
    json: () => Promise.resolve(shakespeareErrorData)
  })) as jest.Mock);

  await act(async () => {
    userEvent.type(screen.getByRole('textbox', { name: "Pokemon Search" }), "pikachu");
    userEvent.click(screen.getByRole('button', { name: /search/i }));
  })

  expect(screen.queryByTestId("error_message")).toBeTruthy();
  expect(screen.queryByTestId("error_description")).toBeFalsy();
  expect(screen.getByTestId("error_message").textContent).toBe("Too Many Requests: Rate limit of 5 requests per hour exceeded. Please wait for 1 hour.");
  spy.mockRestore();
});

it("renders a pokemon on searching", async () => {
  act(() => {
    render(<App />, container)
  });

  const fakePokemon = {
    description: "At which hour several of these pokémon gather,  their electricity couldst buildeth and cause lightning storms.",
    name: "pikachu",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    status: 200
  };

  const spy = jest.spyOn(global, "fetch").mockImplementation(jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(fakePokemon)
  })) as jest.Mock);

  await act(async () => {
    userEvent.type(screen.getByRole('textbox', { name: "Pokemon Search" }), "pikachu");
    userEvent.click(screen.getByRole('button', { name: /search/i }));
  })

  expect(screen.queryByTestId("pokemon_image")).toBeTruthy();
  expect(screen.queryByTestId("pokemon_name")).toBeTruthy();
  expect(screen.queryByTestId("pokemon_description")).toBeTruthy();
  expect((screen.getByTestId("pokemon_image") as HTMLImageElement).src).toBe("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png");
  expect(screen.getByTestId("pokemon_name").textContent).toBe("pikachu");
  expect(screen.getByTestId("pokemon_description").textContent).toBe("At which hour several of these pokémon gather,  their electricity couldst buildeth and cause lightning storms.");
  spy.mockReset();
});


it("fails when pokemon name not entered", async () => {
  act(() => {
    render(<App />, container);
    userEvent.click(screen.getByRole('button', { name: /search/i }));
  });
  expect(screen.queryByTestId("error_name")).toBeTruthy();
  expect(screen.getByTestId("error_name").textContent).toBe('Please enter a pokemon name.');
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container as Element);
  (container as Element).remove();
  container = null;
  sessionStorage.clear();
});