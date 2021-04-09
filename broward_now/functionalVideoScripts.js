let options = {
  prevNextButtons: true,
  freeScroll: true,
  wrapAround: true,
  cellSelector: '.sliderTile',
  pageDots: false,
  imagesLoaded: true,
  draggable: true
}
let videoSec = videoSec
if (matchMedia('screen and (min-width: 768px)').matches) {
  options.draggable = false
}

if (matchMedia('screen and (max-width: 767px)').matches) {
  options.prevNextButtons = false
}

let $carousel = $(
  '#featured, #community, #emergency, #environment, #tourism, #water, #educationHistory, #publicSafety, #transportation, #searched'
).flickity(options)

//Main video full Screen
$(window)
  .resize(function () {
    let width = $(window).width()
    if (width <= 767) {
      $carousel.flickity('resize')
      $('#videoPlayer > div:nth-child(1) > div.container-fluid.bg-black > div')
        .removeClass('container')
        .addClass('container-fluid px-0')
      $(
        '#videoPlayer > div:nth-child(1) > div.container-fluid.bg-black'
      ).removeClass('py-5')
      $('#videoMain').addClass('px-0')
      $('#vidMainInfo').addClass('px-4 pb-4')
      $('.clipTitle, .slideTitle').css({
        display: 'block',
        'font-size': '1rem',
        'text-align': 'center',
        'text-transform': 'uppercase'
      })
    } else if (width > 767) {
      $carousel.flickity('resize')
      $('#videoPlayer > div:nth-child(1) > div.container-fluid.bg-black > div')
        .addClass('container')
        .removeClass('container-fluid px-0')
      $(
        '#videoPlayer > div:nth-child(1) > div.container-fluid.bg-black'
      ).addClass('py-5')
      $('#videoMain').removeClass('px-0')
      $('#vidMainInfo').removeClass('px-4 pb-4')
      $('.clipTitle, .sliderTitle').css({
        display: 'none',
        'font-size': '',
        'text-align': '',
        'text-transform': ''
      })
    }
  })
  .resize()

$('.mdb-select').material_select()
let player = videojs('bc_video')

player.on('touchstart', function () {
  if (player.paused()) {
    player.play()
  } else {
    player.pause()
  }
})

$('select').on('change', function () {
  yourChoice = $('.videoFilter')
    .find('li.active span')[0]
    .textContent.replace(/ /g, '')
  if (yourChoice == 'All') {
    videoSec.fadeOut(0)
    videoSec.fadeIn(1000)
    $carousel.flickity('resize')
    $carousel.flickity('reposition')
  } else {
    videoSec.fadeIn(0)
    videoSec.fadeOut(0)
    $('section' + '.' + yourChoice).fadeIn(1000)
    $carousel.flickity('resize')
    $carousel.flickity('reposition')
  }
})

// Hover Transitions

//Video Playlist
let homePageVid = document.getElementById('bc_video')
let video_main = document.getElementById('videoPlayer')
let linksHERE = document.getElementsByClassName('sliderTile')
let modalButton = document.getElementById('videoPlay')

for (let i = 0; i < linksHERE.length; i++) {
  linksHERE[i].onclick = intoModal
  modalButton.onclick = vidReplace
}

function intoModal (e) {
  e.preventDefault()
  newVIDEO = this.children
  videothumb = newVIDEO[0].href
  removeFocus = newVIDEO[0]
  video = document.querySelector('#videoPlayer video')
  videotitle = newVIDEO[1].children[0].innerHTML
  videodesc = newVIDEO[2].innerHTML
  videoimg = newVIDEO[0].children[0].src
  $('#videoModalTitle').html(videotitle)
  $('.modalVidDesc').html(videodesc)
  $('#vidModalInfo > img').attr('src', videoimg)
}

function vidReplace (e) {
  e.preventDefault()
  video = document.querySelector('#videoPlayer video')
  $('#vidMainInfo > h2').html(videotitle)
  $('#vidMainInfo > p').html(videodesc)
  source = document.querySelectorAll('#videoPlayer video source')
  source2 = video.getAttribute('src')
  source[0].src = videothumb
  source2 = video.setAttribute('src', videothumb)
  $('#videoModal').trigger('click')

  $('html,body').animate({ scrollTop: 0 }, (scroll_top_duration = 700))

  videojs('bc_video').ready(function () {
    let homePageVid = this
    homePageVid.play()
  })
}
