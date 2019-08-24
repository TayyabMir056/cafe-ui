import React, { Component } from "react";
import Category from "./category";
class Categories extends Component {
  state = {
    error: null,
    data: [],
    inputValue: ""
  };

  handleChange = event => {
    this.setState({ inputValue: event.target.value });
  };
  handleAddNew = event => {
    fetch(process.env.REACT_APP_API + "/categories", {
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
        if (result.message !== undefined) {
          alert(result.message);
        } else {
          console.log(result);
          var newData = this.state.data.concat(result);
          this.setState({
            data: newData
          });
        }
      })
      .then(() => {
        this.setData();
      });
    event.preventDefault();
  };
  handleDelete = id => {
    fetch(process.env.REACT_APP_API + "/categories/" + id, {
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
    fetch(process.env.REACT_APP_API + "/categories/" + id, {
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

  setData = () => {
    console.log("h");
    fetch("http://localhost:3000/categories/")
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

  componentDidMount() {
    this.setData();
  }
  render() {
    return (
      <div>
        <ul className="list-group">
          {this.state.data.map(category => (
            <li key={category.id} className="list-group-item">
              <Category
                id={category.id}
                name={category.name}
                delete={this.handleDelete}
                save={this.handleEdit}
              />
            </li>
          ))}
          <li key="newCategoryForm" className="list-group-item">
            <form onSubmit={this.handleAddNew}>
              <div className="form-group">
                <input
                  type="text"
                  value={this.state.value}
                  onChange={this.handleChange}
                  placeholder="Add New category"
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
}

export default Categories;
