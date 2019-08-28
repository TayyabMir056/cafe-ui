//Component: Menu Item
//returns the Menu item used in the parent MenuItems component
//Sub-component: MenuItemRecipe => Loaded with ROUTER when the "Edit Recipe" button of any Menu Item is clicked

import React, { Component } from "react";
import Select from "react-select";
import EdiText from "react-editext";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import MenuItemRecipe from "./menuItemRecipe";

class MenuItem extends Component {
  state = {};
  render() {
    console.log("here", this.props);

    return (
      <div className="card">
        <div className="card-header">
          <EdiText
            className="card-title"
            type="text"
            value={this.props.data.name}
            onSave={val => this.props.onEdit(this.props.data.id, val, "name")}
          />
        </div>
        <div>
          <label>
            <strong>Category:</strong>
          </label>
          <Select
            options={this.props.categories}
            value={{
              value: this.props.data.category.id,
              label: this.props.data.category.name
            }}
            onChange={val => {
              this.props.onEdit(
                this.props.data.id,
                { id: val.value },
                "category"
              );
            }}
          />
        </div>
        <div>
          <label>
            <strong>Selling Price:</strong>
          </label>
          <EdiText
            type="number"
            value={this.props.data.sellingPrice}
            onSave={val =>
              this.props.onEdit(this.props.data.id, val, "sellingPrice")
            }
          />
        </div>
        <div>
          <label>
            <strong>Cost: </strong>
            {this.props.data.cost === -1
              ? "Recipe not found"
              : this.props.data.cost}
          </label>
        </div>
        <Router>
          <div className="btn-grp">
            <button type="button" className="btn btn-info btn-sm">
              <Link
                className="nav-link"
                to={"/menu-item-recipe/"}
                style={{ color: "#FFF" }}
              >
                Edit Recipe
              </Link>
            </button>

            <button
              onClick={() => this.props.onDelete(this.props.data.id)}
              type="button"
              className="btn btn-danger btn-sm"
            >
              X
            </button>
          </div>
          <Route
            path="/menu-item-recipe/"
            component={() => (
              <MenuItemRecipe
                id={this.props.data.id}
                name={this.props.data.name}
                setParentData={this.props.setParentData}
              />
            )}
          />
        </Router>
      </div>
    );
  }
}

export default MenuItem;
