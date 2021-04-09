$(function () {
    let lists
    let listInfo = []
    let results
    let activation = false

    $('#siteInfo > div.row.d-flex.justify-content-end.mr-md-1')
        .removeClass('d-flex')
        .hide()
    $('#siteNavBar').hide()
    $('#fullPageContent > div > div.row.pt-3 > div > div:nth-child(1)').hide()
    $('#quickLinks').hide()

    $.ajax({
        url: "/hurricane/_api/web/lists/GetByTitle('HurricaneVideos')/items",
        method: 'GET',
        headers: {
            Accept: 'application/json; odata=verbose'
        },
        success: function (data) {
            videos = data.d.results
            console.log(videos)
            if (videos.length == 0) {
                $('#videoSection').hide()
            }
        },
        complete: function () {
            $.each(videos, function (i, item) {
                let vimeoLink = item.vimeoLink.Url.replace('https://vimeo.com/', 'https://player.vimeo.com/video/')
                let videoDiv = $('<div class="col embed-responsive embed-responsive-16by9 mx-3">' +
                    '<iframe src="' + vimeoLink + '" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>' +
                    '</div>')

                let liveVideoDiv = $('<div class="divider-broward py-3 mt-3 mx-3">' +
                    '<div class="broward-titles-bg-white">' +
                    '<div class="broward-titles">LIVE Press Conference</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col-6">' +
                    '<h3>' + item.Title + '</h3>' +
                    '<p>' + item.Info + '</p>' +
                    '</div><div class="col-6 embed-responsive embed-responsive-16by9">' +
                    '<iframe src="' + vimeoLink + '" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>' +
                    '</div>')

                if (item.Live) {
                    $('#videoLive').append(liveVideoDiv)
                } else if (!item.Live) {
                    $('#videos').prepend(videoDiv)
                }
            })
        }
    });

    $.ajax({
        url: "/hurricane/_api/web/lists/GetByTitle('Hurricane')/items",
        method: 'GET',
        async: false,
        headers: {
            Accept: 'application/json; odata=verbose'
        },
        success: function (data) {
            /*Get hurricane lists */
            lists = data.d.results
            console.log(lists)
            $.each(lists, function (i, item) {
                item.listItems = []
                item.listUpdated = []
                $.ajax({
                    url: item.ListUrl,
                    method: 'GET',
                    async: false,
                    headers: {
                        Accept: 'application/json; odata=verbose'
                    },
                    success: function (data) {
                        results = data.d.results
                        //console.log(results)
                    },
                    complete: function () {
                        /*return items in hurricane list item in order to check if an item has been recently added or updated*/
                        for (j = 0; j < results.length; j++) {
                            let resultItems = results[j]
                            item.listItems.push(resultItems)
                            let modifiedDate = moment(resultItems.Modified).format('LL')
                            let today = moment().format('LL')

                            if (moment(modifiedDate).isSame(today)) {
                                item.listUpdated.push({
                                    updated: 'true'
                                })
                            }
                        }
                        /*Check if the activation status has changed */
                        if (item.ActivationStatus === 'During and After Storm') {
                            activation = true
                        }
                        /*Build important information buttons */
                        if (item.listItems.length > 0 && item.listUpdated.length == 0) {
                            let pageURL = item.PageUrl ?
                                item.PageUrl.Url :
                                '/hurricane/default.aspx'
                            let listCategory = $(
                                '<div class="col-lg-3 col-6 mb-4">' +
                                '<a href="' +
                                pageURL +
                                '" target="_blank"><div class="media browardBlue z-depth-1 rounded">' +
                                '<div class="media-body my-auto">' +
                                '<p class="text-uppercase text-white mb-1">' +
                                item.Title +
                                '</p>' +
                                ' </div>' +
                                ' </div></a>' +
                                '</div>'
                            )
                            $('#importantItems').append(listCategory)
                        } else if (
                            item.listItems.length > 0 &&
                            item.listUpdated.length > 0
                        ) {
                            let pageURL = item.PageUrl ?
                                item.PageUrl.Url :
                                '/hurricane/default.aspx'

                            let listCategory = $(
                                '<div class="col-lg-3 col-6 mb-4">' +
                                '<a href="' +
                                pageURL +
                                '" target="_blank"><div class="media browardBlue z-depth-1 rounded newItems">' +
                                '<div class="media-body my-auto"><span class="badge badge-pill badge-danger ml-2">' +
                                item.listUpdated.length +
                                '</span>' +
                                '<p class="text-uppercase text-white mb-1">' +
                                item.Title +
                                '</p>' +
                                ' </div>' +
                                ' </div></a>' +
                                '</div>'
                            )
                            $('#importantItems').append(listCategory)
                        }
                        if (activation) {
                            $('#important').show()
                            let cardsDetach = $('#navCards')
                            cardsDetach.detach()
                            cardsDetach.insertAfter('#importantItems')

                            let titleMain = $('#fullPageContent > div > div.divider-broward.py-3.mt-3')
                            titleMain.addClass('mainTitle')
                            titleDetach = $('.mainTitle')
                            titleDetach.detach()
                            titleDetach.insertBefore('#navCards')
                        } else {
                            $('#important').hide()
                        }
                    }
                })
            })
            console.log(lists)
        }
    })

    $('#videoPlayer').remove()
    $('#fullPageContent > div:nth-child(3) > div').remove()

    let reattach = $('#videoSection')
    $('#videoSection').detach()
    reattach.insertAfter('#DeltaPlaceHolderMain > section.section.magazine-section.container-fluid')

    let tableToMove = $('#tableToMove')
    tableToMove.detach()
    tableToMove.prependTo('#fullPageContent')

    let titleToMove = $('#fullPageContent > div:nth-child(2) > div.divider-broward.py-3.mt-3')
    titleToMove.detach()
    titleToMove.insertBefore('#navCards')

    let reattachLive = $('#videoLiveSection')
    reattachLive.detach()
    reattachLive.prependTo('#tableToMove')

})