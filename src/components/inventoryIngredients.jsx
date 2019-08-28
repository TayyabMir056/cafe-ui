/*
Component: InventoryIngredients
Description: The list of inventory ingredients that are used in menu item recipe and intermediate ingredient recipe
Sub-component: InventoryIngredient (Loads as a card in the card-deck. )
Examples: Sugar, cream, flour
*/

import React, { Component } from "react";
import InventoryIngredient from "./inventoryIngredient";
import Select from "react-select";

class InventoryIngredients extends Component {
  state = {
    error: null,
    data: [],
    priceUnits: [],
    formData: {
      name: null,
      cost: null,
      priceUnit: null
    }
  };

  //setData():
  //Triggers when the component is mounted or whenever there is a change in the data
  //Functionality: fetches all the updated inventoryIngredients from the API  and updates the state
  setData = () => {
    //console.log();
    fetch(process.env.REACT_APP_API + "/inventory-ingredient")
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
        console.log("state", this.state);
      });
  };

  //setPriceUnits():
  //Triggered when the component is mounted
  //Functionality: fetches all price units from the API and adds in the state.priceUnits[] to be provided to the dropdown options
  setPriceUnits = () => {
    fetch(process.env.REACT_APP_API + "/units")
      .then(res => res.json())
      .then(
        result => {
          var _priceUnits = [];
          result.forEach(unit => {
            _priceUnits.push({ value: unit.id, label: unit.name });
          });

          this.setState({
            isLoaded: true,
            priceUnits: _priceUnits
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
        console.log("state", this.state);
      });
  };

  //handleEdit():
  //Triggered when an item is edited
  //Functionality: Updates the inventory ingredient using PUT API and updates the state
  //Input:id: inventory ingredient id to be edited
  //      editValue: the key of the item that is edited e.g. name, price Unit
  //      data: the updated data corresponding to the editValue Key

  handleEdit = (id, data, editValue) => {
    fetch(process.env.REACT_APP_API + "/inventory-ingredient/" + id, {
      method: "PUT",
      body: JSON.stringify({
        [editValue]: data
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(() => {
      this.setData();
    });
  };

  //handleDelete():
  //Triggered when an item is deleted from the list
  //Input: category id (uuid) to be deleted
  //Functionality: Delete the item from the Backend API and update the state
  handleDelete = id => {
    fetch(process.env.REACT_APP_API + "/inventory-ingredient/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(() => {
      this.setData();
    });
  };

  //handleFormChange():
  //Triggered whenever a value is entered in the form to add new inventory ingredient
  //Functionality: Takes the values from the form and updates corresponding value in state.formData
  //inputs: key: the form item whose value is entered e.g name,cost,priceunit
  //        value: the value to the corresponding key
  handleFormChange = (key, value) => {
    this.setState(
      {
        formData: {
          name: key === "name" ? value : this.state.formData.name,
          cost: key === "cost" ? value : this.state.formData.cost,
          priceUnit: key === "priceUnit" ? value : this.state.formData.priceUnit
        }
      },
      () => {
        console.log("state:", this.state);
      }
    );
  };

  //handleAddNew():
  //Triggered when the form is "submitted" i.e. when a new item is added
  //Functionality:Adds a new inventory ingredient in the database using POST request of Backend API
  // Also updates the state.data and add the newly added value to the state.
  handleAddNew = event => {
    fetch(process.env.REACT_APP_API + "/inventory-ingredient", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.formData)
    })
      .then(res => res.json())
      .then(result => {
        if (result.id) {
          this.setData();
        } else {
          alert("Warning: " + result.message);
        }
      });
    event.preventDefault();
  };

  componentDidMount() {
    this.setData();
    this.setPriceUnits();
  }

  render() {
    return (
      <div>
        {/* New Form */}
        <form onSubmit={this.handleAddNew}>
          <div className="form-group">
            <label for="formInputName">Name:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              required
              onChange={event => {
                this.handleFormChange("name", event.target.value);
              }}
            />
          </div>

          <label>Cost: (In Rs./)</label>
          <input
            type="number"
            className="form-control"
            placeholder="Cost"
            required
            onChange={event => {
              this.handleFormChange("cost", event.target.value);
            }}
          />

          <label>Per:</label>
          <Select
            options={this.state.priceUnits}
            onChange={val =>
              this.handleFormChange("priceUnit", { id: val.value })
            }
          />

          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>
        <span />

        <ul className="list-group">
          <div className="card-deck">
            {this.state.data.map(inventoryIngredient => (
              <li key={inventoryIngredient.id}>
                <InventoryIngredient
                  data={inventoryIngredient}
                  priceUnits={this.state.priceUnits}
                  onEdit={this.handleEdit}
                  onDelete={this.handleDelete}
                  setParentData={this.setData}
                />
              </li>
            ))}
          </div>
        </ul>
      </div>
    );
  }
}

export default InventoryIngredients;
