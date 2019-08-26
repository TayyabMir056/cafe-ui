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
      });
  };

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
    });
  };

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
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default IntermediateIngredientRecipe;
