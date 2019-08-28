/*
Component: MenuItems
Description: The List of all MenuItems
Sub-components: MenuItem (imported as a card)
Examples: Chocolate Cake, Cheese cake
*/

import React, { Component } from "react";
import MenuItem from "./MenuItem";
import Select from "react-select";

class MenuItems extends Component {
  state = {
    error: null,
    data: [],
    categories: [],
    formData: {
      name: null,
      category: null,
      sellingPrice: null
    }
  };

  //handleFormChange():
  //Triggered whenever a value is entered in the "Add new Menu item" form
  //Functionality: Takes the values from the form and updates corresponding value in state.formData
  //inputs: key: the form item whose value is entered e.g name, category
  //        value: the value to the corresponding key
  handleFormChange = (key, value) => {
    console.log("key", key, key === "name");
    this.setState(
      {
        formData: {
          name: key === "name" ? value : this.state.formData.name,
          category: key === "category" ? value : this.state.formData.category,
          sellingPrice:
            key === "sellingPrice" ? value : this.state.formData.sellingPrice
        }
      },
      () => {
        console.log("state:", this.state);
      }
    );
  };

  //handleEdit():
  //Triggered when an item is edited
  //Functionality: Updates the Menu Item using PUT API and updates the state
  //Input:id: Menu item id to be edited
  //      editValue: the key of the item that is edited e.g. name, price category
  //      data: the updated data corresponding to the editValue Key
  handleEdit = (id, data, editValue) => {
    fetch(process.env.REACT_APP_API + "/menu-item/" + id, {
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

  //setData()
  //Triggers when the component is mounted or whenever there is a change in the data
  //Functionality: fetches all (updated) Menu items and updates the state
  setData = () => {
    //console.log();
    fetch(process.env.REACT_APP_API + "/menu-item")
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
      );
    console.log(this.state);
  };

  //setCategories()
  //Triggered when the component is mounted
  //Functionality: fetches all Categies from the API and adds in the state.Categories[] to be provided to the dropdown options
  setCategories = () => {
    fetch(process.env.REACT_APP_API + "/categories")
      .then(res => res.json())
      .then(
        result => {
          var _categories = [];
          result.forEach(cat => {
            _categories.push({ value: cat.id, label: cat.name });
          });

          this.setState({
            isLoaded: true,
            categories: _categories
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

  //handleAddNew():
  //Triggered when the form is "submitted" i.e. when a new item is added
  //Functionality:Adds a new Menu item in the database using POST request of Backend API
  // Also updates the state.data and add the newly added value to the state.
  handleAddNew = event => {
    if (
      this.state.formData.name &&
      this.state.formData.category &&
      this.state.formData.sellingPrice
    ) {
      fetch(process.env.REACT_APP_API + "/menu-item", {
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
      alert("Missing some values");
    }
  };

  //handleDelete()
  //Triggered when an item is deleted from the list
  //Input: category id (uuid) to be deleted
  //Functionality: Delete the item from the Backend API and update the state
  handleDelete = id => {
    fetch(process.env.REACT_APP_API + "/menu-item/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(() => {
      this.setData();
    });
  };

  componentDidMount() {
    this.setData();
    this.setCategories();
  }
  render() {
    return (
      <div>
        {/* New Form */}

        <div className="card">
          <div className="card-header">Add New Menu Item</div>
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
            <label>Category:</label>
            <Select
              options={this.state.categories}
              onChange={val =>
                this.handleFormChange("category", { id: val.value })
              }
            />
            <label>Selling Price:</label>
            <input
              type="number"
              className="form-control"
              placeholder="Selling Price"
              required
              onChange={event => {
                this.handleFormChange("sellingPrice", event.target.value);
              }}
            />
            <p>
              <strong>cost:</strong> Will be calculated when recipe is added
            </p>
            <button type="submit" className="btn btn-success">
              Add
            </button>
          </form>
        </div>
        <h3>Menu Items</h3>
        <div className="card-deck">
          {this.state.data.map(menuItem => (
            <div className="col-sm-4">
              <MenuItem
                data={menuItem}
                categories={this.state.categories}
                onEdit={this.handleEdit}
                onDelete={this.handleDelete}
                setParentData={this.setData}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default MenuItems;
