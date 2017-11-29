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

        this.slider = this.createSlider();
        this.container.appendChild(this.slider);
    }

    // create slider dom element
    createSlider() {
        let newSlider = document.createElement("div");
        newSlider.className = "slider";
        let style = `height: 20px; width: ${this.radius}px; background-color: ${this.color}`;
        newSlider.setAttribute("style", style); // set element style


        newSlider.addEventListener("touchstart", this.sliderTouchStart);
        newSlider.addEventListener("touchend", this.sliderTouchEnd);
        newSlider.addEventListener("touchmove", this.sliderMove);

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
        console.log("Touch start");
    }

    sliderTouchEnd(e) {
        e.preventDefault();
        this.drag = false;
        console.log("Touch end");
    }

    sliderMove(e) {
        console.log("Moving slider");
    }

}


container = document.getElementById("slider-test");
slider1 = new Slider(container, "#CACBCC", [0, 360], 1, 150);