import React, { Component } from "react";
import IntermediateIngredient from "./intermediateIngredient";
import Select from "react-select";

class IntermediateIngredients extends Component {
  state = {
    error: null,
    data: [],
    priceUnits: [],
    formData: {
      name: null,
      priceUnit: null
    }
  };
  setData = () => {
    //console.log();
    fetch(process.env.REACT_APP_API + "/intermediate-ingredient")
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
    fetch(process.env.REACT_APP_API + "/intermediate-ingredient/" + id, {
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
    fetch(process.env.REACT_APP_API + "/intermediate-ingredient/" + id, {
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
          priceUnit: key === "priceUnit" ? value : this.state.formData.priceUnit
        }
      },
      () => {
        console.log("state:", this.state);
      }
    );
  };

  handleAddNew = event => {
    if (this.state.formData.name && this.state.formData.priceUnit) {
      console.log("handle Addd New Called");
      fetch(process.env.REACT_APP_API + "/intermediate-ingredient", {
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
    } else {
      alert("Some data missing!");
    }
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
            <label>Name:</label>
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
          <label>Price Unit:</label>
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
        <ul className="list-group">
          {this.state.data.map(intermediateItem => (
            <li key={intermediateItem.id}>
              <IntermediateIngredient
                data={intermediateItem}
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

export default IntermediateIngredients;
