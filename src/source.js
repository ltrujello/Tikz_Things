let w = window.innerWidth;
let h = window.innerHeight;
let margin = { top: 100, right: 100, bottom: 100, left: 100 };
let radius = 3;

let svg = d3.select("#canvas").append("svg").attr({
    width: 0.8*w,
    height: 0.9*h
});

let points = [
];

// We're passing in a function in d3.max to tell it what we're maxing (x value)
let xScale = d3.scale.linear()
// .domain([0, d3.max(points, function (d) { return d.x + 100; })])
.domain([0, 100])
.range([margin.left, w - margin.right]);  // Set margins for x specific

// We're passing in a function in d3.max to tell it what we're maxing (y value)
let yScale = d3.scale.linear()
// .domain([0, d3.max(points, function (d) { return d.y + 100; })])
.domain([0, 100])
.range([h - margin.bottom, margin.top]);  // Set margins for y specific

// Add a X and Y Axis (Note: orient means the direction that ticks go, not position)
let xAxis = d3.svg.axis().scale(xScale).orient("bottom");
let yAxis = d3.svg.axis().scale(yScale).orient("left");

let circleAttrs = {
    cx: function(d) { return xScale(d.x); },
    cy: function(d) { return yScale(d.y); },
    r: radius
};

// Adds X-Axis as a 'g' element
svg.append("g").attr({
    "class": "axis",  // Give class so we can style it
    transform: "translate(" + [0, h - margin.top] + ")"  // Translate just moves it down into position (or will be on top)
}).call(xAxis);  // Call the xAxis function on the group

// Adds Y-Axis as a 'g' element
svg.append("g").attr({
    "class": "axis",
    transform: "translate(" + [margin.left, 0] + ")"
}).call(yAxis);  // Call the yAxis function on the group

// On Click, we want to add data to the array and chart
svg.on("click", function() {
    let coords = d3.mouse(this);

    // Normally we go from data to pixels, but here we're doing pixels to data
    let newData= {
        x: Math.round( xScale.invert(coords[0])),  // Takes the pixel number to convert to number
        y: Math.round( yScale.invert(coords[1]))
    };

    let newPt = inArray(newData);

    if (newPt != -1 ){// Remove element if we already have it 
        console.log("fuck")
        delete points[newPt]
    }
    else{
        points.push(newData);   // Push data to our array
    }
    
    svg.selectAll("circle")  // For new circle, go through the update process
    .data(points)
    .enter()
    .append("circle")
    .attr(circleAttrs)  // Get attributes from circleAttrs let
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
})

// Create Event Handlers for mouse
function handleMouseOver(d, i) {  // Add interactivity

    // Use D3 to select element, change color and size
    d3.select(this).attr({
    fill: "orange",
    r: radius*2
    });

    // Specify where to put label of text
    svg.append("text").attr({
        id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
        x: function() { return xScale(d.x) - 30; },
        y: function() { return yScale(d.y) - 15; }
    })
    .text(function() {
        return [d.x, d.y];  // Value of the text
    });
}

// This function is ridiculous 
// returns -1 if not found, otherwise it gives the index
function inArray(point){
    found = -1
    let x = Number(point.x)
    let y = Number(point.y)
    Object.keys(points).forEach(function(key){
            console.log(points[key].x == x & points[key].y == y)
            if(points[key].x == x & points[key].y == y){
                found = key
            }
        }
    )
    return found
}

function handleMouseOut(d, i) {
    // Use D3 to select element, change color back to normal
    d3.select(this).attr({
        fill: "black",
        r: radius
    });

    // Select text by id and then remove
    d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
}


(31, 38), (24, 62), (36, 78), (58, 70), (54, 36), (56, 8), (30, 10), (44, 11), (50, 90)
