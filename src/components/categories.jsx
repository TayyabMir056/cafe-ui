/*
Component: Categories
Description: The List of categories that a menu item can be in.
Sub-components: Category (imported as a card)
Examples: Cakes, Beverages
*/

import React, { Component } from "react";
import Category from "./category";
class Categories extends Component {
  state = {
    error: null,
    data: [],
    inputValue: "" //Contains the value entered in the form to add new category
  };

  //handleChange():
  //Triggered when a value is entered in the form to add new category
  //Functionality: store the form of input text in state.inputValue
  handleChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  //handleAddNew():
  //Triggered when the form is "submitted" i.e. when a new item is added
  //Functionality:Adds a new Category in the database using POST request of Backend API
  // Also updates the state.data and add the newly added value to the state.
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
        //Update the component state after the new category is added in the backend
        this.setData();
      });
    event.preventDefault();
  };

  //handleDelete()
  //Triggered when an item is deleted from the list
  //Input: category id (uuid) to be deleted
  //Functionality: Delete the item from the Backend API and update the state
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

  //handleEdit():
  //Triggered when an item is edited
  //Input:category id to be edited, updated name
  //the "editable" parameter is a default event parameter sent by "react-editable-text" module used in the Category component
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

  //setData()
  //Triggers when the component is mounted or whenever there is a change in the data
  //Functionality: fetches all (updated) categories and updates the state
  setData = () => {
    fetch(process.env.REACT_APP_API + "/categories/")
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
