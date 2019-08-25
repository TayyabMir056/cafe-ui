import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import MenuItems from "./menuItems";
import Categories from "./categories";
import PriceUnits from "./priceUnits";
import InventoryIngredients from "./inventoryIngredients";

class NavBar extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">
              Afiniti Cafe
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Menu Items
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/categories/">
                    Categories
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/inventory-ingredients/">
                    Inventory Ingredients
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/intermediate-ingredient/">
                    Interediate Ingredients
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/units/">
                    Price Units
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <Route path="/" exact component={MenuItems} />
          <Route path="/categories/" component={Categories} />
          <Route
            path="/inventory-ingredients/"
            component={InventoryIngredients}
          />
          <Route path="/intermediate-ingredients/" component={PriceUnits} />
          <Route path="/units/" component={PriceUnits} />
        </div>
      </Router>
    );
  }
}

export default NavBar;
