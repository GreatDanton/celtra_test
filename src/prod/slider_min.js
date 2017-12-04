"use strict";

function _classCallCheck(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}

var _createClass = function() {
    function t(t, e) {
        for (var i = 0; i < e.length; i++) {
            var r = e[i];
            r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), 
            Object.defineProperty(t, r.key, r);
        }
    }
    return function(e, i, r) {
        return i && t(e.prototype, i), r && t(e, r), e;
    };
}(), Slider = function() {
    function t(e, i, r, s, n, l) {
        _classCallCheck(this, t), this.container = e, this.color = i, this.minVal = r[0], 
        this.maxVal = r[1], this.step = s, this.radius = n, this.description = l, this.circumference = 2 * Math.PI * this.radius, 
        this.drag = !1, this.numOfSteps = Math.round((this.maxVal - this.minVal) / s), this.stepAngle = 360 / this.numOfSteps, 
        this.price = this.minVal, this.pricePerStep = (this.maxVal - this.minVal) / this.numOfSteps, 
        this.lastAngle = 0, this.sliderRing, this.fillerRing, this.sliderBtn, this.group, 
        this.strokeWidth, this.sliderDetails = new sliderDetails(this.price, this.color, this.description), 
        this.createSlider(), this.addSlider();
    }
    return _createClass(t, [ {
        key: "addSlider",
        value: function() {
            if (0 == this.container.childElementCount) {
                var t = document.createElement("div");
                t.className = "slider-container";
                var e = document.createElement("div");
                e.className = "slider-detailsPlaceholder", t.appendChild(e);
                var i = document.createElement("div");
                i.className = "slider-placeholder";
                var r = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                r.setAttributeNS(null, "version", "1.1"), r.addEventListener("contextmenu", function(t) {
                    t.preventDefault();
                }), i.appendChild(r);
                var s = document.createElement("p");
                s.innerText = "Adjust dial to enter expenses", i.appendChild(s), t.appendChild(i), 
                this.container.appendChild(t);
            }
            for (var n = this.container.childNodes[0].childNodes, l = void 0, a = void 0, d = 0; d < n.length; d++) {
                var c = n[d];
                "slider-detailsPlaceholder" == c.className ? l = c : "slider-placeholder" == c.className && (a = c);
            }
            var h = a.firstElementChild, u = h.getAttributeNS(null, "width"), o = 2 * this.radius + 2 * this.strokeWidth, p = this.sliderDetails.createElement();
            if (o > u) return h.setAttributeNS(null, "viewBox", -o / 2 + " " + -o / 2 + " " + o + " " + o), 
            h.setAttributeNS(null, "width", o), h.setAttributeNS(null, "height", o), h.insertBefore(this.group, h.firstElementChild), 
            void l.insertBefore(p, l.firstElementChild);
            for (var v = h.childNodes, m = 0; m < v.length; m++) {
                var f = v[m];
                if (o > f.getBoundingClientRect().width) return h.insertBefore(this.group, f), void l(p, l.childNodes[m]);
            }
            h.appendChild(this.group), l.appendChild(p);
        }
    }, {
        key: "createSlider",
        value: function() {
            this.strokeWidth = 20;
            var t = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            t.setAttributeNS(null, "r", this.radius), t.setAttributeNS(null, "stroke-width", this.strokeWidth), 
            t.setAttributeNS(null, "stroke", "#cacbcc"), t.setAttributeNS(null, "cx", 0), t.setAttributeNS(null, "cy", 0), 
            t.setAttributeNS(null, "fill-opacity", 0);
            var e = (2 * Math.PI * this.radius - 2 * this.numOfSteps) / this.numOfSteps;
            t.setAttributeNS(null, "stroke-dasharray", e + ", 2"), this.sliderRing = t;
            var i = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            i.setAttributeNS(null, "stroke-width", this.strokeWidth), i.setAttributeNS(null, "fill-opacity", 0), 
            i.setAttributeNS(null, "r", this.radius), i.setAttributeNS(null, "cx", 0), i.setAttributeNS(null, "cy", 0), 
            i.setAttributeNS(null, "stroke", this.color), i.setAttributeNS(null, "stroke-opacity", .8), 
            i.setAttributeNS(null, "stroke-dasharray", this.circumference), i.setAttributeNS(null, "stroke-dashoffset", this.circumference), 
            this.fillerRing = i;
            var r = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            r.setAttributeNS(null, "r", 12), r.setAttributeNS(null, "stroke-width", 1), r.setAttributeNS(null, "stroke", "#CBCBCC"), 
            r.setAttributeNS(null, "cx", this.radius), r.setAttributeNS(null, "cy", 0), r.setAttributeNS(null, "class", "slider-btn");
            var s = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
            s.setAttributeNS(null, "id", "grad");
            for (var n = [ {
                color: "#DDDEDF",
                offset: "0%"
            }, {
                color: "#ECEDEE",
                offset: "30%"
            }, {
                color: "#F8F8F8",
                offset: "80%"
            } ], l = 0; l < n.length; l++) {
                var a = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                a.setAttributeNS(null, "offset", n[l].offset), a.setAttributeNS(null, "stop-color", n[l].color), 
                s.appendChild(a);
            }
            r.setAttributeNS(null, "fill", "url(#grad)"), this.sliderBtn = r;
            var d = document.createElementNS("http://www.w3.org/2000/svg", "g");
            d.setAttributeNS(null, "transform", "rotate(-90 0 0)"), d.appendChild(t), d.appendChild(i), 
            d.appendChild(r), d.appendChild(s), d.addEventListener("touchstart", this.sliderTouchStart.bind(this)), 
            d.addEventListener("touchend", this.sliderTouchEnd.bind(this)), d.addEventListener("touchmove", this.sliderMove.bind(this)), 
            d.addEventListener("mousedown", this.sliderTouchStart.bind(this)), document.addEventListener("mouseup", this.sliderTouchEnd.bind(this)), 
            document.addEventListener("mousemove", this.sliderMove.bind(this)), this.group = d;
        }
    }, {
        key: "sliderTouchStart",
        value: function(t) {
            t.preventDefault(), this.drag = !0, this.lastAngle = -1, this.sliderMove(t);
        }
    }, {
        key: "sliderTouchEnd",
        value: function(t) {
            t.preventDefault(), this.drag = !1;
        }
    }, {
        key: "sliderMove",
        value: function(t) {
            if (t.preventDefault(), this.drag) {
                var e = void 0, i = void 0;
                "mousemove" == t.type || "mousedown" == t.type ? (e = t.clientX, i = t.clientY) : (e = t.changedTouches[0].clientX, 
                i = t.changedTouches[0].clientY);
                var r = this.calcAngle(e, i);
                if (-1 != this.lastAngle) {
                    if (this.lastAngle > 330 && r < 30) return;
                    if (this.lastAngle < 30 && r > 330) return;
                }
                var s = Math.round(r / this.stepAngle), n = Math.round(s * this.stepAngle);
                this.lastAngle = n;
                var l = this.calculatePrice(n);
                this.sliderDetails.setPrice(l), this.price = l;
                var a = this.arcLength(n), d = this.circumference - a;
                this.fillerRing.setAttributeNS(null, "stroke-dashoffset", d);
                var c = this.calcNewPoints(n), h = c[0], u = c[1];
                this.sliderBtn.setAttributeNS(null, "cx", h), this.sliderBtn.setAttributeNS(null, "cy", u);
            }
        }
    }, {
        key: "calculatePrice",
        value: function(t) {
            var e = Math.round(t / this.stepAngle);
            return Math.round(e * this.pricePerStep);
        }
    }, {
        key: "calcAngle",
        value: function(t, e) {
            var i = this.sliderRing.getBoundingClientRect(), r = t - (i.left + i.width / 2), s = e - (i.top + i.height / 2), n = 180 * Math.atan2(s, r) / Math.PI + 90;
            return n < 0 && (n += 360), n;
        }
    }, {
        key: "calcNewPoints",
        value: function(t) {
            return [ this.radius * Math.cos(t * Math.PI / 180), this.radius * Math.sin(t * Math.PI / 180) ];
        }
    }, {
        key: "arcLength",
        value: function(t) {
            return t * Math.PI * this.radius / 180;
        }
    } ]), t;
}(), sliderDetails = function() {
    function t(e, i, r) {
        _classCallCheck(this, t), this.price = e, this.color = i, this.description = r, 
        this.priceElement;
    }
    return _createClass(t, [ {
        key: "createElement",
        value: function() {
            var t = document.createElement("div");
            t.className = "slider-row";
            var e = document.createElement("h2");
            e.innerHTML = "$" + this.price, this.priceElement = e;
            var i = document.createElement("div");
            i.className = "slider-background", i.style.backgroundColor = this.color;
            var r = document.createElement("p");
            return r.innerHTML = this.description, t.appendChild(e), t.appendChild(i), t.appendChild(r), 
            t;
        }
    }, {
        key: "setPrice",
        value: function(t) {
            this.price = t, this.priceElement.innerHTML = "$" + this.price;
        }
    } ]), t;
}(), container = document.getElementById("slider-test"), slider1 = new Slider(container, "#DC5748", [ 0, 999 ], 15, 50, "Health care"), slider2 = new Slider(container, "#DD8F2E", [ 0, 999 ], 10, 80, "Entertainment"), slider3 = new Slider(container, "#4E961E", [ 0, 999 ], 10, 110, "Insurance"), slider4 = new Slider(container, "#1D8FC4", [ 0, 999 ], 10, 140, "Food"), slider5 = new Slider(container, "#70508F", [ 0, 999 ], 10, 170, "Transportation");