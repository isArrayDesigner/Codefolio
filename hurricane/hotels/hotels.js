//Webpart Scripts

let accID = 'All';
let searchVal = '';

// Title case things - for use when delightful writers type things in all caps when they shouldn't ;)
String.prototype.toTitleCase = function () {
    let i, j, str, lowers, uppers;
    str = this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    // Certain minor words should be left lowercase unless
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
        'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'
    ];
    for (i = 0, j = lowers.length; i < j; i++) str = str.replace(new RegExp('\\s' + lowers[i] + '\\s',
        'g'), function (txt) {
        return txt.toLowerCase();
    }); // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ['Id', 'Tv'];
    for (i = 0, j = uppers.length; i < j; i++) str = str.replace(new RegExp('\\b' + uppers[i] + '\\b',
        'g'), uppers[i].toUpperCase());
    return str;
}

$(document).ready(function () {
    $.ajax({
        url: "/hurricane/_api/web/lists/GetByTitle('hotels')/items?$orderby=Status desc",
        method: "GET",
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        success: function (data) {
            let hotelResults = data.d.results;

            console.log(hotelResults);

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            let hotelItems = $.each(hotelResults, function (ind, hotelItems) {
                return hotelItems;
            });

            let allCities = [];

            for (i = 0; i < hotelItems.length; i++) {
                let filterCities = hotelItems[i];
                allCities.push(filterCities.City);
            };
            allCities.sort();

            let cityList = allCities.filter(onlyUnique);

            for (i = 0; i < cityList.length; i++) {
                let cityName = cityList[i]
                $('#cityOptions').append('<li class="py-1 pl-3"><a href="#" class="text-dark">' + cityName + '</a></li>');
            }
            $('#cityOptions').prepend('<li class="py-1 pl-3"><a href="#" class="text-dark">All</a></li>');

            let effectIn = function () {
                $('.fa-pulse').hide();
                $('#fadeIn').fadeTo(800, 1);
                $('#cityTitle').html(accID).fadeTo(500, 1);
                $('.legend').fadeTo(500, 1);
                return $("#hotelsColumn").fadeTo(500, 1);
            };

            let effectOut = function () {
                $('#cityTitle').fadeTo(500, 0);
                $('.legend').fadeTo(500, 0);
                return $("#hotelsColumn").fadeTo(500, 0);
            };
            //includes Polyfill
            if (!String.prototype.includes) {
                Object.defineProperty(String.prototype, 'includes', {
                    value: function (search, start) {
                        if (typeof start !== 'number') {
                            start = 0
                        }

                        if (start + search.length > this.length) {
                            return false
                        } else {
                            return this.indexOf(search, start) !== -1
                        }
                    }
                })
            }
            let buildAcc = function () {
                let accID2 = accID.replace(/\s/g, '');
                let bodyBuild = '<table id="hotelTable" class="table"><thead id="tableHeadings"><tr><th scope="col" class="text-center">Status</th><th scope="col">Hotel</th><th scope="col" class="text-center">More Info</th></tr></thead><tbody id="hotelTableBody"></tbody></table>'
                $("#hotelsColumn").append(bodyBuild);
            };
            buildAcc();


            function createHotels() {
                let hotelItems = $.each(hotelResults, function (ind, hotelItems) {
                    return hotelItems;
                });

                console.log(accID);
                if (accID != 'Search Results' && accID != 'All') {
                    let filterCity = hotelItems.filter(function (e) {
                        return e.City == accID;
                    });
                } else if (accID == 'All') {
                    let filterCity = hotelItems.filter(function (e) {
                        return hotelItems
                    });
                } else {
                    let filterCity = hotelItems.filter(function (e) {
                        let address = e.Address.toLowerCase();
                        return address.includes(searchVal);
                    });
                }


                let buildCards = function () {
                    if (filterCity.length !== 0) {
                        for (i = 0; i < filterCity.length; i++) {
                            let accID2 = accID.replace(/\s/g, ''),
                                hotelItems = filterCity[i],
                                lastUpdated = moment(hotelItems.Modified).format('MM/DD/YY, h:mm a'),
                                status = hotelItems.Status ? '<i class="fas fa-check-circle green-text sheltIcon"></i>' : '<i class="fas fa-times-circle red-text sheltIcon"></i>',
                                status2 = hotelItems.Status ? '<sup>open</sup>' : '<sup>closed</sup>',
                                petFriendly = hotelItems.PetFriendly ? '<i class="fas fa-paw sheltIcon"></i>' : '';


                            $('#hotelTableBody').append($('<tr class="align-middle">')

                                    .append($('<td class="text-center py-2">' + status + '<br/>' + status2 + '</td>'))
                                    .append($('<td class="py-2">' + hotelItems.Title.toTitleCase() + ' ' + petFriendly + '</td>'))
                                    .append($('<td class="py-2 text-center"><button type="button" data-id="' + hotelItems.ID + '"class="btn btn-sm  waves-effect waves-light hotelBtn" style="background-color:#039BE5;" data-toggle="modal" data-target="#exampleModalCenter"><i class="far fa-info-circle sheltIcon"></i></button></td>')))
                                //.append($('<td class="text-center py-2"><a href="'+ hotelItems.ViewMap.Url +'" target="_blank"><i class="fas fa-map-marker-alt blue-text sheltIcon"></i></a></td>'))
                                //.append($('<td class="py-2"><a href="https://maps.google.com/maps?daddr='+ hotelItems.Address +'"><i class="fas fa-map-marker-alt blue-text sheltIcon"></i> '+ hotelItems.Address +'</a></td>'))
                                //.append($('<td class="text-center py-2">'+ petFriendly +'</td>')))
                                .append($('<tr style="border-bottom: 1px silver solid; background-color:#f4f4f4"><td class="pl-3 pt-2 pb-0 text-left" colspan="5"><sup>Last Updated: ' + lastUpdated + '</sup></td></tr>'));

                        };
                    } else {
                        let cardBuild = '<h4>There are no results matching your search.</div>'
                        $(".hotels").append(cardBuild);
                    }
                    //hotels Icon Animation
                    $('.hotels > div > div > a').on('click', function () {
                        $(this).find(".rotate").toggleClass("down");
                    });
                    effectIn();
                };
                buildCards();

            };
            createHotels();

            $('body').on('click', '.hotelBtn', function () {
                let id = $(this).attr('data-id');
                let filterCity = hotelItems.filter(function (e) {
                    return e.ID == id;
                });
                let hotelTitle = filterCity[0].Title.toTitleCase();
                let hotelDetails = '<p><i class="fal fa-map-marker-alt sheltIcon"></i>  Address:<a href="https://maps.google.com/maps?daddr=' + filterCity[0].Address + ', ' + filterCity[0].City + '"> ' + filterCity[0].Address + ', ' + filterCity[0].City + ', ' + filterCity[0].zip + '</a></p>' +
                    '<p><i class="fal fa-phone sheltIcon"></i>  Phone: <a href="tel:' + filterCity[0].Phone + '">' + filterCity[0].Phone + '</a></p>' +
                    '<p><i class="fal fa-phone sheltIcon"></i>  Toll-free Phone: <a href="tel:' + filterCity[0].Phone + '">' + filterCity[0].Phone + '</a></p>' +
                    '<p><i class="fal fa-globe sheltIcon"></i>  <a href="http://' + filterCity[0].URL + '" target="_blank">Visit Website</a></p>'
                $(".modal-title").html(hotelTitle);
                $(".modal-body").html(hotelDetails);
                // $("#subscribeHere").attr("href", pubItems.Subscribe);
            });

            $("#cityOptions > li:first-child > a").parent().css({
                borderLeft: "solid medium #039BE5",
                marginLeft: "-3px"
            });

            $("#cityOptions > li > a").on("click", function () {
                event.returnValue = false;
                accID = this.innerHTML
                $("[data-search]")[0].value = '';
                $("#cityOptions > li").css({
                    borderLeft: "none",
                    marginLeft: "0px"
                });
                $(this).parent().css({
                    borderLeft: "solid medium #039BE5",
                    marginLeft: "-3px"
                });
                $.when(effectOut()).done(function () {
                    $("#hotelTableBody tr").remove();
                    createHotels();
                    effectIn();
                });
            });

            function cityNav() {
                // Create the dropdown base
                $("<select style=\"padding-left: 10px; padding-right: 10px; font-family: Arquette;border-radius:3px; border:none; height:50px;\" class=\"browser-default custom-select w-100 z-depth-1\" />").appendTo("#cityNav");
                // Create default option "Go to..."
                $("<option />", {
                    "selected": "",
                    "value": "Choose a City",
                    "text": "Choose a City"
                }).appendTo("#cityNav select");

                // Populate dropdown with menu items
                $("#cityNav > ul > li > a").each(function () {
                    let citySelect = $(this);
                    $("<option />", {
                        "value": citySelect.text(),
                        "text": citySelect.text()
                    }).appendTo("#cityNav select");
                });


                // To make dropdown actually work
                // To make more unobtrusive: https://css-tricks.com/4064-unobtrusive-page-changer/
                $("#cityNav select").change(function () {
                    accID = $(this).find("option:selected").val()
                    $.when(effectOut()).done(function () {
                        $("#hotelTableBody tr").remove();
                        createHotels();
                        effectIn();
                    });
                });


            };
            cityNav();

            //Search Function
            $('[data-search]').keypress(function (event) {
                if (event.which == 13) {
                    event.preventDefault();
                    event.returnValue = false;
                    accID = 'Search Results';
                    console.log($(this));

                    searchVal = $(this).val().toLowerCase();
                    $.when(effectOut()).done(function () {
                        $("#cityOptions > li").css({
                            borderLeft: "none",
                            marginLeft: "0px"
                        });

                        $("#hotelTableBody tr").remove();
                        createHotels();
                        effectIn();
                    });
                    console.log(searchVal);
                }
            });

            $('[data-search-button]').on('click', function (event) {
                event.preventDefault();
                event.returnValue = false;
                accID = 'Search Results';

                $("#cityOptions > li").css({
                    borderLeft: "none",
                    marginLeft: "0px"
                });

                searchVal = $('#faqSearch').val().toLowerCase();
                $.when(effectOut()).done(function () {
                    $("#cityOptions > li").css({
                        borderLeft: "none",
                        marginLeft: "0px"
                    });

                    $("#hotelTableBody tr").remove();
                    createHotels();
                    effectIn();
                });
                console.log(searchVal);
            });
        }

    });
    $('#hurricaneHotels').detach().appendTo('#fullPageContent');
    //$('#fullPageContent > div > div.row.pt-3 > div').hide();

});