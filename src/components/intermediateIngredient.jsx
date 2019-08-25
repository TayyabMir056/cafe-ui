import React, { Component } from "react";
import EdiText from "react-editext";
import Select from "react-select";

class IntermediateIngredient extends Component {
  state = {};
  render() {
    return (
      <div>
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

export default IntermediateIngredient;
