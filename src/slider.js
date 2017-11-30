'use strict';

class Slider {
    // inputs:
    // container - html id
    // color - #hex
    // range - [min value, max value]
    // step - integer (1)
    // radius - in px; integer
    constructor(container, color, range, step, radius) {
        this.container = container;
        this.color = color;
        this.minVal = range[0];
        this.maxVal = range[1];
        this.step = step;
        this.radius = radius;

        // variable that is used to determine wheter the slider is being dragged
        this.drag = false;
        // slider default value on init
        this.sliderValue = 0;
        // current x position of slider button
        this.currentXPos = 0;
        // number of chunks
        this.numOfSteps = Math.round(this.maxVal / step);
        // step width in pixels
        this.stepWidth = radius / this.numOfSteps;

        this.slider = this.createSlider();
        this.container.appendChild(this.slider);
    }

    // create slider dom element
    createSlider() {
        // whole slider container
        let newSlider = document.createElement("div");
        newSlider.className = "slider";
        let style = `height: 10px; width: ${this.radius}px; background-color: ${this.color}`;
        newSlider.setAttribute("style", style); // set element style

        // slider touch button
        let sliderBtn = document.createElement("div")
        sliderBtn.className = "slider-btn";
        sliderBtn.setAttribute("style", `border: 1px solid ${this.color}`);
        newSlider.appendChild(sliderBtn);

        newSlider.addEventListener("touchstart", this.sliderTouchStart.bind(this));
        newSlider.addEventListener("touchend", this.sliderTouchEnd.bind(this));
        newSlider.addEventListener("touchmove", this.sliderMove.bind(this));

        newSlider.addEventListener("mousedown", this.sliderTouchStart.bind(this));
        newSlider.addEventListener("mouseup", this.sliderTouchEnd.bind(this));
        newSlider.addEventListener("mousemove", this.sliderMove.bind(this));

        // disable right click popup when long touch occurs
        newSlider.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });

        return newSlider;
    }

    sliderTouchStart(e) {
        // prevents zoom-in on double touch
        e.preventDefault();
        this.drag = true;
        console.log("Touch start " + this.color);
        this.sliderMove(e);
    }

    sliderTouchEnd(e) {
        e.preventDefault();
        this.drag = false;
        console.log("Touch end");
    }

    sliderMove(e) {
        e.preventDefault();
        if (this.drag) {
            let sliderPosition = this.slider.getBoundingClientRect().x;
            let mouseX;
            if (e.type == "mousemove" || e.type == "mousedown") {
                mouseX = e.clientX;
            } else {
                mouseX = e.changedTouches[0].clientX;
            }

            // position of slider btn in px (where it should be)
            let sliderBtnPosition = mouseX - sliderPosition;
            let currentSteps = Math.floor(sliderBtnPosition / this.stepWidth);

            let finalBtnPos = Math.floor(currentSteps * this.stepWidth);
            let price = finalBtnPos;

            if (finalBtnPos < 0) {
                finalBtnPos = 0;
                price = 0;
            } else if (finalBtnPos > this.radius - 20) { // we treat radius as width for now
                // 20 is width of the slider button (so it does not overflow slider path)
                finalBtnPos = this.radius - 20;
            }

            // move slide button to correct position
            let btn;
            // if slider background is clicked, parse child slide button
            if (e.target.classList[0] == "slider") {
                btn = e.target.firstElementChild;
            } else { // the actual slide button is dragged
                btn = e.target;
            }

            btn.style.left = `${finalBtnPos}px`;
            if (price > this.radius) {
                price = this.radius;
            }
            console.log("Price: " + price);
        }
    }
}

let container = document.getElementById("slider-test");
let slider1 = new Slider(container, "#CACBCC", [0, 360], 1, 150);
let slider2 = new Slider(container, "#313131", [0, 360], 10, 200);
let slider3 = new Slider(container, "#d3d3d3", [0, 360], 36, 300);