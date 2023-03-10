import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../components/Header';
import renderWithRouterAndRedux from './renderWithRouterAndRedux';

const searchButtonTestId = 'search-top-btn';
const route = '/foods';

describe('Testa o componente Header e suas funcionalidades', () => {
  it('Verifica a existĂȘncia do header', () => {
    renderWithRouterAndRedux(<Header title="Teste" showSearchIcon />, {}, route);
    const header = screen.getByTestId('header');
    expect(header).toBeInTheDocument();
  });
  it('Verifica searchButton (com showSearchIcon false)', () => {
    renderWithRouterAndRedux(
      <Header title="Teste" showSearchIcon={ false } />, {}, '/profile',
    );
    const searchButton = screen.queryByTestId(searchButtonTestId);
    expect(searchButton).not.toBeInTheDocument();
  });
  it('Verifica searchButton (com showSearchIcon true)', () => {
    renderWithRouterAndRedux(
      <Header title="Teste" showSearchIcon />, {}, route,
    );
    const searchButton = screen.queryByTestId(searchButtonTestId);
    expect(searchButton).toBeInTheDocument();
  });
  it('Verifica profileButton', () => {
    const { history } = renderWithRouterAndRedux(

      <Header title="Teste" showSearchIcon />,
      {},
      route,

    );

    const profileButton = screen.getByTestId('profile-top-btn');

    userEvent.click(profileButton);
    const { pathname } = history.location;
    expect(pathname).toBe('/profile');
  });
  it('Verifica o toggle do input', () => {
    renderWithRouterAndRedux(

      <Header title="Teste" showSearchIcon />,
      {},
      route,

    );

    const searchButton = screen.getByTestId(searchButtonTestId);
    userEvent.click(searchButton);
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
    userEvent.click(searchButton);
    expect(searchInput).not.toBeInTheDocument();
  });
});
