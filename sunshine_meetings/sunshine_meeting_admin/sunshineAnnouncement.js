<!--<link  type="text/css" rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.0/themes/start/jquery-ui.css" />-->
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons">
<link rel="stylesheet" href="https://unpkg.com/bootstrap-material-design@4.1.1/dist/css/bootstrap-material-design.min.css" integrity="sha384-wXznGJNEXNG1NFsbm0ugrLFMQPWswR3lds2VeinahP8N0zJw9VWSopbjv2x7WCvX" crossorigin="anonymous"> 
<link rel="stylesheet" type="text/css" href="https://unpkg.com/gijgo@1.9.13/css/gijgo.min.css" />

<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
<script src="https://unpkg.com/popper.js@1.12.6/dist/umd/popper.js" integrity="sha384-fA23ZRQ3G/J53mElWqVJEGJzU0sTs+SvzG8fXVWP+kJQ1lwFAOkcUOysnlKJC33U" crossorigin="anonymous"></script>
<script src="https://unpkg.com/bootstrap-material-design@4.1.1/dist/js/bootstrap-material-design.js" integrity="sha384-CauSuKpEqAFajSpkdjv3z9t8E7RlpJ1UP0lKM/+NdtSarroVKu069AlsRPKkFBz9" crossorigin="anonymous"></script>
<!--<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.0/jquery-ui.min.js"></script>-->
<script src="https://kit.fontawesome.com/845d470415.js" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js"></script> 
<script type="text/javascript" src="https://unpkg.com/gijgo@1.9.13/js/gijgo.min.js"></script> 
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery.SPServices/0.7.2/jquery.SPServices-0.7.2.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.1/jquery.validate.min.js"></script>
<script type="text/javascript" src="https://sunshineauthor/SiteAssets/stratus-forms-1.55.js"></script>
<script type="text/javascript" src="https://sunshineauthor/SiteAssets/stratus-forms-data-SPServices-1.55.js"></script>
<style>

input[type=password], input[type=text], input[type=file]{
border:none;
}
#MeetingDate, #MeetingTime{
	border-right:none;
	border-left:none;
	border-top:none;
	border-bottom:1px solid rgba(0,0,0,.26);
}
.input-group-append>button {
    border-radius: 0 4px 4px 0px;
    margin-top: 0px;
    margin-bottom: 0px !important;
    margin-left: 0px;
    padding-top: 23px !important;
    padding-bottom: 23px !important;
    box-shadow: none;
}

label:not(.form-check-label):not(.aRadio):not(.lRadio){
	font-weight:bold
}
#MeetingDateTime .form-control:invalid{
	background-image:none;
}
.bootstrap-datetimepicker-widget{
	display:inline-block!important
}
</style>

<!---- this is the main element that contains your form. do not remove this element -->
<div class="container">
<div class="row justify-content-start">
<div class="col-9 p-5 border">
<div id="SFForm">

</div>
</div>
</div>
<!---- end of main element that holds form ----->



<script type='text/javascript'>

$(document).ready(function() {
		$("#SFForm").StratusFormsInitialize({
	          htmlForm: "https://sunshineauthor/SiteAssets/Sunshine%20Forms/sunshineAnnouncement.html",
		  	queryStringVar: "formID",
	          listName: "Sunshine Form",
	          completefunc: function()
	          {
	          }
		});
		
	});

	
	function SubmitForm() {		
		$("#SFForm").StratusFormsSubmit({
	     	listName: "Sunshine Form",
        	completefunc: function(id) { 
        		$('#successSubmit').modal({backdrop: 'static', keyboard: false})
        		$('#successSubmit .modal-body').append('<div class="text-center"><h5>Save was successful.</h5><br/> Temporary Meeting ID is <br><h2><font color="red"> ' + id + '</font></h2></div>')
        		$('#successSubmit .modal-footer').html('<a href="https://sunshineauthor/Lists/Sunshine%20Form/DisplayFormNew.aspx?ID=' + id +'"<button type="button" class="btn btn-secondary goToDisplay">Close</button></a>')
			}
    		});
	}
	
</script>