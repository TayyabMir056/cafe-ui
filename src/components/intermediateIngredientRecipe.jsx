import React, { Component } from "react";
import EdiText from "react-editext";

class IntermediateIngredientRecipe extends Component {
  state = {
    data: {
      intermediateIngredient: null,
      recipe: []
    },
    cost: null
  };

  setData = () => {
    //console.log();
    fetch(
      process.env.REACT_APP_API +
        "/intermediate-ingredient-recipe/" +
        this.props.id
    )
      .then(res => res.json())
      .then(
        result => {
          console.log(result);
          this.setState({
            isLoaded: true,
            data: result
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
      .then(() => {
        this.calculateCost();
      })
      .then(() => {
        console.log("state", this.state);
      });
  };

  calculateCost = () => {
    var _cost = 0;
    console.log("recipe", this.state.data.recipe);
    this.state.data.recipe.forEach(item => {
      _cost = _cost + item.quantity * item.inventoryIngredient_cost;
      console.log(item.quantity * item.inventoryIngredient_cost);
    });
    this.setState({
      cost: _cost
    });
  };

  componentDidMount() {
    this.setData();
  }
  render() {
    return (
      <div>
        <span>
          <strong>Name: </strong>
          {this.props.name}
        </span>
        <span>
          <strong>Total Cost: </strong>
          {this.state.cost}
        </span>
        <ul className="list-group">
          {this.state.data.recipe.map(recipeItem => (
            <li key={recipeItem.id}>
              <p>
                <strong>Inventory item:</strong>{" "}
                {recipeItem.inventoryIngredient_name}
              </p>
              <p>
                <strong>inventory Item Cost:</strong>{" "}
                {recipeItem.inventoryIngredient_cost}
              </p>
              <p>
                <strong>Quantity:</strong>
                <EdiText
                  type="number"
                  value={recipeItem.quantity}
                  onSave={val => this.props.onEdit(this.props.id, val, "cost")}
                />
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default IntermediateIngredientRecipe;
