'use strict';

(function () {

    var spark = {};

    spark.Banner = function () {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.target = {x: this.width / 2, y: this.height / 2};
        this.canvas = document.querySelector('#spark-banner');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        this.points = this.createPoints();
        this.findClosestPoints();
        this.assignCircleToPoints();
        this.startAnimation();
        this.addListeners();
    };

    spark.Banner.prototype = {
        createPoints: function () {
            var points = [], x, y, px, py, p;
            for (x = 0; x < this.width; x = x + this.width / 20) {
                for (y = 0; y < this.height; y = y + this.height / 20) {
                    px = x + Math.random() * this.width / 20;
                    py = y + Math.random() * this.height / 20;
                    p = {x: px, originX: px, y: py, originY: py};
                    points.push(p);
                }
            }
            return points;
        },

        findClosestPoints: function () {
            var closest, p1, p2, placed, i, j, k;
            for (i = 0; i < this.points.length; i++) {
                closest = [];
                p1 = this.points[i];
                for (j = 0; j < this.points.length; j++) {
                    p2 = this.points[j];
                    if (p1 !== p2) {
                    
                        placed = false;

                        if (closest.length < 5) {
                            closest.push(p2);
                            placed = true;
                        }

                        for (k = 0; k < 5; k++) {
                            if (!placed) {  // use breaks instead??
                                if (this.getDistance(p1, p2) < this.getDistance(p1, closest[k])) {
                                    closest[k] = p2;
                                    placed = true;
                                }
                            }
                        }
                    }
                }

                p1.closest = closest;
            }
        },

        assignCircleToPoints: function () {
            var i, c;
            for (i in this.points) {
                c = new spark.Circle(this.ctx, this.points[i], 2 + Math.random() * 2, 'rgba(255,255,255,0.3)');
                this.points[i].circle = c;
            }
        },

        startAnimation: function () {
            this.animate();
            for(var i in this.points) {
                this.shiftPoint(this.points[i]);
            }
        },

        animate: function () {
            var i;

            this.ctx.clearRect(0, 0, this.width, this.height);
            
            for (i = 0; i < this.points.length; i++) {
                if (Math.abs(this.getDistance(this.target, this.points[i])) < 4000) {
                    this.points[i].active = 0.3;
                    this.points[i].circle.active = 0.6;
                } else if (Math.abs(this.getDistance(this.target, this.points[i])) < 20000) {
                    this.points[i].active = 0.1;
                    this.points[i].circle.active = 0.3;
                } else if (Math.abs(this.getDistance(this.target, this.points[i])) < 4000) {
                    this.points[i].active = 0.02;
                    this.points[i].circle.active = 0.1;
                } else {
                    this.points[i].active = 0;
                    this.points[i].circle.active = 0;
                }

                this.drawLines(this.points[i]);
                this.points[i].circle.draw();
            }

            requestAnimationFrame(this.animate.bind(this));
        },
        
        drawLines: function (p) {
            if (!p.active) return;
            for (var i in p.closest) {
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(p.closest[i].x, p.closest[i].y);
                this.ctx.strokeStyle = 'rgba(156,217,249,' + p.active + ')';
                this.ctx.stroke();
            }
        },

        shiftPoint: function (p) {
            var self = this,
                config = {
                    x: p.originX - 50 + Math.random() * 100,
                    y: p.originY - 50 + Math.random() * 100,
                    ease: Circ.easeInOut,
                    onComplete: function () {
                        self.shiftPoint(p);
                    }
                };
            TweenLite.to(p, 1 + 1 * Math.random(), config);
        },

        addListeners: function () {
            if (!('ontouchstart' in window)) {
                addEventListener('mousemove', this.mousemove.bind(this));
            }
            addEventListener('resize', this.resize.bind(this));
        },

        mousemove: function (e) {
            var pageX = e.pageX,
                pageY = e.pageY;

            if (pageX === undefined) {
                pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }

            this.target.x = pageX;
            this.target.y = pageY;
        },

        resize: function () {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            console.log('resize');
        },

        getDistance: function (p1, p2) {
            return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
        }
    };

    spark.Circle = function (ctx, pos, radius, colour) {
        this.ctx = ctx || null;
        this.pos = pos || null;
        this.radius = radius || null;
        this.colour = colour || null;
    };

    spark.Circle.prototype = {
        draw: function () {
            if (!this.active) return;
            this.ctx.beginPath();
            this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
            this.ctx.fillStyle = 'rgba(156,217,249,' + this.active + ')';
            //this.ctx.fillStyle = this.colour;
            this.ctx.fill();
        }
    };

    window.spark = spark;

}());