$('#Purpose').keyup(function () {
    let max = 255;
    let len = $(this).val().length;
    if (len >= max) {
        $('#charNum').removeClass('text-success').addClass('text-danger').text(' You have reached the limit.')
    } else {
        let char = max - len;
        $('#charNum').removeClass('text-danger').addClass('text-success').text(char + ' characters left')
    }
});
$(document).ready(function () {
    if (_spPageContextInfo.userId) {
        $('#s4-titlerow, #titleAreaBox, #titleAreaRow, #siteIcon, #sideNavBox, #DeltaPageStatusBar,#s4-ribbonrow').hide()
        //AGENCY NAME: ENABLE CHOICE BETWEEN LIST DRIVEN DROPDOWN OR MANUALLY ENTERED INPUT
        $('.agencyRadio').on('change', function () {
            if ($(this)[0].id == 'optionsRadios1') {
                $('#optionsRadios1').attr('checked', 'checked')
                $('#optionsRadios2').removeAttr('checked')
                $('#agencyList').removeClass('d-none')
                $('#otherAgencyInput').addClass('d-none')
                $('#agencyName')
                    .attr({
                        required: 'required',
                        listFieldName: "Agency"
                    })
                required.push($('#agencyName')[0])
                required = required.filter(function (index, item) {
                    console.log(item.id)
                    return item.id !== 'otherAgency'
                })
                $('#otherAgency')
                    .removeAttr('required')
                    .removeAttr('listFieldName')
            } else {
                $('#optionsRadios1').removeAttr('checked')
                $('#optionsRadios2').attr('checked', 'checked')
                $('#agencyList').addClass('d-none')
                $('#otherAgencyInput').removeClass('d-none')
                $('#otherAgency')
                    .attr({
                        required: 'required',
                        listFieldName: "Agency"
                    })
                required.push($('#otherAgency')[0])
                required = required.filter(function (index, item) {
                    console.log(item.id)
                    return item.id !== 'agencyName'
                })
                console.log(required)
                $('#agencyName')
                    .removeAttr('required')
                    .removeAttr('listFieldName')
            }
        })

        //LOCATION NAME: ENABLE CHOICE BETWEEN LIST DRIVEN DROPDOWN OR MANUALLY ENTERED INPUT  
        $('.locationRadio').on('change', function () {
            if ($(this)[0].id == 'locationRadios1') {
                $('#locationRadios1').attr('checked', 'checked')
                $('#locationRadios2').removeAttr('checked')
                $('#locationList').removeClass('d-none')
                $('#locationInput').addClass('d-none')
                $('#meetingLocation')
                    .attr({
                        required: 'required',
                        listFieldName: 'Location'
                    })
                required.push($('#meetingLocation')[0])
                required = required.filter(function (index, item) {
                    console.log(item.id)
                    return item.id !== 'otherLocation'
                })

                $('#otherLocation')
                    .removeAttr('required')
                    .removeAttr('listFieldName')
            } else {
                $('#locationRadios1').removeAttr('checked')
                $('#locationRadios2').attr('checked', 'checked')
                $('#locationList').addClass('d-none')
                $('#locationInput').removeClass('d-none')
                $('#otherLocation')
                    .attr({
                        required: 'required',
                        listFieldName: 'Location'
                    })
                required.push($('#otherLocation')[0])
                required = required.filter(function (index, item) {
                    console.log(item.id)
                    return item.id !== 'meetingLocation'
                })

                $('#meetingLocation')
                    .removeAttr('required')
                    .removeAttr('listFieldName')
            }
        })

        let today = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() + 1
        )

        $('#SFForm').bootstrapMaterialDesign()

        $('#MeetingDate').datepicker({
            format: 'yyyy-mm-dd',
            minDate: today,
            disableDaysOfWeek: [0, 6]

        })
        $('#MeetingTime').timepicker({
            mode: 'ampm',
            format: 'h:MM tt',
        })
        $('.gj-datepicker button').removeClass('btn-outline-secondary border-left-0')
        $('#attendingCommissioners').on('click', function () {
            let attending = []
            $("#attendingCommissioners input[type='checkbox']").each(function () {
                if (this.checked && $(this).val() == 'All Commissioners') {
                    $('.commissioners')
                        .prop('checked', false)
                        .attr('disabled', 'disabled')
                } else if (
                    !$(this).is(':checked') &&
                    $(this).val() == 'All Commissioners'
                ) {
                    $('.commissioners').removeAttr('disabled')
                }
                attending += this.checked ? $(this).val() + ';#' : ''
                $('#attendingCommissionerResult').attr('value', attending)
            })
            console.log(attending)
        })
    } else {
        window.location.href = 'https://sunshineauthor/_layouts/15/Authenticate.aspx?Source=%2FPages%2FStratusForms%2Easpx'
    }
})

let required = $('[required]')
let requireditems = required.length
let valid = false

function validateForm() {
    requireditems = required.length - 1
    for (let i = 0; i < required.length; i++) {
        let requiredItem = required[i]
        console.log(requireditems + ' ' + requiredItem + ' ' + requiredItem.value + ' ' + requiredItem.value.length)
        if (requireditems > 0) {
            if (requiredItem.value == 0) {
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
$('.submitFormBtn').on('click', function () {

    function stripHTML(text) {
        let regex = /(<([^>]+)>)/ig;
        return text.replace(regex, "").replace("&amp;amp;", "&").replace("quot;", '"');
    }

    let purposeVal = $('#Purpose').val()

    $('.generalAlert').addClass('d-none')
    $('.formAlerts').remove()
    validateForm()
    console.log(valid)
    if (valid == true && _spPageContextInfo.userId > 0) {
        $(this).prop('disabled', true);
        let now = moment();
        let newMoment = $('#MeetingDate').val()
        let thisInput = moment(newMoment);
        console.log(now, thisInput)
        let dateValidate = (now >= thisInput.subtract(5, 'days'))
        console.log(dateValidate)
        SubmitForm(dateValidate)
        if (!_spPageContextInfo.userId) {
            alert('Your session has timed out. You will now be redirected to sign in.')
            window.location.href = 'https://sunshineauthor/_layouts/15/Authenticate.aspx?Source=%2FPages%2FStratusForms%2Easpx'
        }
    }
})