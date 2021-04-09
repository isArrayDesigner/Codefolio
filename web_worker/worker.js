self.addEventListener(
  'message',
  function (e) {
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
        "https://sunshineauthor/_api/web/lists/GetByTitle('Sunshine Meetings Documents')/items?$select=Title,ItemID,File&$expand=File"

      httpRequest = new XMLHttpRequest()

      if (!httpRequest) {
        console.log('Giving up :( Cannot create an XMLHTTP instance')
        return false
      }
      httpRequest.onreadystatechange = resultContents
      httpRequest.open('GET', url)
      httpRequest.setRequestHeader('Accept', 'application/json; odata=verbose')
      httpRequest.send()

      function resultContents() {
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
        "https://sunshineauthor/_api/web/lists/GetByTitle('Sunshine Form')/items?$select=Id,Title,Notes,Project,Project_x0020_Number,Location,Vendor,Attending_x0020_Commissioners,Meeting_x0020_Cancelled,MeetingID,Contact_x0020_Name,Contact_x0020_Phone,Agency,Purpose,Room_x002f_Suite_x0020_Number,Committee_x002f_Board,Meeting_x0020_Date,Meeting_x0020_Time,Superseded,SunshineADApproval,Superseded,Modified"

      httpRequest = new XMLHttpRequest()

      if (!httpRequest) {
        console.log('Giving up :( Cannot create an XMLHTTP instance')
        return false
      }
      httpRequest.onreadystatechange = resultContents
      httpRequest.open('GET', url)
      httpRequest.setRequestHeader('Accept', 'application/json; odata=verbose')
      httpRequest.send()

      function resultContents() {
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
        "https://sunshineauthor/_api/web/lists/GetByTitle('Published')/items?$select=Id,Title,Notes,Project,Project_x0020_Number,Location,Vendor,Attending_x0020_Commissioners,Meeting_x0020_Cancelled,MeetingID,Contact_x0020_Name,Contact_x0020_Phone,Agency,Purpose,Room_x002f_Suite_x0020_Number,Committee_x002f_Board,Meeting_x0020_Date,Meeting_x0020_Time,Superseded,SunshineADApproval,Superseded,Modified"

      httpRequest = new XMLHttpRequest()

      if (!httpRequest) {
        console.log('Giving up :( Cannot create an XMLHTTP instance')
        return false
      }
      httpRequest.onreadystatechange = resultContents
      httpRequest.open('GET', url)
      httpRequest.setRequestHeader('Accept', 'application/json; odata=verbose')
      httpRequest.send()

      function resultContents() {
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
      console.log(staticResults)
      postMessage([JSON.stringify(staticResults, null, ' ')])
      //buildTableWrapper()
    }
    getDocuments()
  },
  false
)