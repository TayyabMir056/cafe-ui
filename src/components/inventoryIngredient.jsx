import React, { Component } from "react";
import EdiText from "react-editext";
import Select from "react-select";

class InventoryIngredient extends Component {
  state = {};
  render() {
    return (
      <div className="card" style={{ width: "18rem" }}>
        <label htmlFor="inventoryItemName">Name:</label>
        <EdiText
          id="inventoryItemName"
          type="text"
          value={this.props.data.name}
          onSave={val => this.props.onEdit(this.props.data.id, val, "name")}
        />
        <label htmlFor="inventoryItemCost">Cost: Rs</label>
        <EdiText
          type="number"
          value={this.props.data.cost}
          onSave={val => this.props.onEdit(this.props.data.id, val, "cost")}
        />
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

export default InventoryIngredient;
