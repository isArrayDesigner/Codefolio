$("#translate").on("click", function(e) {
    $("ul.tr-dd").toggleClass("showtr");
  	e.stopPropagation();
  //  $(this).find("ul.tr-dd").toggleClass("");
});
$(document).on("click", function(e){
	if ($(e.target).is("ul.tr-dd") === false) {
		$("ul.tr-dd").removeClass("showtr");
	}
});//Spanish
document.getElementById("lang-es").onclick = function() {        
	Microsoft.Translator.Widget.Translate('en', 'es', onProgress, onError, onComplete, onRestoreOriginal, 8000);
	Microsoft.Translator.Widget.domTranslator.showHighlight = false;
	Microsoft.Translator.Widget.domTranslator.showTooltips = false;
}
//French
document.getElementById("lang-fr").onclick = function() {        
	Microsoft.Translator.Widget.Translate('en', 'fr', onProgress, onError, onComplete, onRestoreOriginal, 8000);
	Microsoft.Translator.Widget.domTranslator.showHighlight = false;
	Microsoft.Translator.Widget.domTranslator.showTooltips = false;
}
//Creole
document.getElementById("lang-ht").onclick = function() {        
	Microsoft.Translator.Widget.Translate('en', 'ht', onProgress, onError, onComplete, onRestoreOriginal, 8000);
	Microsoft.Translator.Widget.domTranslator.showHighlight = false;
	Microsoft.Translator.Widget.domTranslator.showTooltips = false;
}
//Portuguese
document.getElementById("lang-pt").onclick = function() {        
	Microsoft.Translator.Widget.Translate('en', 'pt', onProgress, onError, onComplete, onRestoreOriginal, 8000);
	Microsoft.Translator.Widget.domTranslator.showHighlight = false;
	Microsoft.Translator.Widget.domTranslator.showTooltips = false;
}
//English
document.getElementById("lang-en").onclick = function() {        
	Microsoft.Translator.Widget.Translate('en', 'en', onProgress, onError, onComplete, onRestoreOriginal, 8000);
	Microsoft.Translator.Widget.domTranslator.showHighlight = false;
	Microsoft.Translator.Widget.domTranslator.showTooltips = false;
}
//You can use Microsoft.Translator.Widget.GetLanguagesForTranslate to map the language code with the language name
function onProgress(value) {
    document.getElementById('counter').innerHTML = Math.round(value);
}
function onError(error) {
    alert("Translation Error: " + error);
}
function onComplete() {
    document.getElementById('counter').style.color = 'green';
}
//fires when the user clicks on the exit box of the floating widget
function onRestoreOriginal() { 
    alert("The page was reverted to the original language. This message is not part of the widget.");
}
	

// County Side Nav
$(".button-collapse").sideNav();
// SideNav Scrollbar Initialization
let sideNavScrollbar = document.querySelector('.custom-scrollbar');
Ps.initialize(sideNavScrollbar);

//Search Script
$(function() {
    $('a[href="#search"]').on('click', function(event) {
        event.preventDefault();
        $('#search').toggleClass('open');
        $('#search > form > input[type="search"]').focus();
        $('#search').click(function() {
            $('#search-icon').toggle('1000');
            $("i", this).toggleClass("fa-search fa-times");
        });
    });

  $('#search, #search button.close').on('click keyup', function(event) {
        if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
            $(this).removeClass('open');
        }
    });
}); 
//Site Options Slide Out
$("[data-toggle='toggle']").click(function() {
	let selector = $(this).data("target");
	$(selector).toggleClass('in');
	});
