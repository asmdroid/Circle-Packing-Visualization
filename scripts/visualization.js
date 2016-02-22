function visualization(jsonName){

  var STATE_COLOR = true;

  var margin = 20,
      diameter = 960;

  var color = d3.scale.linear()
      .domain([-1, 5])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

  var pack = d3.layout.pack()
      .padding(2)
      .size([diameter - margin, diameter - margin])
      .value(function(d) { return d.size; })

  var svg = d3.select("body").append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
    .append("g")
      .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

  d3.json(jsonName, function(error, root) {
    if (error) return console.error(error);

    inZoom = false;

    var focus = root,
        nodes = pack.nodes(root),
        view;

    var circle = svg.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
        .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
        .style("fill-opacity", function(d) { return opacity(d); })
        .style("stroke-opacity", function(d) { return d.parent === root ? 1 : 0; })
        .style("fill", function(d) { return getColor(d); })
        .on("mouseover", function(d){ return onHover(d);})
        .on("mouseleave",function(d){ return outHover(d);})
        .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });


    var text = svg.selectAll("text")
        .data(nodes)
      .enter().append("text")
        .attr("class", function(d) { return d.parent ? d.children ? "label" : "label--leaf" : "label"; })
        .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
        .style("display", function(d) { return d.parent === root ? null : "none"; })
        .text(function(d) { return d.name; });

    var node = svg.selectAll("circle,text");

    d3.select("body")
        .style("background", color(-1))
        .on("click", function() { zoom(root); });

    zoomTo([root.x, root.y, root.r * 2 + margin]);

  function opacity(d){
    if (d.depth == 1 || d.depth == 0){
      return 1;
    }
    else{
      return 0;
    }
  }

  function opacityInTran(d,focus){
    if (d === focus){
      return 0.5;
    }else if (d.parent === focus){
      return 1;
    }
    else{
      return 0;
    }
  }

  function outHover(d){
  	//TODO si está sobre texto no hacer nada
    if (inZoom == false){
    var focus0 = d;
    /*d3.selectAll("circle")
      .filter(function(d){ return d === focus0})
      .style("fill-opacity", 1)
      .style("stroke-opacity", 1);*/

    d3.selectAll("circle")
      .filter(function(d){ return d.depth == 1})
      .style("fill-opacity", 1)
      .style("stroke-opacity", 0);

    d3.selectAll("circle")
      .filter(function(d){ return d.depth == 2})
      .style("fill-opacity", 0)
      .style("stroke-opacity", 0);

    d3.selectAll("text")
      .filter(function(d){ return d.depth == 2})
      .style("fill-opacity", 0)
      .style("display", "none");

    d3.selectAll("text")
      .filter(function(d){ return d.depth == 1})
      .style("fill-opacity", 1)
      .style("display", null);

    d3.selectAll("text")
      .filter(function(d){ return d === focus0})
      .style("fill-opacity", 1)
      .style("display", null);
    }
    //Selecciona todas las líneas y las borra
    d3.selectAll("line").remove()
  }

  function onHover(d){
    var focus0 = d;
    if (d.parent){
    	var padreN = d.parent.name;
    	var children = d.children;
    	var xchild = children[0].x;
    	var ychild = children[0].y;
	}
    if (inZoom == false){
    d3.selectAll("circle")
      .filter(function(d){ return d === focus0})
      .style("fill-opacity", 0.5);

    /*d3.selectAll("circle")
      .filter(function(d){ return d.parent === focus0})
      .style("fill-opacity", 1)
      .style("stroke-opacity", 0);*/

    d3.selectAll("text")
      .filter(function(d){ return d.parent === focus0})
      .style("fill-opacity", 1)
      .style("display", null);

    d3.selectAll("text")
      .filter(function(d){ return d === focus0})
      .style("fill-opacity", 0)
      .style("display", "none");
    /*d3.selectAll("text")
      .filter(function (d) { return d.parent;})
      .style("fill-opacity", function (d) { return opacityText(d,focus0);})
      .style("display", null);*/
    }
    //Detecta todas las transicioines de este estado.
    d3.selectAll("circle")
    		.filter(function(d){ return getParent(d,children);})
    		.style("fill-opacity", 0.5)
    		.style("stroke","#000")
    		.style("stroke-width", "1.5px")
    		.style("stroke-opacity", 1);
    d3.selectAll("text")
    		.filter(function(d){ return getParent(d,children);})
    		.style("fill-opacity", 0)
      		.style("display", "none");
    /*var arrayNames = [];
    d3.selectAll("circle")
    		.filter(function(d){ return getChildrenTransitionNames(d,children,arrayNames);});

    /*d3.selectAll("circle")
    		.filter(function(d){ return setNoTransition(d,children,arrayNames);})
      		.style("stroke","#000")
      		.style("stroke-width", "1px")
      		.style("stroke-opacity", 1);*/
    var i;
    for (i = 0; i < children.length; i++){
    	
    	d3.selectAll("circle")
      		.filter(function(d){ return d.name === children[i].name})
      		.style("fill-opacity", 1);
      	d3.selectAll("text")
      		.filter(function(d){ return d.name === children[i].name})
      		.style("fill-opacity", 1)
      		.style("display", null);

    }
    //Devuelve las variables que están en el estado sobre el que estamos en otros estados indivando su x e y
    //Dibujar las líneas entre ellos
    return null
  }

  /*function setNoTransition(d,children0,arrayNames){
  	if d.name === 
  	if (arrayNames.indexOf(d.name) > -1){

  	}
  }

  function getChildrenTransitionNames(d,children0,arrayNames){
  	var i;
  	var len = children0.length;
  	childParent = children0[0].parent;
  	if (d.parent){
  	for (i=0;i<children0.length;i++){
  		var name1 = d.name;
  		var name2 = children0[i].name;
  		if (name1 === name2 && d.parent !== childParent){
  			if (arrayNames.indexOf(name1) == -1){
  				arrayNames[arrayNames.length] = name1;
  			}
  		}
  	}
  	}
  }*/

  function getParent(d,children0){
  	var j;
  	var i;
  	if (d.children){
	  	var childrenD = d.children;
	  	for (i=0;i<childrenD.length;i++){
		  	for (j = 0; j < children0.length; j++){
		  		var name1 = childrenD[i].name;
		  		var name2 = children0[j].name;
		  		if (name1 === name2){
		  			return true;
		  		}
		  	}
	  	}
  	}
  }

  function opacityText(d,focus0){
    if (d.parent){
    if (focus0.name === d.parent.name){
      return 1;
    }
    }
  }

  function displayText(d,focus0){
    if (d.parent){
    if (focus0.name === d.parent.name){
      return null;
    }
    }
  }

  function getColor(d){
    /*if (d.transition){
      //return "rgb("+ColourValues[d.transition]+")";
      return d.transition
    }*/
    if (STATE_COLOR){
      if (d.color){
        //return "rgb("+ColourValues[d.transition]+")";
        return d.color
      }
    }
    if (d.depth == 0){
      return color(d.depth);
    }else if (d.depth == 1){
      return d.color;
    }
    else{
      return null;
    }
  }

  function zoom(d) {
    var focus0 = focus; focus = d;
    if (inZoom){
      inZoom = false;
    }else{
      if (d !== root){
        inZoom = true;
      }
    }
    var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
          return function(t) { zoomTo(i(t)); };
        });

    transition.selectAll("text")
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function(d) { return opacityInTran(d,focus); })
        .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });

    transition.selectAll("circle")
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function(d) { return opacityInTran(d,focus); })
        .style("stroke-opacity", function(d) { return opacityInTran(d,focus); })
        .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .each("end", function(d) { if (d.parent !== focus) this.style.display = "inline"; });
  }

  function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }
});

d3.select(self.frameElement).style("height", diameter + "px");
}