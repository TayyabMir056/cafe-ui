import React, { Component } from "react";
import EdiText from "react-editext";
import Select from "react-select";

//Enum
var IngredientType = { Inventory: 1, Intermediate: 2 };
Object.freeze(IngredientType);

class MenuItemRecipe extends Component {
  state = {
    data: {
      menuItem: null,
      recipe: []
    },
    ingredients: [],
    cost: null,
    formData: {
      inventoryIngredient: null,
      intermediateIngredient: null,
      ingredientType: null,
      quantity: null
    }
  };

  calculateCost = () => {
    console.log("Calulcating Cost");
    var _cost = 0;
    console.log("recipe", this.state.data.recipe);
    this.state.data.recipe.forEach(item => {
      _cost = _cost + item.quantity * item.ingredientCost;
      console.log("item", item);
    });
    this.setState({
      cost: _cost
    });
  };
  setData = () => {
    //console.log();
    fetch(process.env.REACT_APP_API + "/menu-item-recipe/" + this.props.id)
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

  setIngredients = () => {
    var _ingredients = [];

    fetch(process.env.REACT_APP_API + "/inventory-ingredient")
      .then(res => res.json())
      .then(result => {
        result.forEach(inventoryIngredient => {
          _ingredients.push({
            value: inventoryIngredient.id,
            label:
              "Inventory - " +
              inventoryIngredient.name +
              " (Rs. " +
              inventoryIngredient.cost +
              "/- per " +
              inventoryIngredient.priceUnit.name +
              ")",
            type: IngredientType.Inventory
          });
        });
      })
      .then(() => {
        fetch(process.env.REACT_APP_API + "/intermediate-ingredient")
          .then(res => res.json())
          .then(result => {
            result.forEach(intermediateIngredient => {
              _ingredients.push({
                value: intermediateIngredient.id,
                label:
                  "Intermediate - " +
                  intermediateIngredient.name +
                  " (Rs. " +
                  intermediateIngredient.cost +
                  "/- per " +
                  intermediateIngredient.priceUnit.name +
                  ")",
                type: IngredientType.Intermediate
              });
            });
          })
          .then(() => {
            this.setState({
              isLoaded: true,
              ingredients: _ingredients
            });
          });
      });
  };

  handleEdit = (ingredientId, ingredientType, quantity) => {
    console.log(this.state);
    fetch(process.env.REACT_APP_API + "/menu-item-recipe", {
      method: "PUT",
      body: JSON.stringify({
        menuItem: {
          id: this.state.data.menuItem.id
        },
        recipe: [
          {
            inventoryIngredient:
              ingredientType === IngredientType.Inventory
                ? { id: ingredientId }
                : null,
            intermediateIngredient:
              ingredientType === IngredientType.Intermediate
                ? { id: ingredientId }
                : null,
            ingredientType: ingredientType,
            quantity: +quantity
          }
        ]
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(() => {
        this.calculateCost();
      })
      .then(() => {
        this.setData();
      });
  };

  handleFormChange = (key, type, value) => {
    this.setState(
      {
        formData: {
          inventoryIngredient:
            key === "ingredient" && type === IngredientType.Inventory
              ? value
              : key === "ingredient"
              ? null
              : this.state.formData.inventoryIngredient,
          intermediateIngredient:
            key === "ingredient" && type === IngredientType.Intermediate
              ? value
              : key === "ingredient"
              ? null
              : this.state.formData.intermediateIngredient,

          ingredientType:
            key === "quantity" ? this.state.formData.ingredientType : type,
          quantity: key === "quantity" ? value : +this.state.formData.quantity
        }
      },
      () => {
        console.log("state:", this.state);
      }
    );
  };

  handleAddNew = event => {
    if (
      !(
        (this.state.formData.intermediateIngredient ||
          this.state.formData.inventoryIngredient) &&
        this.state.formData.ingredientType &&
        this.state.formData.quantity
      )
    )
      alert("Missing some data!");
    else {
      const addData = {
        menuItem: this.state.data.menuItem,
        recipe: [this.state.formData]
      };
      fetch(process.env.REACT_APP_API + "/menu-item-recipe", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(addData)
      })
        .then(res => res.json())
        .then(() => {
          this.setData();
          this.calculateCost();
        })
        .catch(e => {
          alert("Error: " + e.message);
        });
      event.preventDefault();
    }
  };

  handleDelete = id => {
    fetch(process.env.REACT_APP_API + "/menu-item-recipe/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(() => {
      this.setData();
      this.calculateCost();
    });
  };

  componentDidMount() {
    this.setIngredients();
    this.setData();
    this.calculateCost();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleAddNew}>
          <label> Ingredient: </label>
          <Select
            options={this.state.ingredients}
            onChange={val =>
              this.handleFormChange("ingredient", val.type, { id: val.value })
            }
          />

          <label>Quantity:</label>
          <input
            type="number"
            className="form-control"
            placeholder="quantity"
            required
            onChange={event => {
              this.handleFormChange("quantity", null, +event.target.value);
            }}
          />
          <button type="submit" className="btn btn-success">
            Add
          </button>
        </form>
        <label>
          <strong>Name:</strong>{" "}
        </label>
        <span>{this.props.name}</span>
        <label>
          <strong>Cost:</strong>
        </label>
        <span>{this.state.cost}</span>
        <ul className="list-group">
          {this.state.data.recipe.map(recipeItem => (
            <li key={recipeItem.id}>
              <p>
                <strong>
                  {recipeItem.ingredientName +
                    " (Rs. " +
                    recipeItem.ingredientCost +
                    " /-)"}
                </strong>
                >
              </p>

              <strong>Quantity:</strong>
              <EdiText
                type="number"
                value={recipeItem.quantity}
                onSave={val =>
                  this.handleEdit(
                    recipeItem.ingredient,
                    recipeItem.ingredientType === "Inventory Ingredient"
                      ? IngredientType.Inventory
                      : IngredientType.Intermediate,
                    val
                  )
                }
              />
              <button
                onClick={() => this.handleDelete(recipeItem.id)}
                type="button"
                className="btn btn-danger"
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default MenuItemRecipe;
