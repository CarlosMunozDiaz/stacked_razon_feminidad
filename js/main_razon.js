init();

//Colores fijos
const COLOR_PRIMARY_1 = '#F8B05C', 
COLOR_PRIMARY_2 = '#E37A42', 
COLOR_ANAG_1 = '#D1834F', 
COLOR_ANAG_2 = '#BF2727', 
COLOR_COMP_1 = '#528FAD', 
COLOR_COMP_2 = '#AADCE0', 
COLOR_GREY_1 = '#B5ABA4', 
COLOR_GREY_2 = '#64605A', 
COLOR_OTHER_1 = '#B58753', 
COLOR_OTHER_2 = '#731854';

function init() {
    d3.csv('../data/razon_feminidad_tamano_municipios.csv', function(error,data) {
        if (error) throw error;
        
        let margin = {top: 10, right: 10, bottom: 100, left: 30},
            width = document.getElementById('chart').clientWidth - margin.left - margin.right,
            height = document.getElementById('chart').clientHeight - margin.top - margin.bottom;

        let svg = d3.select("#chart")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            let tamanos = d3.map(data, function(d){return(d.tipo_muni_2)}).keys();
            let tipos = ['mas_mujeres', 'mas_hombres', 'igual'];
            
            let x = d3.scaleBand()
                .domain(tamanos)
                .range([0, width])
                .padding([0.35]);
    
            let xAxis = function(g) {
                g.call(d3.axisBottom(x));
                g.call(function(svg) {
                    svg.selectAll("text")	
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-45)");
                });
            }
    
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            let y = d3.scaleLinear()
                .domain([0, 100])
                .range([ height, 0 ]);
              svg.append("g")
                .call(d3.axisLeft(y));
            
            let color = d3.scaleOrdinal()
                .domain(tipos)
                .range([COLOR_PRIMARY_1, COLOR_COMP_2, COLOR_GREY_1]);

            dataNormalized = [];
            data.forEach(function(d){
                // Compute the total
                tot = 0
                for (i in tipos){ name=tipos[i] ; tot += +d[name] }
                // Now normalize
                for (i in tipos){ name=tipos[i] ; d[name] = d[name] / tot * 100}
            })
            
            //stack the data? --> stack per subgroup
            let stackedData = d3.stack()
                .keys(tipos)
                (data);

            console.log(stackedData);

            svg.append("g")
                .selectAll("g")
                .data(stackedData)
                .enter().append("g")
                .attr("fill", function(d) { return color(d.key); })
                .selectAll("rect")
                .data(function(d) { return d; })
                .enter().append("rect")
                    .attr("x", function(d) { console.log(d); return x(d.data.tipo_muni_2); })
                    .attr("y", function(d) { return y(d[1]); })
                    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                    .attr("width",x.bandwidth())
    });
}