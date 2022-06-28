import React from 'react';
import { screen, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';
import DrinkDetail from '../pages/DrinkDetail';
import oneMeal from '../../cypress/mocks/oneMeal';
import meals from '../../cypress/mocks/meals';
import oneDrink from '../../cypress/mocks/oneDrink';
import { foodsInLocalStorage } from '../helpers/storageFuncs';
import App from '../App';

describe('Testa o componente DrinkDetail e suas funcionalidades', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  const pathname = '/drinks/178319';
  const verifyFoodsCards = (foodsObject) => {
    const totalRecipesNumber = 6;
    foodsObject.meals.forEach((recipe, index) => {
      if (index < totalRecipesNumber) {
        expect(screen.getByTestId(`${index}-recomendation-card`)).toBeInTheDocument();
        expect(screen.getByTestId(`${index}-recomendation-title`)).toBeInTheDocument();
        expect(screen.getByTestId(`${index}-recomendation-title`))
          .toHaveTextContent(recipe.strMeal);
        expect(screen.getByRole('img', { name: recipe.strMeal })).toBeInTheDocument();
        expect(screen.getByRole('img', { name: recipe.strMeal }).src)
          .toBe(recipe.strMealThumb);
      } else {
        expect(screen.queryByTestId(`${index}-recomendation-card`))
          .not.toBeInTheDocument();
        expect(screen.queryByTestId(`${index}-recomendation-title`))
          .not.toBeInTheDocument();
      }
    });
  };
  afterEach(() => {
    jest.spyOn(global, 'fetch').mockRestore();
  });
  it('Verifica se a página renderiza a receita e suas informações', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(oneDrink),
    });
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(meals),
    });
    const { history } = renderWithRouterAndRedux(
      <DrinkDetail />,
      {},
      pathname,
    );
    expect(history.location.pathname).toBe(pathname);

    const title = await screen.findByTestId('recipe-title');
    const image = await screen.findByTestId('recipe-photo');
    const category = await screen.findByTestId('recipe-category');
    const ingredient0 = await screen.findByTestId('0-ingredient-name-and-measure');
    const ingredient1 = await screen.findByTestId('1-ingredient-name-and-measure');
    const ingredient2 = await screen.findByTestId('2-ingredient-name-and-measure');
    const instructions = await screen.findByTestId('instructions');

    expect(image).toHaveProperty('src', oneDrink.drinks[0].strDrinkThumb);
    expect(title).toHaveTextContent(oneDrink.drinks[0].strDrink);
    expect(category).toHaveTextContent(oneDrink.drinks[0].strAlcoholic);
    expect(ingredient0).toHaveTextContent(/Hpnotiq/i);
    expect(ingredient1).toHaveTextContent(/Pineapple Juice/i);
    expect(ingredient2).toHaveTextContent(/Banana Liqueur/i);
    expect(instructions).toHaveTextContent(oneDrink.drinks[0].strInstructions);
  });
});
