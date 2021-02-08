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
let colors = ["rgb(50, 149, 237)", 
"rgb(51, 88, 255)",
"rgb(172, 18, 255)", 
"rgb(255, 0, 0)",
"rgb(255, 144, 0)",
"rgb(0, 196, 3)", 
"rgb(51, 204, 255)",
"rgb(0, 102, 153)",
"rgb(255, 0, 238)",
"rgb(50, 149, 237)", 
]

// Adds X-Axis as a 'g' element
let svgxAxis = svg.append("g").attr({
    "class": "axis",
    transform: "translate(" + [70, h - 280] + ")"  //[x, y] controls position 
}).call(xAxis);  

// Adds Y-Axis as a 'g' element
let svgyAxis = svg.append("g").attr({
    "class": "axis",
    transform: "translate(" + [margin.left-20, -150] + ")"
}).call(yAxis); 

let points = []; // Initialize set of all points on canvas
let on_figure = 0; // Keeps track of which figure the user is editing
let figures = { // "figures" maintains an object of arrays; each array is an (x,y) list of points which makes up a figure.
    fig_0 : []
};

let currCodeStatement = {
    statementType : "", // E.g., "draw"
    preamble : "",       // E.g., "\draw plot ..."
    point : "",          // E.g., "... (x_1, y_1), (x_2, y_2)..."
    end: ""              // E.g., "... };"
}

let darkModeOn = false; // Initialize theme to be light mode
const changeColorTheme = () => {
    darkModeOn = !darkModeOn;
    console.log(darkModeOn, "darkmode");
    if (darkModeOn) {
        document.getElementById("body-wrapper").setAttribute("class", "body-dark");
        document.getElementById("theme-selection").setAttribute("class", "theme-selection-dark");
        document.getElementById("text-heading").setAttribute("class", "text-heading-dark");

        svgxAxis.attr("class", "dark-axis");
        svgyAxis.attr("class", "dark-axis");
    }
    else {
        document.getElementById("body-wrapper").setAttribute("class", "body-light");
        document.getElementById("theme-selection").setAttribute("class", "theme-selection-light");
        document.getElementById("text-heading").setAttribute("class", "text-heading-light");

        svgxAxis.attr("class", "axis");
        svgyAxis.attr("class", "axis");
    }
}

document.getElementById("dark-mode-checkbox").addEventListener("click", changeColorTheme);


/* On Click, we register a point (newData). Below we collect its data and draw it.
*/
svg.on("click", function() {    
    if(currCodeStatement.preamble !== ""){
        // Extract data of clicked point
        let coords = d3.mouse(this);
        let newData= {
            x: Math.round( xScale.invert(coords[0])),  // Takes the pixel number to convert to number
            y: Math.round( yScale.invert(coords[1]))
        };

        currCodeStatement.point = "(" + String(newData.x/10) + "," + String(newData.y/10) + ") ";
        
        // Draw point on the canvas
        points.push(newData);
        figures["fig_"+ String(on_figure)].push(newData); // adds point to the new figure
        updateCodeStatement();
        svg.selectAll("circle") 
        .data(points)
        .enter()
        .append("circle")
        .attr(circleAttrs)
        .attr({id: "c" + "-" + "fig_" + String(on_figure) + "-" + String(figures["fig_"+ String(on_figure)].length-1)})
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut); 
    }
})

/* On click for New Draw Statement Button
*/
document.getElementById("new-draw-button").addEventListener("click", () => {createCodeStatement("draw")});

/* On click for New Node Statement Button
*/
document.getElementById("new-node-button").addEventListener("click", () => {createCodeStatement("node")});

function createCodeStatement(statementType){
    // First, we check if this is not the first figure the user has drawn.
    if (on_figure != 0){
        // We check if the user just finished drawing something. If so, we draw lines between their points.
        if(currCodeStatement.statementType == "draw"){
            // Draw lines between points.
            current_fig = figures["fig_" + String(on_figure)]; 
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
        }
    }
    // We update global variables now that we are on a different figure. 
    on_figure += 1; // Very important. Let's all other functions know that, from now on, we're moving onto a different drawing 
    figures["fig_" + String(on_figure)] = []; // Initialize array which will contain new incoming (x,y) coordinates.
    circleAttrs["fill"] = colors[on_figure]; // Give it a different color.
    
    // Next, we work on setting up their new TikZ code.
    // We create a new span element for the incoming TikZ code
    let newTikZCode = document.createElement("span");

    // We update currCodeStatement, and the span id, based on what type of statement the user wants.
    if (statementType == "draw"){
        currCodeStatement.statementType = "draw";
        currCodeStatement.preamble = "\\draw plot[closed hobby] coordinates {<br>";
        currCodeStatement.end = "};<br>";
    }
    else if (statementType == "node"){
        currCodeStatement.statementType = "node";
        currCodeStatement.preamble = "\\node at ";
        currCodeStatement.end = "{};<br>";
    }
    // Edit TikZ code span tag
    newTikZCode.id = "statement-fig_" + String(on_figure);
    newTikZCode.innerHTML = currCodeStatement.preamble + currCodeStatement.end;
    newTikZCode.style = "color:" + colors[on_figure];

    // Add the new span element to HTML 
    document.getElementById("coordinates").appendChild(newTikZCode);
}

function updateCodeStatement(){
    /* We update the TikZ code output (because the user clicked a new point). 
       We do this by 
        1. Figuring out where in our string (coordinates.innerHTML) to add the new coordinate to the TikZ command
        2. Add the new coordinate 
        3. Update the TiKZ command
    */
    let current_id = "statement-fig_" + String(on_figure);
    let n_Chars = document.getElementById(current_id).innerHTML.length; 
    let n_endCodeChars = currCodeStatement.end.length;

    let newStatement = document.getElementById(current_id).innerHTML.substring(0, n_Chars - n_endCodeChars); //We've figured out where to add our coordinate.
    newStatement += currCodeStatement.point ; // Add the new coordinate 
    newStatement += currCodeStatement.end;    // Add the end code, e.g., it could be "};"
    document.getElementById(current_id).innerHTML = newStatement;     // Update the page with the new TikZ code
}

/* On click for Redraw Current Figure button
*/
document.getElementById("redraw-button").addEventListener("click", redrawObject_onClick);

function redrawObject_onClick () {
    let tuples = figures["fig_" + String(on_figure)];
    for(let i = 0; i < tuples.length; i++){
        d3.select("#c" + "-" + "fig_" + String(on_figure) + "-" + i).remove(); //remove the circles
        points.pop(); //remove the circle's data from "points"
    }
    figures["fig_" + String(on_figure)] = [];
    document.getElementById("statement-fig_" + String(on_figure)).innerHTML = currCodeStatement.preamble + currCodeStatement.end;
    
}

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
function handleMouseOver(d, i) {  // Hovering enlarges the radius, prompts textbox
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
