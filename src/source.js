// Screen parameters
const w = window.innerWidth;
const h = window.innerHeight;
const margin = { top: 5, right: 5, bottom: 100, left: 100 };
const radius = 3;

// The canvas
let svg = d3.select("#canvas").append("svg").attr({//"canvas" is our corresponding div id
    width: 0.57*w,
    height: 0.75*h
});

// Setting x axis scale
let xScale = d3.scale.linear()
.domain([0, 100]) // input values
.range([margin.left-120, w - margin.right-800]); // [x,y] controls position of x-axis

let yScale = d3.scale.linear()
.domain([0, 100])
.range([h - margin.bottom, margin.top+150]);  

// Setting axis
let xAxis = d3.svg.axis().scale(xScale).orient("bottom");
let yAxis = d3.svg.axis().scale(yScale).orient("left");

// Circles to mark points on canvas
let circleAttrs = {
    cx: (d) => xScale(d.x),
    cy: (d) => yScale(d.y),
    r: radius,
    fill : "rgb(50, 149, 237)" // This gets updated a lot
};

// Colors of the points on the canvas
let colors = ["rgb(50, 149, 237)", "rgb(153, 102, 255)", "rgb(255, 51, 0)", "rgb(102, 255, 51)", 
"rgb(0, 102, 153)", "rgb(0, 102, 153)", "rgb(255, 153, 51)", "rgb(0, 153, 0)", "rgb(51, 204, 255)"]

// Adds X-Axis as a 'g' element
svg.append("g").attr({
    "class": "axis",  
    transform: "translate(" + [70, h - 280] + ")"  //[x, y] controls position 
}).call(xAxis);  

// Adds Y-Axis as a 'g' element
svg.append("g").attr({
    "class": "axis",
    transform: "translate(" + [margin.left-20, -150] + ")"
}).call(yAxis); 

let points = []; // Initialize set of all points on canvas
let on_figure = 0; // Keeps track of which figure the user is editing
let figures = { // Figures maintains an object of arrays; each array is an (x,y) list of points which makes up a figure.
    fig_0 : []
};

/* On Click, we register a point (which we call newData). Below we collect its data and draw it.
*/
svg.on("click", function() {    
    // Extract data of clicked point
    let coords = d3.mouse(this);
    let newData= {
        x: Math.round( xScale.invert(coords[0])),  // Takes the pixel number to convert to number
        y: Math.round( yScale.invert(coords[1]))
    };
    
    // Draw point on the canvas
    points.push(newData);
    figures["fig_"+on_figure].push(newData); // adds point to the new figure
    svg.selectAll("circle") 
    .data(points)
    .enter()
    .append("circle")
    .attr(circleAttrs) 
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut); 
    // };
})

/* On click for Add TikZ Object Button
*/
document.getElementById("new-object-button").addEventListener("click", newObject_onClick);

function newObject_onClick () {
    /* The user has finished adding points to their figure. We need to do three things:
        1. Draw lines between their selected points.
        2. Output the relevant TikZ command statements.
        3. Set up empty arrays for the next figure's (x,y) data.
    */
    // 1. Draw lines between points.
    current_fig = figures["fig_" + String(on_figure)]; 
    console.log(current_fig);
    for(let i = 0; i < current_fig.length; i++){ // Loop over (x,y) coordinates; connect a line from (x_i,y_i) to (x_{i+1}, y_{i+1}). 
        if(i == current_fig.length-1){
            svg.append('line')
            .style("stroke", colors[on_figure])
            .style("stroke-width", 1)
            .attr("x1", xScale(current_fig[0].x))
            .attr("y1", yScale(current_fig[0].y))
            .attr("x2", xScale(current_fig[i].x))
            .attr("y2", yScale(current_fig[i].y));             
        }
        else{
            svg.append('line')
            .style("stroke", colors[on_figure])
            .style("stroke-width", 1)
            .attr("x1", xScale(current_fig[i].x))
            .attr("y1", yScale(current_fig[i].y))
            .attr("x2", xScale(current_fig[i+1].x))
            .attr("y2", yScale(current_fig[i+1].y)); 
        }
    }

    //2. Output the relevant TikZ command statements.
    let outputString = "\\draw plot[closed hobby] coordinates {<br>"; // The beginning of a figure's TikZ command 
    current_fig.forEach((tuple) => { // We loop through a figure's set of points
        let xCoord = String(tuple.x/10);
        let yCoord = String(tuple.y/10);
        outputString += "(" + xCoord + ", " + yCoord + ") ";
    })
    outputString += "};<br>";     
    coordinates.innerHTML += outputString; // The overall eventual output for the user

    // 3. Set up empty arrays for the next figure's (x,y) data.
    on_figure += 1; // Increase this. We are now editing a new figure.
    figures["fig_" + String(on_figure)] = []; // Initialize array which will contain new (x,y) coordinates.
    circleAttrs["fill"] = colors[on_figure]; // Give it a different color.
};

// This function is ridiculous 
// returns -1 if not found, otherwise it gives the index
function inArray(point){
    found = -1;
    let x = Number(point.x);
    let y = Number(point.y);
    Object.keys(points).forEach((key) => {
            if(points[key].x == x & points[key].y == y){
                found = key;
            }
        }
    )
    return found;
}

// Event Handler for hovering
function handleMouseOver(d, i) {  // Hovering changes color to orange, prompts textbox
    d3.select(this).attr({
        r: radius*2
    });

    // The textbox
    svg.append("text").attr({
        id: "t" + d.x + "-" + d.y + "-" + i,  // Create a reference id
        x: () => xScale(d.x) - 30,
        y: () => yScale(d.y) - 15
    })
    .text(() => [d.x, d.y] // Textbox data
    );
}

// Event Handler for moving mouse away
function handleMouseOut(d, i) {
    d3.select(this).attr({
        r: radius
    });
    // When we're done hovering, remove textbox
    d3.select("#t" + d.x + "-" + d.y + "-" + i).remove(); 
}
