
function dashboard(id, fData, index, linkdata){
    // console.log(fData[0]['freq']);
    var barColor = "#8d99ae";//'steelblue';
    
    //compute total for each state.
    //emo
    if (Object.keys(fData[0]['freq']).includes("negative")) {
      fData.forEach(function(d){
        d.total=d.freq.extremelyPositive+d.freq.positive+d.freq.neutral+d.freq.negative+d.freq.extremelyNegative;
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
    if (Object.keys(fData[0]['freq']).includes("negative")){
        var tF = ['extremelyPositive','positive','neutral','negative','extremelyNegative'].map(function(d){ 
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
    
    
    var hG = histoGram(sF); // create the histogram.


}


  // code to run after the elements are created
function embedVis() {
  context.hotels.forEach(hotel => {
    // var visHTML = '<div id="modal-vis-" '+ hotel.index +' >';
    var visDiv = document.getElementById("modal-vis-" + hotel.index);
    visDiv.className = 'row';
    
    var dashboardDiv = document.createElement('div');
    dashboardDiv.id = 'dashboard' + hotel.index;
    
    visDiv.appendChild(dashboardDiv);
    
    var hotelCategoryData = JSON.parse(JSON.stringify(hotelEmoAll[hotel.index]));
    
    //switch function

    dashboard('#dashboard'+ hotel.index, hotelCategoryData, hotel.index, linkNumAll[hotel.index]);

  })
}

function embedSingleVis(index) {

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

    dashboard('#dashboard'+ index, hotelCategoryData, index, linkNumAll[index]);
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

            dashboard('#dashboard'+ curInd, contriLoad, curInd, linkNumAll[curInd]);
            
          } 
          else if (this.id.includes('Emo')) {
            // console.log("switch emo");
            var curInd = this.id.replace('buttonEmo', '');
            var emoLoad = JSON.parse(JSON.stringify(hotelEmoAll[curInd]));
            var removeLegend = document.getElementById('legend' + curInd);
            removeLegend.innerHTML = '';
            var removeBar = document.getElementById('dashboard' + curInd);
            removeBar.innerHTML = '';

            dashboard('#dashboard'+ curInd, emoLoad, curInd, linkNumAll[curInd]);
          }
          else if (this.id.includes('Helpfulv')) {
            // console.log("switch Helpfulv");
            var curInd = this.id.replace('buttonHelpfulv', '');
            var helpfulvLoad = JSON.parse(JSON.stringify(hotelHelpfulAll[curInd]));
            var removeLegend = document.getElementById('legend' + curInd);
            removeLegend.innerHTML = '';
            var removeBar = document.getElementById('dashboard' + curInd);
            removeBar.innerHTML = '';

            dashboard('#dashboard'+ curInd, helpfulvLoad, curInd, linkNumAll[curInd]);
          }
          else if (this.id.includes('Keywords')) {
            // console.log("switch aspects");
            var curInd = this.id.replace('buttonKeywords', '');
            var keywordsLoad = JSON.parse(JSON.stringify(hotelWordsAll[curInd]));
            var removeLegend = document.getElementById('legend' + curInd);
            removeLegend.innerHTML = '';
            var removeBar = document.getElementById('dashboard' + curInd);
            removeBar.innerHTML = '';

            dashboard('#dashboard'+ curInd, keywordsLoad, curInd, linkNumAll[curInd]);
          }
      });
    }
    
  groupClick();
