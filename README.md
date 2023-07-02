# React Table App
This is a web application built with React and TypeScript that provides a generic table component capable of displaying different types of columns with various data types (string, number, boolean). The app allows users to filter columns, edit cell data, and perform basic CRUD operations (Create, Read, Update, Delete) on the table data. All changes made to the table can be saved to local storage, ensuring persistent data.

## Features
- Table Component: The core functionality of the app is a reusable table component that can handle different column types and data sets.
- Column Filtering: Users can selectively show or hide columns based on their preferences, allowing them to focus on the data they find most relevant.
- Inline Cell Editing: Data cells can be directly edited by users, providing a seamless editing experience.
- CRUD Operations: Users can create new rows, update existing rows, delete rows, and perform basic data manipulation on the table.
- Local Storage Persistence: The app saves all changes to local storage, allowing users to revisit and continue working with their modified table data.
- Optimized for Large Data Sets: The table component is designed to handle large data sets efficiently, ensuring smooth performance even with substantial amounts of data.

## Usage
To use this table component in your project, follow these steps:
1. Clone the repository and navigate to the project directory:
`git clone https://github.com/Yahav9/React-Table-App.git`
2. Install the required dependencies by running `npm install` or `yarn install`.
3. Replace the placeholder table data in the src/data/tableColumns.ts file with your own data conforming to the provided schema of `ColumnData`.
4. Start the development server with `npm start` or `yarn start` and access the app in your browser at `http://localhost:3000`.