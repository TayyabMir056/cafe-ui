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
        <form
          onSubmit={
            this.state.formData.name &&
            this.state.formData.cost &&
            this.state.formData.priceUnit
              ? () => this.handleAddNew
              : () => alert("Some Missing Data")
          }
        >
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
          {this.state.data.map(inventoryIngredient => (
            <li key={inventoryIngredient.id}>
              <InventoryIngredient
                data={inventoryIngredient}
                priceUnits={this.state.priceUnits}
                onEdit={this.handleEdit}
                onDelete={this.handleDelete}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default InventoryIngredients;
