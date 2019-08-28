/*
Component: IntermediateIngredientRecipe
Description: The recipe of an intermediate Ingredient i.e. the inventory ingredients and their quantity used
Parent-component: Intermediate Ingredient (Loads this component when "Edit Recipe" is clicked)
Examples: Sponge=> 0.25kg sugar, 100mg cream
*/

import React, { Component } from "react";
import EdiText from "react-editext";
import Select from "react-select";

class IntermediateIngredientRecipe extends Component {
  state = {
    data: {
      intermediateIngredient: null,
      recipe: []
    },
    inventoryIngredients: [],
    cost: null,
    formData: {
      inventoryIngredient: null,
      quantity: null
    }
  };

  //setData()
  //Triggers when the component is mounted or whenever there is a change in the data
  //Functionality: fetches the updated recipe of particular intermediate ingredient  and updates the state
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

  //setInventoryIngredients()
  //Triggered when the component is mounted
  //Functionality: fetches all InventoryIngredients from the API and adds in the state.InventoryIngredients[] to be provided to the dropdown options
  setInventoryIngredients = () => {
    var checkInventoryIngExists = inventoryIngredient_id =>
      this.state.data.recipe.some(
        ({ inventoryIngredient }) =>
          inventoryIngredient.id === inventoryIngredient_id
      );

    fetch(process.env.REACT_APP_API + "/inventory-ingredient")
      .then(res => res.json())
      .then(
        result => {
          var _inventoryIngredients = [];
          result.forEach(inventoryIngredient => {
            if (!checkInventoryIngExists(inventoryIngredient.id)) {
              _inventoryIngredients.push({
                value: inventoryIngredient.id,
                label:
                  inventoryIngredient.name +
                  " (Rs. " +
                  inventoryIngredient.cost +
                  "/- per " +
                  inventoryIngredient.priceUnit.name +
                  ")"
              });
            }
          });

          this.setState({
            isLoaded: true,
            inventoryIngredients: _inventoryIngredients
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  };

  //calculateCost()
  //Triggered when whenever a recipe item is added, deleted or updated
  //Functionality: Updates the cost of the intermediate ingredient according to the updated recipe
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

  //handleFormChange():
  //Triggered whenever a value is entered in the form to add new recipe item
  //Functionality: Takes the values from the form and updates corresponding value in state.formData
  //inputs: key: the form item whose value is entered e.g inventory Ingredient, quantity
  //        value: the value to the corresponding key
  handleFormChange = (key, value) => {
    this.setState(
      {
        formData: {
          inventoryIngredient:
            key === "inventoryIngredient"
              ? value
              : this.state.formData.inventoryIngredient,
          quantity: key === "quantity" ? value : +this.state.formData.quantity
        }
      },
      () => {
        console.log("state:", this.state);
      }
    );
  };

  //handleEdit():
  //Triggered when an item is edited
  //Functionality: Updates the intermediate ingredient recipe using PUT API and updates the state
  //Input:inventoryId: inventory ingredient id to be edited
  //      val: the updated quantity of the inventory ingredient in the recipe
  handleEdit = (inventoryId, val) => {
    console.log(this.state);
    fetch(
      process.env.REACT_APP_API +
        "/intermediate-ingredient-recipe/" +
        this.state.data.intermediateIngredient,
      {
        method: "PUT",
        body: JSON.stringify({
          intermediateIngredient: {
            id: this.state.data.intermediateIngredient
          },
          recipe: [{ inventoryIngredient: { id: inventoryId }, quantity: +val }]
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(() => {
        this.calculateCost();
      })
      .then(() => {
        this.setData();
        this.props.setParentData();
      });
  };

  //handleDelete()
  //Triggered when an item is deleted from the list
  //Input: category id (uuid) to be deleted
  //Functionality: Delete the item from the Backend API and update the state
  handleDelete = id => {
    fetch(process.env.REACT_APP_API + "/intermediate-ingredient-recipe/" + id, {
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

  //handleAddNew():
  //Triggered when the form is "submitted" i.e. when a new item is added
  //Functionality:Adds a new inventory ingredient item in the intermediate ingredient recipe in the database using POST request of Backend API
  // Also updates the state.data and add the newly added value to the state.
  handleAddNew = event => {
    const addData = {
      intermediateIngredient: { id: this.state.data.intermediateIngredient },
      recipe: [this.state.formData]
    };
    fetch(process.env.REACT_APP_API + "/intermediate-ingredient-recipe", {
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

  componentDidMount() {
    this.setData();
    this.setInventoryIngredients();
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleAddNew}>
          <label>InventoryItem</label>
          <Select
            options={this.state.inventoryIngredients}
            onChange={val =>
              this.handleFormChange("inventoryIngredient", { id: val.value })
            }
          />
          <label>Quantity:</label>
          <input
            type="number"
            className="form-control"
            placeholder="quantity"
            required
            onChange={event => {
              this.handleFormChange("quantity", +event.target.value);
            }}
          />
          <button type="submit" className="btn btn-success">
            Add
          </button>
        </form>

        <ul className="list-group">
          <li className="list-group-item list-group-item-info">
            <span>
              <strong>Name: </strong>
              {this.props.name}
            </span>
            <span>
              <strong>Total Cost: </strong>
              {this.state.cost}
            </span>
          </li>
          {this.state.data.recipe.map(recipeItem => (
            <li className="list-group-item" key={recipeItem.id}>
              <div className="card">
                <p>
                  <strong>Inventory item:</strong>{" "}
                  {recipeItem.inventoryIngredient_name}
                </p>
                <p>
                  <strong>inventory Item Cost:</strong>{" "}
                  {recipeItem.inventoryIngredient_cost}
                </p>
                <button
                  onClick={() => this.handleDelete(recipeItem.id)}
                  type="button"
                  className="btn btn-danger"
                >
                  X
                </button>
                <strong>Quantity:</strong>
                <EdiText
                  type="number"
                  value={recipeItem.quantity}
                  onSave={val =>
                    this.handleEdit(recipeItem.inventoryIngredient, val)
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default IntermediateIngredientRecipe;
