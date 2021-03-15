// read more contents from each review
function loadSingleReview(){
  $('.review_content').each(function(index,element){
    var maxwidth=300;//设置最多显示的字数
    var text_long=$(this).find("p[class = 'contents']").text();
    var text_short = text_long.substring(0,maxwidth);
    if(text_long.length>maxwidth){
        $(this).find("p[class = 'contents']").html(text_short+"...");
    };
    var read_button = $(this).find('a');
    read_button.click(function(){
        if(read_button.text()==="Read More"){
          read_button.parent().find("p[class = 'contents']").html(text_long);
          read_button.text("Read Less");
        } else if (read_button.text()==="Read Less"){
          read_button.parent().find("p[class = 'contents']").html(text_short+"...");
          read_button.text("Read More");
        }
    })
  })
}

// load 5 more reviews each click
function loadMoreReviews() {
$('.reviews-members').each(function(index,element){
  var count = 5;
  var read_more = $(this).find("a[class^='loading-hotel']");
  var all_reviews = $(this).find("div[class ='media']");
  all_reviews.each(function(index,element){
    $(this).css({"display":'none'});
  }); 

  all_reviews.slice(0,3).show();
  read_more.click(function(){
    count += 5;
    all_reviews.slice(0,count).show();
  })
})
}
loadSingleReview();
loadMoreReviews();