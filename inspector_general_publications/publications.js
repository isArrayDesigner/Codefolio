let tHeader = $("#tHeader"),
    rowItems = $("#rowItems"),
    searchYr = 0,
    searchPub = 0,
    selectResults = [],
    selectResults1 = [],
    searchResults = [],
    combinedResults = [];

function getJsonDataAsync(url) {
    // returning the $.ajax object is what makes the next part work...
    return $.ajax({
        url: url,
        method: "GET",
        contentType: "application/json",
        headers: {
            accept: "application/json;odata=verbose"
        }
    });
}

let requestURI1 = "/InspectorGeneral/_api/web/lists/getbytitle('Publications')/items?$top=300&$orderBy=Title",
    requestURI2 = "/InspectorGeneral/_api/web/getfolderbyserverrelativeurl('Publications')/files?&$orderBy=Title";

let req1 = getJsonDataAsync(requestURI1),
    req2 = getJsonDataAsync(requestURI2);

// being returned from $.ajax
$.when(req1, req2).done(function (resp1, resp2) {
    let data1 = resp1[0];
    selectResults.push(data1.d.results)
    selectResults = selectResults.length <= 1 ? selectResults["0"] : selectResults[1];

    console.log(selectResults);

    let data2 = resp2[0];
    selectResults1.push(data2.d.results);
    selectResults1 = selectResults1[0];

    for (let i = 0; i < selectResults.length; i++) {
        let dataHere = selectResults[i],
            dataThere = selectResults1[i];

        if (dataHere.Title === dataThere.Title) {
            combinedResults.push({
                category: dataHere.ReportCategory,
                title: dataHere.Title,
                document: dataThere.ServerRelativeUrl,
                year: dataHere.Year,
                issued: dataHere.Issued_x0020_Date
            });
        }
    };

    //Get 1 of each value to create dropdown for years
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    let yearItems = $.each(combinedResults, function (ind, yearItems) {
        return yearItems;
    });

    let allYears = [];

    for (i = 0; i < yearItems.length; i++) {
        let years = yearItems[i];
        allYears.push(years.year);
    };

    //Sort in Desc Order
    allYears.sort(function (a, b) {
        return b - a
    });

    let yearList = allYears.filter(onlyUnique);

    for (i = 0; i < yearList.length; i++) {
        let year = yearList[i]
        $('#yearOptions').append('<li class="py-1 pl-3"><a href="#" class="text-dark">' + year + '</a></li>');
    }

    function yearNav() {
        // Create the dropdown base
        $("<select style=\"border:none; height:50px; font-family:Arquette;\" class=\"browser-default w-100 mdb-select yearSelect\" />").appendTo("#yearNav");

        // Create default option "Go to..."
        $("<option />", {
            "selected": "",
            "value": "Choose a Year",
            "text": "Choose a Year (Optional)"
        }).appendTo("#yearNav select");

        // Populate dropdown with menu items
        $("#yearNav > ul > li > a").each(function () {
            let lettersSelect = $(this);
            $("<option />", {
                "value": lettersSelect.text(),
                "text": lettersSelect.text()
            }).appendTo("#yearNav select");
        });

        // To make dropdown actually work
        $("#yearNav select").change(function () {
            searchYr = $(this).find("option:selected").val()
        });
    }
    yearNav();

});

//Cleaning Functions
let clearFields = function () {
    searchYr = 0
    searchPub = 0
    $("select").each(function () {
        this.selectedIndex = 0
    });
};

let removeDivs = function () {
    $('#finalFilterResults').remove();
    $('#resultTitle').remove();
    $("#headerRow").remove();
    $("#rowItems").empty();
};

let searchFor = function () {
    //clear previous results
    searchResults = [];
    console.log('searchPub = ' + searchPub, 'searchYr = ' + searchYr);
    console.log(combinedResults);
    if (searchPub !== 0 && searchYr == 0) {
        //filter by Publications ONLY
        if (searchPub === 'All') {
            searchResults.push(combinedResults);
        } else {
            let filterPub = combinedResults.filter(function (item) {
                return item.category === searchPub;
            });
            searchResults.push(filterPub);
        }
        buildResults();
        clearFields();
    } else if (searchPub !== 0 && searchYr !== 0) {
        //filter by Publications & Year
        if (searchPub === 'All') {
            let filterYear = combinedResults.filter(function (item) {
                return item.year == searchYr;
            });
            searchResults.push(filterYear);
        } else {
            console.log(combinedResults);
            let filterBoth = combinedResults.filter(function (item) {
                return item.category === searchPub && item.year == searchYr;
            });
            searchResults.push(filterBoth);
            console.log(searchResults);
        }
        buildResults();
        clearFields();
    } else if (searchPub == 0 && searchYr !== 0) {
        //filter by Year ONLY
        let filterYear = combinedResults.filter(function (item) {
            return item.year == searchYr;
        });
        searchResults.push(filterYear);

        buildResults();
        clearFields();
    };
};

//Build Results        
let buildResults = function () {
    console.log(searchPub, searchYr);
    if (searchPub !== 0 && searchYr !== 0) {
        let resultTitle = searchPub + " in " + searchYr
    } else if (searchPub <= 0 && searchYr !== 0) {
        let resultTitle = "All Publications in " + searchYr
    } else if (searchPub !== 0 && searchYr <= 0) {
        let resultTitle = searchPub
    };

    $('#pubSearchResults').append($('<div class="row" id="finalFilterResults"></div>'))
    $('#pubSearchResults').prepend($(
        '<div id="resultTitle" class="text-center text-md-left px-3"><h4 class="fw-500 text-dark"><span style="font-weight:700">Results for:</span> ' +
        resultTitle + '</h4></div>'));

    //Header & Footer Titles
    tHeader.append($('<tr id="headerRow">'));

    // Proposed Table Headers
    let tHeaderRow = $("#headerRow");
    tHeaderRow.append($('<th>Title</th><th>Publication Type</th><th>Year</th><th>Issued</th><th>PDF</th>'));


    if (searchResults[0].length > 0) {
        $.each(searchResults[0], function (index, resultItems) {
            console.log(resultItems);
            $("#rowItems")
                .append($('<tr>')
                    .append($('<td class="align-middle"><a href="' + resultItems.document + '">' + resultItems.title + '</a></td>'))
                    .append($('<td class="align-middle">' + resultItems.category + '</td>'))
                    .append($('<td class="align-middle">' + resultItems.year + '</td>'))
                    .append($('<td class="align-middle">' + resultItems.issued + '</td>'))
                    .append($('<td class="align-middle"><a href="' + resultItems.document + '"><i class="fal fa-file-pdf fa-2x broward-color-blue"></i></a></td>'))
                );
        });

    }
    initTable();
};

//Get Dropdown Selection
$('.pubSelect').on('change', function () {
    searchPub = $(this).val();
});


$('.srchBtn').on('click', function () {
    if ($.fn.DataTable.isDataTable("#publicationsTable")) {
        $('#publicationsTable').DataTable().clear().destroy();
    };
    removeDivs();
    searchFor();
});

let initTable = function () {
    $('#publicationsTable').DataTable({
        "order": [
            [2, 'desc'],
            [3, 'desc']
        ],
        "columns": [
            null,
            null,
            null,
            null,
            {
                "orderable": false
            }
        ],
        "columnDefs": [{
            "targets": [3],
            "visible": false,
            "searchable": false
        }]
    });
    $('.dataTables_wrapper').find('label').each(function () {
        $(this).parent().append($(this).children());
    });
    $('.dataTables_filter').find('input').each(function () {
        $('input').attr("placeholder", "Search");
        $('input').removeClass('form-control-sm');
    });
    $('.dataTables_length').addClass('d-flex flex-row');
    $('.dataTables_filter').addClass('md-form');
    $('select').addClass('mdb-select');
    $('.mdb-select').material_select();
    $('.mdb-select').removeClass('form-control form-control-sm custom-select custom-select-sm');
    $('.dataTables_filter').find('label').remove();
};
$(document).ready(function () {

    webpartMove = $("#IGPublications")
    webpartMove.detach();
    webpartMove.appendTo("#fullPageContent");
    $("#fullPageContent > div > div.row.pt-3.mb-r").removeClass('mb-r pt-3');
});