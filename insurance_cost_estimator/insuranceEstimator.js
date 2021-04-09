$.ajax({
    url: "/openenrollment/_api/web/lists/GetByTitle('insuranceEstimator')/items",
    method: 'GET',
    headers: {
        Accept: 'application/json; odata=verbose'
    },

    success: function (data) {
        let thisPlanResults = data.d.results
        let planItems = []
        let tier = 'Employee'

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index
        }

        String.prototype.commafy = function () {
            return this.replace(/(^|[^\w.])(\d{4,})/g, function ($0, $1, $2) {
                return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
            });
        }

        let effectIn = function () {
            return $(".table").fadeTo(500, 1);
        };

        let effectOut = function () {
            return $(".table").fadeTo(500, 0);
        };

        let setDefault = function () {
            planItems = $.each(thisPlanResults, function (ind, planItems) {
                return planItems
            })

        }
        setDefault()

        let sortPlans = function () {
            planItems = planItems.sort(function (a, b) {
                return a.PlanNumber - b.PlanNumber
            })
        }
        sortPlans()

        let buildPlans = function () {
            let allPlans = []
            $('.plans').append('<th scope="col-2" style="border:none!important"></th>')
            for (let i = 0; i < planItems.length; i++) {
                let filterPlans = planItems[i]
                allPlans.push(filterPlans.Plan)
            };
            // allTopics.sort();
            let planList = allPlans.filter(onlyUnique)

            for (let i = 0; i < planList.length; i++) {
                let planName = planList[i]
                $('.plans').append('<th scope="col" class= "p-3 text-center ' + planName.replace(/[^A-Z0-9]/ig, '') + ' rowTitle"><div style="font-size:.7rem" class="align-top compareInput d-none d-sm-none d-md-block"><input type="checkbox" value="' + planName + '"> Compare</div> <br><div class="align-middle">' + planName + '</div></th><th class="nostyle"></th>')
            }
        }
        buildPlans()

        let clearTable = function () {
            $('.plans').empty()
            $('#mainTableBody').html('')
            $('.compareChoice').remove()
        }

        let columnTitles = function () {
            $('#mainTableBody').html('<tr><th scope="row" class="annualDeductible columnTitle">Annual Deductible</th></tr>' +
                '<tr><th scope="row" class="maxOutOfPocket columnTitle">Maximum Out-of-Pocket</th></tr>' +
                '<tr><th scope="row" class="estimatedAnnualRx columnTitle">Estimated Annual Rx</th></tr>' +
                '<tr><th scope="row" class="annualHraHsa columnTitle">Annual HRA/HSA</th></tr>' +
                '<tr><th scope="row" class="totalHealthRxMinusHra columnTitle">Total Health & Rx minus HRA/HSA</th></tr>' +
                '<tr><th scope="row" class="biWklyDeduction columnTitle">Bi-Wkly Payroll Deduction</th></tr>' +
                '<tr><th scope="row" class="annualPayrollDeduction columnTitle">Annual Payroll Deduction</th></tr>' +
                '<tr><th scope="row" class="totalAnnualCost columnTitle">Total Annual Cost to Member</th></tr>'
            )
        }
        columnTitles()

        let buildTable = function (buildPlans) {
            for (let i = 0; i < buildPlans.length; i++) {
                let planDetails = buildPlans[i]
                if (planDetails.TierType.replace(/[^A-Z0-9]/ig, '') == tier) {
                    let annualRx
                    if (planDetails.EstimatedAnnualRx == 'Integrated') {
                        annualRx = '<td class="text-center normalCell align-middle">' + planDetails.EstimatedAnnualRx + '</td><td class="nostyle"></td>'
                    } else {
                        annualRx = '<td class="text-center normalCell align-middle">$' + planDetails.EstimatedAnnualRx + '.00</td><td class="nostyle"></td>'
                    }
                    $('.annualDeductible').parent().append('<td class="text-center normalCell align-middle cellTop">$' + parseFloat(planDetails.AnnualDeductible).toFixed(2).commafy() + '</td><td class="nostyle"></td>')
                    $('.maxOutOfPocket').parent().append('<td class="text-center normalCell align-middle">$' + parseFloat(planDetails.MaximumOutOfPocket).toFixed(2).commafy() + '</td><td class="nostyle"></td>')
                    $('.estimatedAnnualRx').parent().append(annualRx)
                    $('.annualHraHsa').parent().append('<td class="text-center normalCell align-middle">$' + parseFloat(planDetails.AnnualHraHsa).toFixed(2).commafy() + '</td><td class="nostyle"></td>')
                    $('.totalHealthRxMinusHra').parent().append('<td class="text-center normalCell align-middle">$' + parseFloat(planDetails.TotalHealthRxMinusHra).toFixed(2).commafy() + '</td><td class="nostyle"></td>')
                    $('.biWklyDeduction').parent().append('<td class="text-center subtotal align-middle">$' + parseFloat(planDetails.BiWklyPayrollDeduction).toFixed(2).commafy() + '</td><td class="nostyle"></td>')
                    $('.annualPayrollDeduction').parent().append('<td class="text-center subtotal align-middle">$' + parseFloat(planDetails.AnnualPayrollDeduction).toFixed(2).commafy() + '</td><td class="nostyle"></td>')
                    $('.totalAnnualCost').parent().append('<td class="text-center total align-middle">$' + parseFloat(planDetails.TotalAnnualCost).toFixed(2).commafy() + '</td><td class="nostyle"></td>')
                }
            }
        }
        buildTable(planItems)

        let removeActive = function () {
            $('.card').addClass('z-depth-0 border')
            $('.card-body').removeClass('active-card')
            $('.tier, .cost').removeClass('active')
            $('.icon').removeClass('text-white')
        }

        let addActive = function (nowActive) {
            nowActive.removeClass('z-depth-0 border')
            nowActive.find('.card-body').addClass('active-card')
            nowActive.find('.tier, .cost').addClass('active')
            nowActive.find('.icon').addClass('text-white')
        }

        $('.card').on('click', function () {
            tier = this.id
            let nowActive = $(this)
            removeActive()
            addActive(nowActive)

            effectOut()
            setTimeout(function () {
                let elmnt = document.getElementById("intoView");
                elmnt.scrollIntoView({
                    behavior: "smooth"
                });

                columnTitles()
                buildTable(planItems)
                effectIn()
            }, 500)
        })

        let comparisons = []
        let inputEvent = function () {
            $('input').on('change', function () {
                $('#frameModalBottom').modal({
                    focus: false
                })
                let compareValue = $(this).val()
                //console.log('I was clicked = ' + compareValue)
                let compareChoice = '<div class="btn white text-dark compareChoice" comparevalue="' + compareValue + '">' + compareValue + '</div>'
                if (comparisons.length <= 3) {
                    if ($('div[comparevalue="' + compareValue + '"]').length) {
                        $('div[comparevalue="' + compareValue + '"]').remove()
                        let index = comparisons.indexOf(compareValue)
                        if (index !== -1) {
                            comparisons.splice(index, 1)
                        }
                    } else {
                        $('.comparisons').append(compareChoice)
                        comparisons.push(compareValue)
                    }
                    //console.log(comparisons)
                } else {
                    this.checked = false;
                    $('div[comparevalue="' + compareValue + '"]').remove()
                    let index = comparisons.indexOf(compareValue)
                    if (index !== -1) {
                        comparisons.splice(index, 1)
                    }
                }
            })
        }
        inputEvent()
        $('.compare').on('click', function () {
            let comparisonArray = []

            $.each(comparisons, function (ind, compareItem) {
                let compareplans = planItems.filter(function (item) {
                    return item.Plan === compareItem
                })
                comparisonArray.push(compareplans)
            })

            effectOut()
            setTimeout(function () {
                planItems = comparisonArray.flat()
                sortPlans()
                $('.plans').empty()
                buildPlans()
                columnTitles()
                buildTable(planItems)
                effectIn()
                $('.compareInput').remove()
                $('.compare').hide()
                $('.reset').show().removeClass('d-none')

                let elmnt = document.getElementById("intoView");
                elmnt.scrollIntoView({
                    behavior: "smooth"
                });
            }, 500)
        })

        $('.reset').on('click', function () {
            effectOut()
            setTimeout(function () {
                $('#frameModalBottom').modal('hide')
                comparisons = []
                $('.compare').show()
                $('.reset').hide()
                tier = "Employee"
                nowActive = $('#' + tier + '')
                removeActive()
                addActive(nowActive)
                clearTable()
                setDefault()
                sortPlans()
                buildPlans()
                columnTitles()
                buildTable(planItems)
                effectIn()
                inputEvent()
            }, 500)
        })
    }
})