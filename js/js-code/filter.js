var source = document.getElementById("reviewlist-template").innerHTML; //new list
var reviewlistTemplate = Handlebars.compile(source);

function filterReviews(hotelIndex, filterParams) {
  // console.log(hotelIndex, filterParams);
  var reviews = _.filter(context.hotels[hotelIndex].reviews, filterParams);
  // console.log("filtered reviews: ", reviews);
  showNumFilter(hotelIndex, reviews.length, filterParams, "none");
  var rendered = reviewlistTemplate({reviews});
  // console.log(rendered); // Debug
  document.getElementById(`modal-reviews-${hotelIndex}`).innerHTML = rendered;
  loadSingleReview();
  // loadMoreReviews();
}

function filterCategory(hotelIndex, filterParams) {
  
  var reviews = _.filter(context.hotels[hotelIndex].reviews, function(x){
    var numContri = x.contriNum.split(" ")[0];
    var numHelpfulv = x.helpfulNum.split(" ")[0];
    var keywords = x.categories;
    // console.log(keywords);
    //Emo category
    if (filterParams == 'extremelyPositive'){
      return x.polarity >= 0.8;
    } else if (filterParams == 'positive') {
      return x.polarity > 0.2 && x.polarity < 0.8;
    } else if (filterParams == 'neutral') {
      return x.polarity >= -0.2 && x.polarity <= 0.2;
    } else if (filterParams == 'negative') {
      return x.polarity > -0.8 && x.polarity < -0.2;
    } else if (filterParams == 'extremelyNegative') {
      return x.polarity <= -0.8;
    } 
    //contribution
    else if (filterParams == 'newReviewer'){
      return numContri >= 1 && numContri <= 2;
    } else if (filterParams == 'juniorReviewer') {
      return numContri > 2 && numContri <= 10;
    } else if (filterParams == 'reviewer') {
      return numContri > 10 && numContri <= 20;
    } else if (filterParams == 'seniorReviewer') {
      return numContri > 20 && numContri <= 50;
    } else if (filterParams == 'proReviewer') {
      return numContri > 50 && numContri <= 100;
    } else if (filterParams == 'topReviewer') {
      return numContri > 100;
    }
    //helpful votes
    else if (filterParams == 'newContributor'){
      return numHelpfulv == 0;
    } else if (filterParams == 'juniorContributor') {
      return numHelpfulv >= 1 && numHelpfulv <= 10;
    } else if (filterParams == 'contributor') {
      return numHelpfulv > 10 && numHelpfulv <= 25;
    } else if (filterParams == 'seniorContributor') {
      return numHelpfulv > 25 && numHelpfulv <= 50;
    } else if (filterParams == 'proContributor') {
      return numHelpfulv > 50 && numHelpfulv <= 100;
    } else if (filterParams == 'topContributor') {
      return numHelpfulv > 100;
    }
    //keywords
    else {
      return keywords.includes(filterParams);
    }

  });
  // console.log("show reviews", reviews, reviews.length);
  showNumFilter(hotelIndex, reviews.length, filterParams, "none");

  var rendered = reviewlistTemplate({reviews});
  document.getElementById(`modal-reviews-${hotelIndex}`).innerHTML = rendered;
  loadSingleReview();
  // loadMoreReviews();
}

function filter2Criteria(hotelIndex, filterParams1, filterParams2) {
  var barId = parseFloat(filterParams2.split('pieId')[1]).toFixed(1);
  // console.log(filterParams1, barId.toString());
  var reviews = _.filter(context.hotels[hotelIndex].reviews, function(x){
    var numContri = x.contriNum.split(" ")[0];
    var numHelpfulv = x.helpfulNum.split(" ")[0];
    var keywords = x.categories;
    // console.log(x.currentRating, barId.toString());
    //Emo category
    if (filterParams1 == 'extremelyPositive'){
      return x.polarity >= 0.8 && x.currentRating == barId.toString();
    } else if (filterParams1 == 'positive') {
      return x.polarity > 0.2 && x.polarity < 0.8 && x.currentRating == barId.toString();
    } else if (filterParams1 == 'neutral') {
      return x.polarity >= -0.2 && x.polarity <= 0.2 && x.currentRating == barId.toString();
    } else if (filterParams1 == 'negative') {
      return x.polarity > -0.8 && x.polarity < -0.2 && x.currentRating == barId.toString();
    } else if (filterParams1 == 'extremelyNegative') {
      return x.polarity <= -0.8 && x.currentRating == barId.toString();
    } 
     //contribution
    else if (filterParams1 == 'newReviewer'){
      return numContri >= 1 && numContri <= 2 && x.currentRating == barId.toString();
    } else if (filterParams1 == 'juniorReviewer') {
      return numContri > 2 && numContri <= 10 && x.currentRating == barId.toString();
    } else if (filterParams1 == 'reviewer') {
      return numContri > 10 && numContri <= 20 && x.currentRating == barId.toString();
    } else if (filterParams1 == 'seniorReviewer') {
      return numContri > 20 && numContri <= 50 && x.currentRating == barId.toString();
    } else if (filterParams1 == 'proReviewer') {
      return numContri > 50 && numContri <= 100 && x.currentRating == barId.toString();
    } else if (filterParams1 == 'topReviewer') {
      return numContri > 100 && x.currentRating == barId.toString(); 
    }
    //helpful votes
    else if (filterParams1 == 'newContributor'){
      return numHelpfulv == 0 && x.currentRating == barId.toString();
    } else if (filterParams1 == 'juniorContributor') {
      return numHelpfulv >= 1 && numHelpfulv <= 10 && x.currentRating == barId.toString();
    } else if (filterParams1 == 'contributor') {
      return numHelpfulv > 10 && numHelpfulv <= 25 && x.currentRating == barId.toString();
    } else if (filterParams1 == 'seniorContributor') {
      return numHelpfulv > 25 && numHelpfulv <= 50 && x.currentRating == barId.toString(); 
    } else if (filterParams1 == 'proContributor') {
      return numHelpfulv > 50 && numHelpfulv <= 100 && x.currentRating == barId.toString();
    } else if (filterParams1 == 'topContributor') {
      return numHelpfulv > 100 && x.currentRating == barId.toString();
    }
    //keywords
    else {
      return keywords.includes(filterParams1) && x.currentRating == barId.toString();
    }
  });
  showNumFilter(hotelIndex, reviews.length, filterParams1, filterParams2);
  var rendered = reviewlistTemplate({reviews});
  document.getElementById(`modal-reviews-${hotelIndex}`).innerHTML = rendered;

  loadSingleReview();
  // loadMoreReviews();
}

function showNumFilter(index, num, para1, para2) {
  // console.log("filter", para1, para2);
  var txtDiv = document.getElementById('filterResultTxt'+ index);
  if (para2 == "none"){
    if (typeof para1 == 'object') {
      // console.log(para1);
      txtDiv.innerHTML = num + " reviews of user rating " + para1['currentRating'];
    } else {
      txtDiv.innerHTML = num + " reviews of the selected category \'" + para1 + "\'";
    }
  } else {
      txtDiv.innerHTML = num + " reviews of the selected category \'" +  para1 + "\' under user rating " 
          + parseFloat(para2.split("Id")[1]).toFixed(1);
  }
}

function filterOnOff(index) {
  var curF = document.getElementById('filterText' + index);
  if (curF.innerHTML == "Filtering is enabled"){
    //close
    curF.innerHTML = "Filtering is disabled";
    d3.selectAll("rect").on('click',null);
    d3.selectAll(".arc").on('click',null);
    // $('.arc').prop('disabled',true);
    // $('rect').prop('disabled',true);
  } else {
    //open
    curF.innerHTML = "Filtering is enabled";
    d3.select("#svg-" + index).remove();
    var legendRemove = $("#legend" + index);
    legendRemove.remove();
    var bg = $("#groupButton" + index);
    bg.remove();

    // embedVis();
    embedSingleVis(index);
    groupClick();
  }
}


function filterTag(hotelIndex, filterParams) {
  console.log(hotelIndex, filterParams.innerHTML);
  var reviews = _.filter(context.hotels[hotelIndex].reviews, function(x){
    var filterWord = filterParams.innerHTML;
    var matchKeywords = x.matchKeywords;
    return matchKeywords.includes(filterWord);
    // console.log(filterTag, matchKeywords);
  });
  showNumFilter(hotelIndex, reviews.length, filterParams.innerHTML, "none");

  reviews.forEach(function(review, ind){
    // console.log(review.content);
    review.content = review.content.split(RegExp(filterParams.innerHTML, "i"))
                      .join("<span style='background-color: #ffd100'>"+filterParams.innerHTML+"</span>");
    
    // review.content.replace(filterParams.innerHTML, "<mark>"+filterParams.innerHTML+"</mark>");
  });
  var rendered = reviewlistTemplate({reviews});
  document.getElementById(`modal-reviews-${hotelIndex}`).innerHTML = rendered;
  // loadSingleReview();
}