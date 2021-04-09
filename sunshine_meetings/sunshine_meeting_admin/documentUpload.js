$('#s4-titlerow, #titleAreaBox, #titleAreaRow, #siteIcon, #sideNavBox, #DeltaPageStatusBar,#s4-ribbonrow').hide()

$(document).ready(function () {
    if (_spPageContextInfo.userId) {
        $.ajax({
            url: "/_api/web/lists/GetByTitle('Sunshine Form')/items?$top=1000",
            method: 'GET',
            headers: {
                Accept: 'application/json; odata=verbose'
            },

            success: function (data) {
                let meetingResults = data.d.results
                let meetingIDs = []
                for (let i = 0; i < meetingResults.length; i++) {
                    let meetingItems = meetingResults[i]
                    meetingIDs.push(meetingItems.MeetingID)
                }
                meetingIDs.reverse()
                $.each(meetingIDs, function (ind, ids) {
                    $('#itemID').append(
                        $('<option value="' + ids + '">' + ids + '</option>')
                    )
                })
            }
        })

        // Check for FileReader API (HTML5) support.
        if (!window.FileReader) {
            alert('This browser does not support the FileReader API.')
        }

        let required = $('[required]')
        let requireditems = required.length
        let valid = false

        function validateForm() {
            requireditems = required.length
            for (let i = 0; i <= required.length; i++) {
                let requiredItem = required[i]
                if (requireditems > 0) {
                    if (
                        requiredItem.value.length == 0 ||
                        ($(requiredItem).attr('type') == 'checkbox' &&
                            requiredItem.checked == false)
                    ) {
                        $(requiredItem)
                            .parent()
                            .append(
                                '<div class="alert alert-warning formAlerts mt-1" role="alert">This field is required.</div>'
                            )
                        $('.generalAlert').removeClass('d-none')
                    } else {
                        requireditems--
                    }
                } else {
                    valid = true
                }
            }
        }
        // Upload the file.
        // You can upload files up to 2 GB with the REST API.
        function uploadFile() {
            // Define the folder path for this example.
            let serverRelativeUrlToFolder = '/Sunshine Meetings Documents'

            // Get test values from the file input and text input page controls.
            let fileInput = $('#getFile')
            let adaConfirm = $('#ada').val() == 'on' ? 'Yes' : 'No'
            let confDataConfirm = $('#confData').val() == 'on' ? 'Yes' : 'No'
            let itemID = $('#itemID').val()
            let newName = $('#displayName').val() + '_' + itemID

            // Get the server URL.
            let serverUrl = _spPageContextInfo.webAbsoluteUrl

            // Initiate method calls using jQuery promises.
            // Get the local file as an array buffer.
            let getFile = getFileBuffer()
            getFile.done(function (arrayBuffer) {
                // Add the file to the SharePoint folder.
                let addFile = addFileToFolder(arrayBuffer)
                addFile.done(function (file, status, xhr) {
                    let getItem = getListItem(file.d.ListItemAllFields.__deferred.uri)
                    getItem.done(function (listItem, status, xhr) {
                        let changeItem = updateListItem(listItem.d.__metadata)
                        changeItem.done(function (data, status, xhr) {
                            window.location.href =
                                'https://sunshineauthor/Pages/uploadSuccess.aspx'
                        })
                        changeItem.fail(onError)
                    })
                    getItem.fail(onError)
                })
                addFile.fail(onError)
            })
            getFile.fail(onError)

            // Get the local file as an array buffer.
            function getFileBuffer() {
                let deferred = $.Deferred()
                let reader = new FileReader()
                reader.onloadend = function (e) {
                    deferred.resolve(e.target.result)
                }
                reader.onerror = function (e) {
                    deferred.reject(e.target.error)
                }
                reader.readAsArrayBuffer(fileInput[0].files[0])
                return deferred.promise()
            }

            // Add the file to the file collection in the Shared Documents folder.
            function addFileToFolder(arrayBuffer) {
                // Get the file name from the file input control on the page.
                let parts = fileInput[0].value.split('\\')
                let fileName = parts[parts.length - 1]

                // Construct the endpoint.
                let fileCollectionEndpoint = String.format(
                    "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
                    "/add(overwrite=true, url='{2}')",
                    serverUrl,
                    serverRelativeUrlToFolder,
                    fileName
                )

                // Send the request and return the response.
                // This call returns the SharePoint file.
                return $.ajax({
                    url: fileCollectionEndpoint,
                    type: 'POST',
                    data: arrayBuffer,
                    processData: false,
                    headers: {
                        accept: 'application/json;odata=verbose',
                        'X-RequestDigest': $('#__REQUESTDIGEST').val(),
                        'content-length': arrayBuffer.byteLength
                    }
                })
            }

            // Get the list item that corresponds to the file by calling the file's ListItemAllFields property.
            function getListItem(fileListItemUri) {
                // Send the request and return the response.
                return $.ajax({
                    url: fileListItemUri,
                    type: 'GET',
                    headers: {
                        accept: 'application/json;odata=verbose'
                    }
                })
            }

            // Change the display name and title of the list item.
            function updateListItem(itemMetadata) {
                let body = String.format(
                    "{{'__metadata':{{'type':'{0}'}},'FileLeafRef':'{1}','Title':'{2}', 'ADA_x0020_Compliance':'{3}', 'Confidential_x0020_Data':'{4}', 'ItemID':'{5}'}}",
                    itemMetadata.type,
                    newName,
                    newName,
                    adaConfirm,
                    confDataConfirm,
                    itemID
                )

                // Send the request and return the promise.
                return $.ajax({
                    url: itemMetadata.uri,
                    type: 'POST',
                    data: body,
                    headers: {
                        'X-RequestDigest': $('#__REQUESTDIGEST').val(),
                        'content-type': 'application/json;odata=verbose',
                        'IF-MATCH': itemMetadata.etag,
                        'X-HTTP-Method': 'MERGE'
                    }
                })
            }
        }

        function submitUpload() {
            $('.formAlerts').remove()
            validateForm()
            if (valid == true) {
                $('.submitButton').attr('value', 'Submitting...')
                $('.submitButton').attr('disabled', 'disabled')
                uploadFile()
            } else {
                alert('Please fill in all required fields')
            }
        }
        $('#addFileButton').on('click', function () {
            submitUpload()
        })

        // Display error messages.
        function onError(error) {
            console.log(error.responseText)
            $('#successSubmit').modal()
            $('#successSubmit .modal-body').append(
                '<h5>The <strong>file name</strong> you have chosen is already in use, please enter another and resubmit.</h5>'
            )
            $('.submitButton').attr('value', 'Submit')
            $('.submitButton').removeAttr('disabled')
        }
    } else {
        window.location.href =
            'https://sunshineauthor/_layouts/15/Authenticate.aspx?Source=%2FPages%2FdocumentUpload%2Easpx'
    }
})