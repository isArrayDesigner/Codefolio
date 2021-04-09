$(
  '#agencyInfo, #fullPageContent > div > div.divider-broward.py-3.mt-3, #fullPageContent > div:nth-child(1) > div.row.pt-3'
).hide()
let listPath = '/cares'
let listName = 'caresCountdown'

let apiUrl =
  "/cares/_api/web/lists/GetByTitle('rentalAssistance')/items?$orderby=OrderBy asc"
let accID = ''

$(function () {
  $('#caresSubnav a').click(function (e) {
    $('li.selectActive').removeClass('selectActive')
    $(this)
      .parent()
      .addClass('selectActive')
  })
  console.log($('#alertsWrap').css('display'))
  ;('use strict')

  let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (!mutation.addedNodes) return

      for (let i = 0; i < mutation.addedNodes.length; i++) {
        if ($('#alertsWrap').css('display') !== 'none') {
          $('#caresNavDiv').css('top', '120px')
          $('#topicNav').css('top', '180px')
          $('.anchor').removeClass('noAlert')
        } else {
          $('#caresNavDiv').css('top', '80px')
          $('#topicNav').css('top', '70px')
          $('.anchor').addClass('noAlert')
        }

        let node = mutation.addedNodes[i]
      }
    })
  })
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  })
  // stop watching using:

  $.ajax({
    url: apiUrl,
    method: 'GET',
    headers: {
      Accept: 'application/json; odata=verbose'
    },
    success: function (data) {
      let thisCaresResults = data.d.results
      let accID
      let hash = window.location.hash

      let onlyUnique = function (value, index, self) {
        return self.indexOf(value) === index
      }

      let caresItems = $.each(thisCaresResults, function (ind, caresItems) {
        return caresItems
      })

      let allTopics = []

      for (i = 0; i < caresItems.length; i++) {
        let filterTopics = caresItems[i]
        allTopics.push(filterTopics.Title)
      }
      // sorting can be done in url parameter if needed
      //allTopics.sort();

      let topicList = allTopics.filter(onlyUnique)

      let buildAcc = function () {
        let accBuild = '<div id="caresItems"></div>'
        $('#mainContent').append(accBuild)
      }

      let buildCards = function () {
        let caresItems = $.each(thisCaresResults, function (ind, caresItems) {
          return caresItems
        })
        let filterTopic = caresItems
        createContentArea(filterTopic)
      }

      function createContentArea (filterTopic) {
        for (i = 0; i < filterTopic.length; i++) {
          let caresItems = filterTopic[i]
          let cardBody = caresItems.Description
          let cardBuild =
            '<div id="' +
            caresItems.Title.replace(/\s/g, '') +
            '" class="anchor"></div><h1 class="pb-3 mt-md-0 mt-3 font-weight-bold text-center text-md-left">' +
            caresItems.Title +
            '</h1><div id="benefitDetail">' +
            cardBody
          $('#caresItems').append(cardBuild)
        }
      }

      let initContent = function () {
        buildAcc()
        buildCards()
      }
      initContent()

      function topicNav () {
        // Create the dropdown base
        $(
          '<select style="border:none; height:50px;" class="browser-default custom-select w-100 z-depth-1" />'
        ).appendTo('#topicNav')
        // Create default option "Go to..."
        $('<option />', {
          selected: '',
          value: 'Choose a Topic',
          text: 'Choose a Topic'
        }).appendTo('#topicNav select')

        // Populate dropdown with menu items
        $('#caresSubnav > li > a').each(function () {
          let topicsSelect = $(this)
          console.log(topicsSelect)
          $('<option />', {
            value: topicsSelect[0].attributes[0].nodeValue,
            text: topicsSelect.text()
          }).appendTo('#topicNav select')
        })

        $('#caresSubnav > li > a').on('click', function () {
          $('#contentRow').removeClass('d-none')
          $('#contentRow').fadeTo('slow', 1)
        })

        $('#topicNav select').change(function () {
          $('#contentRow').removeClass('d-none')
          $('#contentRow').fadeTo('slow', 1)
          accID = $(this)
            .find('option:selected')
            .val()
          let clickLink = $('a[href="' + accID + '"]')[0]
          clickLink.click()
          $('#topicNav select').val('Choose a Topic')
        })
      }
      topicNav()

      $('.continue').on('click', function () {
        $('#contentRow').removeClass('d-none')
        $('#contentRow').fadeTo('slow', 1)
        $('#about').addClass('selectActive')
        $('#topicNav select').val('#AbouttheFund')
      })

      $('#fullPageContent.divider-broward.py-3').css(
        'padding-bottom',
        '2rem!important'
      )
    }
  })
  let toMove = $('#Career')
  toMove.detach()
  let moveTo = $('#fullPageContent')
  toMove.appendTo(moveTo)
})
