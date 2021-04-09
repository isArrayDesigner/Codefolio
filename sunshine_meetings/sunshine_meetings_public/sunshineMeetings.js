let current_progress = 0
let interval = setInterval(function () {
  current_progress += 25
  $('#dynamic')
    .css('width', current_progress + '%')
    .attr('aria-valuenow', current_progress)
    .text(current_progress + '% Complete')
  if (current_progress >= 100) clearInterval(interval)
}, 2000)

let documentResultsArray = []
let historyResultsArray = []
let staticArray = []
let resultItems
let documentResults
let historyResults
let staticResults
let documentArray

let getDocuments = function () {
  // console.log('Get Docs Function')
  let httpRequest
  let url =
    "https://sunshine.broward.org/_api/web/lists/GetByTitle('Sunshine Meetings Documents')/items?$top=2000&$select=Title,ItemID,File&$expand=File"

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
      documentResults = response.d.results

      for (let i = 0; i < documentResults.length; i++) {
        resultItems = documentResults[i]
        documentArray = {}
        documentArray['fileUrl'] = resultItems.File.ServerRelativeUrl
        documentArray['ItemID'] = resultItems.ItemID
        documentArray['Title'] = resultItems.Title
        documentResultsArray.push(documentArray)
      }
      getMeetings()
    } else {
      //console.log('There was a problem with the request.')
    }
  }
}

let getMeetings = function () {
  //console.log('Get Meetings Function')
  let httpRequest
  let url =
    "https://sunshine.broward.org/_api/web/lists/GetByTitle('Sunshine Form')/items?$top=2000&$select=Id,Title,Notes,Project,Project_x0020_Number,Location,Vendor,Attending_x0020_Commissioners,Meeting_x0020_Cancelled,MeetingID,Contact_x0020_Name,Contact_x0020_Phone,Agency,Purpose,Room_x002f_Suite_x0020_Number,Committee_x002f_Board,Meeting_x0020_Date,Meeting_x0020_Time,Superseded,SunshineADApproval,Superseded,Modified"

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
        resultItems.Document = []
        resultItems.History = []
      }
      getMeetingHistory()
    } else {
      //console.log('There was a problem with the request.')
    }
  }
}

let getMeetingHistory = function () {
  // console.log('Get Meetings Function')
  let httpRequest
  let url =
    "https://sunshine.broward.org/_api/web/lists/GetByTitle('Published')/items?$top=2000&$select=Id,Title,Notes,Project,Project_x0020_Number,Location,Vendor,Attending_x0020_Commissioners,Meeting_x0020_Cancelled,MeetingID,Contact_x0020_Name,Contact_x0020_Phone,Agency,Purpose,Room_x002f_Suite_x0020_Number,Committee_x002f_Board,Meeting_x0020_Date,Meeting_x0020_Time,Superseded,SunshineADApproval,Superseded,Modified"

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
      historyResults = response.d.results
      // console.log(results)
      for (let j = 0; j < historyResults.length; j++) {
        resultItems = historyResults[j]
        historyResultsArray.push(resultItems)
      }
      mergeDocsAndMeetings()
    } else {
      //console.log('There was a problem with the request.')
    }
  }
}

let mergeDocsAndMeetings = function () {
  //console.log('Merge Docs Function')
  for (let i = 0; i < documentResultsArray.length; i++) {
    staticArray.forEach(function (result) {
      if (result.MeetingID == documentResultsArray[i].ItemID) {
        result.Document.push(documentResultsArray[i])
      }
    })
  }
  for (let i = 0; i < historyResultsArray.length; i++) {
    staticArray.forEach(function (result) {
      if (result.MeetingID == historyResultsArray[i].MeetingID) {
        result.History.push(historyResultsArray[i])
      }
    })
  }
  // console.log(staticResults)
  buildTableWrapper()
}
getDocuments()

let buildTableItems = function () {
  console.log('Build Table Items Function')

  for (let i = 0; i < staticResults.length; i++) {
    let resultItems = staticResults[i]
    // console.log(resultItems)
    
    // replace null results
    Object.keys(resultItems).forEach(function (key) {
      if (resultItems[key] === null) {
        resultItems[key] = ''
      }
    })

    let meetingDate = moment(resultItems.Meeting_x0020_Date).format('LL')
    let meetingTime = moment(resultItems.Meeting_x0020_Time, 'LT').format(
      'h:mm a'
    )
    let projectName =
      resultItems.Project == 'undefined'
        ? ''
        : resultItems.Project + resultItems['Project_x0020_Number']
    let attending = resultItems.Attending_x0020_Commissioners
      ? resultItems.Attending_x0020_Commissioners.results
      : 'None'
    let contactName = $('<td>' + resultItems.Contact_x0020_Name + '</td>')
    let contactPhone = $('<td>' + resultItems.Contact_x0020_Phone + '</td>')
    let committeeBoard = $('<td>' + resultItems.Committee_x002f_Board + '</td>')
    let project = $('<td>' + resultItems.Project + '</td>')
    let projectNumber = $('<td>' + resultItems.Project_x0020_Number + '</td>')
    let roomSuiteNumber = $(
      '<td>' + resultItems.Room_x002f_Suite_x0020_Number + '</td>'
    )
    let vendor = $('<td>' + resultItems.Vendor + '</td>')
    let notes = $('<td>' + resultItems.Notes + '</td>')
    let attendingCommissioners = $('<td>' + attending + '</td>')

    if (moment(meetingDate).isSameOrAfter(moment().format('LL'))) {
      if (
        resultItems.History.length > 1 &&
        resultItems.Meeting_x0020_Cancelled === false
      ) {
        $('#sRowItems').append(
          $('<tr class="white" data-id="' + resultItems.MeetingID + '">')
            .append(
              $(
                '<td class="attachments text-center align-middle"><a data-toggle="modal" data-target="#noticeModal" data-id="' +
                  resultItems.MeetingID +
                  '" class="fullNotice"><i class="fal fa-file-alt fa-3x"></i></a><br/><a data-toggle="modal" data-target="#resultModal" class="updated btn btn-sm btn-info mt-2 shadow-none">Updated</a></td>'
              )
            )
            .append(contactName)
            .append(contactPhone)
            .append(committeeBoard)
            .append(project)
            .append(projectNumber)
            .append(roomSuiteNumber)
            .append(vendor)
            .append(notes)
            .append(attendingCommissioners)

            .append($('<td>' + meetingDate + '</td>'))
            .append($('<td>' + meetingTime + '</td>'))
            .append($('<td>' + resultItems.Agency + '</td>'))
            .append($('<td>' + resultItems.Purpose + '</td>'))
            .append($('<td>' + resultItems.Location + '</td>'))
        )
      } else if (
        resultItems.History.length > 1 &&
        resultItems.Meeting_x0020_Cancelled === true
      ) {
        $('#sRowItems').append(
          $(
            '<tr class="grey lighten-4 blue-grey-text" data-id="' +
              resultItems.MeetingID +
              '">'
          )
            .append(
              $(
                '<td class="attachments text-center align-middle"><a data-toggle="modal" data-target="#noticeModal" data-id="' +
                  resultItems.MeetingID +
                  '" class="fullNotice"><i class="fal fa-file-alt fa-3x"></i></a><br/><b>(This meeting has been cancelled)</b></td>'
              )
            )
            .append(contactName)
            .append(contactPhone)
            .append(committeeBoard)
            .append(project)
            .append(projectNumber)
            .append(roomSuiteNumber)
            .append(vendor)
            .append(notes)
            .append(attendingCommissioners)

            .append($('<td>' + meetingDate + '</td>'))
            .append($('<td>' + meetingTime + '</td>'))
            .append($('<td>' + resultItems.Agency + '</td>'))
            .append($('<td>' + resultItems.Purpose + '</td>'))
            .append($('<td>' + resultItems.Location + '</td>'))
        )
      } else if (resultItems.Meeting_x0020_Cancelled === true) {
        $('#sRowItems').append(
          $(
            '<tr class="grey lighten-4 blue-grey-text" data-id="' +
              resultItems.MeetingID +
              '">'
          )
            .append(
              $(
                '<td class="attachments text-center align-middle"><a data-toggle="modal" data-target="#noticeModal" data-id="' +
                  resultItems.MeetingID +
                  '" class="fullNotice"><i class="fal fa-file-alt fa-3x"></i></a><br/><b>(This meeting has been cancelled)</b></td>'
              )
            )
            .append(contactName)
            .append(contactPhone)
            .append(committeeBoard)
            .append(project)
            .append(projectNumber)
            .append(roomSuiteNumber)
            .append(vendor)
            .append(notes)
            .append(attendingCommissioners)

            .append($('<td>' + meetingDate + '</td>'))
            .append($('<td>' + meetingTime + '</td>'))
            .append($('<td>' + resultItems.Agency + '</td>'))
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
            .append(contactName)
            .append(contactPhone)
            .append(committeeBoard)
            .append(project)
            .append(projectNumber)
            .append(roomSuiteNumber)
            .append(vendor)
            .append(notes)
            .append(attendingCommissioners)

            .append($('<td>' + meetingDate + '</td>'))
            .append($('<td>' + meetingTime + '</td>'))
            .append($('<td>' + resultItems.Agency + '</td>'))
            .append($('<td>' + resultItems.Purpose + '</td>'))
            .append($('<td>' + resultItems.Location + '</td>'))
        )
      }
    }
  }
}

let initDataTable = function () {
  $.fn.dataTable.moment('LL')
  $.fn.dataTable.moment('h:mm a')

  $('#archiveTable').DataTable({
    responsive: true,
    order: [
      [10, 'asc'],
      [11, 'asc']
    ],
    columnDefs: [
      {
        searchable: true,
        visible: false,
        targets: [1]
      },
      {
        searchable: true,
        visible: false,
        targets: [2]
      },
      {
        searchable: true,
        visible: false,
        targets: [3]
      },
      {
        searchable: true,
        visible: false,
        targets: [4]
      },
      {
        searchable: true,
        visible: false,
        targets: [5]
      },
      {
        searchable: true,
        visible: false,
        targets: [6]
      },
      {
        searchable: true,
        visible: false,
        targets: [7]
      },
      {
        searchable: true,
        visible: false,
        targets: [8]
      },
      {
        searchable: true,
        visible: false,
        targets: [9]
      }
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
  let sHeader = $('#sHeader')
  sHeader.append($('<tr id="headerRow">'))

  let sHeaderRow = $('#headerRow')
  sHeaderRow.append(
    $(
      '<th class="th-sm">View Full Notice</th>' +
        '<th class="th-sm">Contact Name</th>' +
        '<th class="th-sm">Contact Phone</th>' +
        '<th class="th-sm">Committee/board</th>' +
        '<th class="th-sm">Project Type</th>' +
        '<th class="th-sm">Project Number</th>' +
        '<th class="th-sm">Room/Suite Number</th>' +
        '<th class="th-sm">Vendor</th>' +
        '<th class="th-sm">Notes</th>' +
        '<th class="th-sm">Attending Commissioners</th>' +
        '<th class="th-sm">Meeting Date</th>' +
        '<th class="th-sm">Meeting Time</th>' +
        '<th class="th-sm">Agency</th>' +
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
    for (let i = 0; i < staticResults.length; i++) {
      let resultItems = staticResults[i]
      //console.log(resultItems)

      if (resultItems.MeetingID == id) {
        let historyResults = resultItems.History
        for (let j = 0; j < historyResults.length; j++) {
          let historyItems = historyResults[j]
          let meetingStatus = historyItems.Meeting_x0020_Cancelled
            ? 'Meeting Cancelled'
            : 'Meeting Scheduled'

          let meetingDate = moment(historyItems.Meeting_x0020_Date).format('LL')
          let meetingTime = moment(
            historyItems.Meeting_x0020_Time,
            'LT'
          ).format('h:mm a')
          let projectName = historyItems.Project
            ? historyItems.Project + historyItems['Project_x0020_Number']
            : ''

          $('#modalTitle').html(historyItems.Agency)
          $('#modalTable').append(
            $('<tbody id="modalRowItems"></tbody>').append(
              $('<tr data-id="' + historyItems.MeetingID + '">')
                .append(
                  $(
                    '<td>' +
                      meetingDate +
                      '<br><i>' +
                      meetingStatus +
                      '</i></td>'
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
  document.getElementById('printVersion').onclick = function () {
    printElement(document.getElementById('forPrinting'))
  }

  function printElement (elem) {
    let domClone = elem.cloneNode(true)

    let $printSection = document.getElementById('printSection')

    if (!$printSection) {
      let $printSection = document.createElement('div')
      $printSection.id = 'printSection'
      document.body.appendChild($printSection)
    }

    $printSection.innerHTML = ''
    $printSection.appendChild(domClone)
    window.print()
  }

  $('body').on('click', '.fullNotice', function () {
    $('#documents, #history').empty()
    let id = $(this).attr('data-id')

    for (let i = 0; i < staticResults.length; i++) {
      let resultItems = staticResults[i]

      if (resultItems.MeetingID == id) {
        let attachResults = resultItems.Document
        let historyResults = resultItems.History
        let meetingDate = moment(resultItems.Meeting_x0020_Date).format('LL')
        let meetingTime = moment(resultItems.Meeting_x0020_Time, 'LT').format(
          'h:mm a'
        )

        let attending = resultItems.Attending_x0020_Commissioners
          ? resultItems.Attending_x0020_Commissioners.results
          : 'None'

        $('#aModalTitle').html(resultItems.Title)
        $('#date').html(
          '<span class="font-weight-bold">Date: </span>' + meetingDate
        )
        $('#time').html(
          '<span class="font-weight-bold">Time: </span>' + meetingTime
        )
        $('#location').html(
          '<span class="font-weight-bold">Location: </span>' +
            resultItems.Location
        )
        $('#room').html(
          '<span class="font-weight-bold">Room/Suite #: </span>' +
            resultItems.Room_x002f_Suite_x0020_Number
        )
        $('#purpose').html(
          '<span class="font-weight-bold">Purpose: </span>' +
            resultItems.Purpose
        )
        $('#vendor').html(
          '<span class="font-weight-bold">Vendor: </span>' + resultItems.Vendor
        )
        $('#notes').html(
          '<span class="font-weight-bold">Notes: </span>' + resultItems.Notes
        )
        $('#commissioners').html(
          '<span class="font-weight-bold">Attending Commissioners: </span>' +
            attending
        )

        for (let j = 0; j < attachResults.length; j++) {
          let attachItems = attachResults[j]
          $('#documents').append(
            $(
              '<li><i class="fal fa-paperclip"></i><a href="https://sunshine.broward.org' +
                attachItems.fileUrl +
                '" target="_blank"> ' +
                attachItems.Title +
                '</a></li>'
            )
          )
        }
        if (historyResults.length > 0) {
          $('#history').append(
            '<table id="historyModalTable" class="table table-striped table-bordered table-responsive" cellspacing="0"></table>'
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

            let hMeetingDate = moment(historyItems.Meeting_x0020_Date).format(
              'LL'
            )
            let hMeetingTime = moment(
              historyItems.Meeting_x0020_Time,
              'LT'
            ).format('h:mm a')
            let projectName = historyItems.Project
              ? historyItems.Project + historyItems['Project_x0020_Number']
              : ''

            $('#historyModalTable').append(
              $('<tbody id="historyModalRowItems"></tbody>').append(
                $('<tr data-id="' + historyItems.MeetingID + '">')
                  .append(
                    $(
                      '<td>' +
                        hMeetingDate +
                        '<br><i>' +
                        meetingStatus +
                        '</i></td>'
                    )
                  )
                  .append($('<td>' + hMeetingTime + '</td>'))
                  .append($('<td>' + historyItems.Agency + '</td>'))
                  .append($('<td>' + projectName + '</td>'))
                  .append($('<td>' + historyItems.Location + '</td>'))
                  .append(
                    $(
                      '<td>' +
                        moment(historyItems.Modified).format(
                          'MM/DD/YYYY hh:mm'
                        ) +
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
  let webpartMove = $('#tableToMove')
  webpartMove.detach()
  webpartMove.appendTo('#fullPageContent')
}
setTimeout(function () {
  $('.progress').hide()
  $('#tableToMove').fadeIn('slow')
  //document.getElementById("tableToMove").scrollIntoView();
}, 5000)
