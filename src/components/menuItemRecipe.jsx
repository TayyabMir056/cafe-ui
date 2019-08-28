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

  //calculateCost()
  //Triggered when whenever a recipe item is added, deleted or updated
  //Functionality: Updates the cost of the Menu Item according to the updated recipe
  calculateCost = () => {
    var _cost = 0;
    this.state.data.recipe.forEach(item => {
      _cost = _cost + item.quantity * item.ingredientCost;
    });
    this.setState({
      cost: _cost
    });
  };

  //setData():
  //Triggers when the component is mounted or whenever there is a change in the data
  //Functionality: fetches the updated recipe of particular menu item and updates the state
  setData = () => {
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

  //setIngredients():
  //Triggered when the component is mounted
  //Functionality: fetches all ingredients (both inventory and intermediate)  from the API and adds in the state.Ingredients[] to be provided to the dropdown options
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

  //handleEdit():
  //Triggered when an item is edited
  //Functionality: Updates the Menu item recipe using PUT API and updates the state
  //Input:ingredientId: ingredient id to update edited
  //      ingredientType: Enum(Inventory or Ingredient)
  //      quantity: updated quantity
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
      })
      .then(() => {
        this.props.setParentData();
      });
  };

  //handleFormChange():
  //Triggered whenever a value is entered in the form to add new recipe item
  //Functionality: Takes the values from the form and updates corresponding value in state.formData
  //inputs: key: the form item whose value is entered e.g inventory Ingredient, quantity
  //        type: type of ingredient (if key is ingredient ) e.g. inventory or ingredient
  //        value: the value to the corresponding key
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

  //handleAddNew():
  //Triggered when the form is "submitted" i.e. when a new item is added
  //Functionality:Adds a new  ingredient item in the Menu recipe in the database using POST request of Backend API
  // Also updates the state.data and add the newly added value to the state.
  handleAddNew = event => {
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
        this.props.setParentData();
      })
      .catch(e => {
        alert("Error: " + e.message);
      });
    event.preventDefault();
  };

  //handleDelete()
  //Triggered when an item is deleted from the list
  //Input: category id (uuid) to be deleted
  //Functionality: Delete the item from the Backend API and update the state
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
      this.props.setParentData();
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

        <ul className="list-group">
          <li className="list-group-item list-group-item-info">
            <label>
              <strong>Name:</strong>{" "}
            </label>
            <span>{this.props.name}</span>
            <label>
              <strong>Cost:</strong>
            </label>
            <span>{this.state.cost}</span>
          </li>
          {this.state.data.recipe.map(recipeItem => (
            <li className="list-group-item" key={recipeItem.id}>
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
