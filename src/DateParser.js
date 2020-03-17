import React, { Component } from "react";
import FilterResults from 'react-filter-search';

class DataParser extends Component {
  constructor(props) {
    // Call super class
    super(props);
    this.state = {
      todos: ["", ""],
      value: '',
      currentPage: 1,
      todosPerPage: 100
    };


    // Bind this to function updateData (This eliminates the error)
    this.updateData = this.updateData.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    // Your parse code, but not seperated in a function
    var csvFilePath = require("./covid19_cases.csv");
    var Papa = require("papaparse");
    Papa.parse(csvFilePath, {
      header: true,
      download: true,
      skipEmptyLines: true,
      // Here this is also available. So we can call our custom class method
      complete: this.updateData
    });
  }

  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }

  updateData(result) {
    const data = result.data;
    // Here this is available and we can call this.setState (since it's binded in the constructor)
    console.log(JSON.stringify(data));
    this.setState({ todos: data });
    // or shorter ES syntax: this.setState({ data });
  }

  handleChange = event => {
    const { value } = event.target;
    this.setState({ value });
  };

  componentDidMount() {}

  render() {
    const { todos, value, currentPage, todosPerPage } = this.state;

    // Logic for displaying current todos
    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const currentTodos = todos
      ? todos.slice(indexOfFirstTodo, indexOfLastTodo)
      : [];

    const renderTodos = currentTodos.map((todo, index) => {

      return (
      <FilterResults
          value={value}
          data={todos}
          renderResults={results => (
      <div>
              {results.map(todo => (
        <div className="card">
          <div class="clearfix">
            <div className="leftFloat width80 text-left">
              <div className="clearfix">
            
                <div>
                <p>County: {todo.County}</p>
                <p>Province: {todo.Province}</p>
                <p>Country: {todo.Country}</p>
                <p>Confirmed: {todo.Confirmed}</p>
                <p>Deaths: {todo.Deaths}</p>
                <p>Recovered: {todo.Recovered}</p>
                </div>

              </div>
            </div>
          </div>
        </div>
        ))}
      </div>
      )}
    />
    );
                    
    });


    // Logic for displaying page numbers
    const pageNumbers = [];
    for (let i = 1; i <= 3; i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <li
          key={number}
          id={number}
          onClick={this.handleClick}
          className="linkCLick"
        >
          {number}
        </li>
      );
    });
    // Your render function
    return (
      <div className="backwrapper">
      <input type="text" id="inputField" placeholder="Search a country: " value={value} onChange={this.handleChange} />
        <div>{renderTodos}</div>
        <p>Novel Coronavirus (COVID-19) Cases, provided by <a href="https://systems.jhu.edu/research/public-health/ncov/">JHU CSSE</a></p>
      </div>
    );
  }
}

export default DataParser;
