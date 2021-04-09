//Webpart Scripts

let accID = "All";
let searchVal = "";

$(document).ready(function () {
    $.ajax({
        url: "/hurricane/_api/web/lists/GetByTitle('shelters')/items?$orderby=Status desc",
        method: "GET",
        headers: {
            Accept: "application/json; odata=verbose"
        },
        success: function (data) {
            let shelterResults = data.d.results;

            console.log(shelterResults);

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            let shelterItems = $.each(shelterResults, function (
                ind,
                shelterItems
            ) {
                return shelterItems;
            });

            let allCities = [];

            for (i = 0; i < shelterItems.length; i++) {
                let filterCities = shelterItems[i];
                allCities.push(filterCities.City);
            }
            allCities.sort();

            let cityList = allCities.filter(onlyUnique);

            for (i = 0; i < cityList.length; i++) {
                let cityName = cityList[i];
                $("#cityOptions").append(
                    '<li class="py-1 pl-3"><a href="#" class="text-dark">' +
                    cityName +
                    "</a></li>"
                );
            }
            $("#cityOptions").prepend(
                '<li class="py-1 pl-3"><a href="#" class="text-dark">All</a></li>'
            );

            let effectIn = function () {
                $("#cityTitle")
                    .html(accID)
                    .fadeTo(500, 1);
                return $("#sheltersColumn").fadeTo(500, 1);
            };

            let effectOut = function () {
                $("#cityTitle").fadeTo(500, 0);
                return $("#sheltersColumn").fadeTo(500, 0);
            };
            //includes Polyfill
            if (!String.prototype.includes) {
                Object.defineProperty(String.prototype, "includes", {
                    value: function (search, start) {
                        if (typeof start !== "number") {
                            start = 0;
                        }

                        if (start + search.length > this.length) {
                            return false;
                        } else {
                            return this.indexOf(search, start) !== -1;
                        }
                    }
                });
            }
            let buildAcc = function () {
                let accID2 = accID.replace(/\s/g, "");
                let bodyBuild =
                    '<table id="shelterTable" class="table"><thead id="tableHeadings"><tr><th scope="col" class="text-center">Status</th><th scope="col">Shelter</th><th scope="col" class="text-center">Map</th><th scope="col">Address</th><th scope="col" class="text-center">Pet Friendly</th></tr></thead><tbody id="shelterTableBody"></tbody></table>';
                $("#sheltersColumn").append(bodyBuild);
            };
            buildAcc();

            function createShelters() {
                let shelterItems = $.each(shelterResults, function (
                    ind,
                    shelterItems
                ) {
                    return shelterItems;
                });

                console.log(accID);
                if (accID != "Search Results" && accID != "All") {
                    let filterCity = shelterItems.filter(function (e) {
                        return e.City == accID;
                    });
                } else if (accID == "All") {
                    let filterCity = shelterItems.filter(function (e) {
                        return shelterItems;
                    });
                } else {
                    let filterCity = shelterItems.filter(function (e) {
                        let address = e.Address.toLowerCase();
                        return address.includes(searchVal);
                    });
                }

                let buildCards = function () {
                    if (filterCity.length !== 0) {
                        for (i = 0; i < filterCity.length; i++) {
                            let accID2 = accID.replace(/\s/g, ""),
                                shelterItems = filterCity[i],
                                cardTitle = shelterItems.Title,
                                cardBody = shelterItems.Address,
                                lastUpdated = moment(shelterItems.Modified).format(
                                    "MM/DD/YY, h:mm a"
                                ),
                                status = shelterItems.Status ?
                                '<i class="fas fa-check-circle green-text sheltIcon"></i>' :
                                '<i class="fas fa-times-circle red-text sheltIcon"></i>',
                                status2 = shelterItems.Status ?
                                "<sup>open</sup>" :
                                "<sup>closed</sup>",
                                petFriendly = shelterItems.PetFriendly ?
                                '<i class="fas fa-paw sheltIcon"></i>' :
                                "";

                            $("#shelterTableBody")
                                .append(
                                    $('<tr class="align-middle">')
                                    .append(
                                        $(
                                            '<td class="text-center py-2">' +
                                            status +
                                            "<br/>" +
                                            status2 +
                                            "</td>"
                                        )
                                    )
                                    .append(
                                        $(
                                            '<td class="py-2">' + shelterItems.Title + "</td>"
                                        )
                                    )
                                    .append(
                                        $(
                                            '<td class="text-center py-2"><a href="' +
                                            shelterItems.ViewMap.Url +
                                            '" target="_blank"><i class="fas fa-map-marker-alt blue-text sheltIcon"></i></a></td>'
                                        )
                                    )
                                    .append(
                                        $(
                                            '<td class="py-2">' +
                                            shelterItems.Address +
                                            "</td>"
                                        )
                                    )
                                    .append(
                                        $(
                                            '<td class="text-center py-2">' +
                                            petFriendly +
                                            "</td>"
                                        )
                                    )
                                )
                                .append(
                                    $(
                                        '<tr style="border-bottom: 1px silver solid; background-color:#f4f4f4"><td class="pl-3 pt-2 pb-0 text-left" colspan="5"><sup>Last Updated: ' +
                                        lastUpdated +
                                        "</sup></td></tr>"
                                    )
                                );
                        }
                    } else {
                        let cardBuild =
                            "<h4>There are no results matching your search.</div>";
                        $(".shelters").append(cardBuild);
                    }
                    //shelters Icon Animation
                    $(".shelters > div > div > a").on("click", function () {
                        $(this)
                            .find(".rotate")
                            .toggleClass("down");
                    });
                };
                buildCards();
            }
            createShelters();
            $("#cityOptions > li:first-child > a")
                .parent()
                .css({
                    borderLeft: "solid medium #039BE5",
                    marginLeft: "-3px"
                });

            $("#cityOptions > li > a").on("click", function () {
                event.returnValue = false;
                accID = this.innerHTML;
                $("[data-search]")[0].value = "";
                $("#cityOptions > li").css({
                    borderLeft: "none",
                    marginLeft: "0px"
                });
                $(this)
                    .parent()
                    .css({
                        borderLeft: "solid medium #039BE5",
                        marginLeft: "-3px"
                    });
                $.when(effectOut()).done(function () {
                    $("#shelterTableBody tr").remove();
                    createShelters();
                    effectIn();
                });
            });

            function cityNav() {
                // Create the dropdown base
                $(
                    '<select style="padding-left: 10px; padding-right: 10px; font-family: Arquette;border-radius:3px; border:none; height:50px;" class="browser-default custom-select w-100 z-depth-1" />'
                ).appendTo("#cityNav");
                // Create default option "Go to..."
                $("<option />", {
                    selected: "",
                    value: "Choose a City",
                    text: "Choose a City"
                }).appendTo("#cityNav select");

                // Populate dropdown with menu items
                $("#cityNav > ul > li > a").each(function () {
                    let citySelect = $(this);
                    $("<option />", {
                        value: citySelect.text(),
                        text: citySelect.text()
                    }).appendTo("#cityNav select");
                });

                // To make dropdown actually work
                // To make more unobtrusive: https://css-tricks.com/4064-unobtrusive-page-changer/
                $("#cityNav select").change(function () {
                    accID = $(this)
                        .find("option:selected")
                        .val();
                    $.when(effectOut()).done(function () {
                        $("#shelterTableBody tr").remove();
                        createShelters();
                        effectIn();
                    });
                });
            }
            cityNav();

            //Search Function
            $("[data-search]").keypress(function (event) {
                if (event.which == 13) {
                    event.preventDefault();
                    event.returnValue = false;
                    accID = "Search Results";
                    console.log($(this));

                    searchVal = $(this)
                        .val()
                        .toLowerCase();
                    $.when(effectOut()).done(function () {
                        $("#cityOptions > li").css({
                            borderLeft: "none",
                            marginLeft: "0px"
                        });

                        $("#shelterTableBody tr").remove();
                        createShelters();
                        effectIn();
                    });
                    console.log(searchVal);
                }
            });

            $("[data-search-button]").on("click", function (event) {
                event.preventDefault();
                event.returnValue = false;
                accID = "Search Results";

                $("#cityOptions > li").css({
                    borderLeft: "none",
                    marginLeft: "0px"
                });

                searchVal = $("#faqSearch")
                    .val()
                    .toLowerCase();
                $.when(effectOut()).done(function () {
                    $("#cityOptions > li").css({
                        borderLeft: "none",
                        marginLeft: "0px"
                    });

                    $("#shelterTableBody tr").remove();
                    createShelters();
                    effectIn();
                });
                console.log(searchVal);
            });
            /*          $('#shelterTable').DataTable({
            "searching": false,
            "lengthChange": false,
            "paging": false,
            "info": false,
            "ordering": false,
    
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
        $('.dataTables_filter').find('label').remove();*/
        }
    });
    $("#hurricaneShelters")
        .detach()
        .appendTo("#fullPageContent");
    $("#fullPageContent > div > div.row.pt-3 > div").hide();
});