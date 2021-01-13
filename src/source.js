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

// Black circles marking data points
let circleAttrs = {
    cx: (d) => xScale(d.x),
    cy: (d) => yScale(d.y),
    r: radius,
    fill : "green"
};

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

// Set of points on canvas
let points = [];

/* On Click, we register a point (which we call newData).
    1. If the point is new (hasn't be clicked on before), we add it to the svg. 
    2. Otherwise, we've clicked on it before. So we remove it from the svg. 
*/
svg.on("click", function() {
    let coords = d3.mouse(this);
    
    // The clicked and registered point
    let newData= {
        x: Math.round( xScale.invert(coords[0])),  // Takes the pixel number to convert to number
        y: Math.round( yScale.invert(coords[1]))
    };

    let newPt = inArray(newData); //-1 if newData is a new point; otherwise, the index of newData is returned.

    if (newPt != -1 ){// If newData != -1, then we must remove it from out canvas
        points.splice(newPt, 1);
        d3.select("#t" + newData.x + "-" + newData.y + "-" + newPt).remove();  // Remove text location
        svg.selectAll("circle")[0][newPt].remove();
    }
    else{ //Otherwise, newData is in fact new, and we add it to our canvas
        points.push(newData);   
        svg.selectAll("circle") 
        .data(points)
        .enter()
        .append("circle")
        .attr(circleAttrs) 
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut); 
    };

})
/* On click for Output TikZ Button
*/
document.getElementById("code-output-button").addEventListener("click", codeOutput_onClick);

function codeOutput_onClick () {
    let outputString = "\\draw plot[closed hobby] coordinates {<br>";
    Object.keys(points).forEach((key) => {
        let xCoord = String(points[key].x/10);
        let yCoord = String(points[key].y/10);
        outputString += "(" + xCoord + ", " + yCoord + ") ";
    })
    outputString += "};<br>";
    if (coordinates){
        coordinates.innerHTML = outputString;
    }
};

/* On click for New Object Button
*/
// document.getElementById("main-button").addEventListener("click", newObject_onClick);

function newObject_onClick () {
    svg.selectAll
};


// This function is ridiculous 
// returns -1 if not found, otherwise it gives the index
function inArray(point){
    found = -1;
    let x = Number(point.x);
    let y = Number(point.y);
    Object.keys(points).forEach((key) => {
            console.log(points[key].x == x & points[key].y == y)
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
        fill: "orange",
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
        fill: d.fill,
        r: radius
    });
    // When we're done hovering, remove textbox
    d3.select("#t" + d.x + "-" + d.y + "-" + i).remove(); 
}
