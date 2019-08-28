import React, { Component } from "react";
import PriceUnit from "./priceUnit";
class PriceUnits extends Component {
  state = {
    error: null,
    data: [],
    inputValue: ""
  };

  setData = () => {
    console.log();
    fetch(process.env.REACT_APP_API + "/units")
      .then(res => res.json())
      .then(
        result => {
          console.log(result);
          this.setState({
            isLoaded: true,
            data: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  };

  handleAddNew = event => {
    fetch(process.env.REACT_APP_API + "/units", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.inputValue
      })
    })
      .then(res => res.json())
      .then(result => {
        if (result.id) {
          console.log(result);
          var newData = this.state.data.concat(result);
          this.setState({
            data: newData
          });
        } else {
          alert("Warning: " + result.message);
        }
      });
    event.preventDefault();
  };

  handleDelete = id => {
    fetch(process.env.REACT_APP_API + "/units/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }).then(() => {
      this.setData();
    });
  };

  handleEdit = (id, name, editable) => {
    fetch(process.env.REACT_APP_API + "/units/" + id, {
      method: "PUT",
      body: JSON.stringify({
        name: name
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(this.setData())
      .then(editable.success());
  };

  handleChange = event => {
    this.setState({ inputValue: event.target.value });
  };
  render() {
    return (
      <div>
        <ul className="list-group">
          {this.state.data.map(priceUnit => (
            <li key={priceUnit.id} className="list-group-item">
              <PriceUnit
                id={priceUnit.id}
                name={priceUnit.name}
                delete={this.handleDelete}
                save={this.handleEdit}
              />
            </li>
          ))}
          <li className="list-group-item">
            <form onSubmit={this.handleAddNew}>
              <div className="form-group">
                <input
                  type="text"
                  value={this.state.value}
                  onChange={this.handleChange}
                  placeholder="Add New Unit"
                  required
                />
              </div>
              <button type="submit" value="Submit" className="btn btn-success">
                Add
              </button>
            </form>
          </li>
        </ul>
      </div>
    );
  }

  componentDidMount() {
    this.setData();
  }
}
export default PriceUnits;
