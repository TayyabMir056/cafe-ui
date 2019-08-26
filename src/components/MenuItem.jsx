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
      <div>
        <div>
          <h5>Name:</h5>
          <EdiText
            type="text"
            value={this.props.data.name}
            onSave={val => this.props.onEdit(this.props.data.id, val, "name")}
          />
        </div>
        <div>
          <h5>Category:</h5>
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
          <h5>Selling Price:</h5>
          <EdiText
            type="number"
            value={this.props.data.sellingPrice}
            onSave={val =>
              this.props.onEdit(this.props.data.id, val, "sellingPrice")
            }
          />
        </div>
        <div>
          <h5>
            Cost:{" "}
            {this.props.data.cost === -1
              ? "Recipe not found"
              : this.props.data.cost}
          </h5>
        </div>
        <Router>
          <button type="button" className="btn btn-info">
            <Link className="nav-link" to={"/menu-item-recipe/"}>
              Edit Recipe
            </Link>
          </button>

          <Route
            exact
            path="/menu-item-recipe/"
            component={() => <MenuItemRecipe />}
          />
        </Router>
        <button
          onClick={() => this.props.onDelete(this.props.data.id)}
          type="button"
          className="btn btn-danger"
        >
          X
        </button>
      </div>
    );
  }
}

export default MenuItem;
