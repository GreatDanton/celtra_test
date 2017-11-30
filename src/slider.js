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
        this.width = radius; // just for straight slider prototype

        // variable that is used to determine wheter the slider is being dragged
        this.drag = false;
        // slider default value on init
        this.sliderValue = 0;
        // maximum number of steps
        this.numOfSteps = Math.round(this.maxVal / step);
        // step width in pixels
        this.stepWidth = radius / this.numOfSteps;
        // for calculating price based on the slider button position
        this.pricePerPixel = (this.maxVal - this.minVal) / this.width;

        this.slider = this.createSlider();
        this.container.appendChild(this.slider);
    }

    // create slider dom element
    createSlider() {
        // whole slider container
        let newSlider = document.createElement("div");
        newSlider.className = "slider";
        let style = `height: 20px; width: ${this.radius}px; background-color: ${this.color}`;
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
        // if drag != true early escape
        if (!this.drag) {
            return;
        }

        let sliderContainerPos = this.slider.getBoundingClientRect().x;
        // detect mouse or touch x coordinates
        let mouseX;
        if (e.type == "mousemove" || e.type == "mousedown") {
            mouseX = e.clientX;
        } else {
            mouseX = e.changedTouches[0].clientX;
        }

        // position of slider btn in px (where it should be)
        let sliderBtnPosition = mouseX - sliderContainerPos;
        // lines below create sticky feeling for slider button. Slider sticks
        // to the step ticks
        let currentSteps = Math.round(sliderBtnPosition / this.stepWidth);
        let finalBtnPos = Math.round(currentSteps * this.stepWidth);

        // prevents slider button overflowing slider container
        if (finalBtnPos > this.width) {
            finalBtnPos = this.width
        } else if (finalBtnPos < 0) {
            finalBtnPos = 0;
        }

        let price = this.calculatePrice(finalBtnPos);
        console.log("Price: " + price);

        let btn;
        // if slider background is clicked, parse child element => slider button
        if (e.target.classList[0] == "slider") {
            btn = e.target.firstElementChild;
        } else { // the actual slider button is dragged
            btn = e.target;
        }

        // we are using transform translate because it has better performance than
        // changing coordinates of plain element.style.left
        let prevPos = btn.style.left;
        let newPos = finalBtnPos;
        let diff = newPos - prevPos;
        btn.style.transform = `translate(${diff}px, -50%)`;
    }

    // calculate price from slider button position
    calculatePrice(btnPosition) {
        let price = btnPosition * this.pricePerPixel + this.minVal;
        return Math.round(price);
    }
}

let container = document.getElementById("slider-test");
let slider1 = new Slider(container, "#CACBCC", [0, 360], 1, 150);
let slider2 = new Slider(container, "#313131", [0, 360], 10, 200);
let slider3 = new Slider(container, "#d3d3d3", [0, 360], 36, 300);