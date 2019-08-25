import React, { Component } from "react";
import EdiText from "react-editext";
import Select from "react-select";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import IntermediateIngredientRecipe from "./intermediateIngredientRecipe";

class IntermediateIngredient extends Component {
  state = {};
  render() {
    return (
      <div>
        <Router>
          <label>Name:</label>
          <EdiText
            type="text"
            value={this.props.data.name}
            onSave={val => this.props.onEdit(this.props.data.id, val, "name")}
          />

          <label> Cost: Rs. </label>
          <span>
            {this.props.data.cost === -1
              ? "Recipe Not found"
              : this.props.data.cost}
          </span>
          <span>/- per: </span>
          <Select
            options={this.props.priceUnits}
            value={{
              value: this.props.data.priceUnit.id,
              label: this.props.data.priceUnit.name
            }}
            onChange={val => {
              this.props.onEdit(
                this.props.data.id,
                { id: val.value },
                "priceUnit"
              );
            }}
          />
          <button type="button" className="btn btn-info">
            <Link className="nav-link" to={"/intermediate-ingredient-recipe"}>
              Edit Recipe
            </Link>
          </button>
          <button
            onClick={() => this.props.onDelete(this.props.data.id)}
            type="button"
            className="btn btn-danger"
          >
            X
          </button>
          <Route
            exact
            path="/intermediate-ingredient-recipe"
            component={() => (
              <IntermediateIngredientRecipe
                id={this.props.data.id}
                name={this.props.data.name}
                priceUnits={this.props.priceUnits}
              />
            )}
          />
        </Router>
      </div>
    );
  }
}

export default IntermediateIngredient;
