let accID = 'All',
    searchVal = '',
    mainNav = '#CategoryNav',
    mainNavSelect = '#CategoryNav select',
    catNavTitle = $('#faqCategoryTitle'),
    resultsArea = $('#cardColumn'),
    gridName = '.grid'

$(document).ready(function () {

    $.ajax({
        url: "/swapmeet/_api/web/lists/GetByTitle('Swap Meet Images')/items?$orderby=Created desc",
        method: "GET",
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        success: function (data) {
            let thisSwapResults = data.d.results;

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            let faqItems = $.each(thisSwapResults, function (ind, faqItems) {
                return faqItems;
            });

            let allCategories = [];
            for (i = 0; i < faqItems.length; i++) {
                let filterCategories = faqItems[i];
                allCategories.push(filterCategories.Category);
            };
            allCategories.sort();

            let CategoryList = allCategories.filter(onlyUnique);
            for (i = 0; i < CategoryList.length; i++) {
                let CategoryName = CategoryList[i]
                $('#CategoryOptions').append('<li class="py-1 pl-3"><a href="#" class="text-dark">' + CategoryName + '</a></li>');
            }
            let effectIn = function () {
                $(catNavTitle).html(accID).fadeTo(600, 1);
                $(resultsArea).fadeTo(600, 1);
            };

            let effectOut = function () {
                //$(resultsArea).fadeTo(600,0);
                $(gridName).masonry('destroy');
                $(gridName).remove();
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

            function createCardColumns() {
                let faqItems = $.each(thisSwapResults, function (ind, faqItems) {
                    return faqItems;
                });

                if (accID === 'Search Results') {
                    let filterCategory = faqItems.filter(function (e) {
                        let source = e.ItemTitle.toLowerCase();
                        return source.includes(searchVal)
                    });
                } else if (accID === 'All') {
                    let filterCategory = faqItems.filter(function (e) {
                        return faqItems
                    });
                } else {
                    let filterCategory = faqItems.filter(function (e) {
                        return e.Category == accID
                    });
                }

                let buildCards = function () {
                    let cardGroupBuild = '<div class="grid" ><div class="grid-sizer"></div></div>'
                    $("#cardColumn").append(cardGroupBuild);

                    if (filterCategory.length !== 0) {
                        $.each(filterCategory, function (ind, swapItems) {
                            let itemPageUrl = '/swapmeet/Pages/SwapMeetItem.aspx?=' + swapItems.ID

                            let cardBuild = '<div class="grid-item"><div class="card align-items-center white">' +
                                '<img src="/swapmeet/Swap%20Meet%20Images/' + swapItems.Title + '" class="card-img-top">' +
                                '<div class="card-body text-center white"><a href="' + itemPageUrl + '" style="color:#1C2A48"><h5><strong>' + swapItems.ItemTitle + '</strong></h5></a><h5 class="broward-color-blue"><strong> $' + swapItems.Price + '</strong></h5><a href="' + itemPageUrl + '" type="button" class="btn btn-sm btn-info text-white">View Details</a></div>'

                            //let cardBuild = '<div class="card-wrapper"><div id="flipCard'+ swapItems.ID +'" class="card card-rotating text-center"><div class="face front"><div class="card-up"><img class="card-img-top" src="'+ swapItems.Image.Url +'" alt="'+ swapItems.Image.Description +'"></div><div class="card-body"><h4 class="font-weight-bold mb-3">'+ swapItems.Title +'</h4><p class="font-weight-bold blue-text">'+ swapItems.Price +'</p><a class="rotate-btn" data-card="flipCard'+ swapItems.ID +'"><i class="fas fa-redo-alt"></i> Click here to rotate</a></div></div><div class="face back"><div class="card-body"><h4 class="font-weight-bold mb-0">'+ swapItems.Title +'</h4><hr><p>'+ swapItems.Description +'</p><h4 class="font-weight-bold broward-color-blue mb-0">'+ swapItems.Price +'</h4></div></div></div></div>'	           	

                            $(gridName).append(cardBuild);
                        });
                    } else {
                        let cardBuild = '<div id="srchResultsNone"><h4>There are no results matching your search.</h4></div>'
                        $("#cardColumn").append(cardBuild);
                    }

                };
                buildCards();
            };
            let gridify = function () {
                let gridFunction = $(gridName).masonry({
                    itemSelector: '.grid-item',
                    columnWidth: '.grid-sizer',
                    gutter: 20
                });
                gridFunction.masonry('layout');
                $(catNavTitle).html(accID).fadeTo(300, 1);
            };

            let resultBuild = function () {
                $.when(createCardColumns()).done(function () {
                    $(gridName).imagesLoaded(function () {
                        gridify();
                    })
                });
            };
            resultBuild();

            $("#CategoryOptions > li:first-child > a").parent().css({
                borderLeft: "solid medium #039BE5",
                marginLeft: "-3px"
            });

            $("#CategoryOptions > li > a").on("click", function () {
                event.returnValue = false;
                accID = this.innerHTML
                $("#srchResultsNone").remove();

                $("[data-search]")[0].value = '';
                $("#CategoryOptions > li").css({
                    borderLeft: "none",
                    marginLeft: "0px"
                });
                $(this).parent().css({
                    borderLeft: "solid medium #039BE5",
                    marginLeft: "-3px"
                });
                effectOut();
                resultBuild();
            });

            function CategoryNav() {
                // Create the dropdown base
                $("<select style=\"border:none; height:50px;\" class=\"browser-default custom-select w-100 z-depth-1\" />").appendTo(mainNav);
                // Create default option "Go to..."
                $("<option />", {
                    "selected": "",
                    "value": "Choose a Category",
                    "text": "Choose a Category"
                }).appendTo(mainNavSelect);

                // Populate dropdown with menu items
                $("#CategoryNav > ul > li > a").each(function () {
                    let CategoriesSelect = $(this);
                    $("<option />", {
                        "value": CategoriesSelect.text(),
                        "text": CategoriesSelect.text()
                    }).appendTo(mainNavSelect);
                });

                // To make dropdown actually work
                $(mainNavSelect).change(function () {
                    accID = $(this).find("option:selected").val()
                    $.when(effectOut()).done(function () {
                        resultBuild();
                    });
                });
            };
            CategoryNav();

            //Search Function
            $('[data-search]').keypress(function (event) {
                if (event.which == 13) {
                    event.preventDefault();
                    event.returnValue = false;
                    accID = 'Search Results';
                    $("#srchResultsNone").remove();

                    searchVal = $(this).val().toLowerCase();
                    $.when(effectOut()).done(function () {
                        $("#CategoryOptions > li").css({
                            borderLeft: "none",
                            marginLeft: "0px"
                        });
                        resultBuild();
                    });
                }
            });

            $('[data-search-button]').on('click', function (event) {
                event.preventDefault();
                event.returnValue = false;
                accID = 'Search Results';
                $("#srchResultsNone").remove();
                $("#CategoryOptions > li").css({
                    borderLeft: "none",
                    marginLeft: "0px"
                });

                searchVal = $('#faqSearch').val().toLowerCase();
                $.when(effectOut()).done(function () {
                    $("#CategoryOptions > li").css({
                        borderLeft: "none",
                        marginLeft: "0px"
                    });
                    resultBuild();
                });
            });
        }
    })
    webpartMove = $("#swapHeader")
    webpartMove.detach();
    webpartMove.prependTo("#DeltaPlaceHolderMain");
    $('#layout1Container').css('margin-top', '0');
    $('#layout1Container > section.magazine-section.my-3 > div > hr').hide();
    $('#agencyInfo').hide();

});