var parameters = location.search.substring(1).split("&");

  var temp = parameters[0].split("=");
  var statefilter = unescape(temp[1]);
console.log('done')
const statedata =  d3.csv("/barchart/data/country.csv").then(function(data) 
{
    return data   
});
statedata.then(function(data1) {
      var dataValue=d3.nest()
    .key(function(data1){return data1.country;})
    .rollup(function(g)
    {
    console.log(g)
      return  d3.sum(g, function(d){
        return d.value;
      });
        })
        .entries(data1)
        console.log(dataValue)
        var s1 = dataValue.map(function (d){return {key:(d.key)}}); 
        var s1Val=dataValue.map(function (d){return {value:(d.key)}}); 
           
        const svg = d3.select('svg');
  const svgContainer = d3.select('#container');

const margin = 80;
const width = 1000 - 2 * margin;
const height = 600 - 2 * margin;

const chart = svg.append('g')
.attr('transform', `translate(${margin}, ${margin})`);

const xScale = d3.scaleBand()
.range([0, width])
.domain(dataValue.map((s) => s.key))
.padding(0.4)

console.log('xScale============'+xScale)

const yScale = d3.scaleLinear()
.range([height, 0])
.domain([0,  d3.max(dataValue, function(d) { return parseInt(d.value); })]);    
console.log('yScale----------------'+yScale)

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
.data(dataValue)
.enter()
.append('g')

barGroups
.append('rect')
.attr('class', 'bar')
.attr('x', (g) => xScale(g.key))
.attr('y', (g) => yScale(g.value))
.attr('height', (g) => height - yScale(g.value))
.attr('width', xScale.bandwidth())
.on('mouseenter', function (actual, i) {
  d3.selectAll('.value')
    .attr('opacity', 0)

  d3.select(this)
    .transition()
    .duration(300)
    .attr('opacity', 0.6)
    .attr('x', (a) => xScale(a.key) - 5)
    .attr('width', xScale.bandwidth() + 10)

  const y = yScale(actual.value)

  line = chart.append('line')
    .attr('id', 'limit')
    .attr('x1', 0)
    .attr('y1', y)
    .attr('x2', width)
    .attr('y2', y)

  barGroups.append('text')
    .attr('class', 'divergence')
    .attr('x', (a) => xScale(a.key) + xScale.bandwidth() / 2)
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
    .attr('x', (a) => xScale(a.key))
    .attr('width', xScale.bandwidth())

  chart.selectAll('#limit').remove()
  chart.selectAll('.divergence').remove()
})

barGroups 
.append('text')
.attr('class', 'value')
.attr('x', (a) => xScale(a.key) + xScale.bandwidth() / 2)
.attr('y', (a) => yScale(a.value) + 30)
.attr('text-anchor', 'middle')
//.text((a) => `${a.value}`)

svg
.append('text')
.attr('class', 'label')
.attr('x', -(height / 2) - margin)
.attr('y',10)// margin / 2.4)
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
.text('Covid - 19 Cases by County for State ' + statefilter)

svg.append('text')
.attr('class', 'source')
.attr('x', width - margin / 2)
.attr('y', height + margin * 1.7)
.attr('text-anchor', 'start')
//.text('Source: Stack Overflow, 2018')
//});
});