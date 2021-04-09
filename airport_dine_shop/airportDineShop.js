let terminalAll = []
let selectResults = []
let selectResults1 = []
let searchTermStorage = []
let searchSecStorage = []

$(document).ready(function () {
    $.ajax({
        url: "/airport/_api/web/lists/GetByTitle('terminals')/items?$top=500",
        method: 'GET',
        headers: {
            Accept: 'application/json; odata=verbose'
        },

        success: function (data) {
            let thisTerminalResults = data.d.results
            console.log(thisTerminalResults)
            let searchOption = 'Food'
            let searchTerm = ''
            // let searchAir = '';
            let searchSecurity = ''

            function filterItems(query) {
                return terminalItems.filter(function (el) {
                    return el.toLowerCase().indexOf(query.toLowerCase()) > -1
                })
            }

            let clearFields = function () {
                $('#resultBtns')
                    .removeClass('d-none')
                    .addClass('d-flex')
                searchTerm = ''
                // searchAir = '';
                searchSecurity = ''
                $('select').each(function () {
                    this.selectedIndex = 0
                })
            }

            let removeDivs = function () {
                $('#finalFilterResults').remove()
                $('#resultTitle').remove()
            }

            let buildResults = function () {
                if (searchSecurity.length && searchTerm.length) {
                    if (searchTerm !== 'R') {
                        resultTitle = 'Terminal ' + searchTerm + ' & ' + searchSecurity
                    } else {
                        resultTitle = 'Rental Car Center & ' + searchSecurity
                    }
                } else if (!searchSecurity.length && searchTerm.length) {
                    if (searchTerm !== 'R') {
                        resultTitle = 'Terminal ' + searchTerm
                    } else {
                        resultTitle = 'Rental Car Center'
                    }
                } else if (searchSecurity.length && !searchTerm.length) {
                    resultTitle = searchSecurity
                }

                $('#termSearchResults').append(
                    $('<div class="row" id="finalFilterResults"></div>')
                )
                $('#moreOptions').prepend(
                    $(
                        '<div id="resultTitle" class="text-center text-md-left"><h3 class="fw-500"><strong>Results for:</strong></h3> <h4>' +
                        resultTitle +
                        '</h4></div>'
                    )
                )

                // Sets active style to Food, Shop & Service navigation buttons
                if (searchOption == 'Food') {
                    $('.Dine').addClass('active')
                } else if (searchOption == 'Shop') {
                    $('.Shop').addClass('active')
                } else {
                    $('.Service').addClass('active')
                }

                if (selectResults1.length > 0) {
                    $.each(selectResults1, function (index, resultItems) {
                        $('#finalFilterResults').append(
                            $(
                                '<div class="col-12 col-md-6"><a class="row mx-1 my-2 py-3 z-depth-1 shopName" type="button" data-toggle="modal" data-target="#shopInfo" data-index="' +
                                index +
                                '"><div class="col-7 my-auto"><p class="fw-500 my-auto">' +
                                resultItems.Title +
                                '</p></div><div class="col-5 d-flex justify-content-end"><p class="my-auto pr-3">Terminal ' +
                                resultItems.terminal.charAt(0) +
                                ' Concourse ' +
                                resultItems.terminal.substr(1) +
                                '</p><i class="fal fa-plus-circle fa-2x broward-color-blue my-auto"></i></div></a></div>'
                            )
                        )
                    })
                } else {
                    $('#finalFilterResults').append(
                        $(
                            '<div class="col-12 pt-3 text-center text-md-left"><h3>Sorry! No matching results.</h3><h5>Adjust your filter options and try again.</h5></div>'
                        )
                    )
                }
                $('body').on('click', '.shopName', function () {
                    let index = $(this).attr('data-index')
                    let terminalItems = selectResults1[index]
                    $('#shopModalTitle').html(terminalItems.Title)
                    if (terminalItems.terminal.length <= 3) {
                        $('#shopModalBody').html(
                            '<div class="fw-400 my-auto"><i class="fal fa-map-marker-alt mr-1" style="font-size:1.5rem;"></i> Terminal ' +
                            terminalItems.terminal.charAt(0) +
                            ' Concourse ' +
                            terminalItems.terminal.substr(1) +
                            '</div><div class="fw-400 pt-1"><i class="fal fa-shield-check" style="font-size:1.5rem;"></i> ' +
                            terminalItems.security +
                            '</div><div class="fw-400 pt-1"><i class="fal fa-clock" style="font-size:1.5rem;"></i> Hours: ' +
                            terminalItems.hours +
                            '</div><div class="pt-3">' +
                            terminalItems.description +
                            '</div>'
                        )
                    } else if (
                        terminalItems.terminal.length > 3 &&
                        terminalItems.terminal != 'Rental Car Center'
                    ) {
                        $('#shopModalBody').html(
                            '<div class="fw-400 my-auto"><i class="fal fa-map-marker-alt mr-1" style="font-size:1.5rem;"></i> Terminal ' +
                            terminalItems.terminal +
                            '</div><div class="fw-400 pt-1"><i class="fal fa-shield-check" style="font-size:1.5rem;"></i> ' +
                            terminalItems.security +
                            '</div><div class="fw-400 pt-1"><i class="fal fa-clock" style="font-size:1.5rem;"></i> Hours: ' +
                            terminalItems.hours +
                            '</div><div class="pt-3">' +
                            terminalItems.description +
                            '</div>'
                        )
                    } else {
                        $('#shopModalBody').html(
                            '<div class="fw-400 my-auto"><i class="fal fa-map-marker-alt mr-1" style="font-size:1.5rem;"></i> ' +
                            terminalItems.terminal +
                            '</div><div class="fw-400 pt-1"><i class="fal fa-shield-check" style="font-size:1.5rem;"></i> ' +
                            terminalItems.security +
                            '</div><div class="fw-400 pt-1"><i class="fal fa-clock" style="font-size:1.5rem;"></i> Hours: ' +
                            terminalItems.hours +
                            '</div><div class="pt-3">' +
                            terminalItems.description +
                            '</div>'
                        )
                    }
                })
            }

            for (let i = 0; i < thisTerminalResults.length; i++) {
                terminalAll.push(thisTerminalResults[i])
            }

            for (let i = 0; i < terminalAll.length; i++) {
                terminalItems = terminalAll[i]
            }

            $('.termSelect').on('change', function () {
                searchTermStorage = []
                // get terminal for filter
                searchTerm = $(this).val()
                searchTermStorage.push(searchTerm)
            })

            $('.secSelect').on('change', function () {
                searchSecStorage = []
                // get security option
                searchSecurity = $(this).val()
                searchSecStorage.push(searchSecurity)
            })

            let searchFor = function () {
                // clear previous results
                selectResults = []
                // filter by foodOrShop
                let filterStoreType = terminalAll.filter(function (item) {
                    return item.foodOrShop == searchOption
                })
                selectResults.push(filterStoreType)

                if (searchTerm.length && searchSecurity.length <= 0) {
                    // filter by Terminal
                    let filterTerm = selectResults[0].filter(function (item) {
                        return item.terminal.charAt(0) === searchTerm && item.closed === false
                    })
                    selectResults.push(filterTerm)

                    selectResults1 = selectResults[1]
                    buildResults()
                    clearFields()
                } else if (searchTerm.length && searchSecurity.length) {
                    // filter by Terminal
                    let filterTerm = selectResults[0].filter(function (item) {
                        return item.terminal.charAt(0) === searchTerm && item.closed === false
                    })
                    selectResults.push(filterTerm)

                    // filter by Security
                    let filterSecurity = selectResults[1].filter(function (item) {
                        return item.security === searchSecurity
                    })
                    selectResults.push(filterSecurity)

                    selectResults1 = selectResults[2]
                    buildResults()
                    clearFields()
                } else if (searchTerm.length <= 0 && searchSecurity.length) {
                    // filter by Security
                    let filterSecurity = selectResults[0].filter(function (item) {
                        return item.security === searchSecurity
                    })
                    selectResults.push(filterSecurity)

                    selectResults1 = selectResults[1]
                    buildResults()
                    clearFields()
                } else {

                }
            }

            $('.srchBtn').on('click', function () {
                if (!searchTerm.length) {
                    searchTermStorage = []
                }
                if (!searchSecurity.length) {
                    searchSecStorage = []
                }
                $('#resultBtns')
                    .find('.active')
                    .removeClass('active')
                searchOption = 'Food'
                removeDivs()
                searchFor()
            })
            $('.Shop').on('click', function () {
                $('#resultBtns')
                    .find('.active')
                    .removeClass('active')
                searchOption = 'Shop'
                searchTerm = searchTermStorage['0'] ? searchTermStorage['0'] : ''
                searchSecurity = searchSecStorage['0'] ? searchSecStorage['0'] : ''
                removeDivs()
                searchFor()
            })
            $('.Dine').on('click', function () {
                $('#resultBtns')
                    .find('.active')
                    .removeClass('active')
                searchOption = 'Food'
                searchTerm = searchTermStorage['0'] ? searchTermStorage['0'] : ''
                searchSecurity = searchSecStorage['0'] ? searchSecStorage['0'] : ''
                removeDivs()
                searchFor()
            })
            $('.Service').on('click', function () {
                $('#resultBtns')
                    .find('.active')
                    .removeClass('active')
                searchOption = 'Service'
                searchTerm = searchTermStorage['0'] ? searchTermStorage['0'] : ''
                searchSecurity = searchSecStorage['0'] ? searchSecStorage['0'] : ''
                removeDivs()
                searchFor()
            })
        }
    })
})