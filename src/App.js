import React, { Component } from 'react';
import LineChart from './visualizations/LineChart';
import './App.css';
//https://github.com/sxywu/react-d3-example/blob/master/src/App.js


class App extends Component {
  state = {
    location: 'utica',
    values: {}
  };
  
  componentDidMount() {
   Promise.all([
      fetch(`${process.env.PUBLIC_URL}/utica.json`),
      fetch(`${process.env.PUBLIC_URL}/permian.json`),
    ]).then(responses => Promise.all(responses.map(resp => resp.json())))
    .then(([utica, permian]) => {
      utica.forEach(day => day.date = new Date(day.date));
      permian.forEach(day => day.date = new Date(day.date));
      console.log('permian',permian)
      this.setState({values: {utica,permian}});
    });
  }

  updateLocation = (e) =>{
  	this.setState({location: e.target.value})
  	//change to redux later?
  };

  render() {
  	const data = this.state.values[this.state.location];
    
    let sum = 0;
      
    for (let key in data){
      sum +=  data[key].price * data[key].production;
    }
    sum = sum.toLocaleString('USD');

    return (
      <div className="App">
      <h1>
        Select Production and Price Chart for...
		<select name='city' onChange={this.updateLocation}>
    	{
    		[
    		{label: 'Utica', value: 'utica'},
    		{label: 'Permian', value: 'permian'},
    		].map(option => {
    			return (<option key={option.value} value={option.value}>{option.label}</option>)
    		})
    	}
    	</select>
	  </h1>
	  <LineChart data={data}/>
	  <p> Total  value of oil produced over a four month period...${sum}</p>
      </div>
    );
  }
}

export default App;
