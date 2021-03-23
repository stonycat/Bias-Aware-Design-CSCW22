
function addTags() {
  context.hotels.forEach((hotel) => {
    var food = hotel.filterTagsFood;
    var facility = hotel.filterTagsFacility;
    var surrounding = hotel.filterTagsSurroundings;
    var service = hotel.filterTagsService;
    var companion = hotel.filterTagsCompanion;
    var travel = hotel.filterTagsTravelling_purpose;
    var tagDiv = document.getElementById("filtertags-" + hotel.index);

    food.forEach(f =>{
      var button0 = document.createElement("BUTTON");
      button0.className = "tag";
      button0.textContent = f;
      tagDiv.appendChild(button0);

      button0.addEventListener("click", function(){
        filterTag(hotel.index, button0);
        recordClickAspectsTag(button0.innerHTML,hotel.index);
      });
    });
    facility.forEach(f =>{
      var button0 = document.createElement("BUTTON");
      button0.className = "tag";
      button0.textContent = f;
      tagDiv.appendChild(button0);
      button0.addEventListener("click", function(){
        filterTag(hotel.index, button0);
        recordClickAspectsTag(button0.innerHTML,hotel.index);
      });
    });
    surrounding.forEach(f =>{
      var button0 = document.createElement("BUTTON");
      button0.className = "tag";
      button0.textContent = f;
      tagDiv.appendChild(button0);
      button0.addEventListener("click", function(){
        filterTag(hotel.index, button0);
        recordClickAspectsTag(button0.innerHTML,hotel.index);
      });
    });
    service.forEach(f =>{
      var button0 = document.createElement("BUTTON");
      button0.className = "tag";
      button0.textContent = f;
      tagDiv.appendChild(button0);
      button0.addEventListener("click", function(){
        filterTag(hotel.index, button0);
        recordClickAspectsTag(button0.innerHTML,hotel.index);
      });
    });
    companion.forEach(f =>{
      var button0 = document.createElement("BUTTON");
      button0.className = "tag";
      button0.textContent = f;
      tagDiv.appendChild(button0);
      button0.addEventListener("click", function(){
        filterTag(hotel.index, button0);
        recordClickAspectsTag(button0.innerHTML,hotel.index);
      });
    });
    travel.forEach(f =>{
      var button0 = document.createElement("BUTTON");
      button0.className = "tag";
      button0.textContent = f;
      tagDiv.appendChild(button0);
      button0.addEventListener("click", function(){
        filterTag(hotel.index, button0);
        recordClickAspectsTag(button0.innerHTML,hotel.index);
      });
    });
    // console.log(tagDiv);
  })
}




function dashboard(id, fData, index){
    // console.log(fData[0]['freq']);
    var barColor = "#8d99ae";//'steelblue';
    
    //compute total for each state.
    //emo
    if (Object.keys(fData[0]['freq']).includes("negative")) {
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
    function histoGram(fD){
      // console.log(nLdata);
      var hG={},    hGDim = {t: 30, r: 40, b: 0, l: 30};
      hGDim.w = 500 - hGDim.l - hGDim.r, 
      hGDim.h = 320 - hGDim.t - hGDim.b;
          
      //create svg for histogram.
      var realh = hGDim.h - 20;
      // var barY = hGDim.h + 1;
      var hGsvg = d3.select(id).append("svg")
          .attr("id", "svg-" + index)
          .attr("width", hGDim.w + hGDim.l + hGDim.r)
          .attr("height", hGDim.h + hGDim.t).append("g")
          .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

      // create function for x-axis mapping.
      var x = d3.scaleBand().range([0, hGDim.w]).padding(0.2)//rangeRound([0, hGDim.w], 2.0) //v3 d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
              .domain(fD.map(function(d) { return d[0]; }));
      // Create function for y-axis map.
      var y = d3.scaleLinear().range([realh, 0])
              .domain([0, d3.max(fD, function(d) { return d[1]; })]);

      var tooltipBar = d3.select(id).append("div").attr("class", "toolTipBar");
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
            else {return realh - y(d[1]); }
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
          
      // Add x-axis to the histogram svg.
      hGsvg.append("g").attr("class", "x axis")
        .style("font-size", "15px")
        .attr("transform", "translate(0," + realh + ")")
        .call(d3.axisBottom().tickSize(0).scale(x));

    function barMouseover(d){  // utility function to be called on mouseover.
      //tooltip
      tooltipBar.style('display', 'inline');
      RecordOver_b(this, index);
    }

    function  barMousemove(d) {
        var xPosition = d3.mouse(this)[0] + 50;   //d3.event.pageX;
        var yPosition = d3.mouse(this)[1] + 5;    //d3.event.pageY;

        var newHtml = [];
        newHtml.push('<table><h6>' + d[1] + ' ' 
          + '<small style="color:blue"> Click to filter review</small></h6>');
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
        RecordOut_b(this, index);
    }
        return hG;
    }


    // calculate total frequency by segment for all state.
    // if (Object.keys(fData[0]['freq']).includes("negative")){
    //     var tF = ['positiveOnly','positiveGenerally','neutral','negativeGenerally','negativeOnly'].map(function(d){ 
    //       return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))}; 
    //     });  
    // }
    // else if (Object.keys(fData[0]['freq']).includes("reviewer")) {
    //     var tF = ['newReviewer','juniorReviewer', 'reviewer','seniorReviewer',
    //     'proReviewer', 'topReviewer'].map(function(d){ 
    //         return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))}; 
    //     });    
    // } else if (Object.keys(fData[0]['freq']).includes("contributor")) {
    //     var tF = ['newContributor', 'juniorContributor', 'contributor','seniorContributor',
    //     'proContributor', 'topContributor'].map(function(d){ 
    //         return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))}; 
    //     });    
    // } else if (Object.keys(fData[0]['freq']).includes("food")) {
    //     var tF = ['food', 'facility', 'surroundings','service','companion', 
    //       'travelling_purpose'].map(function(d){ 
    //         return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))}; 
    //     });    
    // }
      
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
    
    
    var hG = histoGram(sF); // create the histogram.

    // var taGsvg = d3.select(id).append("svg")
    //     .attr("id", "tagsvg-" + index)
    //     .attr("width", 600)
    //     .attr("height", 200);
    // var food = context.hotels[index].filterTagsFood;
    // taGsvg.append("button").text(food[0]).attr("class", "tag");


}


  // code to run after the elements are created
function embedVis() {
  context.hotels.forEach(hotel => {
    var visDiv = document.getElementById("modal-vis-" + hotel.index);
    visDiv.className = 'row';
    
    var dashboardDiv = document.createElement('div');
    dashboardDiv.id = 'dashboard' + hotel.index;
    
    visDiv.appendChild(dashboardDiv);
    
    var hotelCategoryData = JSON.parse(JSON.stringify(hotelContriAll[hotel.index]));
    
    //switch function
    dashboard('#dashboard'+ hotel.index, hotelCategoryData, hotel.index);

  })
}

embedVis();
