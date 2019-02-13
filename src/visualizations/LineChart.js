import React, { Component } from 'react';
import * as d3 from 'd3';

const width = 650;
const height = 400;
const margin = {top: 20, right: 35, bottom: 20, left: 35};
const red = '#eb6a5b';
const blue = '#52b6ca';

class LineChart extends Component {
  state = {
    price: null, // svg path command for all the high temps
    production: null, // svg path command for low temps,
    // d3 helpers
    xScale: d3.scaleTime().range([margin.left, width - margin.right]),
    yScale: d3.scaleLinear().range([height - margin.bottom, margin.top]),
    yScale1: d3.scaleLinear().range([height - margin.bottom, margin.top]),
    //yscale basically the same set-up
    lineGenerator: d3.line(),
  };

  xAxis = d3.axisBottom().scale(this.state.xScale)
    .tickFormat(d3.timeFormat('%b %Y')).ticks(4);
  yAxisLeft = d3.axisLeft().scale(this.state.yScale)
    .tickFormat(d => `${'$' + d}`);
  yAxisRight = d3.axisRight().scale(this.state.yScale1)
    .tickFormat(d => `${d + ' bbl '}`);


  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.data) return null; // data hasn't been loaded yet so do nothing
    const {data} = nextProps;
    const {xScale, yScale, yScale1, lineGenerator} = prevState;
    // data has changed, so recalculate scale domains
    const timeDomain = d3.extent(data, d => d.date);
    const priceMax = d3.max(data, d => d.price);
    const productionMax = d3.max(data, d => d.production);

    xScale.domain(timeDomain);
    yScale.domain([0, priceMax]);
    yScale1.domain([0, productionMax])
    // calculate line for production
    lineGenerator.x(d => xScale(d.date));
    //sets-up x scale
    lineGenerator.y( d=> yScale1(d.production));

    const production = lineGenerator(data);
    // and then price
    lineGenerator.y(d => yScale(d.price));
    const price = lineGenerator(data);
    
    return {production, price};
  }

  componentDidUpdate() {
    d3.select(this.refs.xAxis).call(this.xAxis);
    d3.select(this.refs.yAxisLeft).call(this.yAxisLeft);
    // add yaxis right
    d3.select(this.refs.yAxisRight).call(this.yAxisRight);
  }

  render() {
    console.log('this.state', this.state)
    return (
      <svg width={width} height={height}>
        <path d={this.state.price} fill='none' stroke={red} strokeWidth='3' />
        <path d={this.state.production} fill='none' stroke={blue} strokeWidth='3' />
        <g>
          <g ref='xAxis' transform={`translate(0, ${height - margin.bottom})`} />
          <g ref='yAxisLeft' transform={`translate(${margin.left}, 0)`} />
          <g ref='yAxisRight' transform={`translate(${width-margin.right}, 0)`} />
        </g>
      </svg>
    );
  }
}

export default LineChart;
