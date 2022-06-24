import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { fetchDrinks, fetchFoods } from '../helpers/fetchRecipesAPI';
import '../style/RecipesDetail.css';
import RecommendationCard from '../components/RecommendationCard';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import useFavorite from '../customHooks/useFavorite';
import
removeRecipeFromLocalStorage
from '../reusable_functions/removeRecipeFromLocalStorage';

const FoodDetail = () => {
  // const storage = JSON.parse(localStorage.getItem('favoriteRecipes'));
  const history = useHistory();
  const [recipe, setRecipe] = useState({ ingredientsAndMeasures: [] });
  const [recommendations, setRecommendations] = useState([]);
  const [copy, setCopy] = useState(false);
  const [favorite, setFavorite] = useState(false);
  // const [foodsInStorage, setFoodsInStorage] = useState(storage || []);

  useFavorite(history, setFavorite);

  const loadsRecommendations = async () => {
    const numberOfRecommendations = 5;
    const recommendationsData = await fetchDrinks('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
    const usableRecommendations = recommendationsData
      .filter((r, index) => index <= numberOfRecommendations);
    setRecommendations(usableRecommendations);
  };

  useEffect(() => {
    const id = history.location.pathname.split('/')[2];
    const fetchRecipe = async () => {
      const recipeData = await fetchFoods(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      loadsRecommendations();
      const entries = Object.entries(recipeData[0]);
      const ingredients = entries
        .filter((item) => JSON.stringify(item).includes('strIngredient'))
        .filter((ingredient) => ingredient[1] !== '');
      const measures = entries
        .filter((item) => JSON.stringify(item).includes('strMeasure'))
        .filter((measure) => measure[1] !== ' ');
      const ingredientsAndMeasures = ingredients
        .map((ingredient, index) => `${ingredient[1]} - ${measures[index][1]}`);
      setRecipe({ ...recipeData[0], ingredientsAndMeasures });
    };
    fetchRecipe();
  }, [history]);

  const copyRecipeToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopy(true);
  };

  const favoriteRecipe = () => {
    const storagedFood = [{
      id: recipe.idMeal,
      type: 'food',
      nationality: recipe.strArea,
      category: recipe.strCategory,
      alcoholicOrNot: '',
      name: recipe.strMeal,
      image: recipe.strMealThumb,
    }];
    // setFoodsInStorage(foodsInStorage.concat(storagedFood));
    localStorage.setItem('favoriteRecipes', JSON.stringify(storagedFood));
    setFavorite(true);
  };

  const removeOfLocalStorage = () => {
    removeRecipeFromLocalStorage(history, setFavorite);
  };

  // useEffect(() => {
  //   localStorage.setItem('favoriteRecipes', JSON.stringify(foodsInStorage));
  // }, [foodsInStorage]);

  return (
    <section>
      {favorite && (
        <button
          type="button"
          src={ blackHeartIcon }
          alt="favorite"
          data-testid="favorite-btn"
          style={ { display: 'block' } }
          onClick={ removeOfLocalStorage }
        >
          <img
            src={ blackHeartIcon }
            alt="favorite"
          />
        </button>
      )}

      {!favorite && (
        <button
          type="button"
          src={ whiteHeartIcon }
          alt="non-favorite"
          data-testid="favorite-btn"
          style={ { display: 'block' } }
          onClick={ favoriteRecipe }
        >
          <img
            src={ whiteHeartIcon }
            alt="non-favorite"
          />
        </button>
      )}

      <img
        src={ recipe.strMealThumb }
        alt={ recipe.strMeal }
        data-testid="recipe-photo"
      />
      <h1 data-testid="recipe-title">{ recipe.strMeal }</h1>
      <h3 data-testid="recipe-category">{ recipe.strCategory }</h3>

      <button
        type="button"
        data-testid="share-btn"
        onClick={ copyRecipeToClipboard }
      >
        Compartilhar Receita
      </button>

      <button
        type="button"
        // data-testid="favorite-btn"
        // onClick={ favoriteRecipe }
      >
        Favoritar Receita
      </button>

      {copy && <p style={ { color: 'green' } }>Link copied!</p>}

      <ul>
        <h3>Ingredients</h3>
        {recipe.ingredientsAndMeasures
          .map((i, index) => (
            <li
              key={ index }
              data-testid={ `${index}-ingredient-name-and-measure` }
            >
              { i }
            </li>
          ))}
      </ul>
      <p data-testid="instructions">{ recipe.strInstructions }</p>
      <video
        src={ recipe.strYoutube }
        controls
        data-testid="video"
      >
        <track default kind="captions" />
      </video>
      <div>
        {recommendations.map(({ idDrink, strDrink, strDrinkThumb }, index) => (
          <RecommendationCard
            key={ idDrink }
            id={ idDrink }
            index={ index }
            recommendationName={ strDrink }
            recommendationImage={ strDrinkThumb }
            endPoint="drinks"
          />
        ))}
      </div>
    </section>
  );
};
export default FoodDetail;
