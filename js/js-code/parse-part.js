document.write("<script src='js/parse.js'></script>")
document.write("<script src='js/parseB.js'></script>")
parseAPI.init()

    function recordClickResult(button) {
      
      parseAPI.saveClickResult(
        // {ID: 'user id', Button: $(this).attr('id')},
        {ID: $('input[id="userID"]').val(), Button: button.id}, 
        {anything: 'type: Click'} //not obj
      ) 
      console.log( "ClickButton ", button.id);
    }


    function recordClickReadMore(indexReview,hotelInd) {
      
      parseAPI.saveClickReadMore(
        {ID: $('input[id="userID"]').val(), Button: 'Read More', Hotel: hotelInd, ReviewNum: (indexReview+1)}, 
        {anything: 'type: Click'} //not obj
      ) 
      console.log("ClickReadMore", indexReview,hotelInd);
    }

    function recordClickViz(el, index) {
      
      parseAPI.saveClickResult(
        // {ID: 'user id', Button: $(this).attr('id')},
        {ID: $('input[id="userID"]').val(), Button: el.id}, 
        {anything: 'type: Click'} //not obj
      ) 
      console.log( "ClickButton ", el.id, index);
    }

    function recordClickAspectsTag(button, index){
      // console.log($('input[id="userID"]').val());
        parseAPI.saveClickAspectsTag(
        {ID: $('input[id="userID"]').val(), Button: button, Hotel: index}, 
        {anything: 'type: Click'} //not obj
      ) 
      console.log( "ClickButton ", button, index);
    }


    function recordClickSave() {
      var review01= $("textarea:eq(0)").val();
      var review02= $('textarea:eq(1)').val();
      var review03= $('textarea:eq(2)').val();
      var reviews=[review01,review02,review03];

      var reviewId01 = $("textarea:eq(0)").attr('id');
      var hotelNum01  = reviewId01.split('-').pop();
      hotelNum01 = parseInt(hotelNum01.split('-').pop());

      var reviewId02 = $("textarea:eq(1)").attr('id');
      var hotelNum02  = reviewId02.split('-').pop();
      hotelNum02 = parseInt(hotelNum02.split('-').pop());

      var reviewId03 = $("textarea:eq(2)").attr('id');
      var hotelNum03  = reviewId03.split('-').pop();
      hotelNum03 = parseInt(hotelNum03.split('-').pop());
      var hotelNums = [hotelNum01,hotelNum02,hotelNum03];

      for(var i=0; i<3;i++){
        parseAPI.saveReason(
        {ID: $('input[id="userID"]').val(), Hotel: hotelNums[i] , Reason:reviews[i],Ranking: (i+1) }, 
        {anything: 'type: Save Reasons'} //not obj
      ) 
      }
      // console.log("recordClickSave");
    }

    function saveDragHistory(items){
      parseAPI.saveDrag(
        {ID: $('input[id="userID"]').val(), Rank1: items[0], Rank2: items[1], Rank3: items[2]}, 
        {anything: 'type: DragUpdate'}
      );
      console.log(items);
    }
    function RecordOver_b(button, hotelInd) {
      
      parseAPI.saveMouseOver(
        // {ID: 'user id', Button: 'this.id'},
        {ID: $('input[id="userID"]').val(), Button: button.id,  Hotel: hotelInd}, 
        {anything: 'type: MouseOver'} //not obj
      ) 
      // console.log("MouseOver", button.id, hotelInd);
    }

    function RecordOut_b(button, hotelInd) {
      
      parseAPI.saveMouseOut(
        // {ID: 'user id', Button: 'this.id'}, 
        {ID: $('input[id="userID"]').val(), Button: button.id, Hotel: hotelInd}, 
        {anything: 'type: MouseOut'} //not obj
      ) 
      // console.log("MouseOut", button.id, hotelInd);

    }

    function RecordOver_arc(type, barId, hotelInd) {
      
      parseAPI.saveMouseOver(
        // {ID: 'user id', Button: 'this.id'},
        {ID: $('input[id="userID"]').val(), Button: type, Hotel: hotelInd}, 
        {anything: 'type: MouseOver'} //not obj
      ) 
      // console.log("MouseOver", type,  barId.parentElement.id, hotelInd);
    }

    function RecordOut_arc(type,  barId, hotelInd) {
      
      parseAPI.saveMouseOut(
        // {ID: 'user id', Button: 'this.id'}, 
        {ID: $('input[id="userID"]').val(), Button: type,  Hotel: hotelInd}, 
        {anything: 'type: MouseOut'} //not obj
      ) 
      // console.log("MouseOut", type,  barId.parentElement.id, hotelInd);
    }


    //scroll down/up
    parseAPI.init()
    var time = null;
    window.onmousewheel = document.onmousewheel = function(e){
        if (time) {
            clearTimeout(time)
        }
        time = setTimeout( () => {
          e = e || window.event;
          var length = e.deltaY;
          console.log(length);  
          if (e.wheelDelta) {               
              if (e.wheelDelta > 0) { //Chrome / IE
                  console.log("scroll up");
                  parseAPI.saveScroll(
                  {ID: $('input[id="userID"]').val(), Length: ''+length}, 
                  {anything: 'scroll up'} 
                )
                  // console.log("send msg to backend");   
              }  
              if (e.wheelDelta < 0) { 
                  console.log("scroll down");
                  parseAPI.saveScroll(
                    {ID: $('input[id="userID"]').val(),  Length: ''+length}, 
                    {anything: 'scroll down'} 
                )
                  // console.log("send msg to backend");  
              }
          }
          else if (e.detail) {  //Firefox]
              if (e.detail < 0) { 
                console.log("scroll up");
                  parseAPI.saveScroll(
                    {ID: $('input[id="userID"]').val(), Length: ''+length}, 
                    {anything: 'scroll up'+length} 
                )
                  // console.log("send msg to backend"); 
              }  
              if (e.detail > 0) { 
                console.log("scroll down");
                  parseAPI.saveScroll(
                    {ID: $('input[id="userID"]').val(),  Length: ''+length}, 
                    {anything: 'scroll down'+length} 
                )
                  // console.log("send msg to backend");  
              }  
              
          }  
          
          time = null
        }, 200)
    }