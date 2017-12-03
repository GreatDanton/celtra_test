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
        // description text for slider details/counter
        this.description = description;
        this.circumference = 2 * Math.PI * this.radius;

        // variable that is used to determine wheter the slider is being dragged
        this.drag = false;
        // maximum number of steps
        this.numOfSteps = Math.round((this.maxVal - this.minVal) / step);
        // how many degrees are in one angle
        this.stepAngle = 360 / this.numOfSteps;

        // slider default price when the slider component mounts
        this.price = this.minVal;
        // Used for calculating price based on the slider button position
        this.pricePerStep = (this.maxVal - this.minVal) / this.numOfSteps;

        // sliderRing and sliderBtn are set up while constructing slider svg
        // they hold sliderRing and sliderBtn svg element for this class so we
        // can simply use them for calculations across Slider class
        this.sliderRing;
        this.fillerRing;
        this.sliderBtn;

        // create slider and it's details/(price counter) part
        this.svgContainer = this.createSlider();
        // slider details (price counter) element
        this.sliderDetails = new sliderDetails(this.price, this.color, this.description);

        // add slider to specified container in constructor
        //this.addSlider();
        this.container.appendChild(this.svgContainer);
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
        for (let i = 0; i < childElements.length; i++) {
            let el = childElements[i];
            if (el.className == "slider-detailsPlaceholder") {
                el.appendChild(this.sliderDetails.createElement());
            } else if (el.className == "slider-placeholder") {
                let placeholderWidth = el.getBoundingClientRect().width;

                if (this.radius > placeholderWidth) {
                    el.style.width = 2 * this.radius + "px";
                    el.style.height = 2 * this.radius + "px";
                }
                let positionContainer = document.createElement("div");
                positionContainer.className = "slider-position-container";
                positionContainer.appendChild(this.svgContainer);
                el.appendChild(positionContainer);
            }
        }
    }

    // create slider dom element
    createSlider() {
        let strokeWidth = 20;
        let sliderWidth = 30;
        let width = 2 * this.radius + strokeWidth + sliderWidth;

        let svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgContainer.setAttributeNS(null, "version", "1.1");
        svgContainer.setAttributeNS(null, "viewBox", `${(-strokeWidth - sliderWidth) / 2} ${(-strokeWidth - sliderWidth) / 2} ${width} ${width}`);
        svgContainer.setAttributeNS(null, "width", width);
        svgContainer.setAttributeNS(null, "height", width);

        let sliderRing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        sliderRing.setAttributeNS(null, "r", this.radius);
        sliderRing.setAttributeNS(null, "stroke-width", strokeWidth);
        sliderRing.setAttributeNS(null, "cx", this.radius);
        sliderRing.setAttributeNS(null, "cy", this.radius);
        sliderRing.setAttributeNS(null, "fill-opacity", 0);
        sliderRing.setAttributeNS(null, "class", "slider-ring");

        let emptyChunkSize = 2;
        let fullChunkSize = (2 * Math.PI * this.radius - emptyChunkSize * this.numOfSteps) / this.numOfSteps;
        sliderRing.setAttributeNS(null, "stroke-dasharray", `${fullChunkSize}, ${emptyChunkSize}`);
        this.sliderRing = sliderRing;

        svgContainer.appendChild(sliderRing);

        // fills with color based on btn position
        let fillerRing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        fillerRing.setAttributeNS(null, "stroke-width", strokeWidth);
        fillerRing.setAttributeNS(null, "fill-opacity", 0);
        fillerRing.setAttributeNS(null, "r", this.radius);
        fillerRing.setAttributeNS(null, "cx", this.radius);
        fillerRing.setAttributeNS(null, "cy", this.radius);
        fillerRing.setAttributeNS(null, "stroke", this.color);
        fillerRing.setAttributeNS(null, "stroke-opacity", 0.7);
        // fillerRing is rotated for 90 deg counterclockwise, so it starts at the top of the circle
        fillerRing.setAttributeNS(null, "transform", `rotate(-90 ${this.radius} ${this.radius})`);

        // create empty filler ring (not filled in since we start at point 0)
        fillerRing.setAttributeNS(null, "stroke-dasharray", this.circumference);
        fillerRing.setAttributeNS(null, "stroke-dashoffset", this.circumference);
        this.fillerRing = fillerRing;
        svgContainer.appendChild(fillerRing);


        // slider touch button
        let sliderBtn = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        sliderBtn.setAttributeNS(null, "r", 13);
        sliderBtn.setAttributeNS(null, "stroke-width", 1);
        sliderBtn.setAttributeNS(null, "stroke", this.color);
        sliderBtn.setAttributeNS(null, "fill", "#fafafa");
        sliderBtn.setAttributeNS(null, "cx", this.radius);
        sliderBtn.setAttributeNS(null, "cy", 0);
        sliderBtn.setAttributeNS(null, "class", "slider-btn");
        this.sliderBtn = sliderBtn;
        svgContainer.appendChild(sliderBtn);

        svgContainer.addEventListener("touchstart", this.sliderTouchStart.bind(this));
        svgContainer.addEventListener("touchend", this.sliderTouchEnd.bind(this));
        svgContainer.addEventListener("touchmove", this.sliderMove.bind(this));

        svgContainer.addEventListener("mousedown", this.sliderTouchStart.bind(this));
        svgContainer.addEventListener("mouseup", this.sliderTouchEnd.bind(this));
        svgContainer.addEventListener("mousemove", this.sliderMove.bind(this));

        // disable right click popup when long touch occurs
        svgContainer.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });

        return svgContainer;
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
        // detect mouse or touch global x,y coordinates
        let clickX;
        let clickY;
        if (e.type == "mousemove" || e.type == "mousedown") {
            clickX = e.clientX;
            clickY = e.clientY;
        } else {
            clickX = e.changedTouches[0].clientX;
            clickY = e.changedTouches[0].clientY;
        }

        let newAngle = this.calcAngle(clickX, clickY);
        // create sticky feeling => slider sticks to slider ring ticks/steps
        let steps = Math.round(newAngle / this.stepAngle);
        let finalAngle = Math.round(steps * this.stepAngle);

        // calculate new price based on the angle
        let newPrice = this.calculatePrice(finalAngle);
        this.price = newPrice;

        // fill part of the arc untill the slider button
        let arcLen = this.arcLength(finalAngle);
        let offset = this.circumference - arcLen;
        this.fillerRing.setAttributeNS(null, "stroke-dashoffset", offset);

        // update slider button position
        let newBtnPosition = this.calcNewPoints(finalAngle);
        let newX = newBtnPosition[0] + this.radius;
        let newY = newBtnPosition[1] + this.radius;

        this.sliderBtn.setAttributeNS(null, "cx", newX);
        this.sliderBtn.setAttributeNS(null, "cy", newY);
    }

    // calculate price from slider button position
    calculatePrice(angle) {
        let steps = Math.round(angle / this.stepAngle);
        let price = steps * this.pricePerStep;
        return price;
    }

    // calculate angle between (pointX, pointY), center point of the
    // ringSlider (circle) and top most point which represent 0 degrees.
    calcAngle(pointX, pointY) {
        let dimensions = this.sliderRing.getBoundingClientRect();
        let cx = dimensions.left + (dimensions.width / 2);
        let cy = dimensions.top + (dimensions.height / 2);

        let dx = pointX - cx;
        let dy = pointY - cy;
        // returns angle in degrees. + 90 is added to rotate coordinate system
        // so 0deg angle is at the top of the circle.
        let deg = Math.atan2(dy, dx) * 180 / Math.PI + 90;
        if (deg < 0) {
            deg += 360;
        }
        return deg;
    }

    // calculate new [x,y] points for sliderBtn based on the inserted angle in degrees
    calcNewPoints(angle) {
        // rotate coordinate system so 0deg angle is at the top of the circle (ringSlider);
        angle -= 90;
        let x = this.radius * Math.cos(angle * Math.PI / 180);
        let y = this.radius * Math.sin(angle * Math.PI / 180);
        return [x, y];
    }

    // calculate length of the arc for the chosen angle
    arcLength(angle) {
        let length = angle * Math.PI * this.radius / 180;
        return length;
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

    // call setPrice() on class instance to change value of h1 price html tag
    setPrice(price) {
        this.price = price;
        this.priceElement.innerHTML = "$" + this.price;
    }
}

let container = document.getElementById("slider-test");
let slider1 = new Slider(container, "#70508F", [0, 1000], 50, 100, "Transportation");
let slider2 = new Slider(container, "#1D8FC4", [0, 1000], 10, 180, "Food");
let slider3 = new Slider(container, "#609F36", [0, 1000], 10, 210, "Insurance");
let slider4 = new Slider(container, "#DD8F2E", [0, 1000], 500, 240, "Entertainment");
let slider5 = new Slider(container, "#DA5648", [0, 1000], 10, 270, "Health care");