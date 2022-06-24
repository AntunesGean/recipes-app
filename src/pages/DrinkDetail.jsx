import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import RecommendationCard from '../components/RecommendationCard';
import { fetchDrinks, fetchFoods } from '../helpers/fetchRecipesAPI';
import '../style/RecipesDetail.css';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import shareIcon from '../images/shareIcon.svg';
import useFavorite from '../customHooks/useFavorite';
import
removeRecipeFromLocalStorage
from '../reusable_functions/removeRecipeFromLocalStorage';

const DrinkDetail = () => {
  // const storage = JSON.parse(localStorage.getItem('favoriteRecipes'));  // ------ NÃO APAGAR!!!
  const history = useHistory();
  const [recipe, setRecipe] = useState({
    ingredientsAndMeasures: [] });
  const [recommendations, setRecommendations] = useState([]);
  const [copy, setCopy] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [done, setDone] = useState(false);
  const [startedFood, setStartedFood] = useState(false);
  // const [foodsInStorage, setFoodsInStorage] = useState(storage || []);  // ------ NÃO APAGAR!!!

  useFavorite(history, setFavorite);

  const loadsRecommendations = async () => {
    const numberOfRecommendations = 5;
    const recommendationsData = await fetchFoods('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const usableRecommendations = recommendationsData
      .filter((r, index) => index <= numberOfRecommendations);
    setRecommendations(usableRecommendations);
  };

  useEffect(() => {
    const id = history.location.pathname.split('/')[2];
    const fetchRecipe = async () => {
      const recipeData = await fetchDrinks(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
      loadsRecommendations();
      const entries = Object.entries(recipeData[0]);
      const ingredients = entries
        .filter((item) => JSON.stringify(item).includes('strIngredient'))
        .filter((ingredient) => ingredient[1] !== null);
      const measures = entries
        .filter((item) => JSON.stringify(item).includes('strMeasure'))
        .filter((measure) => measure[1] !== null);
      const ingredientsAndMeasures = ingredients
        .map((ingredient, index) => {
          if (measures[index]) {
            return `${ingredient[1]} - ${measures[index][1]}`;
          } return `${ingredient[1]}`;
        });
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
      id: recipe.idDrink,
      type: 'drink',
      nationality: '',
      category: recipe.strCategory,
      alcoholicOrNot: recipe.strAlcoholic,
      name: recipe.strDrink,
      image: recipe.strDrinkThumb,
    }];
    // setFoodsInStorage(foodsInStorage.concat(storagedFood));  // ------ NÃO APAGAR!!!!
    localStorage.setItem('favoriteRecipes', JSON.stringify(storagedFood));
    setFavorite(true);
  };

  const removeOfLocalStorage = () => {
    removeRecipeFromLocalStorage(history, setFavorite);
  };

  useEffect(() => {
    const storage = JSON.parse(localStorage.getItem('doneRecipes'));
    if (storage) return setDone(true);
    const storageStarted = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (storageStarted) return setStartedFood(true);
  },
  [history]);

  const startedRecipe = () => {
    const startedFoodStorage = {
      cocktails: {
        id: ['lista de ingredientes utilizados'],
        // ...
      },
      meals: {
        id: ['lista de ingredientes utilizados'],
        // ...
      },
    };
    localStorage.setItem('inProgressRecipes', JSON.stringify(startedFoodStorage));
    setStartedFood(true);
  };

  // useEffect(() => {
  //   localStorage.setItem('favoriteRecipes', JSON.stringify(foodsInStorage)); // ------ NÃO APAGAR!!!!
  // }, [foodsInStorage]);

  return (
    <section>
      <img
        src={ recipe.strDrinkThumb }
        alt={ recipe.strDrink }
        data-testid="recipe-photo"
        className="detail_img_recipe"
      />
      <div className="detail_recipe">
        <h1 data-testid="recipe-title">{ recipe.strDrink }</h1>
        <h3 data-testid="recipe-category">{ recipe.strAlcoholic }</h3>
        {favorite ? (
          <input
            type="image"
            src={ blackHeartIcon }
            alt="favorite"
            data-testid="favorite-btn"
            style={ { display: 'block' } }
            onClick={ removeOfLocalStorage }
          />
        ) : (
          <input
            type="image"
            src={ whiteHeartIcon }
            alt="non-favorite"
            data-testid="favorite-btn"
            style={ { display: 'block' } }
            onClick={ favoriteRecipe }
          />
        )}
        <input
          type="image"
          src={ shareIcon }
          alt="share"
          data-testid="share-btn"
          onClick={ copyRecipeToClipboard }
        />

        {copy && <p style={ { color: 'green' } }>Link copied!</p>}

        <h3>Ingredients</h3>
        <ul>
          {recipe.ingredientsAndMeasures
            .map((i, index) => (
              <li
                key={ i }
                data-testid={ `${index}-ingredient-name-and-measure` }
              >
                { i }
              </li>
            ))}
        </ul>
        <h3>Instructions</h3>
        <p data-testid="instructions">{ recipe.strInstructions }</p>
        <h3>Recommended</h3>
        <div className="container_recommendations">
          {recommendations
            .map(({ idMeal, strMeal, strMealThumb, strCategory }, index) => (
              <RecommendationCard
                key={ idMeal }
                id={ idMeal }
                index={ index }
                recommendationType={ strCategory }
                recommendationName={ strMeal }
                recommendationImage={ strMealThumb }
                endPoint="foods"
              />
            ))}
          {console.log(recommendations)}
        </div>
        {!done && (
          <button
            className="startRecipeButton"
            type="button"
            data-testid="start-recipe-btn"
            onClick={ () => {
              const id = history.location.pathname.split('/')[2];
              history.push(`/foods/${id}/in-progress`);
              startedRecipe();
            } }
          >
            {startedFood ? 'Continue Recipe' : 'Start Recipe'}
          </button>
        )}
      </div>
    </section>
  );
};
export default DrinkDetail;
