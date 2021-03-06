console.log('done')
  const statedata =  d3.csv("/barchart/data/statedata1.csv").then(function(data) 
  {
    console.log(statedata)
    return data   
  });
  statedata.then(function(data) {

 const svg = d3.select('svg');
  const svgContainer = d3.select('#container');
  
  const margin = 80;
  const width = 1000 - 2 * margin;
  const height = 600 - 2 * margin;

  const chart = svg.append('g')
    .attr('transform', `translate(${margin}, ${margin})`);

  const xScale = d3.scaleBand()
    .range([0, width])
    .domain(data.map((s) => s.state))
    .padding(0.4)

 console.log(xScale);
 
  const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain([0,  d3.max(data, function(d) { return parseInt(d.value); })]);   
    console.log(yScale); 
  
  const makeYLines = () => d3.axisLeft()
    .scale(yScale)

  chart.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("y", 5)
    .attr("x", -50)
    .attr("dy", "-.2em")
    .attr("transform", "rotate(-90)")  ;

  chart.append('g')
    .call(d3.axisLeft(yScale));

  // vertical grid lines
  // chart.append('g')
  //   .attr('class', 'grid')
  //   .attr('transform', `translate(0, ${height})`)
  //   .call(makeXLines()
  //     .tickSize(-height, 0, 0)
  //     .tickFormat('')
  //   )

  chart.append('g')
    .attr('class', 'grid')
    .call(makeYLines()
      .tickSize(-width, 0, 0)
      .tickFormat('')
    )

  const barGroups = chart.selectAll()
    .data(data)
    .enter()
    .append('g')
   
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

  barGroups
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (g) => xScale(g.state))
    .attr('y', (g) => yScale(g.value))
    .attr('height', (g) => height - yScale(g.value))
    .attr('width', xScale.bandwidth())    
     .on('dblclick', function (actual, i) {        
         url = 'http://localhost/sample/uscountybystated3js.html?state=' + actual.state;
         document.location.href = url;      
     })
    //  .on("mousemove", function(d){
    //     tooltip
    //       .style("left", d3.event.pageX - 50 + "px")
    //       .style("top", d3.event.pageY - 70 + "px")
    //       .style("display", "inline-block")
    //       .html((d.state) + "<br>" + "" + (d.value));
    // })

    .on('mouseenter', function (actual, i) {
      d3.selectAll('.value')
        .attr('opacity', 0)
        
      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 0.6)
        .attr('x', (a) => xScale(a.state) - 5)
        .attr('width', xScale.bandwidth() + 10)

      //const x = xScale(actual.value)  
      console.log(actual.state)
      const y = yScale(actual.value)
      

      line = chart.append('line')
        .attr('id', 'limit')
        .attr('x1', 0)
        .attr('y1', y)
        .attr('x2', width)
        .attr('y2', y)

      barGroups.append('text')
        .attr('class', 'divergence')
        .attr('x', (a) => xScale(a.state) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.value) + 30)
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        // .text((a, idx) => {
        //   const divergence = (a.value - actual.value).toFixed(1)
          
        //   let text = ''
        //   if (divergence > 0) text += '+'
        //   text += `${divergence}%`

        //   return idx !== i ? text : '';
        // })

    })
    .on('mouseleave', function () {
      d3.selectAll('.value')
        .attr('opacity', 1)

      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 1)
        .attr('x', (a) => xScale(a.state))
        .attr('width', xScale.bandwidth())

      chart.selectAll('#limit').remove()
      chart.selectAll('.divergence').remove()
    })

  barGroups 
    .append('text')
    .attr('class', 'value')
    .attr('x', (a) => xScale(a.state) + xScale.bandwidth() / 2)
    .attr('y', (a) => yScale(a.value) + 30)
    .attr('text-anchor', 'middle')
    //.text((a) => `${a.value}`)
  
  svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2) - margin)
    .attr('y', 10)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Covid Cases')

  svg.append('text')
    .attr('class', 'label')
    .attr('x', width / 2 + margin)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'middle')
    //.text('States')

  svg.append('text')
    .attr('class', 'title')
    .attr('x', width / 2 + margin)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text('Covid - 19 Cases by State')

  svg.append('text')
    .attr('class', 'source')
    .attr('x', width - margin / 2)
    .attr('y', height + margin * 1.7)
    .attr('text-anchor', 'start')
    //.text('Source: Stack Overflow, 2018')
});