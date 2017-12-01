'use strict';

class Slider {
    // inputs:
    // container - html id
    // color - #hex
    // range - [min value, max value]
    // step - integer (1)
    // radius - in px; integer
    // description - text that will be shown in details on the left of the slider
    constructor(container, color, range, step, radius, description) {
        this.container = container;
        this.color = color;
        this.minVal = range[0];
        this.maxVal = range[1];
        this.step = step;
        this.radius = radius;
        this.width = radius; // just for straight slider prototype
        // description text for slider details/counter
        this.description = description;

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

        // create slider and it's details/counter part
        this.slider = this.createSlider();
        this.sliderDetails = new sliderDetails(this.sliderValue, this.color, this.description);

        // add slider to specified container in constructor
        this.addSlider();
    }

    // addSlider inserts slider and detail (counter) to this.container specified in constructor
    // with custom div parent elements used for styling
    addSlider() {
        // if we are importing slider component inside container for the first time, we
        // would like to add slider-details and slider-placeholder dom elements first.
        if (this.container.childElementCount == 0) {
            let sliderContainer = document.createElement("div");
            sliderContainer.className = "slider-container";

            let detailsPlaceholder = document.createElement("div");
            detailsPlaceholder.className = "slider-detailsPlaceholder";

            let sliderPlaceholder = document.createElement("div");
            sliderPlaceholder.className = "slider-placeholder";

            sliderContainer.appendChild(detailsPlaceholder);
            sliderContainer.appendChild(sliderPlaceholder);
            this.container.appendChild(sliderContainer);
        }

        let sliderContainer = this.container.childNodes[0];
        let childElements = sliderContainer.childNodes;

        // append slider and details counter dom elements inside correct containers
        for (var i = 0; i < childElements.length; i++) {
            let el = childElements[i];
            if (el.className == "slider-detailsPlaceholder") {
                el.appendChild(this.sliderDetails.createElement());
            } else if (el.className == "slider-placeholder") {
                el.appendChild(this.slider);
            }
        }
    }

    // create slider dom element
    createSlider() {
        // whole slider container
        let newSlider = document.createElement("div");
        newSlider.className = "slider";
        let style = `height: 25px; width: ${this.radius}px; background-color: ${this.color}`;
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

        // calculating price and updating details part
        let price = this.calculatePrice(finalBtnPos);
        this.sliderDetails.setPrice(price);

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


class sliderDetails {
    // price - int
    // color - #hexNum
    // description - string (ie: Transportation)
    constructor(price, color, description) {
        this.price = price;
        this.color = color;
        this.description = description;

        // var that holds price h1 dom element so we can change it later via function
        this.priceElement;
    }

    // create dom element with data from constructor arguments
    createElement() {
        let sliderDetails = document.createElement("div");
        sliderDetails.className = "slider-row";

        let price = document.createElement("h2");
        price.innerHTML = "$" + this.price;
        this.priceElement = price;

        let backgroundColor = document.createElement("div");
        backgroundColor.className = "slider-background"
        backgroundColor.style.backgroundColor = this.color;

        let description = document.createElement("p");
        description.innerHTML = this.description;

        sliderDetails.appendChild(price);
        sliderDetails.appendChild(backgroundColor);
        sliderDetails.appendChild(description);

        return sliderDetails;
    }

    // call setPrice() on class instance to change value of
    // h1 price html tag
    setPrice(price) {
        this.price = price;
        this.priceElement.innerHTML = "$" + this.price;
    }
}

let container = document.getElementById("slider-test");
let slider1 = new Slider(container, "#70508F", [0, 1000], 1, 300, "Transportation");
let slider2 = new Slider(container, "#1D8FC4", [0, 1000], 10, 300, "Food");
let slider3 = new Slider(container, "#609F36", [0, 1000], 10, 300, "Insurance");
let slider4 = new Slider(container, "#DD8F2E", [0, 1000], 100, 300, "Entertainment");
let slider5 = new Slider(container, "#DA5648", [0, 1000], 10, 300, "Health care");