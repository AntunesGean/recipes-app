import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExploreFoods from '../pages/ExploreFoods';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';

const exploreByIngredient = 'explore-by-ingredient';
const exploreByNationality = 'explore-by-nationality';
const exploreSurpriseMe = 'explore-surprise';
const exploreFoods = '/ExploreFoods';

describe('Testa o componente ExploreFoods e suas funcionalidades', () => {
  it('Verifica se existem 3 buttons na tela', () => {
    renderWithRouterAndRedux(

      <ExploreFoods />,
      {},
      exploreFoods,
    );
    const exploreByIngredientButton = screen.getByTestId(exploreByIngredient);
    expect(exploreByIngredientButton).toBeInTheDocument();

    const exploreByNationalityButton = screen.getByTestId(exploreByNationality);
    expect(exploreByNationalityButton).toBeInTheDocument();

    const exploreSurpriseMeButton = screen.getByTestId(exploreSurpriseMe);
    expect(exploreSurpriseMeButton).toBeInTheDocument();
  });

  it('Verifica se ByIngredientButton é redirecionado para tela FoodsIngredient', () => {
    const { history } = renderWithRouterAndRedux(

      <ExploreFoods />,
      {},
      exploreFoods,
    );

    const exploreByIngredientButton = screen.getByTestId(exploreByIngredient);

    userEvent.click(exploreByIngredientButton);

    const { pathname } = history.location;
    expect(pathname).toBe('/explore/foods/ingredients');
  });

  it(`Verifica se ByNationalityButton é redirecionado
  para tela FoodsNationality`, () => {
    const { history } = renderWithRouterAndRedux(

      <ExploreFoods />,
      {},
      exploreFoods,
    );

    const exploreByNationalityButton = screen.getByTestId(exploreByNationality);

    userEvent.click(exploreByNationalityButton);

    const { pathname } = history.location;
    expect(pathname).toBe('/explore/foods/nationalities');
  });
});
