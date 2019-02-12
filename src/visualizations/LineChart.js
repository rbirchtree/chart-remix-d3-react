import React, { Component } from 'react';
import * as d3 from 'd3';

const width = 650;
const height = 400;
const margin = {top: 20, right: 5, bottom: 20, left: 35};
const red = '#eb6a5b';
const blue = '#52b6ca';

class LineChart extends Component {
  state = {
    price: null, // svg path command for all the high temps
    production: null, // svg path command for low temps,
    // d3 helpers
    xScale: d3.scaleTime().range([margin.left, width - margin.right]),
    yScale: d3.scaleLinear().range([height - margin.bottom, margin.top]),
    lineGenerator: d3.line(),
  };
  //change highs = price and lows = production to price and production
  xAxis = d3.axisBottom().scale(this.state.xScale)
    .tickFormat(d3.timeFormat('%b%Y'));
  yAxis = d3.axisLeft().scale(this.state.yScale)
    .tickFormat(d => `${'$' + d}`);

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.data) return null; // data hasn't been loaded yet so do nothing
    const {data} = nextProps;
    console.log('data',data)
    const {xScale, yScale, lineGenerator} = prevState;
    alert('hi')
    // data has changed, so recalculate scale domains
    const timeDomain = d3.extent(data, d => d.date);
    const priceMax = d3.max(data, d => d.price);
    
    xScale.domain(timeDomain);
    yScale.domain([0, priceMax]);

    // calculate line for lows
    lineGenerator.x(d => xScale(d.date));
    lineGenerator.y(d => yScale(d.price));
    const production = lineGenerator(data);
    // and then highs
    lineGenerator.y(d => yScale(d.price));
    const price = lineGenerator(data);
    
    return {production, price};
  }

  componentDidUpdate() {
    d3.select(this.refs.xAxis).call(this.xAxis);
    d3.select(this.refs.yAxis).call(this.yAxis);
  }

  render() {

    return (
      <svg width={width} height={height}>
        <path d={this.state.price} fill='none' stroke={red} strokeWidth='2' />
        <path d={this.state.production} fill='none' stroke={blue} strokeWidth='2' />
        <g>
          <g ref='xAxis' transform={`translate(0, ${height - margin.bottom})`} />
          <g ref='yAxis' transform={`translate(${margin.left}, 0)`} />
        </g>
      </svg>
    );
  }
}

export default LineChart;
