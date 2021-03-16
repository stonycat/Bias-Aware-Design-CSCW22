//rank part
var source = document.getElementById("reorderinglist-template").innerHTML;
var reorderinglistTemplate = Handlebars.compile(source);

$('#modal-picktop').on('shown.bs.modal', function (e) {
    var topHotels = _.filter(context.hotels, {checked: true});
    // webstorage order
    topHotels = _.orderBy(topHotels, hotel => hotel.order === -1 ? 100 : hotel.order);
    var rendered = reorderinglistTemplate({items: topHotels});
    // console.log(rendered);
    document.getElementById('picktop-modal-body').innerHTML = rendered;
    if (topHotels.length === 3) {
      var reorderingitems = document.getElementById('reorderingitems');
      Sortable.create(reorderingitems, { 
        animation: 100, 
        group: 'list-1', 
        draggable: '.list-group-item', 
        handle: '.list-group-item', 
        sort: true, 
        filter: '.sortable-disabled', 
        chosenClass: 'active',
        onSort: onReorderingListSort,
        onUpdate: function(evt) { 
          var eles = document.getElementsByClassName("updateInd");
          for (var i=0;i<eles.length;i++)
          { 
            var index = i+1
            eles[i].innerText = "Top " + index;
          }
        }
      });
      $('#modal-picktop-save').prop('disabled', false);
    } else {
      $('#modal-picktop-save').prop('disabled', true);
    }
});

function onReorderingListSort() {
  var items = $('#reorderingitems li').map(function(){return $(this).attr('data-item-id')}).get();
  context.hotels.forEach(hotel => {
    hotel.order = items.indexOf(hotel.id);
    window.localStorage.setItem(`order-${hotel.id}`, hotel.order);
  })
}

function textareaOnChange(index) {
  var hotel = _.find(context.hotels, {index: index});
  var reason = $(`#textarea-reason-${index}`).val();
  hotel.reason = reason;
  window.localStorage.setItem(`item-{{@index}}`, index);
  window.localStorage.setItem(`reason-${hotel.id}`, reason);
  // console.log(hotel, reason);
}

function recordOrder() {
  var items = $('#reorderingitems li').map(function(){return $(this).attr('data-item-id')}).get();
  // console.log(items);
}

//pick hotel
function pickHotel(index) {
  var hotel = _.find(context.hotels, {index: index});
  hotel.checked = !hotel.checked;
  if (!hotel.checked) {
      hotel.order = -1
      window.localStorage.setItem(`order-${hotel.id}`, hotel.order);
    }
  window.localStorage.setItem(`checked-${hotel.id}`, hotel.checked);

}

//sort
var source = document.getElementById("hotellist-template").innerHTML;
var hotellistTemplate = Handlebars.compile(source);

function sortHotels(attrs, orders) {
    var attrList = [['name'], ['rating'], ['ratingNum'], ['price']];
    var orderList = [['desc'], ['asc']];
    var attrs = attrList[Math.floor(Math.random() * attrList.length)];
    var orders = orderList[Math.floor(Math.random() * orderList.length)];
    var sortedByName = _.orderBy(context.hotels, attrs, orders);
    var rendered = hotellistTemplate({hotels: sortedByName});
    document.getElementById(`body-hotel-list`).innerHTML = rendered;

    context.hotels.forEach((hotel, i) => {
      hotel.index = i;
    });
    embedVis();
    // groupClick();
    loadSingleReview();
    loadMoreReviews();
}