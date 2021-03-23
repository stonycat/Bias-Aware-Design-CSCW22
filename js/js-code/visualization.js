
function dashboard(id, fData, index, linkdata, hotel){
    // console.log(fData[0]['freq']);
    var barColor = "#8d99ae";//'steelblue';
    function segColor(c){ 
      if (Object.keys(fData[0]['freq']).includes("neutral")) {
        return {positiveOnly:"#fa9601", positiveGenerally:"#ffd60a",neutral:"#c6dbef", 
        negativeGenerally:"#6796C6", negativeOnly:"#08519c"}[c]; 
      } 
      else if(Object.keys(fData[0]['freq']).includes("newReviewer")) {
        return {newReviewer:"#eff3ff", juniorReviewer:"#c6dbef",reviewer:"#9ecae1", 
          seniorReviewer:"#6baed6", proReviewer:"#3182bd", topReviewer:"#08519c"}[c]; 
        }
      else if(Object.keys(fData[0]['freq']).includes("newContributor")){
        return {newContributor:"#eff3ff", juniorContributor:"#c6dbef", contributor:"#9ecae1", 
          seniorContributor:"#6baed6", proContributor:"#3182bd", topContributor:"#08519c"}[c]; 
        }      
        else if(Object.keys(fData[0]['freq']).includes("food")){
        return {food:"#bdd002", facility:"#faa307", surroundings:"#ffd100", 
          service:"#7181b2", companion:"#8bb8e8", travelling_purpose:"#795ea5"}[c]; 
        }
      }
    
    //compute total for each state.
    //emo
    if (Object.keys(fData[0]['freq']).includes("neutral")) {
      fData.forEach(function(d){
        d.total=d.freq.positiveOnly+d.freq.positiveGenerally+d.freq.neutral+d.freq.negativeGenerally+d.freq.negativeOnly;
      });
      // console.log("emo");
    } else if(Object.keys(fData[0]['freq']).includes("newReviewer")){
      //contri
      fData.forEach(function(d){
        d.total=d.freq.newReviewer+d.freq.juniorReviewer+d.freq.reviewer
          +d.freq.seniorReviewer+d.freq.proReviewer+d.freq.topReviewer;});
        // console.log("contri"); 
    } else if (Object.keys(fData[0]['freq']).includes("newContributor")){
      fData.forEach(function(d){
        d.total=d.freq.newContributor+d.freq.juniorContributor+d.freq.contributor
          +d.freq.seniorContributor+d.freq.proContributor+d.freq.topContributor;});
    } else if (Object.keys(fData[0]['freq']).includes("food")){
      fData.forEach(function(d){
        d.total=d.freq.food+d.freq.facility+d.freq.surroundings
          +d.freq.service+d.freq.companion+d.freq.travelling_purpose;});
    }
    
    // function to handle histogram.
    function histoGram(fD, nLdata, legendData){
      // console.log(nLdata);
      var hG={},    hGDim = {t: 40, r: 40, b: 0, l: 40};
      hGDim.w = 500 - hGDim.l - hGDim.r, 
      hGDim.h = 370 - hGDim.t - hGDim.b;
          
      //create svg for histogram.
      var barY = 2*hGDim.h/3 + 1;
      var hGsvg = d3.select(id).append("svg")
          .attr("id", "svg-" + index)
          .attr("width", hGDim.w + hGDim.l + hGDim.r)
          .attr("height", hGDim.h + hGDim.t).append("g")
          .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

      // create function for x-axis mapping.
      var x = d3.scaleBand().range([0, hGDim.w]).padding(0.2)//rangeRound([0, hGDim.w], 2.0) //v3 d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
              .domain(fD.map(function(d) { return d[0]; }));
      // Create function for y-axis map.
      var y = d3.scaleLinear().range([barY, 0])// v3 d3.scale.linear().range([hGDim.h, 0])
              .domain([0, d3.max(fD, function(d) { return d[1]; })]);

      var tooltipBar = d3.select(id).append("div").attr("class", "toolTipBar");
      var tooltipPie = d3.select(id).append("div").attr("class", "toolTipPie");
      // Create bars for histogram to contain rectangles and freq labels.
      var bars = hGsvg.selectAll(".bar").data(fD).enter()
              .append("g").attr("class", "bar");
      //create the rectangles.
      bars.append("rect")
          .attr("x", function(d) { 
            return x(d[0]); 
          })
          .attr("y", function(d) { return y(d[1]); })
          .attr("width", x.bandwidth())//rangeBand())
          .attr("height", function(d) { 
            if (d[1] == 0){
              return 0;
            }
            else {return 2*hGDim.h/3 - y(d[1]); }
          })
          .attr('fill',barColor)
          .attr("id", function(d){
            return "barRect-" + d[0];
          })
          .on("mouseover", barMouseover)
          .on('mousemove', barMousemove)
          .on("mouseout", barMouseout)
          .on("click", function(d) { 
            var filterObj = {};
            if (d[0] == "5"){
              var filterObj = {currentRating: "5.0"};
            } else if(d[0] == "4"){
              var filterObj = {currentRating: "4.0"};
            } else if(d[0] == "3"){
              var filterObj = {currentRating: "3.0"};
            } else if(d[0] == "2"){
              var filterObj = {currentRating: "2.0"};
            } else if(d[0] == "1"){
              var filterObj = {currentRating: "1.0"};
            }
            filterReviews(index, filterObj);
            //bar listen click
            recordClickViz(this, index);
          });

      //Create the frequency labels above the rectangles.
      bars.append("text").text(function(d){ return d3.format(",")(d[1])})
          .attr("x", function(d) { return x(d[0])+x.bandwidth()/2; })
          .attr("y", function(d) { return y(d[1])-10; })
          .attr("text-anchor", "middle");

      //*****add sankey chart in this svg*******//
      var maxNodeY = Math.max(nLdata.links[0].value, nLdata.links[1].value,
        nLdata.links[2].value,nLdata.links[3].value,nLdata.links[4].value);

      var minNodeY = Math.min(nLdata.links[0].value, nLdata.links[1].value,
        nLdata.links[2].value,nLdata.links[3].value,nLdata.links[4].value);


      // console.log(minNodeY, maxNodeY);
      var pieSankey = hGsvg.append("g").attr("class", "sankeyPie")
          .attr("width", hGDim.w + hGDim.l + hGDim.r)
          .attr("height", hGDim.h/5)
          .attr("transform", "translate(" + 0 + "," + barY + ")");
        
      // pieSankey.call(tooltipPie);

      var sankey = d3.sankey()
        .nodeWidth(5) // node.dx = nodeWidth
        .nodePadding(80) 
        .size([hGDim.w, hGDim.h/5]);

      var sankeyPath = sankey.link();
      
      sankey
          .nodes(nLdata.nodes)
          .links(nLdata.links)
          .layout(32); // what is this? iterations

      

      var link = pieSankey.append("g").selectAll(".link").data(nLdata.links)
          .enter().append("path")
          .attr("class", "link");  
          
      var node = pieSankey.append("g").selectAll(".node")
          .data(nLdata.nodes)
        .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d, i) {
              // console.log(i);
              switch(i) {
                case 0: 
                case 5:{
                  d.x = x("5") + (x.bandwidth()-d.dy) / 2; 
                  break;
                }
                case 1: 
                case 6:{
                  d.x = x("4") + (x.bandwidth()-d.dy) / 2; 
                  break;
                }
                case 2: 
                case 7:{
                  d.x = x("3") + (x.bandwidth()-d.dy) / 2; 
                  break;
                }
                case 3: 
                case 8:{
                  d.x = x("2") + (x.bandwidth()-d.dy) / 2; 
                  break;
                }
                case 4: 
                case 9:{
                  d.x = x("1") + (x.bandwidth()-d.dy) / 2; 
                  break;
                }
              };
              return "translate(" + d.x + "," + d.y + ")"; 
          });
          // .call(d3.drag()
          // .on("drag", dragmove));

      //add rect as uppernode
      node.filter(function(d){
          return !d.pieData; //add rect
        }).append("rect")
          .attr("height", sankey.nodeWidth())
          .attr("width", function(d) { 
            // console.log(d.dy, x.bandwidth());
            return Math.min(d.dy, x.bandwidth()); })
          .style("fill", "#CDD0D3");


      //render link later for alignment 
      link.attr("d", sankeyPath)
        .style("stroke-width", function(d) { 
          return Math.min(d.dy, x.bandwidth()); 
        })
        .style("stroke", "#CDD0D3")
        .sort(function(a, b) { 
          return b.dy - a.dy; 
        });

    var outerRadius = 42,
        innerRadius = 0;

    var arc = d3.arc()
        .padRadius(outerRadius)
        // .outerRadius(outerRadius)
        .innerRadius(innerRadius);
    var pie = d3.pie()
          .sort(null)
          .value(function(d) { return d.value; });
    
    
    var g = node.filter(function(d){
        return d.pieData;
      })
    .append("g")
      .attr('transform', function(d,i){ // have been transformed by d.x d.y
        return 'translate('+d.dy/2+',' + 0 + ')';// just change d.x
      })
      .attr("class","pie") //pie
      .attr("id", function(d){
        return "pieId" + d.pieId;
      })
      .selectAll(".arc")
      .data(function(d){return pie(d.pieData);})
      .enter()
    .append("path") 
      .attr("class", "arc") //<path>
      .attr("id", function(d){
        return "arc-" + d.data.type;
      }).each(function(d) { d.outerRadius = outerRadius - 5; })
      .attr("d", arc)
      .attr("fill",function(d,i){ 
          return segColor(d.data.type); 
        })
      // .on("mouseover", arcTween(42, 0))
      // .on("mouseout",  arcTween(37, 150))
      .on("mouseover", pieMouseover)
      .on("mousemove", pieMousemove)
      .on("mouseout", pieMouseout)
      .on("click", function(d){
        var barId = $(this).parent().attr('id');
        filter2Criteria(index, d.data.type, barId);
        //listen pie
        recordClickViz(this, index);
      });

              
    // Add x-axis to the histogram svg.
    hGsvg.append("g").attr("class", "x axis")
          .style("font-size", "15px")
          .attr("transform", "translate(0," + 2*hGDim.h/3 + ")")
          .call(d3.axisBottom().tickSize(0).scale(x));

    // function dragmove(d) {
    //   //d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
    //   d3.select(this).attr("transform", "translate(" + (d.x = Math.max(0, Math.min(hGDim.w - d.dy, d3.event.x))) + "," + d.y + ")");
    //   sankey.relayout();
    //   link.attr("d", sankeyPath);
    // }

    // function arcTween(outerRadius, delay) { 
    //   return function() {
    //     // console.log("change");
    //     d3.select(this).transition().delay(delay).attrTween("d", function(d) {
    //       var i = d3.interpolate(d.outerRadius, outerRadius);
    //       // console.log(d.outerRadius, outerRadius);
    //       return function(t) { d.outerRadius = i(t); return arc(d); };
    //     });
    //   };
    // }

    function pieMouseover(d) {
      tooltipPie.style('display', 'inline');

      RecordOver_arc(d.data.type, this, hotel.index);
        // return function() {
        d3.select(this).transition().delay(0).attrTween("d", function(d) {
          var i = d3.interpolate(d.outerRadius, 42);
          // console.log(d.outerRadius, outerRadius);
          return function(t) { d.outerRadius = i(t); return arc(d); };
        });
    }

    function pieMousemove(d) {
      var svg = this.closest('svg');
      var xP = d3.event.pageX - svg.getBoundingClientRect().x;
      var yP = d3.event.pageY - svg.getBoundingClientRect().y - window.scrollY;
      // console.log("pie:", xP, yP); 

      var barNum  = this.parentElement.id.split("pieId")[1];
      var st = fData.filter(function(s){ return s.State == barNum;});
      
      var perc = d.value/st[0].total;
      perc = d3.format(".2%")(perc.toFixed(4));
      var newHtml = [];
      newHtml.push('<table><small style="color:blue"> Click to filter review</small>');
      newHtml.push(
            '<tr>', 
            '<td id="key">' + d.data.type + '</td>',
            '<td id="value">' + d.data.value + '</td>', 
            '<td id="value">' + perc + '</td>', 
            '</tr>');
      newHtml.push('</table>');
      tooltipPie
      //  .attr("transform", "translate(" + xPosition + "," + yPosition + ")")
        .style("left", xP  + "px")
        .style("top", yP + "px")
        .style("display", "inline-block")
        .html(newHtml.join("  "));
    }

    function pieMouseout(d) {
      tooltipPie.style('display', 'none');

      RecordOut_arc(d.data.type, this, hotel.index);
        // return function() {
        d3.select(this).transition().delay(150).attrTween("d", function(d) {
          var i = d3.interpolate(d.outerRadius, 37);
          // console.log(d.outerRadius, outerRadius);
          return function(t) { d.outerRadius = i(t); return arc(d); };
        });
    }

    function barMouseover(d){  // utility function to be called on mouseover.
      //tooltip
      tooltipBar.style('display', 'inline');
      RecordOver_b(this, hotel.index);
      // grey pie
      var curPieId = parseInt(d[0]);
      // console.log("moveon", curPieId);
      for (i = 1; i < 6; i++)
      { if (i != curPieId){
          var tagDiv = $("#dashboard" + index).find(".sankeyPie");
          var pieDiv = tagDiv.find("#pieId" + i);
          pieDiv.find("path").css({fill: "#CDD0D3"});
          // $("#pieId" + i).find("path").css({fill: "#CDD0D3"});
        } else {
          continue;
      }}
      // filter for selected state.
      // var st = fData.filter(function(s){ return s.State == d[0];})[0],
      //     nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});
      // leg.update(nD);

      //bar listen mouseover
    }

    function  barMousemove(d) {
        var xPosition = d3.mouse(this)[0] + 50;   //d3.event.pageX;
        var yPosition = d3.mouse(this)[1] + 5;    //d3.event.pageY;
        // console.log("bar:", xPosition, yPosition);

        var st = fData.filter(function(s){ return s.State == d[0];})[0],
            nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});
        var perc = [];
        nD.forEach(function(t, ind){
          var temp = nD[ind].freq/d3.sum(nD.map(function(v){ return v.freq; }));
          perc[ind] = d3.format(".2%")(temp.toFixed(4));
        })

        var newHtml = [];
        newHtml.push('<table><h6>' + d[1] + ' ' 
          + '<small style="color:blue"> Click to filter review</small></h6>');
        // console.log("nD", nD);  
        nD.forEach(function(t, ind){
          // console.log(t);
          newHtml.push(
            '<tr>', 
            '<td id="key">' + nD[ind].type + '</td>',
            '<td id="value">' + nD[ind].freq + '</td>', 
            '<td id="value">' + perc[ind] + '</td>', 
            '</tr>')
        })
        newHtml.push('</table>');
        // console.log("mousemove", nD[0]);
        tooltipBar
          // .attr("transform", "translate(" + xPosition + "," + yPosition + ")")
          .style("left", xPosition  + "px")
          .style("top", yPosition + "px")
          .style("display", "inline-block")
          .html(newHtml.join("  "));

        
    }
    
    function barMouseout(d){    // utility function to be called on mouseout.
        //tooltip
        tooltipBar.style('display', 'none');
        //remove grey
        var curPieId = parseInt(d[0]);
        // console.log("moveout", curPieId);
        for (i = 1; i < 6; i++){
          if (i != curPieId){
            var tagDiv = $("#dashboard" + index).find(".sankeyPie");
            var pieDiv = tagDiv.find("#pieId" + i);
            pieDiv.find("path").css({fill: ""});
            // $("#pieId" + i).find("path").css({fill: ""});
          }
        }
        RecordOut_b(this, hotel.index);
        // reset the pie-chart and legend.    
        // leg.update(tF);
    }
    
    // create function to update the bars. This will be used by pie-chart.
    hG.update = function(nD, color){
        // update the domain of the y-axis map to reflect change in frequencies.
        y.domain([0, d3.max(nD, function(d) { return d[1]; })]);
        
        // Attach the new data to the bars.
        var bars = hGsvg.selectAll(".bar").data(nD);
        // transition the height and color of rectangles.
        bars.select("rect").transition().duration(500)
            .attr("y", function(d) {return y(d[1]); })
            .attr("height", function(d) { return barY - y(d[1]); })
            .attr("fill", color);

        // transition the frequency labels location and change value.
        bars.select("text").transition().duration(500)
            .text(function(d){ return d3.format(",")(d[1])})
            .attr("y", function(d) {return y(d[1])-10; });            
    }        
        return hG;
    }


    // function to handle legend.
  function legend(lD, id, hotel){
    var leg = {}, legDim = {t: 0, r: 0, b: 0, l: 20};
    legDim.w = 300 - legDim.l - legDim.r, 
    legDim.h = 180 - legDim.t - legDim.b;
    // create table for legend.
    
    var legend = d3.select(id).append("table").attr('class','legend')
        .attr("width", legDim.w + legDim.l + legDim.r)
        .attr("height", legDim.h + legDim.t + legDim.b)
        .attr("transform", "translate(" + legDim.l + ",0");

    // var tooltipRec = legend.append("div").attr("class", "toolTipRec");
    // create one row per segment.
    var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");
    var tooltipTag = legend.append("div").attr("class", "toolTipTag");
    // create the first column for each segment.
    tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
        .attr("width", '16').attr("height", '16')
        .attr("id", function(d){
            return "legendRect-" + d.type;
          })
        .attr("fill",function(d){ return segColor(d.type); })
        .on("mouseover", mouseover)
        .on("mouseout",mouseout)
        .on("click", function(d) { 
            filterCategory(index, d.type);
            //listen
            recordClickViz(this, index);
          });
      
    // create the second column for each segment.
    tr.append("td").text(function(d){ return d.type;});
    //create filtering tags
    tr.selectAll("td").each(function(d, i){
      // console.log(d, i);
      if (d.type === "food" && i == 1){
        var tags = hotel.filterTagsFood;
        var tagsP = hotel.filterPercFood;
        for (i=0; i<tags.length;i++){
          var food = d3.select(this.parentNode).append("td")
          .style("text-align","center");
          food.append("button").text(tags[i]).attr("class", "tag");
          food.on("click", function(){
            filterTag(index, this.childNodes[0]);
            recordClickAspectsTag(this.childNodes[0].innerHTML,hotel.index);
          })
          .on("mouseover", function(){
            tagMouseover(this.childNodes[0], tags, tagsP);
          })
          .on("mouseout", function(){
            tagMouseout();
          });
        }

      }
      else if (d.type == "facility" && i == 1) {
        var tags = hotel.filterTagsFacility;
        var tagsP = hotel.filterPercFacility;
        for (i=0; i<tags.length;i++){
          var facility = d3.select(this.parentNode).append("td").style("text-align","center");
              facility.append("button").text(tags[i]).attr("class", "tag");
          facility.on("click", function(){
            filterTag(index, this.childNodes[0]);
            recordClickAspectsTag(this.childNodes[0].innerHTML,hotel.index);
          }).on("mouseover", function(){
            tagMouseover(this.childNodes[0], tags, tagsP);
          })
          .on("mouseout", function(){
            tagMouseout();
          });
        }
      }     
      else if (d.type == "surroundings" && i == 1) {
        var tags = hotel.filterTagsSurroundings;
        var tagsP = hotel.filterPercSurroundings;
        for (i=0; i<tags.length;i++){
          var sur = d3.select(this.parentNode).append("td").style("text-align","center");
              sur.append("button").text(tags[i]).attr("class", "tag");
          sur.on("click", function(){
            filterTag(index, this.childNodes[0]);
            recordClickAspectsTag(this.childNodes[0].innerHTML,hotel.index);
          }).on("mouseover", function(){
            tagMouseover(this.childNodes[0], tags, tagsP);
          })
          .on("mouseout", function(){
            tagMouseout();
          });
        }
      }
      else if (d.type == "service" && i == 1) {
        var tags = hotel.filterTagsService;
        var tagsP = hotel.filterPercService;
        for (i=0; i<tags.length;i++){
          var service = d3.select(this.parentNode).append("td").style("text-align","center");
              service.append("button").text(tags[i]).attr("class", "tag");
          service.on("click", function(){
            filterTag(index, this.childNodes[0]);
            recordClickAspectsTag(this.childNodes[0].innerHTML,hotel.index);
          }).on("mouseover", function(){
            tagMouseover(this.childNodes[0], tags, tagsP);
          })
          .on("mouseout", function(){
            tagMouseout();
          });
        }
      }
      else if (d.type == "companion" && i == 1) {
        var tags = hotel.filterTagsCompanion;
        var tagsP = hotel.filterPercCompanion;
        for (i=0; i<tags.length;i++){
          var companion = d3.select(this.parentNode).append("td").style("text-align","center");
              companion.append("button").text(tags[i]).attr("class", "tag");
          companion.on("click", function(){
            filterTag(index, this.childNodes[0]);
            recordClickAspectsTag(this.childNodes[0].innerHTML,hotel.index);
          }).on("mouseover", function(){
            tagMouseover(this.childNodes[0], tags, tagsP);
          })
          .on("mouseout", function(){
            tagMouseout();
          });
        }
      }
      else if (d.type == "travelling_purpose" && i == 1) {
        var tags = hotel.filterTagsTravelling_purpose;
        var tagsP = hotel.filterPercTravelling_purpose;
        for (i=0; i<tags.length;i++){
          var travel = d3.select(this.parentNode).append("td").style("text-align","center");
              travel.append("button").text(tags[i]).attr("class", "tag");
          travel.on("click", function(){
            filterTag(index, this.childNodes[0]);
            recordClickAspectsTag(this.childNodes[0].innerHTML,hotel.index);
          }).on("mouseover", function(){
            tagMouseover(this.childNodes[0], tags, tagsP);
          })
          .on("mouseout", function(){
            tagMouseout();
          });
        }
      }
    })
    
    
    // var alert = d3.select(id).append("div")
    //   .attr("class", "alert alert-danger")
    //   .attr("role", "alert")
    //   .text("There are % reviews with extreme emotions in this hotel");

    function tagMouseover(el, tags, perc) {
      // console.log("over", el.innerHTML, tags.indexOf(el.innerHTML));
      // var svg = el.closest('svg');
      var showTxt = perc[tags.indexOf(el.innerHTML)];
      // var xP = d3.event.pageX - svg.getBoundingClientRect().x;
      // var yP = d3.event.pageY - svg.getBoundingClientRect().y - window.scrollY;
      var xP = d3.event.x - 100;
      var yP = d3.event.y - 170;

      var newHtml = [];
      newHtml.push('<small style="color:blue"> Click to filter review</small><br>'
            + showTxt + "users mentioned it");
      tooltipTag
        .style("left", xP  + "px")
        .style("top", yP + "px")
        .style("display", "inline-block")
        .html(newHtml.join(" "));
      
    }
    function tagMouseout() {
      tooltipTag.style('display', 'none');
    }
  
    // create the third column for each segment.
    // tr.append("td").attr("class",'legendFreq')
    //     .text(function(d){ return d3.format(",")(d.freq);});

    // // create the fourth column for each segment.
    // tr.append("td").attr("class",'legendPerc')
    //     .text(function(d){ 
    //       return getLegend(d,lD);
    //     });

    // Utility function to be used to update the legend.
    // leg.update = function(nD){
    //     // update the data attached to the row elements.
    //     var l = legend.select("tbody").selectAll("tr").data(nD);
        
    //     // update the frequencies.
    //     l.select(".legendFreq").text(function(d){ return d3.format(",")(d.freq);});

    //     // update the percentage column.
    //     l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});        
    // }
    
    // function getLegend(d,aD){ // Utility function to compute percentage.
    //     // return d3.format("%")(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
    //     var tempperc = d.freq/d3.sum(aD.map(function(v){ return v.freq; }));
    //     return d3.format(".2%")(tempperc.toFixed(4));
    // }
        
    function mouseover(d){ //legend mouse
        RecordOver_b(this, hotel.index);
        
        // //grey all pies, focus on the bars
        // // $('.arc').not('#arc-' + d.type).find("path").css({fill: "#CDD0D3"});
        $('.arc').not('#arc-' + d.type).css({fill: "#CDD0D3"});
        // call the update function of histogram with new data.
        var aspectsList = ['food', 'facility', 'surroundings', 'service', 'companion', 'travelling_purpose'];
        if (aspectsList.includes(d.type)) {
          hG.update(fData.map(function(v){ 
            return [v.State,v.freq2[d.type]];}),segColor(d.type));
        } else {
          hG.update(fData.map(function(v){ 
            return [v.State,v.freq[d.type]];}),segColor(d.type));
        }

    }
    //Utility function to be called on mouseout a pie slice.
    function mouseout(d){
      // tooltipRec.style('display', 'none'); 
      RecordOut_b(this, hotel.index);
      $('.arc').css({fill: ""});
      
      hG.update(fData.map(function(v){
          return [v.State,v.total];}), barColor);
      }
      return leg;
    } 

    // calculate total frequency by segment for all state.
    if (Object.keys(fData[0]['freq']).includes("neutral")){
        var tF = ['positiveOnly','positiveGenerally','neutral','negativeGenerally','negativeOnly'].map(function(d){ 
          return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))}; 
        });  
    }
    else if (Object.keys(fData[0]['freq']).includes("reviewer")) {
        var tF = ['newReviewer','juniorReviewer', 'reviewer','seniorReviewer',
        'proReviewer', 'topReviewer'].map(function(d){ 
            return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))}; 
        });    
    } else if (Object.keys(fData[0]['freq']).includes("contributor")) {
        var tF = ['newContributor', 'juniorContributor', 'contributor','seniorContributor',
        'proContributor', 'topContributor'].map(function(d){ 
            return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))}; 
        });    
    } else if (Object.keys(fData[0]['freq']).includes("food")) {
        var tF = ['food', 'facility', 'surroundings','service','companion', 
          'travelling_purpose'].map(function(d){ 
            return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))}; 
        });    
    }
      
    // calculate total frequency by state for all segment.
    var sF = fData.map(function(d){return [d.State,d.total];});

    var st5 = fData.filter(function(s){ return s.State;})[0],
          nD5 = d3.keys(st5.freq).map(function(s){ return {type:s, freq:st5.freq[s]};});
    var st4 = fData.filter(function(s){ return s.State;})[1],
          nD4 = d3.keys(st4.freq).map(function(s){ return {type:s, freq:st4.freq[s]};})
    var st3 = fData.filter(function(s){ return s.State;})[2],
          nD3 = d3.keys(st3.freq).map(function(s){ return {type:s, freq:st3.freq[s]};})
    var st2 = fData.filter(function(s){ return s.State;})[3],
          nD2 = d3.keys(st2.freq).map(function(s){ return {type:s, freq:st2.freq[s]};})
    var st1 = fData.filter(function(s){ return s.State;})[4],
          nD1 = d3.keys(st1.freq).map(function(s){ return {type:s, freq:st1.freq[s]};})
    //console.log("all data:", fData);

    var linkDataEmo = {
    "nodes": [{
      "node": 0,
      "name": "1"
    },  {
      "node": 1,
      "name": "2"
    }, {
      "node": 2,
      "name": "3"
    }, {
      "node": 3,
      "name": "4"
    }, {
      "node": 4,
      "name": "5"
    },{
      "node": 5,
      "name": "6",
      "pieId": 5,
      "pieData": [{
        "value": Math.random()
      },{
        "value": Math.random()
      },{
        "value": Math.random()
      },{
        "value": Math.random()
      },{
        "value": Math.random()
      }]
    },{
      "node": 6,
      "name": "7",
      "pieId": 4,
      "pieData": [{
        "value": Math.random()
      },{
        "value": Math.random()
      },{
        "value": Math.random()
      },{
        "value": Math.random()
      },{
        "value": Math.random()
      }]
    },
    {
      "node": 7,
      "name": "8",
      "pieId": 3,
      "pieData": [{
        "value": Math.random()
      },{
        "value": Math.random()
      },{
        "value": Math.random()
      },{
        "value": Math.random()
      },{
        "value": Math.random()
      }]
    },
    {
      "node": 8,
      "name": "9",
      "pieId": 2,
      "pieData": [{
        "value": Math.random()
      },{
        "value": Math.random()
      },{
        "value": Math.random()
      },{
        "value": Math.random()
      },{
        "value": Math.random()
      }]
    }, {
      "node": 9,
      "name": "10",
      "pieId": 1,
      "pieData": [{
        "value": Math.random()
      },{
        "value": Math.random()
      },{
        "value": Math.random()
      },{
        "value": Math.random()
      },{
        "value": Math.random()
      }]
    }
    ], //all nodes
    "links": [{
      "source": 0,
      "target": 5,
      "value": 64
    }, {
      "source": 1,
      "target": 6,
      "value": 54  //node.dy = node.value * ky, ky~nodePadding & value
    },
    {
      "source": 2,
      "target": 7,
      "value": 15 
    }, {
      "source": 3,
      "target": 8,
      "value": 1 
    },
    {
      "source": 4,
      "target": 9,
      "value": 7  
    }]// all links
    }    
    // console.log(linkNum1);
    linkDataEmo.links.map((link, index, arr) => {
      ind = (index+1).toString()
      if (ind == "5") ind2 = "1"
      if (ind == "4") ind2 = "2"
      if (ind == "3") ind2 = "3"
      if (ind == "2") ind2 = "4"
      if (ind == "1") ind2 = "5"
      // console.log(link.value, ind2);
      link.value = linkdata[ind2];
    })

    // read link data from fData
    Object.size = function(obj) {
      var size = 0,
        key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    };

    if (Object.size(fData[0]['freq']) == 5){
      // add link value
      linkDataEmo.nodes.map((item, index, arr)=>{
        // console.log(item.name);
        if (item.hasOwnProperty("pieData")) { 
          item.pieData.map((itemPie, indPie, arrPie) => {            
            itemPie.value = fData[index-5]['freq'][Object.keys(fData[index-5]['freq'])[indPie]];
            itemPie.type = Object.keys(fData[index-5]['freq'])[indPie];
            });
          }
      })
    }
    
    else if (Object.size(fData[0]['freq']) == 6) {
      linkDataEmo.nodes.map((item, index, arr)=>{
        if (item.hasOwnProperty("pieData")) { 
          item['pieData'].push({"value": Math.random()});
        }
      })
      linkDataEmo.nodes.map((item, index, arr)=>{
      //   // console.log(item.name);
        if (item.hasOwnProperty("pieData")) { 
          item.pieData.map((itemPie, indPie, arrPie) => {   
            // console.log(fData[index-5]['freq'], Object.keys(fData[index-5]['freq'])[indPie]);
            itemPie.value = fData[index-5]['freq'][Object.keys(fData[index-5]['freq'])[indPie]];
            itemPie.type = Object.keys(fData[index-5]['freq'])[indPie];
          });
        }
      })
    }

    //sankeyPie(linkDataEmo);
    var hG = histoGram(sF, linkDataEmo, tF); // create the histogram.
    legend(tF, '#legend' + index, hotel);  // create the legend.
    // console.log(sF);

}


  // code to run after the elements are created
function embedVis() {
  context.hotels.forEach(hotel => {
    var visDiv = document.getElementById("modal-vis-" + hotel.index);
    visDiv.className = 'row';
    
    var dashboardDiv = document.createElement('div');
    dashboardDiv.id = 'dashboard' + hotel.index;
    
    var legendDiv = document.createElement('div');
    legendDiv.id = 'legend' + hotel.index;
    
    
    var buttonGroup = document.createElement('div');
    buttonGroup.classList.add("btn-group", "btn-group-sm");
    buttonGroup.id = "groupButton" + hotel.index;
    buttonGroup.setAttribute("role", "group");
    buttonGroup.setAttribute("aria-label", "Basic example");
    buttonGroup.style.paddingLeft = '30px';
    buttonGroup.style.paddingRight = '30px';
    
    
    var buttonEmo = document.createElement('button');
    buttonEmo.classList.add("btn", "btn-outline-primary", "active");
    buttonEmo.id = 'buttonEmo' + hotel.index;
    buttonEmo.innerHTML = 'Emotion';
    var buttonContri = document.createElement('button');
    buttonContri.classList.add("btn", "btn-outline-primary");
    buttonContri.id = 'buttonContri' + hotel.index;
    buttonContri.innerHTML = 'Contribution';
    var buttonHelpfulv = document.createElement('button');
    buttonHelpfulv.classList.add("btn", "btn-outline-primary");
    buttonHelpfulv.id = 'buttonHelpfulv' + hotel.index;
    buttonHelpfulv.innerHTML = 'Helpful votes';
    var buttonKeywords = document.createElement('button');
    buttonKeywords.classList.add("btn", "btn-outline-primary");
    buttonKeywords.id = 'buttonKeywords' + hotel.index;
    buttonKeywords.innerHTML = 'Aspects';
    
    buttonGroup.appendChild(buttonEmo);
    buttonGroup.appendChild(buttonContri);
    buttonGroup.appendChild(buttonHelpfulv);
    buttonGroup.appendChild(buttonKeywords);
    
    
    visDiv.appendChild(dashboardDiv);
    visDiv.appendChild(legendDiv);
    visDiv.appendChild(buttonGroup);
    // buttonDiv.appendChild(filterBox);
    visDiv.insertAdjacentElement('beforebegin', buttonGroup);
    
    var hotelCategoryData = JSON.parse(JSON.stringify(hotelEmoAll[hotel.index]));
    
    //switch function

    dashboard('#dashboard'+ hotel.index, hotelCategoryData, hotel.index, linkNumAll[hotel.index], hotel);
    
  });
  // console.log(context.hotels[0]);
}


embedVis();

function groupClick() {
  
    $(".btn-group > .btn").click(function(){
          $(".btn-group > .btn").removeClass("active");
          $(this).addClass("active");
          // console.log(this.id);
          recordClickResult(this);
          if (this.id.includes('Contri')) {
            // console.log("switch contri");
            var curInd = this.id.replace('buttonContri', '');
            var contriLoad = JSON.parse(JSON.stringify(hotelContriAll[curInd]));
            var removeLegend = document.getElementById('legend' + curInd);
            removeLegend.innerHTML = '';
            var removeBar = document.getElementById('dashboard' + curInd);
            removeBar.innerHTML = '';
            
            dashboard('#dashboard'+ curInd, contriLoad, curInd, linkNumAll[curInd], context.hotels[curInd]);
    
          } 
          else if (this.id.includes('Emo')) {
            // console.log("switch emo");
            var curInd = this.id.replace('buttonEmo', '');
            var emoLoad = JSON.parse(JSON.stringify(hotelEmoAll[curInd]));
            var removeLegend = document.getElementById('legend' + curInd);
            removeLegend.innerHTML = '';
            var removeBar = document.getElementById('dashboard' + curInd);
            removeBar.innerHTML = '';
    
            dashboard('#dashboard'+ curInd, emoLoad, curInd, linkNumAll[curInd], context.hotels[curInd]);
    
          }
          else if (this.id.includes('Helpfulv')) {
            // console.log("switch Helpfulv");
            var curInd = this.id.replace('buttonHelpfulv', '');
            var helpfulvLoad = JSON.parse(JSON.stringify(hotelHelpfulAll[curInd]));
            var removeLegend = document.getElementById('legend' + curInd);
            removeLegend.innerHTML = '';
            var removeBar = document.getElementById('dashboard' + curInd);
            removeBar.innerHTML = '';

            dashboard('#dashboard'+ curInd, helpfulvLoad, curInd, linkNumAll[curInd], context.hotels[curInd]);

          }
          else if (this.id.includes('Keywords')) {
            // console.log("switch aspects");
            var curInd = this.id.replace('buttonKeywords', '');
            var keywordsLoad = JSON.parse(JSON.stringify(hotelWordsAll[curInd]));
            var removeLegend = document.getElementById('legend' + curInd);
            removeLegend.innerHTML = '';
            var removeBar = document.getElementById('dashboard' + curInd);
            removeBar.innerHTML = '';
          
            dashboard('#dashboard'+ curInd, keywordsLoad, curInd, linkNumAll[curInd], context.hotels[curInd]);
          }
      });
  
  }


groupClick();




function embedSingleVis(index) {
    console.log("single vis");
    var visDiv = document.getElementById("modal-vis-" + index);
    visDiv.className = 'row';
    
    var dashboardDiv = document.createElement('div');
    dashboardDiv.id = 'dashboard' + index;
    
    var legendDiv = document.createElement('div');
    legendDiv.id = 'legend' + index;
    
    // var buttonDiv = document.getElementById("modal-button-" + hotel.index);
    // buttonDiv.class = 'row';
    
    var buttonGroup = document.createElement('div');
    buttonGroup.classList.add("btn-group", "btn-group-sm");
    buttonGroup.id = "groupButton" + index;
    buttonGroup.setAttribute("role", "group");
    buttonGroup.setAttribute("aria-label", "Basic example");
    // var buttonGroup = document.getElementById('groupButton' + hotel.index);
    buttonGroup.style.paddingLeft = '30px';
    buttonGroup.style.paddingRight = '30px';
    
    // var checkBox = document.getElementsByClassName('checkBox' + hotel.index);
    // checkBox.style.height = '8px';
    // checkBox.style.width = '12px';
    
    var buttonEmo = document.createElement('button');
    buttonEmo.classList.add("btn", "btn-outline-primary", "active");
    buttonEmo.id = 'buttonEmo' + index;
    buttonEmo.innerHTML = 'Emotion';
    var buttonContri = document.createElement('button');
    buttonContri.classList.add("btn", "btn-outline-primary");
    buttonContri.id = 'buttonContri' + index;
    buttonContri.innerHTML = 'Contribution';
    var buttonHelpfulv = document.createElement('button');
    buttonHelpfulv.classList.add("btn", "btn-outline-primary");
    buttonHelpfulv.id = 'buttonHelpfulv' + index;
    buttonHelpfulv.innerHTML = 'Helpful votes';

    var buttonKeywords = document.createElement('button');
    buttonKeywords.classList.add("btn", "btn-outline-primary");
    buttonKeywords.id = 'buttonKeywords' + index;
    buttonKeywords.innerHTML = 'Aspects';

    // var buttonKeywords2 = document.createElement('button');
    // buttonKeywords2.classList.add("btn", "btn-outline-primary");
    // buttonKeywords2.id = 'buttonKeywords2' + index;
    // buttonKeywords2.innerHTML = 'keywords';
    
    buttonGroup.appendChild(buttonEmo);
    buttonGroup.appendChild(buttonContri);
    buttonGroup.appendChild(buttonHelpfulv);
    buttonGroup.appendChild(buttonKeywords);
    // buttonGroup.appendChild(buttonKeywords2);
    
    
    visDiv.appendChild(dashboardDiv);
    visDiv.appendChild(legendDiv);
    visDiv.appendChild(buttonGroup);
    // buttonDiv.appendChild(filterBox);
    visDiv.insertAdjacentElement('beforebegin', buttonGroup);
    
    var hotelCategoryData = JSON.parse(JSON.stringify(hotelEmoAll[index]));
    
    //switch function

    dashboard('#dashboard'+ index, hotelCategoryData, index, linkNumAll[index], hotel);
}
