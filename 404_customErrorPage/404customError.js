// SVG Responsive

function resize_svg() {
  var screen_width = window.innerWidth
  var screen_height = window.innerHeight
  var svg_height = $("#main-error").height()
  var svg_width = $("#main-error").width()

  var width_difference = screen_width - svg_width
  var width_change = width_difference / 2

  var height_difference = screen_height - svg_height
    var height_change = height_difference / 2

    $("#main-error").css({
        "position": "fixed",
        "top": height_change + "px",
        "left": width_change + "px"
    })

    if (svg_height < screen_height) {
        console.log("High is not covered")
        $("#main-error").height(screen_height)
        resize_svg()
    }
}

resize_svg()

$(window).resize(function () {
    resize_svg()
})


// SVG Opacity

var svgfade2 = $("#main-error")
TweenMax
    .fromTo(svgfade2[0], 1, {
        opacity: 0
    }, {
        opacity: 1
    })

var footerfade = $("#site-footer")
TweenMax
    .fromTo(footerfade[0], 1, {
        opacity: 0
    }, {
        opacity: 1
    })

// Airplane Animation

var airplane = $("#airplane-with-banner")
TweenMax
    .fromTo(airplane[0], 5.5, {
        x: "250%",
        display: 'initial'
    }, {
        x: "0%",
        delay: 2,
        onComplete: bobAirplane
    })

function bobAirplane() {
    TweenMax
        .fromTo(airplane[0], 2, {
            y: "0%"
        }, {
            y: "15%",
            rotation: .5,
            repeat: -1,
            yoyo: true,
            ease: Sine.easeInOut,
            transformOrigin: "bottom center"
        })
}


// 404 Animation

var error_404 = $("#error-404")
TweenMax
    .fromTo(error_404[0], 3, {
        y: "60%",
        display: 'initial'
    }, {
        y: "0%",
        onComplete: bob
    })

function bob() {
    TweenMax
        .fromTo(error_404[0], 2, {
            y: "0%"
        }, {
            y: "2%",
            rotation: .5,
            repeat: -1,
            yoyo: true,
            ease: Sine.easeInOut,
            transformOrigin: "bottom center"
        })
}

// Trees Sway

var treeLeftSway = $("#tree-left-leaves-group")
TweenMax
    .fromTo(treeLeftSway[0], 2, {
        x: "0%"
    }, {
        x: "1%",
        rotation: .5,
        repeat: -1,
        yoyo: true,
        ease: Sine.easeInOut,
        transformOrigin: "bottom right"
    })

var treeRightSway = $("#tree-right-leaves-group")
TweenMax
    .fromTo(treeRightSway[0], 2, {
        x: "0%"
    }, {
        x: "1%",
        rotation: .5,
        repeat: -1,
        yoyo: true,
        ease: Sine.easeInOut,
        transformOrigin: "bottom right",
        delay: .5
    })

// Crab Animation


var crab = $("#crab")

var crab_swivel = TweenMax.to(crab[0], 0.1, {
    rotation: 8,
    repeat: -1,
    yoyo: true,
    delay: 7,
    transformOrigin: "center center"
})

TweenMax.fromTo(crab[0], 3, {
    x: "0%",
    y: "0",
    display: 'initial'
}, {
    x: "-900%",
    y: "-70%",
    delay: 7,
    onComplete: function (val) {
        crab_swivel.kill()
    }
})

//Banner Animation

var banner_front = $("#banner-front_1_")
TweenMax.fromTo(banner_front[0], 1.3, {
    rotation: -1.7,
    scale: 0.99,
    repeat: -1,
    yoyo: true,
    yoyoEase: Back.easeOut.config(2),
    transformOrigin: "left center"
}, {
    rotation: 1.7,
    scale: 1.01,
    repeat: -1,
    yoyo: true,
    yoyoEase: Sine.easeOut

})

// Clouds Animation
var cloud1 = $("#cloud-1")
TweenMax
    .fromTo(cloud1[0], 100, {
        x: "0%",
        display: 'initial'
    }, {
        x: "600%"
    })

var cloud2 = $("#cloud-2")
TweenMax
    .fromTo(cloud2[0], 200, {
        x: "0%",
        display: 'initial'
    }, {
        x: "1000%"
    })

var cloud3 = $("#cloud-3")
TweenMax
    .fromTo(cloud3[0], 100, {
        x: "0%",
        display: 'initial'
    }, {
        x: "1000%"
    })

var cloud4 = $("#cloud-4")
TweenMax
    .fromTo(cloud4[0], 80, {
        x: "0%",
        display: 'initial'
    }, {
        x: "600%"
    })

var cloud5 = $("#cloud-5")
TweenMax
    .fromTo(cloud5[0], 95, {
        x: "0%",
        display: 'initial'
    }, {
        x: "600%"
    })


// Beachball Animation
var beachball = $("#beachball")
TweenMax
    .to(beachball[0], 4, {
        x: "-80%",
        rotation: -100,
        transformOrigin: "center center",
        delay: 12
    })