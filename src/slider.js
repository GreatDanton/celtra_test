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
        this.group;
        // width of the slider stroke (colored ring part)
        this.strokeWidth;

        // slider details (price counter) element
        this.sliderDetails = new sliderDetails(this.price, this.color, this.description);
        // create slider and fill variables above with elements
        this.createSlider();
        // add slider to specified container in constructor
        this.addSlider();
    }

    // addSlider inserts slider and slider detail(price counter) to this.container
    // specified in constructor with custom div parent elements used for easier positioning
    addSlider() {
        // if the svgContainer is empty (slider is being added for the first time)
        // the necessary containers should be added to the dom tree first
        if (this.container.childElementCount == 0) {
            let sliderContainer = document.createElement("div");
            sliderContainer.className = "slider-container";

            let detailsPlaceholder = document.createElement("div");
            detailsPlaceholder.className = "slider-detailsPlaceholder";
            sliderContainer.appendChild(detailsPlaceholder);

            // adding svg container inside slider-placeholder
            let sliderPlaceholder = document.createElement("div");
            sliderPlaceholder.className = "slider-placeholder";


            let svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgContainer.setAttributeNS(null, "version", "1.1");
            // disable right click popup when long touch occurs
            svgContainer.addEventListener("contextmenu", (e) => {
                e.preventDefault();
            });
            sliderPlaceholder.appendChild(svgContainer);

            let textholder = document.createElement("p");
            textholder.innerText = "Adjust dial to enter expenses";
            sliderPlaceholder.appendChild(textholder);

            // appending slider-placeholder element to main slider-container
            sliderContainer.appendChild(sliderPlaceholder);
            // appending whole sliderContainer to the chosen dom element
            this.container.appendChild(sliderContainer);
        }

        let sliderContainerNodes = this.container.childNodes[0].childNodes;
        let detailsPlaceholder;
        let sliderPlaceholder;
        for (let i = 0; i < sliderContainerNodes.length; i++) {
            let el = sliderContainerNodes[i];
            if (el.className == "slider-detailsPlaceholder") {
                detailsPlaceholder = el;
            } else if (el.className == "slider-placeholder") {
                sliderPlaceholder = el;
            }
        }

        // append slider and details counter dom elements inside their correct container
        let svgContainer = sliderPlaceholder.firstElementChild;
        let svgContainerWidth = svgContainer.getAttributeNS(null, "width");

        let width = 2 * this.radius + 2 * this.strokeWidth;
        let detailsElement = this.sliderDetails.createElement();

        // if the slider that is being added is bigger than the current width of the
        // svg container, change viewbox (so the sliders are always centered)
        //  and width & height
        //
        // group <g> tags should be located in svgContainer in descending order. The
        // biggest sliders should ba at the front of the node array otherwise smaller
        // sliders (smaller <g> group) can not be clicked. Svg z-index works
        if (width > svgContainerWidth) {
            // viewbox (minx, miny, width, height);
            svgContainer.setAttributeNS(null, "viewBox", `${-width / 2} ${-width / 2} ${width} ${width}`);
            svgContainer.setAttributeNS(null, "width", width);
            svgContainer.setAttributeNS(null, "height", width);

            // insert before the first <g> tag in svgContainer. The biggest sliders
            // should be at the front otherwise we can not click on the smaller sliders
            svgContainer.insertBefore(this.group, svgContainer.firstElementChild);
            detailsPlaceholder.insertBefore(detailsElement, detailsPlaceholder.firstElementChild)
            return;
        }

        // if the slider width is in between smallest and biggest slider in the node array
        // find its exact position and insert it into the svgContainer
        let otherSlidersArr = svgContainer.childNodes;
        for (let i = 0; i < otherSlidersArr.length; i++) {
            let slider = otherSlidersArr[i];
            let sliderWidth = slider.getBoundingClientRect().width;
            if (width > sliderWidth) {
                svgContainer.insertBefore(this.group, slider);
                detailsPlaceholder(detailsElement, detailsPlaceholder.childNodes[i]);
                return;
            }
        }

        // if the current slider is the smallest one in the svgContainer, append it to svg container
        svgContainer.appendChild(this.group);
        detailsPlaceholder.appendChild(detailsElement);
    }


    // create slider dom element
    createSlider() {
        this.strokeWidth = 20;

        let sliderRing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        sliderRing.setAttributeNS(null, "r", this.radius);
        sliderRing.setAttributeNS(null, "stroke-width", this.strokeWidth);
        sliderRing.setAttributeNS(null, "cx", 0);
        sliderRing.setAttributeNS(null, "cy", 0);
        sliderRing.setAttributeNS(null, "fill-opacity", 0);
        sliderRing.setAttributeNS(null, "class", "slider-ring");

        let emptyChunkSize = 2;
        let fullChunkSize = (2 * Math.PI * this.radius - emptyChunkSize * this.numOfSteps) / this.numOfSteps;
        sliderRing.setAttributeNS(null, "stroke-dasharray", `${fullChunkSize}, ${emptyChunkSize}`);
        this.sliderRing = sliderRing;

        // fills with color based on btn position
        let fillerRing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        fillerRing.setAttributeNS(null, "stroke-width", this.strokeWidth);
        fillerRing.setAttributeNS(null, "fill-opacity", 0);
        fillerRing.setAttributeNS(null, "r", this.radius);
        fillerRing.setAttributeNS(null, "cx", 0);
        fillerRing.setAttributeNS(null, "cy", 0);
        fillerRing.setAttributeNS(null, "stroke", this.color);
        fillerRing.setAttributeNS(null, "stroke-opacity", 0.8);

        // create empty filler ring (not filled in since we start at point 0)
        fillerRing.setAttributeNS(null, "stroke-dasharray", this.circumference);
        fillerRing.setAttributeNS(null, "stroke-dashoffset", this.circumference);
        this.fillerRing = fillerRing;

        // slider touch button
        let sliderBtn = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        sliderBtn.setAttributeNS(null, "r", 13);
        sliderBtn.setAttributeNS(null, "stroke-width", 1);
        sliderBtn.setAttributeNS(null, "stroke", "#CBCBCC");
        sliderBtn.setAttributeNS(null, "cx", this.radius);
        sliderBtn.setAttributeNS(null, "cy", 0);
        sliderBtn.setAttributeNS(null, "class", "slider-btn");

        // add gradient to button
        let gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        gradient.setAttributeNS(null, "id", "grad");
        let stops = [
            { "color": "#DDDEDF", "offset": "0%" }, // dark at bottom
            { "color": "#ECEDEE", "offset": "30%" },
            { "color": "#F8F8F8", "offset": "80%" } // light at top
        ];
        for (let i = 0; i < stops.length; i++) {
            console.log(stops[i].offset);
            let stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
            stop.setAttributeNS(null, "offset", stops[i].offset);
            stop.setAttributeNS(null, "stop-color", stops[i].color);
            gradient.appendChild(stop);
        }
        sliderBtn.setAttributeNS(null, "fill", "url(#grad)");
        this.sliderBtn = sliderBtn;

        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        // group of all elements is rotated by 90deg counter clockwise. This ensures
        // slider btn is at the top of the circle and the step ticks start always at
        // the top.
        group.setAttributeNS(null, "transform", "rotate(-90 0 0)");

        group.appendChild(sliderRing);
        group.appendChild(fillerRing);
        group.appendChild(sliderBtn);
        group.appendChild(gradient);

        // touch clicks event listeners
        group.addEventListener("touchstart", this.sliderTouchStart.bind(this));
        group.addEventListener("touchend", this.sliderTouchEnd.bind(this));
        group.addEventListener("touchmove", this.sliderMove.bind(this));

        // mouse clicks event listeners
        group.addEventListener("mousedown", this.sliderTouchStart.bind(this));
        // if the mouse goes outside the group container the events on group element
        // would not fire. This problem is fixed with event listener on group being
        //replaced with event on document
        document.addEventListener("mouseup", this.sliderTouchEnd.bind(this));
        document.addEventListener("mousemove", this.sliderMove.bind(this));

        this.group = group;
    }

    sliderTouchStart(e) {
        // prevents zoom-in on double touch
        e.preventDefault();
        this.drag = true;
        this.sliderMove(e);
    }

    sliderTouchEnd(e) {
        e.preventDefault();
        this.drag = false;
    }

    sliderMove(e) {
        e.preventDefault();
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

        // calculate angle of mouse click - center of circle
        let newAngle = this.calcAngle(clickX, clickY);

        // create sticky feeling => slider sticks to slider ring ticks/steps
        let steps = Math.round(newAngle / this.stepAngle);
        let finalAngle = Math.round(steps * this.stepAngle);

        // calculate new price based on the angle
        let newPrice = this.calculatePrice(finalAngle);
        this.sliderDetails.setPrice(newPrice);
        this.price = newPrice;

        // fill part of the arc untill the slider button
        let arcLen = this.arcLength(finalAngle);
        let offset = this.circumference - arcLen;
        this.fillerRing.setAttributeNS(null, "stroke-dashoffset", offset);

        // update slider button position
        let newBtnPosition = this.calcNewPoints(finalAngle);
        let newX = newBtnPosition[0];
        let newY = newBtnPosition[1];

        this.sliderBtn.setAttributeNS(null, "cx", newX);
        this.sliderBtn.setAttributeNS(null, "cy", newY);
    }

    // calculate price from slider button position
    calculatePrice(angle) {
        let steps = Math.round(angle / this.stepAngle);
        let price = Math.round(steps * this.pricePerStep);
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
let slider1 = new Slider(container, "#DC5748", [0, 999], 15, 50, "Health care");
let slider2 = new Slider(container, "#DD8F2E", [0, 999], 10, 80, "Food");
let slider3 = new Slider(container, "#4E961E", [0, 999], 10, 110, "Insurance");
let slider4 = new Slider(container, "#1D8FC4", [0, 999], 10, 140, "Entertainment");
let slider5 = new Slider(container, "#70508F", [0, 999], 10, 170, "Transportation");
