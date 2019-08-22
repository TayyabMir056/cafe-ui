import React, { Component } from "react";
import Line from "react-editable-text/Line";

class PriceUnit extends Component {
  state = {};

  render() {
    return (
      <div className="btn-group" role="group">
        <Line
          label='<i class="fa fa-user"></i>'
          onSave={(value, editable) =>
            this.props.save(this.props.id, value, editable)
          }
          value={this.props.name}
        />
        <button
          onClick={() => this.props.delete(this.props.id)}
          type="button"
          className="btn btn-danger"
        >
          X
        </button>
      </div>
    );
  }
}

export default PriceUnit;
