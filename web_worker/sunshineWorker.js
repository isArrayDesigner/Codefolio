var worker = new Worker('/Style%20Library/V7/WebParts/SunshineMeetings/js/worker.js')
var allResults

worker.onmessage = function (e) {
  console.log('On Message Running')
  allResults = JSON.parse(e.data)
  buildTableWrapper()
  let reply = setTimeout(function () {
    worker.postMessage('Start')
  }, 3000)
}

function stopWorker () {
  console.log('TERMINATE')
  worker.terminate()
}

worker.postMessage('Start')
setTimeout(stopWorker, 4000)

let buildTableItems = function () {
  console.log('Build Table Items Function')

  for (let i = 0; i < allResults.length; i++) {
    let resultItems = allResults[i]
    console.log(resultItems)
    // replace null results
    Object.keys(resultItems).forEach(function (key) {
      if (resultItems[key] === null) {
        resultItems[key] = ''
      }
    })

    let meetingDate = moment(resultItems.Meeting_x0020_Date).format('LL')
    let meetingTime = resultItems.Meeting_x0020_Time    
    let projectName = resultItems.Project == 'undefined' ? "" : resultItems.Project + resultItems['Project_x0020_Number']

    if (resultItems.History.length > 1 && resultItems.Meeting_x0020_Cancelled === false) {
      $('#sRowItems').append(
        $('<tr class="white" data-id="' + resultItems.MeetingID + '">')
      
        .append(
          $(
            '<td class="attachments text-center align-middle"><a data-toggle="modal" data-target="#noticeModal" data-id="' +
              resultItems.MeetingID +
              '" class="fullNotice"><i class="fal fa-file-alt fa-3x"></i></a><br/><a data-toggle="modal" data-target="#resultModal" class="updated btn btn-sm btn-info mt-2 shadow-none">Updated</a></td>'
          )
        )
          .append(
            $(
              '<td>' +
                meetingDate +
                '</td>'
            )
          )
          .append($('<td>' + meetingTime + '</td>'))
          .append($('<td>' + resultItems.Agency + '</td>'))
          //.append($('<td>' + resultItems.Vendor + '</td>'))
          .append($('<td>' + resultItems.Purpose + '</td>'))
          .append($('<td>' + resultItems.Location + '</td>'))
      )
    } else if (resultItems.History.length > 1 && resultItems.Meeting_x0020_Cancelled === true) {
      $('#sRowItems').append(
        $('<tr class="grey lighten-4 blue-grey-text" data-id="' + resultItems.MeetingID + '">')
      
        .append(
          $(
            '<td class="attachments text-center align-middle"><a data-toggle="modal" data-target="#noticeModal" data-id="' +
              resultItems.MeetingID +
              '" class="fullNotice"><i class="fal fa-file-alt fa-3x"></i></a><br/><b>(This meeting has been cancelled)</b></td>'
          )
        )
          .append(
            $(
              '<td>' +
                meetingDate +
                '</td>'
            )
          )
          .append($('<td>' + meetingTime + '</td>'))
          .append($('<td>' + resultItems.Agency + '</td>'))
          //.append($('<td>' + resultItems.Vendor + '</td>'))
          .append($('<td>' + resultItems.Purpose + '</td>'))
          .append($('<td>' + resultItems.Location + '</td>'))
      )
    }else if (
      resultItems.Meeting_x0020_Cancelled === true
    ) {
      $('#sRowItems').append(
        $('<tr class="grey lighten-4 blue-grey-text" data-id="' + resultItems.MeetingID + '">')
          .append(
            $(
              '<td class="attachments text-center align-middle"><a data-toggle="modal" data-target="#noticeModal" data-id="' +
                resultItems.MeetingID +
                '" class="fullNotice"><i class="fal fa-file-alt fa-3x"></i></a><br/><b>(This meeting has been cancelled)</b></td>'
            )
          )
          .append(
            $(
              '<td>' +
                meetingDate +
                '</td>'
            )
          )
          .append($('<td>' + meetingTime + '</td>'))
          .append($('<td>' + resultItems.Agency + '</td>'))
          //.append($('<td>' + resultItems.Vendor + '</td>'))
          .append($('<td>' + resultItems.Purpose + '</td>'))
          .append($('<td>' + resultItems.Location + '</td>'))
      )
    } else {
      $('#sRowItems').append(
        $('<tr class="white" data-id="' + resultItems.MeetingID + '">')
          .append(
            $(
              '<td class="attachments text-center align-middle"><a data-toggle="modal" data-target="#noticeModal" data-id="' +
                resultItems.MeetingID +
                '" class="fullNotice"><i class="fal fa-file-alt fa-3x"></i></a></td>'
            )
          )
          .append($('<td>' + meetingDate + '</td>'))
          .append($('<td>' + meetingTime + '</td>'))
          .append($('<td>' + resultItems.Agency + '</td>'))
          //.append($('<td>' + resultItems.Vendor + '</td>'))
          .append($('<td>' + resultItems.Purpose + '</td>'))
          .append($('<td>' + resultItems.Location + '</td>'))
      )
    }
  }
}

let initDataTable = function () {
  console.log('Init Data Table Function')

	$.fn.dataTable.moment('LL');
	$.fn.dataTable.moment('h:mm a');

  $('#archiveTable').DataTable({
    order: [
      [1, 'asc'],
      [2, 'asc']
    ]
  })

  $('.dataTables_wrapper')
    .find('label')
    .each(function () {
      $(this)
        .parent()
        .append($(this).children())
    })

  $('.dataTables_filter')
    .find('input')
    .each(function () {
      $('input').attr('placeholder', 'Search')
      $('input')
        .removeClass('form-control-sm')
        .addClass('w-75')
    })
  $('.dataTables_filter').addClass('w-100')
  $('.dataTables_length').addClass('d-flex flex-row')
  // $('.dataTables_filter').addClass('md-form');
  $('select').addClass('mdb-select')
  $('.mdb-select').material_select()
  $('.mdb-select').removeClass(
    'form-control form-control-sm custom-select custom-select-sm'
  )
  $('.dataTables_filter')
    .find('label')
    .remove()
  $('#archiveTable_length > label').hide()
  $('#archiveTable_wrapper .select-wrapper').hide()
}

let buildTableWrapper = function () {
  console.log('Build Table Wrapper Function')

  let sHeader = $('#sHeader')
  sHeader.append($('<tr id="headerRow">'))

  let sHeaderRow = $('#headerRow')
  sHeaderRow.append(
    $(
      '<th class="th-sm">View Full Notice</th>' +
        '<th class="th-sm">Meeting Date</th>' +
        '<th class="th-sm">Meeting Time</th>' +
        '<th class="th-sm">Agency</th>' +
        //'<th class="th-sm">Vendor</th>' +
        '<th class="th-sm">Purpose</th>' +
        '<th class="th-sm">Location</th>'
    )
  )

  $.when(buildTableItems()).done(initDataTable)

$('body').on('click', '.updated', function () {
  $('#resultModal .modal-body').empty()
  $('#resultModal .modal-body').append(
    '<table id="modalTable" class="table table-striped table-bordered table-responsive" cellspacing="0"></table>'
  )
  let id = $(this)
    .parent()
    .parent()
    .attr('data-id')

  $('#modalTable').append(
    $(
      '<thead id="modalHeaders">' +
        '<th class="th-sm">Meeting Date</th>' +
        '<th class="th-sm">Meeting Time</th>' +
        '<th class="th-sm">Agency</th>' +
        '<th class="th-sm">Project Name</th>' +
        '<th class="th-lg">Location</th>' +
        '<th class="th-lg">Modified Date</th></thead>'
    )
  )
  for (let i = 0; i < allResults.length; i++) {
    let resultItems = allResults[i]
    console.log(resultItems)

    if (resultItems.MeetingID == id) {
      let historyResults = resultItems.History
      for (let j = 0; j < historyResults.length; j++) {
        let historyItems = historyResults[j]
        let meetingStatus = historyItems.Meeting_x0020_Cancelled
        ? 'Meeting Cancelled'
        : 'Meeting Scheduled'
        
  
      let meetingDate = moment(historyItems.Meeting_x0020_Date).format('LL')
      let meetingTime = historyItems.Meeting_x0020_Time
      let projectName = historyItems.Project ? historyItems.Project + historyItems['Project_x0020_Number'] : ""

        $('#modalTitle').html(historyItems.Agency)
        $('#modalTable').append(
          $('<tbody id="modalRowItems"></tbody>').append(
            $('<tr data-id="' + historyItems.MeetingID + '">')
              .append(
                $(
                  '<td>' + meetingDate + '<br><i>' + meetingStatus + '</i></td>'
                )
              )
              .append($('<td>' + meetingTime + '</td>'))
              .append($('<td>' + historyItems.Agency + '</td>'))
              .append($('<td>' + projectName + '</td>'))
              .append($('<td>' + historyItems.Location + '</td>'))
              .append(
                $(
                  '<td>' +
                    moment(historyItems.Modified).format('MM/DD/YYYY hh:mm') +
                    '</td>'
                )
              )
          )
        )
      }
    }
  }
})
//Printer Friendly
document.getElementById("printVersion").onclick = function () {
    printElement(document.getElementById("forPrinting"));
}

function printElement(elem) {
    var domClone = elem.cloneNode(true);
    
    var $printSection = document.getElementById("printSection");
    
    if (!$printSection) {
        var $printSection = document.createElement("div");
        $printSection.id = "printSection";
        document.body.appendChild($printSection);
    }
    
    $printSection.innerHTML = "";
    $printSection.appendChild(domClone);
    window.print();
}

$('body').on('click', '.fullNotice', function () {
  $('#documents, #history').empty()
  let id = $(this).attr('data-id')

  for (let i = 0; i < allResults.length; i++) {
    let resultItems = allResults[i]

    if (resultItems.MeetingID == id) {
      let attachResults = resultItems.Document
      let historyResults = resultItems.History
      let meetingDate = moment(resultItems.Meeting_x0020_Date).format('LL')
      let meetingTime = resultItems.Meeting_x0020_Time
      let attending = resultItems.Attending_x0020_Commissioners.results
      
      $('#aModalTitle').html(resultItems.Title)
      $('#date').html('<span class="font-weight-bold">Date: </span>' + meetingDate)
      $('#time').html('<span class="font-weight-bold">Time: </span>' + meetingTime)
      $('#location').html('<span class="font-weight-bold">Location: </span>' + resultItems.Location)
      $('#room').html('<span class="font-weight-bold">Room/Suite #: </span>' + resultItems.Room_x002f_Suite_x0020_Number)
      $('#purpose').html('<span class="font-weight-bold">Purpose: </span>' + resultItems.Purpose)
      $('#vendor').html('<span class="font-weight-bold">Vendor: </span>' + resultItems.Vendor)
      $('#notes').html('<span class="font-weight-bold">Notes: </span>' + resultItems.Notes)
      $('#commissioners').html('<span class="font-weight-bold">Attending Commissioners: </span>' + attending)

      for (let j = 0; j < attachResults.length; j++) {
        let attachItems = attachResults[j]
        $('#documents').append(
          $(
            '<li><i class="fal fa-paperclip"></i><a href="https://sunshineauthor' +
              attachItems.fileUrl +
              '" target="_blank"> ' +
              attachItems.Title +
              '</a></li>'
          )
        )
      }
      if(historyResults.length > 0){
        $('#history').append('<table id="historyModalTable" class="table table-striped table-bordered table-responsive" cellspacing="0"></table>'
        )
        $('#historyModalTable').append(
          $(
            '<thead id="historyModalHeaders">' +
              '<th class="th-sm">Meeting Date</th>' +
              '<th class="th-sm">Meeting Time</th>' +
              '<th class="th-sm">Agency</th>' +
              '<th class="th-sm">Project Name</th>' +
              '<th class="th-lg">Location</th>' +
              '<th class="th-lg">Modified Date</th></thead>'
          )
        )
        for (let j = 0; j < historyResults.length; j++) {
          let historyItems = historyResults[j]
          let meetingStatus = historyItems.Meeting_x0020_Cancelled
          ? 'Meeting Cancelled'
          : 'Meeting Scheduled'
    
          let hMeetingDate = moment(historyItems.Meeting_x0020_Date).format('LL')
      	  let hMeetingTime = historyItems.Meeting_x0020_Time
          let projectName = historyItems.Project ? historyItems.Project + historyItems['Project_x0020_Number'] : ""
  
          $('#historyModalTable').append(
            $('<tbody id="historyModalRowItems"></tbody>').append(
              $('<tr data-id="' + historyItems.MeetingID + '">')
                .append(
                  $(
                    '<td>' + hMeetingDate + '<br><i>' + meetingStatus + '</i></td>'
                  )
                )
                .append($('<td>' + hMeetingTime + '</td>'))
                .append($('<td>' + historyItems.Agency + '</td>'))
                .append($('<td>' + projectName + '</td>'))
                .append($('<td>' + historyItems.Location + '</td>'))
                .append(
                  $(
                    '<td>' +
                      moment(historyItems.Modified).format('MM/DD/YYYY hh:mm') +
                      '</td>'
                  )
                )
              )
            )
          }
        }
      }
    }
  })

  $('#fullPageContent > div > div.row.pt-3.mb-r').removeClass('mb-r')
  $('#fullPageContent > div > div.row.pt-3').removeClass('pt-3')
  // $('#fullPageContent > div:nth-child(1) > div.row > div').hide();
  let webpartMove = $('#tableToMove')
  webpartMove.detach()
  webpartMove.appendTo('#fullPageContent')
}
