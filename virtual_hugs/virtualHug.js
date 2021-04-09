let staticArray = []
let userResultsArray = []
let discussionResultsArray = []

$(document).ready(function () {

$('#hugs').simpleLoadMore({
  item: '.hug-item',
  count: 5,
  // itemsToLoad: 10,
  // btnHTML: '<a href="#" class="load-more__btn">View More <i class="fas fa-angle-down"></i></a>'
});

$('#s4-bodyContainer').css({"margin-bottom":"0", "background-image":"url('http://bc-net/PublishingImages/Virtual-Hug.png?csf=1&amp;e=GHzAiz')","background-repeat": "no-repeat","background-attachment": "fixed", "background-size": "cover", "background-position": "center top"})
$('#v-1').css('margin-top','30rem');

let options = {
    title: "Virtual Hugs",
    url: "../Lists/Virtual%20Hugs/NewForm.aspx",
    dialogReturnValueCallback: function(result){
    if (result == SP.UI.DialogResult.OK) {
        window.location.reload();
    }
    if (result == SP.UI.DialogResult.cancel) {
        //do nothing, modal was closed
    }
}
};
$('#sendAHug').on('click', function(){
    
SP.UI.ModalDialog.showModalDialog( options );
})

let getUsers = function () {
    console.log('Get Users Function')
    let httpRequest
    let url =
      "/_api/web/SiteUsers"

    httpRequest = new XMLHttpRequest()

    if (!httpRequest) {
      //console.log('Giving up :( Cannot create an XMLHTTP instance')
      return false
    }
    httpRequest.onreadystatechange = resultContents
    httpRequest.open('GET', url)
    httpRequest.setRequestHeader('Accept', 'application/json; odata=verbose')
    httpRequest.send()

    function resultContents () {
      if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        let response = JSON.parse(httpRequest.responseText)
        userResults = response.d.results

        for (let i = 0; i < userResults.length; i++) {
          resultItems = userResults[i]
          userArray = {}
          userArray['UserID'] = resultItems.Id
          userArray['Title'] = resultItems.Title
          userResultsArray.push(userArray)
        }
        console.log(userResultsArray)
        getDiscussion()
      } else {
        //console.log('There was a problem with the request.')
      }
    }
  }

  let getDiscussion = function () {
     console.log('Get Discussion Function')
    let httpRequest
    let url =
      "/_api/web/lists/GetByTitle('Virtual Hugs')/items?top=1000&?orderby=Created asc"

    httpRequest = new XMLHttpRequest()

    if (!httpRequest) {
      //console.log('Giving up :( Cannot create an XMLHTTP instance')
      return false
    }
    httpRequest.onreadystatechange = resultContents
    httpRequest.open('GET', url)
    httpRequest.setRequestHeader('Accept', 'application/json; odata=verbose')
    httpRequest.send()

    function resultContents () {
      if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        let response = JSON.parse(httpRequest.responseText)
        staticResults = response.d.results
        // console.log(results)
        for (let j = 0; j < staticResults.length; j++) {
          resultItems = staticResults[j]
          staticArray.push(resultItems)
          resultItems.User = []
          resultItems.Person = []
        }        
        	mergeUsersAndDisc()
      } else {
        //console.log('There was a problem with the request.')
      }
    }
  }

  let mergeUsersAndDisc = function () {
    console.log('Merge Function')
     for (let i = 0; i < userResultsArray.length; i++) {
      staticArray.forEach(function (result) {
        if (result.EditorId == userResultsArray[i].UserID) {
          result.User.push(userResultsArray[i])
        }
        if (result.PersonId == userResultsArray[i].UserID) {
          result.Person.push(userResultsArray[i])
        }

      })
    }   
     staticArray.sort(function (a, b) {
  		return a.ID > b.ID ? -1 : 1;
	});

	  for (let i = 0; i < staticArray.length; i++) {
	  	let userItems = staticArray[i]
	  	let userBody = userItems.Body ? userItems.Body : ''
	  	let hugged
	  	
		if(userItems.Person.length > 0 && !userItems.Hug_x0020_an_x0020_Agency){
			hugged =  '<a href="/_layouts/15/userdisp.aspx?ID='+userItems.PersonId+'" target="_blank">' + userItems.Person[0].Title
		}else if(userItems.Person.length == 0 && userItems.Hug_x0020_an_x0020_Agency){
			hugged =  userItems.Hug_x0020_an_x0020_Agency
		}else{
			hugged =  userItems.Hug_x0020_an_x0020_Agency +' and <a href="/_layouts/15/userdisp.aspx?ID='+userItems.PersonId+'" target="_blank">' + userItems.Person[0].Title		
			} 
			
	  	let cardBody = '<div class="row ">'+
	  					'<div class="col-2"><div class="userImg"><img src="http://bc-net/PublishingImages/userIcon.png?csf=1&e=whHltV" style="width:75px"></div></div>'+
	  					'<div class="col-10">'+
	  					'<h4><a href="/_layouts/15/userdisp.aspx?ID='+userItems.EditorId+'" target="_blank">'+ userItems.User[0].Title + '</a> sent a hug to...'+ hugged +'</a></h4>'+
	  					'<h6 class="mb-2">'+ moment(userItems.Created).format('LL') + '</h6>'+
	  					'<p><span class="font-weight-bold">'+ userItems.Title+ '</span></br>'+ userBody +'<p>'+
	  					'</div>'+
	  					'</div>'
	  					
	  					
	  	let userHug = $('<div class="card my-3 p-2 hug-item">'+
	  						'<div class="card-body">'+ cardBody +
	  						'</div>'+
						'</div>')
	  	$('#hugs').append(userHug)
	  }
	$('#loading').fadeTo('slow', 0)  
 	$('#huggers').fadeTo('slow', 1)
  }
  getUsers()
  
  
   	webpartMove = $("#swapHeader")
    webpartMove.detach();
    webpartMove.prependTo("#DeltaPlaceHolderMain");
    $('#layout1Container').css('margin-top','0');
   	$('#layout1Container > section.magazine-section.my-3 > div > hr').hide();
   	$('#agencyInfo').hide();  

});