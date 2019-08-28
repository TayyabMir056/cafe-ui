# Cafe Task FrontEnd

Create and manage menu items with their recipes and cost.

## Framework:
REACTJS (CREATE-REACT-APP 3.0.1)

## Environment setup

  -  git clone git@github.com:TayyabMir056/cafe-ui.git
  OR Download zip and extract it to required folder 
  - Create a .env file in project folder and add the following line about the backend API

    REACT_APP_API=http://localhost:3500
    *change the port if you are running the backend on a differend port
    
   - open terminal in the directory and run the following command
 

    npm run start

## Components
**Price Units:**
The list of price units in which any ingredient can be calculated.
e.g kg, mg, or even 200ml for items which have prices like $Rs. 80/- per 200ml

**Categories:**
The List of categories that a menu item can be in.

Examples: Cakes, Beverages

**Inventory Ingredients:**
The list of inventory ingredients that are used in "menu item" recipe and "intermediate ingredient" recipe

Examples: Sugar, cream, flour

**Intermediate Ingredients:**
The List of Intermediate Ingredients (Ingredients made up from inventory ingredients) that can be used in a menu-item
An Intermediate Ingredients  "cost" is calculated from its recipe.

Examples: Sponge(made from inventory items: flour, cream, sugar)

**Menu Item:**
The List of all Menu Items having a recipe containing Ingredients (Inventory and Intermediate) and their respective quantities.
A Menu Item's Selling price can be set manually, however the "cost" of a menu item is calculated from its recipe.

Examples: Chocolate Cake, Cheese cake
