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
        <ul className="list-group">
          {this.state.data.map(menuItem => (
            <li key={menuItem.id} className="list-group-item">
              <MenuItem
                data={menuItem}
                categories={this.state.categories}
                onEdit={this.handleEdit}
                onDelete={this.handleDelete}
              />
            </li>
          ))}
        </ul>

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
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </form>
      </div>
    );
  }
}

export default MenuItems;
