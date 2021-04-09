function resize_svg() {
    let screen_width = window.innerWidth
    let screen_height = window.innerHeight
    let svg_height = $("#main-error-2").height()
    let svg_width = $("#main-error-2").width()

    let width_difference = screen_width - svg_width
    let width_change = width_difference / 2

    let height_difference = screen_height - svg_height
    let height_change = height_difference / 2

    $("#main-error-2").css({
        "position": "fixed",
        "top": height_change + "px",
        "left": width_change + "px"
    })

    if (svg_height < screen_height) {
        console.log("High is not covered")
        $("#main-error-2").height(screen_height)
        resize_svg()
    }
}

resize_svg()

$(window).resize(function () {
    resize_svg()
})

//SVG Opacity

let svgfade = $("#main-error-2")
TweenMax
    .fromTo(svgfade[0], 1, {
        opacity: 0
    }, {
        opacity: 1
    })

let footerfade = $("#site-footer")
TweenMax
    .fromTo(footerfade[0], 1, {
        opacity: 0
    }, {
        opacity: 1
    })

//Alligator Main Animation
let alligatorMain = $("#alligator-500")
TweenMax
    .fromTo(alligatorMain[0], 10, {
        x: "80%"
    }, {
        x: "0%",
        onComplete: bob
    })

let alligatorSplash = $("#alligator-splash")
TweenMax
    .fromTo(alligatorSplash[0], 9.7, {
        x: "84%"
    }, {
        x: "0%"
    })

//Alligator Secondary Animation
let alligatorBob = $("#alligator-floaty")
TweenMax
    .fromTo(alligatorBob[0], 2.2, {
        y: "-10%"
    }, {
        y: "-7%",
        rotation: 1,
        repeat: -1,
        yoyo: true,
        ease: Sine.easeInOut,
        transformOrigin: "bottom center"
    })

//Middle Grass Animation
let grassBob = $("#grass-middle-right")
TweenMax
    .fromTo(grassBob[0], 2.5, {
        y: "-10%"
    }, {
        y: "-6%",
        rotation: 1,
        repeat: -1,
        yoyo: true,
        ease: Sine.easeInOut,
        transformOrigin: "bottom center"
    })


// Wood Bob

let wood = $("#wood")
TweenMax
    .fromTo(wood[0], 2.2, {
        y: "-10%"
    }, {
        y: "-5%",
        rotation: 1,
        repeat: -1,
        yoyo: true,
        ease: Sine.easeInOut,
        transformOrigin: "bottom center"
    })


//Alligator Main Blink Animation

let alligatorBlink = $("#alligator-eyes-1")

function blink() {
    TweenLite.to(alligatorBlink, 0.1, {
        autoAlpha: 0,
        delay: 3,
        onComplete: function () {

            TweenLite.to(alligatorBlink, 0.1, {
                autoAlpha: 1,
                delay: 0.1,
                onComplete: blink
            });
        }
    });
}
blink();

//Alligator Floaty Blink Animation

let alligatorBlink2 = $("#alligator-floaty-eyes")

function blink2() {
    TweenLite.to(alligatorBlink2, 0.1, {
        autoAlpha: 0,
        delay: 2.5,
        onComplete: function () {

            TweenLite.to(alligatorBlink2, 0.1, {
                autoAlpha: 1,
                delay: 0.1,
                onComplete: blink2
            });
        }
    });
}
blink2();

//Alligator floaty jump
//let alligatorFloatyJump = $("#alligator-floaty")
//TweenMax
//.to(alligatorFloatyJump[0], 3, {bezier:{type:"thru", values:[{x:0, y:0}, {x:-600, y:-500}, {x:-1350, y:400}]}, ease:Power1.easeInOut, delay: 6})

//Alligator Bob Animation

function bob() {
    TweenMax
        .fromTo(alligatorMain[0], 2, {
            y: "0%"
        }, {
            y: "3%",
            rotation: 1,
            repeat: -1,
            yoyo: true,
            ease: Sine.easeInOut,
            transformOrigin: "bottom center"
        })
}

//Error Message Animation
let errorMask = $("#alligator-mask-2")
TweenMax
    .fromTo(errorMask[0], 7, {
        y: "-50%"
    }, {
        y: "0%",
        onComplete: bob2
    })

let errorMessage = $("#internal-server-error")
TweenMax
    .fromTo(errorMessage[0], 2, {
        y: "0%"
    }, {
        y: "-10%",
        onComplete: bob3
    })



function bob2() {
    TweenMax
        .fromTo(errorMask[0], 2.2, {
            y: "0%"
        }, {
            y: "-2%",
            repeat: -1,
            yoyo: true,
            ease: Sine.easeInOut
        })
}

function bob3() {
    TweenMax
        .fromTo(errorMessage[0], 2.2, {
            y: "-10%"
        }, {
            y: "-5%",
            rotation: 1,
            repeat: -1,
            yoyo: true,
            ease: Sine.easeInOut,
            transformOrigin: "bottom center"
        })
}

//Grass Swaying Animation

let grassSway1 = $("#blade-1")
TweenMax.to(grassSway1[0], 2, {
    rotation: 5,
    repeat: -1,
    yoyo: true,
    ease: Power2.easeInOut,
    delay: 2,
    transformOrigin: "bottom right"
})

let grassSway2 = $("#blade-2")
TweenMax.to(grassSway2[0], 4, {
    rotation: 5,
    repeat: -1,
    yoyo: true,
    ease: Power2.easeInOut,
    delay: 3,
    transformOrigin: "bottom right"
})

let grassSway3 = $("#blade-3")
TweenMax.to(grassSway3[0], 2, {
    rotation: 5,
    repeat: -1,
    yoyo: true,
    ease: Power2.easeInOut,
    delay: 2,
    transformOrigin: "bottom right"
})

let grassSway4 = $("#blade-4")
TweenMax.to(grassSway4[0], 3, {
    rotation: 5,
    repeat: -1,
    yoyo: true,
    ease: Power2.easeInOut,
    delay: 3,
    transformOrigin: "bottom right"
})

let grassSway5 = $("#blade-5")
TweenMax.to(grassSway5[0], 3, {
    rotation: 5,
    repeat: -1,
    yoyo: true,
    ease: Power2.easeInOut,
    delay: 2,
    transformOrigin: "bottom right"
})

let grassSway6 = $("#blade-6")
TweenMax.to(grassSway6[0], 2, {
    rotation: 5,
    repeat: -1,
    yoyo: true,
    ease: Power2.easeInOut,
    delay: 1,
    transformOrigin: "bottom center"
})

let grassSway7 = $("#blade-7")
TweenMax.to(grassSway7[0], 5, {
    rotation: 5,
    repeat: -1,
    yoyo: true,
    ease: Power2.easeInOut,
    delay: 1,
    transformOrigin: "bottom center"
})

let grassSway8 = $("#blade-8")
TweenMax.to(grassSway8[0], 3, {
    rotation: 5,
    repeat: -1,
    yoyo: true,
    ease: Power2.easeInOut,
    delay: 1,
    transformOrigin: "bottom center"
})

let grassSway9 = $("#blade-9")
TweenMax.to(grassSway9[0], 6, {
    rotation: -5,
    repeat: -1,
    yoyo: true,
    ease: Power2.easeInOut,
    delay: 1,
    transformOrigin: "bottom center"
})

let grassSway10 = $("#blade-10")
TweenMax.to(grassSway10[0], 6, {
    rotation: 5,
    repeat: -1,
    yoyo: true,
    ease: Power2.easeInOut,
    delay: 1,
    transformOrigin: "bottom center"
})

let grassSway11 = $("#blade-11")
TweenMax.to(grassSway11[0], 6, {
    rotation: -5,
    repeat: -1,
    yoyo: true,
    ease: Power2.easeInOut,
    delay: 1,
    transformOrigin: "bottom center"
})

let grassSway12 = $("#blade-12")
TweenMax.to(grassSway12[0], 2, {
    rotation: 5,
    repeat: -1,
    yoyo: true,
    ease: Power2.easeInOut,
    delay: 1,
    transformOrigin: "bottom center"
})

let grassSway13 = $("#blade-13")
TweenMax.to(grassSway13[0], 2, {
    rotation: -5,
    repeat: -1,
    yoyo: true,
    ease: Power2.easeInOut,
    delay: 1,
    transformOrigin: "bottom center"
})

let grassSway14 = $("#blade-14")
TweenMax.to(grassSway14[0], 2, {
    rotation: 5,
    repeat: -1,
    yoyo: true,
    ease: Power2.easeInOut,
    delay: 1,
    transformOrigin: "bottom center"
})


//Clouds Animation
let cloud1 = $("#cloud-1")
TweenMax
    .fromTo(cloud1[0], 200, {
        x: "0%",
        display: 'initial'
    }, {
        x: "600%"
    })

let cloud2 = $("#cloud-2")
TweenMax
    .fromTo(cloud2[0], 600, {
        x: "0%",
        display: 'initial'
    }, {
        x: "1000%"
    })

let cloud3 = $("#cloud-3")
TweenMax
    .fromTo(cloud3[0], 200, {
        x: "0%",
        display: 'initial'
    }, {
        x: "1000%"
    })

let cloud4 = $("#cloud-4")
TweenMax
    .fromTo(cloud4[0], 300, {
        x: "0%",
        display: 'initial'
    }, {
        x: "600%"
    })

let cloud5 = $("#cloud-5")
TweenMax
    .fromTo(cloud5[0], 400, {
        x: "0%",
        display: 'initial'
    }, {
        x: "600%"
    })

let cloud6 = $("#cloud-6")
TweenMax
    .fromTo(cloud6[0], 500, {
        x: "0%",
        display: 'initial'
    }, {
        x: "600%"
    })

let cloud7 = $("#cloud-7")
TweenMax
    .fromTo(cloud7[0], 350, {
        x: "0%",
        display: 'initial'
    }, {
        x: "600%"
    })