/**
 * @license
 * Pixi.JS - v1.3.0
 * Copyright (c) 2012, Mat Groves
 * http://goodboydigital.com/
 *
 * Compiled: 2013-10-17
 *
 * Pixi.JS is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */
/**

 * @author Mat Groves http://matgroves.com/ @Doormat23

 */



(function(){



	var root = this;


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * @module PIXI
 */
var PIXI = PIXI || {};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis.
 *
 * @class Point
 * @constructor
 * @param x {Number} position of the point
 * @param y {Number} position of the point
 */
PIXI.Point = function(x, y)
{
	/**
	 * @property x
	 * @type Number
	 * @default 0
	 */
	this.x = x || 0;

	/**
	 * @property y
	 * @type Number
	 * @default 0
	 */
	this.y = y || 0;
}

/**
 * Creates a clone of this point
 *
 * @method clone
 * @return {Point} a copy of the point
 */
PIXI.Point.prototype.clone = function()
{
	return new PIXI.Point(this.x, this.y);
}

// constructor
PIXI.Point.prototype.constructor = PIXI.Point;


/**
 * @author Mat Groves http://matgroves.com/
 */

/**
 * the Rectangle object is an area defined by its position, as indicated by its top-left corner point (x, y) and by its width and its height.
 *
 * @class Rectangle
 * @constructor
 * @param x {Number} The X coord of the upper-left corner of the rectangle
 * @param y {Number} The Y coord of the upper-left corner of the rectangle
 * @param width {Number} The overall wisth of this rectangle
 * @param height {Number} The overall height of this rectangle
 */
PIXI.Rectangle = function(x, y, width, height)
{
	/**
	 * @property x
	 * @type Number
	 * @default 0
	 */
	this.x = x || 0;

	/**
	 * @property y
	 * @type Number
	 * @default 0
	 */
	this.y = y || 0;

	/**
	 * @property width
	 * @type Number
	 * @default 0
	 */
	this.width = width || 0;

	/**
	 * @property height
	 * @type Number
	 * @default 0
	 */
	this.height = height || 0;
}

/**
 * Creates a clone of this Rectangle
 *
 * @method clone
 * @return {Rectangle} a copy of the rectangle
 */
PIXI.Rectangle.prototype.clone = function()
{
	return new PIXI.Rectangle(this.x, this.y, this.width, this.height);
}

/**
 * Checks if the x, and y coords passed to this function are contained within this Rectangle
 *
 * @method contains
 * @param x {Number} The X coord of the point to test
 * @param y {Number} The Y coord of the point to test
 * @return {Boolean} if the x/y coords are within this Rectangle
 */
PIXI.Rectangle.prototype.contains = function(x, y)
{
    if(this.width <= 0 || this.height <= 0)
        return false;

	var x1 = this.x;
	if(x >= x1 && x <= x1 + this.width)
	{
		var y1 = this.y;

		if(y >= y1 && y <= y1 + this.height)
		{
			return true;
		}
	}

	return false;
}

// constructor
PIXI.Rectangle.prototype.constructor = PIXI.Rectangle;


/**
 * @author Adrien Brault <adrien.brault@gmail.com>
 */

/**
 * @class Polygon
 * @constructor
 * @param points* {Array<Point>|Array<Number>|Point...|Number...} This can be an array of Points that form the polygon,
 *      a flat array of numbers that will be interpreted as [x,y, x,y, ...], or the arugments passed can be
 *      all the points of the polygon e.g. `new PIXI.Polygon(new PIXI.Point(), new PIXI.Point(), ...)`, or the
 *      arguments passed can be flat x,y values e.g. `new PIXI.Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are
 *      Numbers.
 */
PIXI.Polygon = function(points)
{
    //if points isn't an array, use arguments as the array
    if(!(points instanceof Array))
        points = Array.prototype.slice.call(arguments);

    //if this is a flat array of numbers, convert it to points
    if(typeof points[0] === 'number') {
        var p = [];
        for(var i = 0, il = points.length; i < il; i+=2) {
            p.push(
                new PIXI.Point(points[i], points[i + 1])
            );
        }

        points = p;
    }

	this.points = points;
}

/**
 * Creates a clone of this polygon
 *
 * @method clone
 * @return {Polygon} a copy of the polygon
 */
PIXI.Polygon.prototype.clone = function()
{
	var points = [];
	for (var i=0; i<this.points.length; i++) {
		points.push(this.points[i].clone());
	}

	return new PIXI.Polygon(points);
}

/**
 * Checks if the x, and y coords passed to this function are contained within this polygon
 *
 * @method contains
 * @param x {Number} The X coord of the point to test
 * @param y {Number} The Y coord of the point to test
 * @return {Boolean} if the x/y coords are within this polygon
 */
PIXI.Polygon.prototype.contains = function(x, y)
{
    var inside = false;

    // use some raycasting to test hits
    // https://github.com/substack/point-in-polygon/blob/master/index.js
    for(var i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
        var xi = this.points[i].x, yi = this.points[i].y,
            xj = this.points[j].x, yj = this.points[j].y,
            intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if(intersect) inside = !inside;
    }

    return inside;
}

PIXI.Polygon.prototype.constructor = PIXI.Polygon;


/**
 * @author Chad Engler <chad@pantherdev.com>
 */

/**
 * The Circle object can be used to specify a hit area for displayobjects
 *
 * @class Circle
 * @constructor
 * @param x {Number} The X coord of the upper-left corner of the framing rectangle of this circle
 * @param y {Number} The Y coord of the upper-left corner of the framing rectangle of this circle
 * @param radius {Number} The radius of the circle
 */
PIXI.Circle = function(x, y, radius)
{
    /**
     * @property x
     * @type Number
     * @default 0
     */
    this.x = x || 0;

    /**
     * @property y
     * @type Number
     * @default 0
     */
    this.y = y || 0;

    /**
     * @property radius
     * @type Number
     * @default 0
     */
    this.radius = radius || 0;
}

/**
 * Creates a clone of this Circle instance
 *
 * @method clone
 * @return {Circle} a copy of the polygon
 */
PIXI.Circle.prototype.clone = function()
{
    return new PIXI.Circle(this.x, this.y, this.radius);
}

/**
 * Checks if the x, and y coords passed to this function are contained within this circle
 *
 * @method contains
 * @param x {Number} The X coord of the point to test
 * @param y {Number} The Y coord of the point to test
 * @return {Boolean} if the x/y coords are within this polygon
 */
PIXI.Circle.prototype.contains = function(x, y)
{
    if(this.radius <= 0)
        return false;

    var dx = (this.x - x),
        dy = (this.y - y),
        r2 = this.radius * this.radius;

    dx *= dx;
    dy *= dy;

    return (dx + dy <= r2);
}

PIXI.Circle.prototype.constructor = PIXI.Circle;


/**
 * @author Chad Engler <chad@pantherdev.com>
 */

/**
 * The Ellipse object can be used to specify a hit area for displayobjects
 *
 * @class Ellipse
 * @constructor
 * @param x {Number} The X coord of the upper-left corner of the framing rectangle of this ellipse
 * @param y {Number} The Y coord of the upper-left corner of the framing rectangle of this ellipse
 * @param width {Number} The overall height of this ellipse
 * @param height {Number} The overall width of this ellipse
 */
PIXI.Ellipse = function(x, y, width, height)
{
    /**
     * @property x
     * @type Number
     * @default 0
     */
    this.x = x || 0;

    /**
     * @property y
     * @type Number
     * @default 0
     */
    this.y = y || 0;

    /**
     * @property width
     * @type Number
     * @default 0
     */
    this.width = width || 0;

    /**
     * @property height
     * @type Number
     * @default 0
     */
    this.height = height || 0;
}

/**
 * Creates a clone of this Ellipse instance
 *
 * @method clone
 * @return {Ellipse} a copy of the ellipse
 */
PIXI.Ellipse.prototype.clone = function()
{
    return new PIXI.Ellipse(this.x, this.y, this.width, this.height);
}

/**
 * Checks if the x, and y coords passed to this function are contained within this ellipse
 *
 * @method contains
 * @param x {Number} The X coord of the point to test
 * @param y {Number} The Y coord of the point to test
 * @return {Boolean} if the x/y coords are within this ellipse
 */
PIXI.Ellipse.prototype.contains = function(x, y)
{
    if(this.width <= 0 || this.height <= 0)
        return false;

    //normalize the coords to an ellipse with center 0,0
    //and a radius of 0.5
    var normx = ((x - this.x) / this.width) - 0.5,
        normy = ((y - this.y) / this.height) - 0.5;

    normx *= normx;
    normy *= normy;

    return (normx + normy < 0.25);
}

PIXI.Ellipse.getBounds = function()
{
    return new PIXI.Rectangle(this.x, this.y, this.width, this.height);
}

PIXI.Ellipse.prototype.constructor = PIXI.Ellipse;




/*
 * A lighter version of the rad gl-matrix created by Brandon Jones, Colin MacKenzie IV
 * you both rock!
 */

function determineMatrixArrayType() {
    PIXI.Matrix = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
    return PIXI.Matrix;
}

determineMatrixArrayType();

PIXI.mat3 = {};

PIXI.mat3.create = function()
{
	var matrix = new PIXI.Matrix(9);

	matrix[0] = 1;
	matrix[1] = 0;
	matrix[2] = 0;
	matrix[3] = 0;
	matrix[4] = 1;
	matrix[5] = 0;
	matrix[6] = 0;
	matrix[7] = 0;
	matrix[8] = 1;

	return matrix;
}


PIXI.mat3.identity = function(matrix)
{
	matrix[0] = 1;
	matrix[1] = 0;
	matrix[2] = 0;
	matrix[3] = 0;
	matrix[4] = 1;
	matrix[5] = 0;
	matrix[6] = 0;
	matrix[7] = 0;
	matrix[8] = 1;

	return matrix;
}


PIXI.mat4 = {};

PIXI.mat4.create = function()
{
	var matrix = new PIXI.Matrix(16);

	matrix[0] = 1;
	matrix[1] = 0;
	matrix[2] = 0;
	matrix[3] = 0;
	matrix[4] = 0;
	matrix[5] = 1;
	matrix[6] = 0;
	matrix[7] = 0;
	matrix[8] = 0;
	matrix[9] = 0;
	matrix[10] = 1;
	matrix[11] = 0;
	matrix[12] = 0;
	matrix[13] = 0;
	matrix[14] = 0;
	matrix[15] = 1;

	return matrix;
}

PIXI.mat3.multiply = function (mat, mat2, dest)
{
	if (!dest) { dest = mat; }

	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[0], a01 = mat[1], a02 = mat[2],
	    a10 = mat[3], a11 = mat[4], a12 = mat[5],
	    a20 = mat[6], a21 = mat[7], a22 = mat[8],

	    b00 = mat2[0], b01 = mat2[1], b02 = mat2[2],
	    b10 = mat2[3], b11 = mat2[4], b12 = mat2[5],
	    b20 = mat2[6], b21 = mat2[7], b22 = mat2[8];

	dest[0] = b00 * a00 + b01 * a10 + b02 * a20;
	dest[1] = b00 * a01 + b01 * a11 + b02 * a21;
	dest[2] = b00 * a02 + b01 * a12 + b02 * a22;

	dest[3] = b10 * a00 + b11 * a10 + b12 * a20;
	dest[4] = b10 * a01 + b11 * a11 + b12 * a21;
	dest[5] = b10 * a02 + b11 * a12 + b12 * a22;

	dest[6] = b20 * a00 + b21 * a10 + b22 * a20;
	dest[7] = b20 * a01 + b21 * a11 + b22 * a21;
	dest[8] = b20 * a02 + b21 * a12 + b22 * a22;

	return dest;
}

PIXI.mat3.clone = function(mat)
{
	var matrix = new PIXI.Matrix(9);

	matrix[0] = mat[0];
	matrix[1] = mat[1];
	matrix[2] = mat[2];
	matrix[3] = mat[3];
	matrix[4] = mat[4];
	matrix[5] = mat[5];
	matrix[6] = mat[6];
	matrix[7] = mat[7];
	matrix[8] = mat[8];

	return matrix;
}

PIXI.mat3.transpose = function (mat, dest)
{
 	// If we are transposing ourselves we can skip a few steps but have to cache some values
    if (!dest || mat === dest) {
        var a01 = mat[1], a02 = mat[2],
            a12 = mat[5];

        mat[1] = mat[3];
        mat[2] = mat[6];
        mat[3] = a01;
        mat[5] = mat[7];
        mat[6] = a02;
        mat[7] = a12;
        return mat;
    }

    dest[0] = mat[0];
    dest[1] = mat[3];
    dest[2] = mat[6];
    dest[3] = mat[1];
    dest[4] = mat[4];
    dest[5] = mat[7];
    dest[6] = mat[2];
    dest[7] = mat[5];
    dest[8] = mat[8];
    return dest;
}

PIXI.mat3.toMat4 = function (mat, dest)
{
	if (!dest) { dest = PIXI.mat4.create(); }

	dest[15] = 1;
	dest[14] = 0;
	dest[13] = 0;
	dest[12] = 0;

	dest[11] = 0;
	dest[10] = mat[8];
	dest[9] = mat[7];
	dest[8] = mat[6];

	dest[7] = 0;
	dest[6] = mat[5];
	dest[5] = mat[4];
	dest[4] = mat[3];

	dest[3] = 0;
	dest[2] = mat[2];
	dest[1] = mat[1];
	dest[0] = mat[0];

	return dest;
}


/////


PIXI.mat4.create = function()
{
	var matrix = new PIXI.Matrix(16);

	matrix[0] = 1;
	matrix[1] = 0;
	matrix[2] = 0;
	matrix[3] = 0;
	matrix[4] = 0;
	matrix[5] = 1;
	matrix[6] = 0;
	matrix[7] = 0;
	matrix[8] = 0;
	matrix[9] = 0;
	matrix[10] = 1;
	matrix[11] = 0;
	matrix[12] = 0;
	matrix[13] = 0;
	matrix[14] = 0;
	matrix[15] = 1;

	return matrix;
}

PIXI.mat4.transpose = function (mat, dest)
{
	// If we are transposing ourselves we can skip a few steps but have to cache some values
	if (!dest || mat === dest)
	{
	    var a01 = mat[1], a02 = mat[2], a03 = mat[3],
	        a12 = mat[6], a13 = mat[7],
	        a23 = mat[11];

	    mat[1] = mat[4];
	    mat[2] = mat[8];
	    mat[3] = mat[12];
	    mat[4] = a01;
	    mat[6] = mat[9];
	    mat[7] = mat[13];
	    mat[8] = a02;
	    mat[9] = a12;
	    mat[11] = mat[14];
	    mat[12] = a03;
	    mat[13] = a13;
	    mat[14] = a23;
	    return mat;
	}

	dest[0] = mat[0];
	dest[1] = mat[4];
	dest[2] = mat[8];
	dest[3] = mat[12];
	dest[4] = mat[1];
	dest[5] = mat[5];
	dest[6] = mat[9];
	dest[7] = mat[13];
	dest[8] = mat[2];
	dest[9] = mat[6];
	dest[10] = mat[10];
	dest[11] = mat[14];
	dest[12] = mat[3];
	dest[13] = mat[7];
	dest[14] = mat[11];
	dest[15] = mat[15];
	return dest;
}

PIXI.mat4.multiply = function (mat, mat2, dest)
{
	if (!dest) { dest = mat; }

	// Cache the matrix values (makes for huge speed increases!)
	var a00 = mat[ 0], a01 = mat[ 1], a02 = mat[ 2], a03 = mat[3];
	var a10 = mat[ 4], a11 = mat[ 5], a12 = mat[ 6], a13 = mat[7];
	var a20 = mat[ 8], a21 = mat[ 9], a22 = mat[10], a23 = mat[11];
	var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

	// Cache only the current line of the second matrix
    var b0  = mat2[0], b1 = mat2[1], b2 = mat2[2], b3 = mat2[3];
    dest[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    dest[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    dest[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    dest[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = mat2[4];
    b1 = mat2[5];
    b2 = mat2[6];
    b3 = mat2[7];
    dest[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    dest[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    dest[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    dest[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = mat2[8];
    b1 = mat2[9];
    b2 = mat2[10];
    b3 = mat2[11];
    dest[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    dest[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    dest[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    dest[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = mat2[12];
    b1 = mat2[13];
    b2 = mat2[14];
    b3 = mat2[15];
    dest[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    dest[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    dest[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    dest[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    return dest;
}

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The base class for all objects that are rendered on the screen.
 *
 * @class DisplayObject
 * @constructor
 */
PIXI.DisplayObject = function()
{
	this.last = this;
	this.first = this;

	/**
	 * The coordinate of the object relative to the local coordinates of the parent.
	 *
	 * @property position
	 * @type Point
	 */
	this.position = new PIXI.Point();

	/**
	 * The scale factor of the object.
	 *
	 * @property scale
	 * @type Point
	 */
	this.scale = new PIXI.Point(1,1);//{x:1, y:1};

	/**
	 * The pivot point of the displayObject that it rotates around
	 *
	 * @property pivot
	 * @type Point
	 */
	this.pivot = new PIXI.Point(0,0);

	/**
	 * The rotation of the object in radians.
	 *
	 * @property rotation
	 * @type Number
	 */
	this.rotation = 0;

	/**
	 * The opacity of the object.
	 *
	 * @property alpha
	 * @type Number
	 */
	this.alpha = 1;

	/**
	 * The visibility of the object.
	 *
	 * @property visible
	 * @type Boolean
	 */
	this.visible = true;

	/**
	 * This is the defined area that will pick up mouse / touch events. It is null by default.
	 * Setting it is a neat way of optimising the hitTest function that the interactionManager will use (as it will not need to hit test all the children)
	 *
	 * @property hitArea
	 * @type Rectangle|Circle|Ellipse|Polygon
	 */
	this.hitArea = null;

	/**
	 * This is used to indicate if the displayObject should display a mouse hand cursor on rollover
	 *
	 * @property buttonMode
	 * @type Boolean
	 */
	this.buttonMode = false;

	/**
	 * Can this object be rendered
	 *
	 * @property renderable
	 * @type Boolean
	 */
	this.renderable = false;

	/**
	 * [read-only] The display object container that contains this display object.
	 *
	 * @property parent
	 * @type DisplayObjectContainer
	 * @readOnly
	 */
	this.parent = null;

	/**
	 * [read-only] The stage the display object is connected to, or undefined if it is not connected to the stage.
	 *
	 * @property stage
	 * @type Stage
	 * @readOnly
	 */
	this.stage = null;

	/**
	 * [read-only] The multiplied alpha of the displayobject
	 *
	 * @property worldAlpha
	 * @type Number
	 * @readOnly
	 */
	this.worldAlpha = 1;

	/**
	 * [read-only] Whether or not the object is interactive, do not toggle directly! use the `interactive` property
	 *
	 * @property _interactive
	 * @type Boolean
	 * @readOnly
	 * @private
	 */
	this._interactive = false;

	/**
	 * [read-only] Current transform of the object based on world (parent) factors
	 *
	 * @property worldTransform
	 * @type Mat3
	 * @readOnly
	 * @private
	 */
	this.worldTransform = PIXI.mat3.create()//mat3.identity();

	/**
	 * [read-only] Current transform of the object locally
	 *
	 * @property localTransform
	 * @type Mat3
	 * @readOnly
	 * @private
	 */
	this.localTransform = PIXI.mat3.create()//mat3.identity();

	/**
	 * [NYI] Unkown
	 *
	 * @property color
	 * @type Array<>
	 * @private
	 */
	this.color = [];

	/**
	 * [NYI] Holds whether or not this object is dynamic, for rendering optimization
	 *
	 * @property dynamic
	 * @type Boolean
	 * @private
	 */
	this.dynamic = true;

	// chach that puppy!
	this._sr = 0;
	this._cr = 1;

	/*
	 * MOUSE Callbacks
	 */

	/**
	 * A callback that is used when the users clicks on the displayObject with their mouse
	 * @method click
	 * @param interactionData {InteractionData}
	 */

	/**
	 * A callback that is used when the user clicks the mouse down over the sprite
	 * @method mousedown
	 * @param interactionData {InteractionData}
	 */

	/**
	 * A callback that is used when the user releases the mouse that was over the displayObject
	 * for this callback to be fired the mouse must have been pressed down over the displayObject
	 * @method mouseup
	 * @param interactionData {InteractionData}
	 */

	/**
	 * A callback that is used when the user releases the mouse that was over the displayObject but is no longer over the displayObject
	 * for this callback to be fired, The touch must have started over the displayObject
	 * @method mouseupoutside
	 * @param interactionData {InteractionData}
	 */

	/**
	 * A callback that is used when the users mouse rolls over the displayObject
	 * @method mouseover
	 * @param interactionData {InteractionData}
	 */

	/**
	 * A callback that is used when the users mouse leaves the displayObject
	 * @method mouseout
	 * @param interactionData {InteractionData}
	 */


	/*
	 * TOUCH Callbacks
	 */

	/**
	 * A callback that is used when the users taps on the sprite with their finger
	 * basically a touch version of click
	 * @method tap
	 * @param interactionData {InteractionData}
	 */

	/**
	 * A callback that is used when the user touch's over the displayObject
	 * @method touchstart
	 * @param interactionData {InteractionData}
	 */

	/**
	 * A callback that is used when the user releases a touch over the displayObject
	 * @method touchend
	 * @param interactionData {InteractionData}
	 */

	/**
	 * A callback that is used when the user releases the touch that was over the displayObject
	 * for this callback to be fired, The touch must have started over the sprite
	 * @method touchendoutside
	 * @param interactionData {InteractionData}
	 */
}

// constructor
PIXI.DisplayObject.prototype.constructor = PIXI.DisplayObject;

/**
 * [Deprecated] Indicates if the sprite will have touch and mouse interactivity. It is false by default
 * Instead of using this function you can now simply set the interactive property to true or false
 *
 * @method setInteractive
 * @param interactive {Boolean}
 * @deprecated Simply set the `interactive` property directly
 */
PIXI.DisplayObject.prototype.setInteractive = function(interactive)
{
	this.interactive = interactive;
}

/**
 * Indicates if the sprite will have touch and mouse interactivity. It is false by default
 *
 * @property interactive
 * @type Boolean
 * @default false
 */
Object.defineProperty(PIXI.DisplayObject.prototype, 'interactive', {
    get: function() {
        return this._interactive;
    },
    set: function(value) {
    	this._interactive = value;

    	// TODO more to be done here..
		// need to sort out a re-crawl!
		if(this.stage)this.stage.dirty = true;
    }
});

/**
 * Sets a mask for the displayObject. A mask is an object that limits the visibility of an object to the shape of the mask applied to it.
 * In PIXI a regular mask must be a PIXI.Ggraphics object. This allows for much faster masking in canvas as it utilises shape clipping.
 * To remove a mask, set this property to null.
 *
 * @property mask
 * @type Graphics
 */
Object.defineProperty(PIXI.DisplayObject.prototype, 'mask', {
    get: function() {
        return this._mask;
    },
    set: function(value) {

        this._mask = value;

        if(value)
        {
	        this.addFilter(value)
        }
        else
        {
        	 this.removeFilter();
        }
    }
});

/*
 * Adds a filter to this displayObject
 *
 * @method addFilter
 * @param mask {Graphics} the graphics object to use as a filter
 * @private
 */
PIXI.DisplayObject.prototype.addFilter = function(mask)
{
	if(this.filter)return;
	this.filter = true;

	// insert a filter block..
	var start = new PIXI.FilterBlock();
	var end = new PIXI.FilterBlock();

	start.mask = mask;
	end.mask = mask;

	start.first = start.last =  this;
	end.first = end.last = this;

	start.open = true;

	/*
	 * insert start
	 */

	var childFirst = start
	var childLast = start
	var nextObject;
	var previousObject;

	previousObject = this.first._iPrev;

	if(previousObject)
	{
		nextObject = previousObject._iNext;
		childFirst._iPrev = previousObject;
		previousObject._iNext = childFirst;
	}
	else
	{
		nextObject = this;
	}

	if(nextObject)
	{
		nextObject._iPrev = childLast;
		childLast._iNext = nextObject;
	}


	// now insert the end filter block..

	/*
	 * insert end filter
	 */
	var childFirst = end
	var childLast = end
	var nextObject = null;
	var previousObject = null;

	previousObject = this.last;
	nextObject = previousObject._iNext;

	if(nextObject)
	{
		nextObject._iPrev = childLast;
		childLast._iNext = nextObject;
	}

	childFirst._iPrev = previousObject;
	previousObject._iNext = childFirst;

	var updateLast = this;

	var prevLast = this.last;
	while(updateLast)
	{
		if(updateLast.last == prevLast)
		{
			updateLast.last = end;
		}
		updateLast = updateLast.parent;
	}

	this.first = start;

	// if webGL...
	if(this.__renderGroup)
	{
		this.__renderGroup.addFilterBlocks(start, end);
	}

	mask.renderable = false;

}

/*
 * Removes the filter to this displayObject
 *
 * @method removeFilter
 * @private
 */
PIXI.DisplayObject.prototype.removeFilter = function()
{
	if(!this.filter)return;
	this.filter = false;

	// modify the list..
	var startBlock = this.first;

	var nextObject = startBlock._iNext;
	var previousObject = startBlock._iPrev;

	if(nextObject)nextObject._iPrev = previousObject;
	if(previousObject)previousObject._iNext = nextObject;

	this.first = startBlock._iNext;


	// remove the end filter
	var lastBlock = this.last;

	var nextObject = lastBlock._iNext;
	var previousObject = lastBlock._iPrev;

	if(nextObject)nextObject._iPrev = previousObject;
	previousObject._iNext = nextObject;

	// this is always true too!
	var tempLast =  lastBlock._iPrev;
	// need to make sure the parents last is updated too
	var updateLast = this;
	while(updateLast.last == lastBlock)
	{
		updateLast.last = tempLast;
		updateLast = updateLast.parent;
		if(!updateLast)break;
	}

	var mask = startBlock.mask
	mask.renderable = true;

	// if webGL...
	if(this.__renderGroup)
	{
		this.__renderGroup.removeFilterBlocks(startBlock, lastBlock);
	}
}

/*
 * Updates the object transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.DisplayObject.prototype.updateTransform = function()
{
	// TODO OPTIMIZE THIS!! with dirty
	if(this.rotation !== this.rotationCache)
	{
		this.rotationCache = this.rotation;
		this._sr =  Math.sin(this.rotation);
		this._cr =  Math.cos(this.rotation);
	}

	var localTransform = this.localTransform;
	var parentTransform = this.parent.worldTransform;
	var worldTransform = this.worldTransform;
	//console.log(localTransform)
	localTransform[0] = this._cr * this.scale.x;
	localTransform[1] = -this._sr * this.scale.y
	localTransform[3] = this._sr * this.scale.x;
	localTransform[4] = this._cr * this.scale.y;

	// TODO --> do we even need a local matrix???

	var px = this.pivot.x;
	var py = this.pivot.y;

    // Cache the matrix values (makes for huge speed increases!)
    var a00 = localTransform[0], a01 = localTransform[1], a02 = this.position.x - localTransform[0] * px - py * localTransform[1],
        a10 = localTransform[3], a11 = localTransform[4], a12 = this.position.y - localTransform[4] * py - px * localTransform[3],

        b00 = parentTransform[0], b01 = parentTransform[1], b02 = parentTransform[2],
        b10 = parentTransform[3], b11 = parentTransform[4], b12 = parentTransform[5];

	localTransform[2] = a02
	localTransform[5] = a12

    worldTransform[0] = b00 * a00 + b01 * a10;
    worldTransform[1] = b00 * a01 + b01 * a11;
    worldTransform[2] = b00 * a02 + b01 * a12 + b02;

    worldTransform[3] = b10 * a00 + b11 * a10;
    worldTransform[4] = b10 * a01 + b11 * a11;
    worldTransform[5] = b10 * a02 + b11 * a12 + b12;

	// because we are using affine transformation, we can optimise the matrix concatenation process.. wooo!
	// mat3.multiply(this.localTransform, this.parent.worldTransform, this.worldTransform);
	this.worldAlpha = this.alpha * this.parent.worldAlpha;

	this.vcount = PIXI.visibleCount;

}

PIXI.visibleCount = 0;
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


/**
 * A DisplayObjectContainer represents a collection of display objects.
 * It is the base class of all display objects that act as a container for other objects.
 *
 * @class DisplayObjectContainer
 * @extends DisplayObject
 * @constructor
 */
PIXI.DisplayObjectContainer = function()
{
	PIXI.DisplayObject.call( this );

	/**
	 * [read-only] The of children of this container.
	 *
	 * @property children
	 * @type Array<DisplayObject>
	 * @readOnly
	 */
	this.children = [];
}

// constructor
PIXI.DisplayObjectContainer.prototype = Object.create( PIXI.DisplayObject.prototype );
PIXI.DisplayObjectContainer.prototype.constructor = PIXI.DisplayObjectContainer;

//TODO make visible a getter setter
/*
Object.defineProperty(PIXI.DisplayObjectContainer.prototype, 'visible', {
    get: function() {
        return this._visible;
    },
    set: function(value) {
        this._visible = value;

    }
});*/

/**
 * Adds a child to the container.
 *
 * @method addChild
 * @param child {DisplayObject} The DisplayObject to add to the container
 */
PIXI.DisplayObjectContainer.prototype.addChild = function(child)
{
	if(child.parent != undefined)
	{

		//// COULD BE THIS???
		child.parent.removeChild(child);
	//	return;
	}

	child.parent = this;

	this.children.push(child);

	// update the stage refference..

	if(this.stage)
	{
		var tmpChild = child;
		do
		{
			if(tmpChild.interactive)this.stage.dirty = true;
			tmpChild.stage = this.stage;
			tmpChild = tmpChild._iNext;
		}
		while(tmpChild)
	}

	// LINKED LIST //

	// modify the list..
	var childFirst = child.first
	var childLast = child.last;
	var nextObject;
	var previousObject;

	// this could be wrong if there is a filter??
	if(this.filter)
	{
		previousObject =  this.last._iPrev;
	}
	else
	{
		previousObject = this.last;
	}

	nextObject = previousObject._iNext;

	// always true in this case
	// need to make sure the parents last is updated too
	var updateLast = this;
	var prevLast = previousObject;

	while(updateLast)
	{
		if(updateLast.last == prevLast)
		{
			updateLast.last = child.last;
		}
		updateLast = updateLast.parent;
	}

	if(nextObject)
	{
		nextObject._iPrev = childLast;
		childLast._iNext = nextObject;
	}

	childFirst._iPrev = previousObject;
	previousObject._iNext = childFirst;

	// need to remove any render groups..
	if(this.__renderGroup)
	{
		// being used by a renderTexture.. if it exists then it must be from a render texture;
		if(child.__renderGroup)child.__renderGroup.removeDisplayObjectAndChildren(child);
		// add them to the new render group..
		this.__renderGroup.addDisplayObjectAndChildren(child);
	}

}

/**
 * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
 *
 * @method addChildAt
 * @param child {DisplayObject} The child to add
 * @param index {Number} The index to place the child in
 */
PIXI.DisplayObjectContainer.prototype.addChildAt = function(child, index)
{
	if(index >= 0 && index <= this.children.length)
	{
		if(child.parent != undefined)
		{
			child.parent.removeChild(child);
		}
		child.parent = this;

		if(this.stage)
		{
			var tmpChild = child;
			do
			{
				if(tmpChild.interactive)this.stage.dirty = true;
				tmpChild.stage = this.stage;
				tmpChild = tmpChild._iNext;
			}
			while(tmpChild)
		}

		// modify the list..
		var childFirst = child.first;
		var childLast = child.last;
		var nextObject;
		var previousObject;

		if(index == this.children.length)
		{
			previousObject =  this.last;
			var updateLast = this;
			var prevLast = this.last;
			while(updateLast)
			{
				if(updateLast.last == prevLast)
				{
					updateLast.last = child.last;
				}
				updateLast = updateLast.parent;
			}
		}
		else if(index == 0)
		{
			previousObject = this;
		}
		else
		{
			previousObject = this.children[index-1].last;
		}

		nextObject = previousObject._iNext;

		// always true in this case
		if(nextObject)
		{
			nextObject._iPrev = childLast;
			childLast._iNext = nextObject;
		}

		childFirst._iPrev = previousObject;
		previousObject._iNext = childFirst;

		this.children.splice(index, 0, child);
		// need to remove any render groups..
		if(this.__renderGroup)
		{
			// being used by a renderTexture.. if it exists then it must be from a render texture;
			if(child.__renderGroup)child.__renderGroup.removeDisplayObjectAndChildren(child);
			// add them to the new render group..
			this.__renderGroup.addDisplayObjectAndChildren(child);
		}

	}
	else
	{
		throw new Error(child + " The index "+ index +" supplied is out of bounds " + this.children.length);
	}
}

/**
 * [NYI] Swaps the depth of 2 displayObjects
 *
 * @method swapChildren
 * @param child {DisplayObject}
 * @param child2 {DisplayObject}
 * @private
 */
PIXI.DisplayObjectContainer.prototype.swapChildren = function(child, child2)
{
	/*
	 * this funtion needs to be recoded..
	 * can be done a lot faster..
	 */
	return;

	// need to fix this function :/
	/*
	// TODO I already know this??
	var index = this.children.indexOf( child );
	var index2 = this.children.indexOf( child2 );

	if ( index !== -1 && index2 !== -1 )
	{
		// cool

		/*
		if(this.stage)
		{
			// this is to satisfy the webGL batching..
			// TODO sure there is a nicer way to achieve this!
			this.stage.__removeChild(child);
			this.stage.__removeChild(child2);

			this.stage.__addChild(child);
			this.stage.__addChild(child2);
		}

		// swap the positions..
		this.children[index] = child2;
		this.children[index2] = child;

	}
	else
	{
		throw new Error(child + " Both the supplied DisplayObjects must be a child of the caller " + this);
	}*/
}

/**
 * Returns the Child at the specified index
 *
 * @method getChildAt
 * @param index {Number} The index to get the child from
 */
PIXI.DisplayObjectContainer.prototype.getChildAt = function(index)
{
	if(index >= 0 && index < this.children.length)
	{
		return this.children[index];
	}
	else
	{
		throw new Error(child + " Both the supplied DisplayObjects must be a child of the caller " + this);
	}
}

/**
 * Removes a child from the container.
 *
 * @method removeChild
 * @param child {DisplayObject} The DisplayObject to remove
 */
PIXI.DisplayObjectContainer.prototype.removeChild = function(child)
{
	var index = this.children.indexOf( child );
	if ( index !== -1 )
	{
		// unlink //
		// modify the list..
		var childFirst = child.first;
		var childLast = child.last;

		var nextObject = childLast._iNext;
		var previousObject = childFirst._iPrev;

		if(nextObject)nextObject._iPrev = previousObject;
		previousObject._iNext = nextObject;

		if(this.last == childLast)
		{
			var tempLast =  childFirst._iPrev;
			// need to make sure the parents last is updated too
			var updateLast = this;
			while(updateLast.last == childLast.last)
			{
				updateLast.last = tempLast;
				updateLast = updateLast.parent;
				if(!updateLast)break;
			}
		}

		childLast._iNext = null;
		childFirst._iPrev = null;

		// update the stage reference..
		if(this.stage)
		{
			var tmpChild = child;
			do
			{
				if(tmpChild.interactive)this.stage.dirty = true;
				tmpChild.stage = null;
				tmpChild = tmpChild._iNext;
			}
			while(tmpChild)
		}

		// webGL trim
		if(child.__renderGroup)
		{
			child.__renderGroup.removeDisplayObjectAndChildren(child);
		}

		child.parent = undefined;
		this.children.splice( index, 1 );
	}
	else
	{
		throw new Error(child + " The supplied DisplayObject must be a child of the caller " + this);
	}
}

/*
 * Updates the container's children's transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.DisplayObjectContainer.prototype.updateTransform = function()
{
	if(!this.visible)return;

	PIXI.DisplayObject.prototype.updateTransform.call( this );

	for(var i=0,j=this.children.length; i<j; i++)
	{
		this.children[i].updateTransform();
	}
}

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.blendModes = {};
PIXI.blendModes.NORMAL = 0;
PIXI.blendModes.SCREEN = 1;


/**
 * The SPrite object is the base for all textured objects that are rendered to the screen
 *
 * @class Sprite
 * @extends DisplayObjectContainer
 * @constructor
 * @param texture {Texture} The texture for this sprite
 * @type String
 */
PIXI.Sprite = function(texture)
{
	PIXI.DisplayObjectContainer.call( this );

	/**
	 * The anchor sets the origin point of the texture.
	 * The default is 0,0 this means the textures origin is the top left
	 * Setting than anchor to 0.5,0.5 means the textures origin is centered
	 * Setting the anchor to 1,1 would mean the textures origin points will be the bottom right
	 *
     * @property anchor
     * @type Point
     */
	this.anchor = new PIXI.Point();

	/**
	 * The texture that the sprite is using
	 *
	 * @property texture
	 * @type Texture
	 */
	this.texture = texture;

	/**
	 * The blend mode of sprite.
	 * currently supports PIXI.blendModes.NORMAL and PIXI.blendModes.SCREEN
	 *
	 * @property blendMode
	 * @type Number
	 */
	this.blendMode = PIXI.blendModes.NORMAL;

	/**
	 * The width of the sprite (this is initially set by the texture)
	 *
	 * @property _width
	 * @type Number
	 * @private
	 */
	this._width = 0;

	/**
	 * The height of the sprite (this is initially set by the texture)
	 *
	 * @property _height
	 * @type Number
	 * @private
	 */
	this._height = 0;

	if(texture.baseTexture.hasLoaded)
	{
		this.updateFrame = true;
	}
	else
	{
		this.onTextureUpdateBind = this.onTextureUpdate.bind(this);
		this.texture.addEventListener( 'update', this.onTextureUpdateBind );
	}

	this.renderable = true;
}

// constructor
PIXI.Sprite.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.Sprite.prototype.constructor = PIXI.Sprite;

/**
 * The width of the sprite, setting this will actually modify the scale to acheive the value set
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI.Sprite.prototype, 'width', {
    get: function() {
        return this.scale.x * this.texture.frame.width;
    },
    set: function(value) {
    	this.scale.x = value / this.texture.frame.width
        this._width = value;
    }
});

/**
 * The height of the sprite, setting this will actually modify the scale to acheive the value set
 *
 * @property height
 * @type Number
 */
Object.defineProperty(PIXI.Sprite.prototype, 'height', {
    get: function() {
        return  this.scale.y * this.texture.frame.height;
    },
    set: function(value) {
    	this.scale.y = value / this.texture.frame.height
        this._height = value;
    }
});

/**
 * Sets the texture of the sprite
 *
 * @method setTexture
 * @param texture {Texture} The PIXI texture that is displayed by the sprite
 */
PIXI.Sprite.prototype.setTexture = function(texture)
{
	// stop current texture;
	if(this.texture.baseTexture != texture.baseTexture)
	{
		this.textureChange = true;
		this.texture = texture;

		if(this.__renderGroup)
		{
			this.__renderGroup.updateTexture(this);
		}
	}
	else
	{
		this.texture = texture;
	}

	this.updateFrame = true;
}

/**
 * When the texture is updated, this event will fire to update the scale and frame
 *
 * @method onTextureUpdate
 * @param event
 * @private
 */
PIXI.Sprite.prototype.onTextureUpdate = function(event)
{
	//this.texture.removeEventListener( 'update', this.onTextureUpdateBind );

	// so if _width is 0 then width was not set..
	if(this._width)this.scale.x = this._width / this.texture.frame.width;
	if(this._height)this.scale.y = this._height / this.texture.frame.height;

	this.updateFrame = true;
}

// some helper functions..

/**
 *
 * Helper function that creates a sprite that will contain a texture from the TextureCache based on the frameId
 * The frame ids are created when a Texture packer file has been loaded
 *
 * @method fromFrame
 * @static
 * @param frameId {String} The frame Id of the texture in the cache
 * @return {Sprite} A new Sprite using a texture from the texture cache matching the frameId
 */
PIXI.Sprite.fromFrame = function(frameId)
{
	var texture = PIXI.TextureCache[frameId];
	if(!texture)throw new Error("The frameId '"+ frameId +"' does not exist in the texture cache" + this);
	return new PIXI.Sprite(texture);
}

/**
 *
 * Helper function that creates a sprite that will contain a texture based on an image url
 * If the image is not in the texture cache it will be loaded
 *
 * @method fromImage
 * @static
 * @param imageId {String} The image url of the texture
 * @return {Sprite} A new Sprite using a texture from the texture cache matching the image id
 */
PIXI.Sprite.fromImage = function(imageId)
{
	var texture = PIXI.Texture.fromImage(imageId);
	return new PIXI.Sprite(texture);
}


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A MovieClip is a simple way to display an animation depicted by a list of textures.
 *
 * @class MovieClip
 * @extends Sprite
 * @constructor
 * @param textures {Array<Texture>} an array of {Texture} objects that make up the animation
 */
PIXI.MovieClip = function(textures)
{
	PIXI.Sprite.call(this, textures[0]);

	/**
	 * The array of textures that make up the animation
	 *
	 * @property textures
	 * @type Array
	 */
	this.textures = textures;

	/**
	 * The speed that the MovieClip will play at. Higher is faster, lower is slower
	 *
	 * @property animationSpeed
	 * @type Number
	 * @default 1
	 */
	this.animationSpeed = 1;

	/**
	 * Whether or not the movie clip repeats after playing.
	 *
	 * @property loop
	 * @type Boolean
	 * @default true
	 */
	this.loop = true;

	/**
	 * Function to call when a MovieClip finishes playing
	 *
	 * @property onComplete
	 * @type Function
	 */
	this.onComplete = null;

	/**
	 * [read-only] The index MovieClips current frame (this may not have to be a whole number)
	 *
	 * @property currentFrame
	 * @type Number
	 * @default 0
	 * @readOnly
	 */
	this.currentFrame = 0;

	/**
	 * [read-only] Indicates if the MovieClip is currently playing
	 *
	 * @property playing
	 * @type Boolean
	 * @readOnly
	 */
	this.playing = false;
}

// constructor
PIXI.MovieClip.prototype = Object.create( PIXI.Sprite.prototype );
PIXI.MovieClip.prototype.constructor = PIXI.MovieClip;

/**
 * Stops the MovieClip
 *
 * @method stop
 */
PIXI.MovieClip.prototype.stop = function()
{
	this.playing = false;
}

/**
 * Plays the MovieClip
 *
 * @method play
 */
PIXI.MovieClip.prototype.play = function()
{
	this.playing = true;
}

/**
 * Stops the MovieClip and goes to a specific frame
 *
 * @method gotoAndStop
 * @param frameNumber {Number} frame index to stop at
 */
PIXI.MovieClip.prototype.gotoAndStop = function(frameNumber)
{
	this.playing = false;
	this.currentFrame = frameNumber;
	var round = (this.currentFrame + 0.5) | 0;
	this.setTexture(this.textures[round % this.textures.length]);
}

/**
 * Goes to a specific frame and begins playing the MovieClip
 *
 * @method gotoAndPlay
 * @param frameNumber {Number} frame index to start at
 */
PIXI.MovieClip.prototype.gotoAndPlay = function(frameNumber)
{
	this.currentFrame = frameNumber;
	this.playing = true;
}

/*
 * Updates the object transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.MovieClip.prototype.updateTransform = function()
{
	PIXI.Sprite.prototype.updateTransform.call(this);

	if(!this.playing)return;

	this.currentFrame += this.animationSpeed;

	var round = (this.currentFrame + 0.5) | 0;

	if(this.loop || round < this.textures.length)
	{
		this.setTexture(this.textures[round % this.textures.length]);
	}
	else if(round >= this.textures.length)
	{
		this.gotoAndStop(this.textures.length - 1);
		if(this.onComplete)
		{
			this.onComplete();
		}
	}
}
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */



PIXI.FilterBlock = function(mask)
{
	this.graphics = mask
	this.visible = true;
	this.renderable = true;
}


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A Text Object will create a line(s) of text to split a line you can use "\n"
 *
 * @class Text
 * @extends Sprite
 * @constructor
 * @param text {String} The copy that you would like the text to display
 * @param [style] {Object} The style parameters
 * @param [style.font] {String} default "bold 20pt Arial" The style and size of the font
 * @param [style.fill="black"] {Object} A canvas fillstyle that will be used on the text eg "red", "#00FF00"
 * @param [style.align="left"] {String} An alignment of the multiline text ("left", "center" or "right")
 * @param [style.stroke] {String} A canvas fillstyle that will be used on the text stroke eg "blue", "#FCFF00"
 * @param [style.strokeThickness=0] {Number} A number that represents the thickness of the stroke. Default is 0 (no stroke)
 * @param [style.wordWrap=false] {Boolean} Indicates if word wrap should be used
 * @param [style.wordWrapWidth=100] {Number} The width at which text will wrap
 */
PIXI.Text = function(text, style)
{
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    PIXI.Sprite.call(this, PIXI.Texture.fromCanvas(this.canvas));

    this.setText(text);
    this.setStyle(style);

    this.updateText();
    this.dirty = false;
};

// constructor
PIXI.Text.prototype = Object.create(PIXI.Sprite.prototype);
PIXI.Text.prototype.constructor = PIXI.Text;

/**
 * Set the style of the text
 *
 * @method setStyle
 * @param [style] {Object} The style parameters
 * @param [style.font="bold 20pt Arial"] {String} The style and size of the font
 * @param [style.fill="black"] {Object} A canvas fillstyle that will be used on the text eg "red", "#00FF00"
 * @param [style.align="left"] {String} An alignment of the multiline text ("left", "center" or "right")
 * @param [style.stroke="black"] {String} A canvas fillstyle that will be used on the text stroke eg "blue", "#FCFF00"
 * @param [style.strokeThickness=0] {Number} A number that represents the thickness of the stroke. Default is 0 (no stroke)
 * @param [style.wordWrap=false] {Boolean} Indicates if word wrap should be used
 * @param [style.wordWrapWidth=100] {Number} The width at which text will wrap
 */
PIXI.Text.prototype.setStyle = function(style)
{
    style = style || {};
    style.font = style.font || "bold 20pt Arial";
    style.fill = style.fill || "black";
    style.align = style.align || "left";
    style.stroke = style.stroke || "black"; //provide a default, see: https://github.com/GoodBoyDigital/pixi.js/issues/136
    style.strokeThickness = style.strokeThickness || 0;
    style.wordWrap = style.wordWrap || false;
    style.wordWrapWidth = style.wordWrapWidth || 100;
    this.style = style;
    this.dirty = true;
};

/**
 * Set the copy for the text object. To split a line you can use "\n"
 *
 * @methos setText
 * @param {String} text The copy that you would like the text to display
 */
PIXI.Sprite.prototype.setText = function(text)
{
    this.text = text.toString() || " ";
    this.dirty = true;
};

/**
 * Renders text
 *
 * @method updateText
 * @private
 */
PIXI.Text.prototype.updateText = function()
{
	this.context.font = this.style.font;

	var outputText = this.text;

	// word wrap
	// preserve original text
	if(this.style.wordWrap)outputText = this.wordWrap(this.text);

	//split text into lines
	var lines = outputText.split(/(?:\r\n|\r|\n)/);

	//calculate text width
	var lineWidths = [];
	var maxLineWidth = 0;
	for (var i = 0; i < lines.length; i++)
	{
		var lineWidth = this.context.measureText(lines[i]).width;
		lineWidths[i] = lineWidth;
		maxLineWidth = Math.max(maxLineWidth, lineWidth);
	}
	this.canvas.width = maxLineWidth + this.style.strokeThickness;

	//calculate text height
	var lineHeight = this.determineFontHeight("font: " + this.style.font  + ";") + this.style.strokeThickness;
	this.canvas.height = lineHeight * lines.length;

	//set canvas text styles
	this.context.fillStyle = this.style.fill;
	this.context.font = this.style.font;

	this.context.strokeStyle = this.style.stroke;
	this.context.lineWidth = this.style.strokeThickness;

	this.context.textBaseline = "top";

	//draw lines line by line
	for (i = 0; i < lines.length; i++)
	{
		var linePosition = new PIXI.Point(this.style.strokeThickness / 2, this.style.strokeThickness / 2 + i * lineHeight);

		if(this.style.align == "right")
		{
			linePosition.x += maxLineWidth - lineWidths[i];
		}
		else if(this.style.align == "center")
		{
			linePosition.x += (maxLineWidth - lineWidths[i]) / 2;
		}

		if(this.style.stroke && this.style.strokeThickness)
		{
			this.context.strokeText(lines[i], linePosition.x, linePosition.y);
		}

		if(this.style.fill)
		{
			this.context.fillText(lines[i], linePosition.x, linePosition.y);
		}
	}

    this.updateTexture();
};

/**
 * Updates texture size based on canvas size
 *
 * @method updateTexture
 * @private
 */
PIXI.Text.prototype.updateTexture = function()
{
    this.texture.baseTexture.width = this.canvas.width;
    this.texture.baseTexture.height = this.canvas.height;
    this.texture.frame.width = this.canvas.width;
    this.texture.frame.height = this.canvas.height;

  	this._width = this.canvas.width;
    this._height = this.canvas.height;

    PIXI.texturesToUpdate.push(this.texture.baseTexture);
};

/**
 * Updates the transfor of this object
 *
 * @method updateTransform
 * @private
 */
PIXI.Text.prototype.updateTransform = function()
{
	if(this.dirty)
	{
		this.updateText();
		this.dirty = false;
	}

	PIXI.Sprite.prototype.updateTransform.call(this);
};

/*
 * http://stackoverflow.com/users/34441/ellisbben
 * great solution to the problem!
 *
 * @method determineFontHeight
 * @param fontStyle {Object}
 * @private
 */
PIXI.Text.prototype.determineFontHeight = function(fontStyle)
{
	// build a little reference dictionary so if the font style has been used return a
	// cached version...
	var result = PIXI.Text.heightCache[fontStyle];

	if(!result)
	{
		var body = document.getElementsByTagName("body")[0];
		var dummy = document.createElement("div");
		var dummyText = document.createTextNode("M");
		dummy.appendChild(dummyText);
		dummy.setAttribute("style", fontStyle + ';position:absolute;top:0;left:0');
		body.appendChild(dummy);

		result = dummy.offsetHeight;
		PIXI.Text.heightCache[fontStyle] = result;

		body.removeChild(dummy);
	}

	return result;
};

/**
 * A Text Object will apply wordwrap
 *
 * @method wordWrap
 * @param text {String}
 * @private
 */
PIXI.Text.prototype.wordWrap = function(text)
{
	// search good wrap position
	var searchWrapPos = function(ctx, text, start, end, wrapWidth)
	{
		var p = Math.floor((end-start) / 2) + start;
		if(p == start) {
			return 1;
		}

		if(ctx.measureText(text.substring(0,p)).width <= wrapWidth)
		{
			if(ctx.measureText(text.substring(0,p+1)).width > wrapWidth)
			{
				return p;
			}
			else
			{
				return arguments.callee(ctx, text, p, end, wrapWidth);
			}
		}
		else
		{
			return arguments.callee(ctx, text, start, p, wrapWidth);
		}
	};

	var lineWrap = function(ctx, text, wrapWidth)
	{
		if(ctx.measureText(text).width <= wrapWidth || text.length < 1)
		{
			return text;
		}
		var pos = searchWrapPos(ctx, text, 0, text.length, wrapWidth);
		return text.substring(0, pos) + "\n" + arguments.callee(ctx, text.substring(pos), wrapWidth);
	};

	var result = "";
	var lines = text.split("\n");
	for (var i = 0; i < lines.length; i++)
	{
		result += lineWrap(this.context, lines[i], this.style.wordWrapWidth) + "\n";
	}

	return result;
};

/**
 * Destroys this text object
 *
 * @method destroy
 * @param destroyTexture {Boolean}
 */
PIXI.Text.prototype.destroy = function(destroyTexture)
{
	if(destroyTexture)
	{
		this.texture.destroy();
	}

};

PIXI.Text.heightCache = {};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A Text Object will create a line(s) of text using bitmap font. To split a line you can use "\n", "\r" or "\r\n"
 * You can generate the fnt files using
 * http://www.angelcode.com/products/bmfont/ for windows or
 * http://www.bmglyph.com/ for mac.
 *
 * @class BitmapText
 * @extends DisplayObjectContainer
 * @constructor
 * @param text {String} The copy that you would like the text to display
 * @param style {Object} The style parameters
 * @param style.font {String} The size (optional) and bitmap font id (required) eq "Arial" or "20px Arial" (must have loaded previously)
 * @param [style.align="left"] {String} An alignment of the multiline text ("left", "center" or "right")
 */
PIXI.BitmapText = function(text, style)
{
    PIXI.DisplayObjectContainer.call(this);

    this.setText(text);
    this.setStyle(style);
    this.updateText();
    this.dirty = false

};

// constructor
PIXI.BitmapText.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXI.BitmapText.prototype.constructor = PIXI.BitmapText;

/**
 * Set the copy for the text object
 *
 * @method setText
 * @param text {String} The copy that you would like the text to display
 */
PIXI.BitmapText.prototype.setText = function(text)
{
    this.text = text || " ";
    this.dirty = true;
};

/**
 * Set the style of the text
 *
 * @method setStyle
 * @param style {Object} The style parameters
 * @param style.font {String} The size (optional) and bitmap font id (required) eq "Arial" or "20px Arial" (must have loaded previously)
 * @param [style.align="left"] {String} An alignment of the multiline text ("left", "center" or "right")
 */
PIXI.BitmapText.prototype.setStyle = function(style)
{
    style = style || {};
    style.align = style.align || "left";
    this.style = style;

    var font = style.font.split(" ");
    this.fontName = font[font.length - 1];
    this.fontSize = font.length >= 2 ? parseInt(font[font.length - 2], 10) : PIXI.BitmapText.fonts[this.fontName].size;

    this.dirty = true;
};

/**
 * Renders text
 *
 * @method updateText
 * @private
 */
PIXI.BitmapText.prototype.updateText = function()
{
    var data = PIXI.BitmapText.fonts[this.fontName];
    var pos = new PIXI.Point();
    var prevCharCode = null;
    var chars = [];
    var maxLineWidth = 0;
    var lineWidths = [];
    var line = 0;
    var scale = this.fontSize / data.size;
    for(var i = 0; i < this.text.length; i++)
    {
        var charCode = this.text.charCodeAt(i);
        if(/(?:\r\n|\r|\n)/.test(this.text.charAt(i)))
        {
            lineWidths.push(pos.x);
            maxLineWidth = Math.max(maxLineWidth, pos.x);
            line++;

            pos.x = 0;
            pos.y += data.lineHeight;
            prevCharCode = null;
            continue;
        }

        var charData = data.chars[charCode];
        if(!charData) continue;

        if(prevCharCode && charData[prevCharCode])
        {
           pos.x += charData.kerning[prevCharCode];
        }
        chars.push({texture:charData.texture, line: line, charCode: charCode, position: new PIXI.Point(pos.x + charData.xOffset, pos.y + charData.yOffset)});
        pos.x += charData.xAdvance;

        prevCharCode = charCode;
    }

    lineWidths.push(pos.x);
    maxLineWidth = Math.max(maxLineWidth, pos.x);

    var lineAlignOffsets = [];
    for(i = 0; i <= line; i++)
    {
        var alignOffset = 0;
        if(this.style.align == "right")
        {
            alignOffset = maxLineWidth - lineWidths[i];
        }
        else if(this.style.align == "center")
        {
            alignOffset = (maxLineWidth - lineWidths[i]) / 2;
        }
        lineAlignOffsets.push(alignOffset);
    }

    for(i = 0; i < chars.length; i++)
    {
        var c = new PIXI.Sprite(chars[i].texture)//PIXI.Sprite.fromFrame(chars[i].charCode);
        c.position.x = (chars[i].position.x + lineAlignOffsets[chars[i].line]) * scale;
        c.position.y = chars[i].position.y * scale;
        c.scale.x = c.scale.y = scale;
        this.addChild(c);
    }

    this.width = pos.x * scale;
    this.height = (pos.y + data.lineHeight) * scale;
};

/**
 * Updates the transfor of this object
 *
 * @method updateTransform
 * @private
 */
PIXI.BitmapText.prototype.updateTransform = function()
{
	if(this.dirty)
	{
        while(this.children.length > 0)
        {
            this.removeChild(this.getChildAt(0));
        }
        this.updateText();

        this.dirty = false;
	}

	PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);
};

PIXI.BitmapText.fonts = {};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */



/**
 * The interaction manager deals with mouse and touch events. Any DisplayObject can be interactive
 * This manager also supports multitouch.
 *
 * @class InteractionManager
 * @constructor
 * @param stage {Stage} The stage to handle interactions
 */
PIXI.InteractionManager = function(stage)
{
	/**
	 * a refference to the stage
	 *
	 * @property stage
	 * @type Stage
	 */
	this.stage = stage;

	/**
	 * the mouse data
	 *
	 * @property mouse
	 * @type InteractionData
	 */
	this.mouse = new PIXI.InteractionData();

	/**
	 * an object that stores current touches (InteractionData) by id reference
	 *
	 * @property touchs
	 * @type Object
	 */
	this.touchs = {};



	// helpers
	this.tempPoint = new PIXI.Point();
	//this.tempMatrix =  mat3.create();

	this.mouseoverEnabled = true;

	//tiny little interactiveData pool!
	this.pool = [];

	this.interactiveItems = [];


	this.last = 0;
}

// constructor
PIXI.InteractionManager.prototype.constructor = PIXI.InteractionManager;

/**
 * Collects an interactive sprite recursively to have their interactions managed
 *
 * @method collectInteractiveSprite
 * @param displayObject {DisplayObject} the displayObject to collect
 * @param iParent {DisplayObject}
 * @private
 */
PIXI.InteractionManager.prototype.collectInteractiveSprite = function(displayObject, iParent)
{
	var children = displayObject.children;
	var length = children.length;

	/// make an interaction tree... {item.__interactiveParent}
	for (var i = length-1; i >= 0; i--)
	{
		var child = children[i];

//		if(child.visible) {
			// push all interactive bits
			if(child.interactive)
			{
				iParent.interactiveChildren = true;
				//child.__iParent = iParent;
				this.interactiveItems.push(child);

				if(child.children.length > 0)
				{
					this.collectInteractiveSprite(child, child);
				}
			}
			else
			{
				child.__iParent = null;

				if(child.children.length > 0)
				{
					this.collectInteractiveSprite(child, iParent);
				}
			}
//		}
	}
}

/**
 * Sets the target for event delegation
 *
 * @method setTarget
 * @param target {WebGLRenderer|CanvasRenderer} the renderer to bind events to
 * @private
 */
PIXI.InteractionManager.prototype.setTarget = function(target)
{
	if (window.navigator.msPointerEnabled)
	{
		// time to remove some of that zoom in ja..
		target.view.style["-ms-content-zooming"] = "none";
    	target.view.style["-ms-touch-action"] = "none"

		// DO some window specific touch!
	}

	this.target = target;
	target.view.addEventListener('mousemove',  this.onMouseMove.bind(this), true);
	target.view.addEventListener('mousedown',  this.onMouseDown.bind(this), true);
 	document.body.addEventListener('mouseup',  this.onMouseUp.bind(this), true);
 	target.view.addEventListener('mouseout',   this.onMouseOut.bind(this), true);

	// aint no multi touch just yet!
	target.view.addEventListener("touchstart", this.onTouchStart.bind(this), true);
	target.view.addEventListener("touchend", this.onTouchEnd.bind(this), true);
	target.view.addEventListener("touchmove", this.onTouchMove.bind(this), true);
}

/**
 * updates the state of interactive objects
 *
 * @method update
 * @private
 */
PIXI.InteractionManager.prototype.update = function()
{
	if(!this.target)return;

	// frequency of 30fps??
	var now = Date.now();
	var diff = now - this.last;
	diff = (diff * 30) / 1000;
	if(diff < 1)return;
	this.last = now;
	//

	// ok.. so mouse events??
	// yes for now :)
	// OPTIMSE - how often to check??
	if(this.dirty)
	{
		this.dirty = false;

		var len = this.interactiveItems.length;

		for (var i=0; i < len; i++) {
		  this.interactiveItems[i].interactiveChildren = false;
		}

		this.interactiveItems = [];

		if(this.stage.interactive)this.interactiveItems.push(this.stage);
		// go through and collect all the objects that are interactive..
		this.collectInteractiveSprite(this.stage, this.stage);
	}

	// loop through interactive objects!
	var length = this.interactiveItems.length;

	this.target.view.style.cursor = "default";

	for (var i = 0; i < length; i++)
	{
		var item = this.interactiveItems[i];


		//if(!item.visible)continue;

		// OPTIMISATION - only calculate every time if the mousemove function exists..
		// OK so.. does the object have any other interactive functions?
		// hit-test the clip!


		if(item.mouseover || item.mouseout || item.buttonMode)
		{
			// ok so there are some functions so lets hit test it..
			item.__hit = this.hitTest(item, this.mouse);
			this.mouse.target = item;
			// ok so deal with interactions..
			// loks like there was a hit!
			if(item.__hit)
			{
				if(item.buttonMode)this.target.view.style.cursor = "pointer";

				if(!item.__isOver)
				{

					if(item.mouseover)item.mouseover(this.mouse);
					item.__isOver = true;
				}
			}
			else
			{
				if(item.__isOver)
				{
					// roll out!
					if(item.mouseout)item.mouseout(this.mouse);
					item.__isOver = false;
				}
			}
		}

		// --->
	}
}

/**
 * Is called when the mouse moves accross the renderer element
 *
 * @method onMouseMove
 * @param event {Event} The DOM event of the mouse moving
 * @private
 */
PIXI.InteractionManager.prototype.onMouseMove = function(event)
{
	this.mouse.originalEvent = event || window.event; //IE uses window.event
	// TODO optimize by not check EVERY TIME! maybe half as often? //
	var rect = this.target.view.getBoundingClientRect();

	this.mouse.global.x = (event.clientX - rect.left) * (this.target.width / rect.width);
	this.mouse.global.y = (event.clientY - rect.top) * ( this.target.height / rect.height);

	var length = this.interactiveItems.length;
	var global = this.mouse.global;


	for (var i = 0; i < length; i++)
	{
		var item = this.interactiveItems[i];

		if(item.mousemove)
		{
			//call the function!
			item.mousemove(this.mouse);
		}
	}
}

/**
 * Is called when the mouse button is pressed down on the renderer element
 *
 * @method onMouseDown
 * @param event {Event} The DOM event of a mouse button being pressed down
 * @private
 */
PIXI.InteractionManager.prototype.onMouseDown = function(event)
{
	this.mouse.originalEvent = event || window.event; //IE uses window.event

	// loop through inteaction tree...
	// hit test each item! ->
	// get interactive items under point??
	//stage.__i
	var length = this.interactiveItems.length;
	var global = this.mouse.global;

	var index = 0;
	var parent = this.stage;

	// while
	// hit test
	for (var i = 0; i < length; i++)
	{
		var item = this.interactiveItems[i];

		if(item.mousedown || item.click)
		{
			item.__mouseIsDown = true;
			item.__hit = this.hitTest(item, this.mouse);

			if(item.__hit)
			{
				//call the function!
				if(item.mousedown)item.mousedown(this.mouse);
				item.__isDown = true;

				// just the one!
				if(!item.interactiveChildren)break;
			}
		}
	}
}


PIXI.InteractionManager.prototype.onMouseOut = function(event)
{
	var length = this.interactiveItems.length;

	this.target.view.style.cursor = "default";

	for (var i = 0; i < length; i++)
	{
		var item = this.interactiveItems[i];

		if(item.__isOver)
		{
			this.mouse.target = item;
			if(item.mouseout)item.mouseout(this.mouse);
			item.__isOver = false;
		}
	}
}

/**
 * Is called when the mouse button is released on the renderer element
 *
 * @method onMouseUp
 * @param event {Event} The DOM event of a mouse button being released
 * @private
 */
PIXI.InteractionManager.prototype.onMouseUp = function(event)
{
	this.mouse.originalEvent = event || window.event; //IE uses window.event

	var global = this.mouse.global;


	var length = this.interactiveItems.length;
	var up = false;

	for (var i = 0; i < length; i++)
	{
		var item = this.interactiveItems[i];

		if(item.mouseup || item.mouseupoutside || item.click)
		{
			item.__hit = this.hitTest(item, this.mouse);

			if(item.__hit && !up)
			{
				//call the function!
				if(item.mouseup)
				{
					item.mouseup(this.mouse);
				}
				if(item.__isDown)
				{
					if(item.click)item.click(this.mouse);
				}

				if(!item.interactiveChildren)up = true;
			}
			else
			{
				if(item.__isDown)
				{
					if(item.mouseupoutside)item.mouseupoutside(this.mouse);
				}
			}

			item.__isDown = false;
		}
	}
}

/**
 * Tests if the current mouse coords hit a sprite
 *
 * @method hitTest
 * @param item {DisplayObject} The displayObject to test for a hit
 * @param interactionData {InteractionData} The interactiondata object to update in the case of a hit
 * @private
 */
PIXI.InteractionManager.prototype.hitTest = function(item, interactionData)
{
	var global = interactionData.global;

	if(item.vcount !== PIXI.visibleCount)return false;

	var isSprite = (item instanceof PIXI.Sprite),
		worldTransform = item.worldTransform,
		a00 = worldTransform[0], a01 = worldTransform[1], a02 = worldTransform[2],
		a10 = worldTransform[3], a11 = worldTransform[4], a12 = worldTransform[5],
		id = 1 / (a00 * a11 + a01 * -a10),
		x = a11 * id * global.x + -a01 * id * global.y + (a12 * a01 - a02 * a11) * id,
		y = a00 * id * global.y + -a10 * id * global.x + (-a12 * a00 + a02 * a10) * id;

	interactionData.target = item;

	//a sprite or display object with a hit area defined
	if(item.hitArea && item.hitArea.contains) {
		if(item.hitArea.contains(x, y)) {
			//if(isSprite)
			interactionData.target = item;

			return true;
		}

		return false;
	}
	// a sprite with no hitarea defined
	else if(isSprite)
	{
		var width = item.texture.frame.width,
			height = item.texture.frame.height,
			x1 = -width * item.anchor.x,
			y1;

		if(x > x1 && x < x1 + width)
		{
			y1 = -height * item.anchor.y;

			if(y > y1 && y < y1 + height)
			{
				// set the target property if a hit is true!
				interactionData.target = item
				return true;
			}
		}
	}

	var length = item.children.length;

	for (var i = 0; i < length; i++)
	{
		var tempItem = item.children[i];
		var hit = this.hitTest(tempItem, interactionData);
		if(hit)
		{
			// hmm.. TODO SET CORRECT TARGET?
			interactionData.target = item
			return true;
		}
	}

	return false;
}

/**
 * Is called when a touch is moved accross the renderer element
 *
 * @method onTouchMove
 * @param event {Event} The DOM event of a touch moving accross the renderer view
 * @private
 */
PIXI.InteractionManager.prototype.onTouchMove = function(event)
{
	var rect = this.target.view.getBoundingClientRect();
	var changedTouches = event.changedTouches;

	for (var i=0; i < changedTouches.length; i++)
	{
		var touchEvent = changedTouches[i];
		var touchData = this.touchs[touchEvent.identifier];
		touchData.originalEvent =  event || window.event;

		// update the touch position
		touchData.global.x = (touchEvent.clientX - rect.left) * (this.target.width / rect.width);
		touchData.global.y = (touchEvent.clientY - rect.top)  * (this.target.height / rect.height);
	}

	var length = this.interactiveItems.length;
	for (var i = 0; i < length; i++)
	{
		var item = this.interactiveItems[i];
		if(item.touchmove)item.touchmove(touchData);
	}
}

/**
 * Is called when a touch is started on the renderer element
 *
 * @method onTouchStart
 * @param event {Event} The DOM event of a touch starting on the renderer view
 * @private
 */
PIXI.InteractionManager.prototype.onTouchStart = function(event)
{
	var rect = this.target.view.getBoundingClientRect();

	var changedTouches = event.changedTouches;
	for (var i=0; i < changedTouches.length; i++)
	{
		var touchEvent = changedTouches[i];

		var touchData = this.pool.pop();
		if(!touchData)touchData = new PIXI.InteractionData();

		touchData.originalEvent =  event || window.event;

		this.touchs[touchEvent.identifier] = touchData;
		touchData.global.x = (touchEvent.clientX - rect.left) * (this.target.width / rect.width);
		touchData.global.y = (touchEvent.clientY - rect.top)  * (this.target.height / rect.height);

		var length = this.interactiveItems.length;

		for (var j = 0; j < length; j++)
		{
			var item = this.interactiveItems[j];

			if(item.touchstart || item.tap)
			{
				item.__hit = this.hitTest(item, touchData);

				if(item.__hit)
				{
					//call the function!
					if(item.touchstart)item.touchstart(touchData);
					item.__isDown = true;
					item.__touchData = touchData;

					if(!item.interactiveChildren)break;
				}
			}
		}
	}
}

/**
 * Is called when a touch is ended on the renderer element
 *
 * @method onTouchEnd
 * @param event {Event} The DOM event of a touch ending on the renderer view
 * @private
 */
PIXI.InteractionManager.prototype.onTouchEnd = function(event)
{
	//this.mouse.originalEvent = event || window.event; //IE uses window.event
	var rect = this.target.view.getBoundingClientRect();
	var changedTouches = event.changedTouches;

	for (var i=0; i < changedTouches.length; i++)
	{
		var touchEvent = changedTouches[i];
		var touchData = this.touchs[touchEvent.identifier];
		var up = false;
		touchData.global.x = (touchEvent.clientX - rect.left) * (this.target.width / rect.width);
		touchData.global.y = (touchEvent.clientY - rect.top)  * (this.target.height / rect.height);

		var length = this.interactiveItems.length;
		for (var j = 0; j < length; j++)
		{
			var item = this.interactiveItems[j];
			var itemTouchData = item.__touchData; // <-- Here!
			item.__hit = this.hitTest(item, touchData);

			if(itemTouchData == touchData)
			{
				// so this one WAS down...
				touchData.originalEvent =  event || window.event;
				// hitTest??

				if(item.touchend || item.tap)
				{
					if(item.__hit && !up)
					{
						if(item.touchend)item.touchend(touchData);
						if(item.__isDown)
						{
							if(item.tap)item.tap(touchData);
						}

						if(!item.interactiveChildren)up = true;
					}
					else
					{
						if(item.__isDown)
						{
							if(item.touchendoutside)item.touchendoutside(touchData);
						}
					}

					item.__isDown = false;
				}

				item.__touchData = null;

			}
			else
			{

			}
		}
		// remove the touch..
		this.pool.push(touchData);
		this.touchs[touchEvent.identifier] = null;
	}
}

/**
 * Holds all information related to an Interaction event
 *
 * @class InteractionData
 * @constructor
 */
PIXI.InteractionData = function()
{
	/**
	 * This point stores the global coords of where the touch/mouse event happened
	 *
	 * @property global
	 * @type Point
	 */
	this.global = new PIXI.Point();

	// this is here for legacy... but will remove
	this.local = new PIXI.Point();

	/**
	 * The target Sprite that was interacted with
	 *
	 * @property target
	 * @type Sprite
	 */
	this.target;

	/**
	 * When passed to an event handler, this will be the original DOM Event that was captured
	 *
	 * @property originalEvent
	 * @type Event
	 */
	this.originalEvent;
}

/**
 * This will return the local coords of the specified displayObject for this InteractionData
 *
 * @method getLocalPosition
 * @param displayObject {DisplayObject} The DisplayObject that you would like the local coords off
 * @return {Point} A point containing the coords of the InteractionData position relative to the DisplayObject
 */
PIXI.InteractionData.prototype.getLocalPosition = function(displayObject)
{
	var worldTransform = displayObject.worldTransform;
	var global = this.global;

	// do a cheeky transform to get the mouse coords;
	var a00 = worldTransform[0], a01 = worldTransform[1], a02 = worldTransform[2],
        a10 = worldTransform[3], a11 = worldTransform[4], a12 = worldTransform[5],
        id = 1 / (a00 * a11 + a01 * -a10);
	// set the mouse coords...
	return new PIXI.Point(a11 * id * global.x + -a01 * id * global.y + (a12 * a01 - a02 * a11) * id,
							   a00 * id * global.y + -a10 * id * global.x + (-a12 * a00 + a02 * a10) * id)
}

// constructor
PIXI.InteractionData.prototype.constructor = PIXI.InteractionData;

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A Stage represents the root of the display tree. Everything connected to the stage is rendered
 *
 * @class Stage
 * @extends DisplayObjectContainer
 * @constructor
 * @param backgroundColor {Number} the background color of the stage, easiest way to pass this in is in hex format
 *		like: 0xFFFFFF for white
 * @param interactive {Boolean} enable / disable interaction (default is false)
 */
PIXI.Stage = function(backgroundColor, interactive)
{
	PIXI.DisplayObjectContainer.call( this );

	/**
	 * [read-only] Current transform of the object based on world (parent) factors
	 *
	 * @property worldTransform
	 * @type Mat3
	 * @readOnly
	 * @private
	 */
	this.worldTransform = PIXI.mat3.create();

	/**
	 * Whether or not the stage is interactive
	 *
	 * @property interactive
	 * @type Boolean
	 */
	this.interactive = interactive;

	/**
	 * The interaction manage for this stage, manages all interactive activity on the stage
	 *
	 * @property interactive
	 * @type InteractionManager
	 */
	this.interactionManager = new PIXI.InteractionManager(this);

	/**
	 * Whether the stage is dirty and needs to have interactions updated
	 *
	 * @property dirty
	 * @type Boolean
	 * @private
	 */
	this.dirty = true;

	this.__childrenAdded = [];
	this.__childrenRemoved = [];

	//the stage is it's own stage
	this.stage = this;

	//optimize hit detection a bit
	this.stage.hitArea = new PIXI.Rectangle(0,0,100000, 100000);

	this.setBackgroundColor(backgroundColor);
	this.worldVisible = true;
}

// constructor
PIXI.Stage.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.Stage.prototype.constructor = PIXI.Stage;

/*
 * Updates the object transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.Stage.prototype.updateTransform = function()
{
	this.worldAlpha = 1;
	this.vcount = PIXI.visibleCount;

	for(var i=0,j=this.children.length; i<j; i++)
	{
		this.children[i].updateTransform();
	}

	if(this.dirty)
	{
		this.dirty = false;
		// update interactive!
		this.interactionManager.dirty = true;
	}


	if(this.interactive)this.interactionManager.update();
}

/**
 * Sets the background color for the stage
 *
 * @method setBackgroundColor
 * @param backgroundColor {Number} the color of the background, easiest way to pass this in is in hex format
 *		like: 0xFFFFFF for white
 */
PIXI.Stage.prototype.setBackgroundColor = function(backgroundColor)
{
	this.backgroundColor = backgroundColor || 0x000000;
	this.backgroundColorSplit = HEXtoRGB(this.backgroundColor);
	var hex = this.backgroundColor.toString(16);
	hex = "000000".substr(0, 6 - hex.length) + hex;
	this.backgroundColorString = "#" + hex;
}

/**
 * This will return the point containing global coords of the mouse.
 *
 * @method getMousePosition
 * @return {Point} The point containing the coords of the global InteractionData position.
 */
PIXI.Stage.prototype.getMousePosition = function()
{
	return this.interactionManager.mouse.global;
}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

/**
 * A polyfill for requestAnimationFrame
 *
 * @method requestAnimationFrame
 */
/**
 * A polyfill for cancelAnimationFrame
 *
 * @method cancelAnimationFrame
 */
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                               || window[vendors[x]+'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };

window.requestAnimFrame = window.requestAnimationFrame;

/**
 * Converts a hex color number to an [R, G, B] array
 *
 * @method HEXtoRGB
 * @param hex {Number}
 */
function HEXtoRGB(hex) {
	return [(hex >> 16 & 0xFF) / 255, ( hex >> 8 & 0xFF) / 255, (hex & 0xFF)/ 255];
}

/**
 * A polyfill for Function.prototype.bind
 *
 * @method bind
 */
if (typeof Function.prototype.bind != 'function') {
  Function.prototype.bind = (function () {
    var slice = Array.prototype.slice;
    return function (thisArg) {
      var target = this, boundArgs = slice.call(arguments, 1);

      if (typeof target != 'function') throw new TypeError();

      function bound() {
	var args = boundArgs.concat(slice.call(arguments));
	target.apply(this instanceof bound ? this : thisArg, args);
      }

      bound.prototype = (function F(proto) {
          proto && (F.prototype = proto);
          if (!(this instanceof F)) return new F;
	})(target.prototype);

      return bound;
    };
  })();
}

/**
 * A wrapper for ajax requests to be handled cross browser
 *
 * @class AjaxRequest
 * @constructor
 */
var AjaxRequest = PIXI.AjaxRequest = function()
{
	var activexmodes = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"] //activeX versions to check for in IE

	if (window.ActiveXObject)
	{ //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
		for (var i=0; i<activexmodes.length; i++)
		{
			try{
				return new ActiveXObject(activexmodes[i])
			}
   			catch(e){
    			//suppress error
   			}
		}
	}
	else if (window.XMLHttpRequest) // if Mozilla, Safari etc
  	{
  		return new XMLHttpRequest()
 	}
 	else
 	{
		return false;
 	}
}

/*
 * DEBUGGING ONLY
 */
PIXI.runList = function(item)
{
	console.log(">>>>>>>>>")
	console.log("_")
	var safe = 0;
	var tmp = item.first;
	console.log(tmp);

	while(tmp._iNext)
	{
		safe++;
		tmp = tmp._iNext;
		console.log(tmp);
	//	console.log(tmp);

		if(safe > 100)
		{
			console.log("BREAK")
			break
		}
	}
}






/**
 * https://github.com/mrdoob/eventtarget.js/
 * THankS mr DOob!
 */

/**
 * Adds event emitter functionality to a class
 *
 * @class EventTarget
 * @example
 *		function MyEmitter() {
 *			PIXI.EventTarget.call(this); //mixes in event target stuff
 *		}
 *
 *		var em = new MyEmitter();
 *		em.emit({ type: 'eventName', data: 'some data' });
 */
PIXI.EventTarget = function () {

	var listeners = {};

	this.addEventListener = this.on = function ( type, listener ) {


		if ( listeners[ type ] === undefined ) {

			listeners[ type ] = [];

		}

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {

			listeners[ type ].push( listener );
		}

	};

	this.dispatchEvent = this.emit = function ( event ) {

		for ( var listener in listeners[ event.type ] ) {

			listeners[ event.type ][ listener ]( event );

		}

	};

	this.removeEventListener = this.off = function ( type, listener ) {

		var index = listeners[ type ].indexOf( listener );

		if ( index !== - 1 ) {

			listeners[ type ].splice( index, 1 );

		}

	};

};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * This helper function will automatically detect which renderer you should be using.
 * WebGL is the preferred renderer as it is a lot fastest. If webGL is not supported by
 * the browser then this function will return a canvas renderer
 *
 * @method autoDetectRenderer
 * @static
 * @param width {Number} the width of the renderers view
 * @param height {Number} the height of the renderers view
 * @param view {Canvas} the canvas to use as a view, optional
 * @param transparent=false {Boolean} the transparency of the render view, default false
 * @param antialias=false {Boolean} sets antialias (only applicable in webGL chrome at the moment)
 *
 * antialias
 */
PIXI.autoDetectRenderer = function(width, height, view, transparent, antialias)
{
	if(!width)width = 800;
	if(!height)height = 600;

	// BORROWED from Mr Doob (mrdoob.com)
	var webgl = ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )();

	// TEMP FIX
	if(webgl)
	{
		var ie =  (navigator.userAgent.toLowerCase().indexOf('msie') != -1);
		 webgl = !ie;
	}
	//console.log(webgl);
	if( webgl )
	{
		return new PIXI.WebGLRenderer(width, height, view, transparent, antialias);
	}

	return	new PIXI.CanvasRenderer(width, height, view, transparent);
};



/*
	PolyK library
	url: http://polyk.ivank.net
	Released under MIT licence.

	Copyright (c) 2012 Ivan Kuckir

	Permission is hereby granted, free of charge, to any person
	obtaining a copy of this software and associated documentation
	files (the "Software"), to deal in the Software without
	restriction, including without limitation the rights to use,
	copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the
	Software is furnished to do so, subject to the following
	conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	OTHER DEALINGS IN THE SOFTWARE.

	This is an amazing lib!

	slightly modified by mat groves (matgroves.com);
*/

PIXI.PolyK = {};

/**
 * Triangulates shapes for webGL graphic fills
 *
 * @method Triangulate
 * @namespace PolyK
 * @constructor
 */
PIXI.PolyK.Triangulate = function(p)
{
	var sign = true;

	var n = p.length>>1;
	if(n<3) return [];
	var tgs = [];
	var avl = [];
	for(var i=0; i<n; i++) avl.push(i);

	var i = 0;
	var al = n;
	while(al > 3)
	{
		var i0 = avl[(i+0)%al];
		var i1 = avl[(i+1)%al];
		var i2 = avl[(i+2)%al];

		var ax = p[2*i0],  ay = p[2*i0+1];
		var bx = p[2*i1],  by = p[2*i1+1];
		var cx = p[2*i2],  cy = p[2*i2+1];

		var earFound = false;
		if(PIXI.PolyK._convex(ax, ay, bx, by, cx, cy, sign))
		{
			earFound = true;
			for(var j=0; j<al; j++)
			{
				var vi = avl[j];
				if(vi==i0 || vi==i1 || vi==i2) continue;
				if(PIXI.PolyK._PointInTriangle(p[2*vi], p[2*vi+1], ax, ay, bx, by, cx, cy)) {earFound = false; break;}
			}
		}
		if(earFound)
		{
			tgs.push(i0, i1, i2);
			avl.splice((i+1)%al, 1);
			al--;
			i = 0;
		}
		else if(i++ > 3*al)
		{
			// need to flip flip reverse it!
			// reset!
			if(sign)
			{
				var tgs = [];
				avl = [];
				for(var i=0; i<n; i++) avl.push(i);

				i = 0;
				al = n;

				sign = false;
			}
			else
			{
				console.log("PIXI Warning: shape too complex to fill")
				return [];
			}
		}
	}
	tgs.push(avl[0], avl[1], avl[2]);
	return tgs;
}

/**
 * Checks if a point is within a triangle
 *
 * @class _PointInTriangle
 * @namespace PolyK
 * @private
 */
PIXI.PolyK._PointInTriangle = function(px, py, ax, ay, bx, by, cx, cy)
{
	var v0x = cx-ax;
	var v0y = cy-ay;
	var v1x = bx-ax;
	var v1y = by-ay;
	var v2x = px-ax;
	var v2y = py-ay;

	var dot00 = v0x*v0x+v0y*v0y;
	var dot01 = v0x*v1x+v0y*v1y;
	var dot02 = v0x*v2x+v0y*v2y;
	var dot11 = v1x*v1x+v1y*v1y;
	var dot12 = v1x*v2x+v1y*v2y;

	var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
	var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

	// Check if point is in triangle
	return (u >= 0) && (v >= 0) && (u + v < 1);
}

/**
 * Checks if a shape is convex
 *
 * @class _convex
 * @namespace PolyK
 * @private
 */
PIXI.PolyK._convex = function(ax, ay, bx, by, cx, cy, sign)
{
	return ((ay-by)*(cx-bx) + (bx-ax)*(cy-by) >= 0) == sign;
}


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


/*
 * the default suoer fast shader!
 */

PIXI.shaderFragmentSrc = [
  "precision mediump float;",
  "varying vec2 vTextureCoord;",
  "varying float vColor;",
  "uniform sampler2D uSampler;",
  "void main(void) {",
    "gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));",
    "gl_FragColor = gl_FragColor * vColor;",
  "}"
];

PIXI.shaderVertexSrc = [
  "attribute vec2 aVertexPosition;",
  "attribute vec2 aTextureCoord;",
  "attribute float aColor;",
  //"uniform mat4 uMVMatrix;",

  "uniform vec2 projectionVector;",
  "varying vec2 vTextureCoord;",
  "varying float vColor;",
  "void main(void) {",
   // "gl_Position = uMVMatrix * vec4(aVertexPosition, 1.0, 1.0);",
    "gl_Position = vec4( aVertexPosition.x / projectionVector.x -1.0, aVertexPosition.y / -projectionVector.y + 1.0 , 0.0, 1.0);",
    "vTextureCoord = aTextureCoord;",
    "vColor = aColor;",
  "}"
];

/*
 * the triangle strip shader..
 */

PIXI.stripShaderFragmentSrc = [
  "precision mediump float;",
  "varying vec2 vTextureCoord;",
  "varying float vColor;",
  "uniform float alpha;",
  "uniform sampler2D uSampler;",
  "void main(void) {",
    "gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));",
    "gl_FragColor = gl_FragColor * alpha;",
  "}"
];


PIXI.stripShaderVertexSrc = [
  "attribute vec2 aVertexPosition;",
  "attribute vec2 aTextureCoord;",
  "attribute float aColor;",
  "uniform mat3 translationMatrix;",
  "uniform vec2 projectionVector;",
  "varying vec2 vTextureCoord;",
  "varying float vColor;",
  "void main(void) {",
	"vec3 v = translationMatrix * vec3(aVertexPosition, 1.0);",
    "gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);",
    "vTextureCoord = aTextureCoord;",
    "vColor = aColor;",
  "}"
];


/*
 * primitive shader..
 */

PIXI.primitiveShaderFragmentSrc = [
  "precision mediump float;",
  "varying vec4 vColor;",
  "void main(void) {",
    "gl_FragColor = vColor;",
  "}"
];

PIXI.primitiveShaderVertexSrc = [
  "attribute vec2 aVertexPosition;",
  "attribute vec4 aColor;",
  "uniform mat3 translationMatrix;",
  "uniform vec2 projectionVector;",
  "uniform float alpha;",
  "varying vec4 vColor;",
  "void main(void) {",
  	"vec3 v = translationMatrix * vec3(aVertexPosition, 1.0);",
    "gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);",
    "vColor = aColor  * alpha;",
  "}"
];

PIXI.initPrimitiveShader = function()
{
	var gl = PIXI.gl;

	var shaderProgram = PIXI.compileProgram(PIXI.primitiveShaderVertexSrc, PIXI.primitiveShaderFragmentSrc)

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    shaderProgram.colorAttribute = gl.getAttribLocation(shaderProgram, "aColor");

    shaderProgram.projectionVector = gl.getUniformLocation(shaderProgram, "projectionVector");
    shaderProgram.translationMatrix = gl.getUniformLocation(shaderProgram, "translationMatrix");

	shaderProgram.alpha = gl.getUniformLocation(shaderProgram, "alpha");

	PIXI.primitiveProgram = shaderProgram;
}

PIXI.initDefaultShader = function()
{
	var gl = this.gl;
	var shaderProgram = PIXI.compileProgram(PIXI.shaderVertexSrc, PIXI.shaderFragmentSrc)

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    shaderProgram.projectionVector = gl.getUniformLocation(shaderProgram, "projectionVector");
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	shaderProgram.colorAttribute = gl.getAttribLocation(shaderProgram, "aColor");

   // shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

	PIXI.shaderProgram = shaderProgram;
}

PIXI.initDefaultStripShader = function()
{
	var gl = this.gl;
	var shaderProgram = PIXI.compileProgram(PIXI.stripShaderVertexSrc, PIXI.stripShaderFragmentSrc)

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    shaderProgram.projectionVector = gl.getUniformLocation(shaderProgram, "projectionVector");
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	shaderProgram.translationMatrix = gl.getUniformLocation(shaderProgram, "translationMatrix");
	shaderProgram.alpha = gl.getUniformLocation(shaderProgram, "alpha");

	shaderProgram.colorAttribute = gl.getAttribLocation(shaderProgram, "aColor");

    shaderProgram.projectionVector = gl.getUniformLocation(shaderProgram, "projectionVector");

    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

	PIXI.stripShaderProgram = shaderProgram;
}

PIXI.CompileVertexShader = function(gl, shaderSrc)
{
  return PIXI._CompileShader(gl, shaderSrc, gl.VERTEX_SHADER);
}

PIXI.CompileFragmentShader = function(gl, shaderSrc)
{
  return PIXI._CompileShader(gl, shaderSrc, gl.FRAGMENT_SHADER);
}

PIXI._CompileShader = function(gl, shaderSrc, shaderType)
{
  var src = shaderSrc.join("\n");
  var shader = gl.createShader(shaderType);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}


PIXI.compileProgram = function(vertexSrc, fragmentSrc)
{
	var gl = PIXI.gl;
	var fragmentShader = PIXI.CompileFragmentShader(gl, fragmentSrc);
	var vertexShader = PIXI.CompileVertexShader(gl, vertexSrc);

	var shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

	return shaderProgram;
}


PIXI.activateDefaultShader = function()
{
	var gl = PIXI.gl;
	var shaderProgram = PIXI.shaderProgram;

	gl.useProgram(shaderProgram);


	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
    gl.enableVertexAttribArray(shaderProgram.colorAttribute);
}



PIXI.activatePrimitiveShader = function()
{
	var gl = PIXI.gl;

	gl.disableVertexAttribArray(PIXI.shaderProgram.textureCoordAttribute);
    gl.disableVertexAttribArray(PIXI.shaderProgram.colorAttribute);

	gl.useProgram(PIXI.primitiveProgram);

	gl.enableVertexAttribArray(PIXI.primitiveProgram.vertexPositionAttribute);
	gl.enableVertexAttribArray(PIXI.primitiveProgram.colorAttribute);
}


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A set of functions used by the webGL renderer to draw the primitive graphics data
 *
 * @class CanvasGraphics
 */
PIXI.WebGLGraphics = function()
{

}

/**
 * Renders the graphics object
 *
 * @static
 * @private
 * @method renderGraphics
 * @param graphics {Graphics}
 * @param projection {Object}
 */
PIXI.WebGLGraphics.renderGraphics = function(graphics, projection)
{
	var gl = PIXI.gl;

	if(!graphics._webGL)graphics._webGL = {points:[], indices:[], lastIndex:0,
										   buffer:gl.createBuffer(),
										   indexBuffer:gl.createBuffer()};

	if(graphics.dirty)
	{
		graphics.dirty = false;

		if(graphics.clearDirty)
		{
			graphics.clearDirty = false;

			graphics._webGL.lastIndex = 0;
			graphics._webGL.points = [];
			graphics._webGL.indices = [];

		}

		PIXI.WebGLGraphics.updateGraphics(graphics);
	}


	PIXI.activatePrimitiveShader();

	// This  could be speeded up fo sure!
	var m = PIXI.mat3.clone(graphics.worldTransform);

	PIXI.mat3.transpose(m);

	// set the matrix transform for the
 	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

 	gl.uniformMatrix3fv(PIXI.primitiveProgram.translationMatrix, false, m);

	gl.uniform2f(PIXI.primitiveProgram.projectionVector, projection.x, projection.y);

	gl.uniform1f(PIXI.primitiveProgram.alpha, graphics.worldAlpha);

	gl.bindBuffer(gl.ARRAY_BUFFER, graphics._webGL.buffer);

	// WHY DOES THIS LINE NEED TO BE THERE???
	gl.vertexAttribPointer(PIXI.shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
	// its not even used.. but need to be set or it breaks?
	// only on pc though..

	gl.vertexAttribPointer(PIXI.primitiveProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 4 * 6, 0);
	gl.vertexAttribPointer(PIXI.primitiveProgram.colorAttribute, 4, gl.FLOAT, false,4 * 6, 2 * 4);

	// set the index buffer!
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, graphics._webGL.indexBuffer);

	gl.drawElements(gl.TRIANGLE_STRIP,  graphics._webGL.indices.length, gl.UNSIGNED_SHORT, 0 );

	// return to default shader...
	PIXI.activateDefaultShader();
}

/**
 * Updates the graphics object
 *
 * @static
 * @private
 * @method updateGraphics
 * @param graphics {Graphics}
 */
PIXI.WebGLGraphics.updateGraphics = function(graphics)
{
	for (var i=graphics._webGL.lastIndex; i < graphics.graphicsData.length; i++)
	{
		var data = graphics.graphicsData[i];

		if(data.type == PIXI.Graphics.POLY)
		{
			if(data.fill)
			{
				if(data.points.length>3)
				PIXI.WebGLGraphics.buildPoly(data, graphics._webGL);
			}

			if(data.lineWidth > 0)
			{
				PIXI.WebGLGraphics.buildLine(data, graphics._webGL);
			}
		}
		else if(data.type == PIXI.Graphics.RECT)
		{
			PIXI.WebGLGraphics.buildRectangle(data, graphics._webGL);
		}
		else if(data.type == PIXI.Graphics.CIRC || data.type == PIXI.Graphics.ELIP)
		{
			PIXI.WebGLGraphics.buildCircle(data, graphics._webGL);
		}
	};

	graphics._webGL.lastIndex = graphics.graphicsData.length;

	var gl = PIXI.gl;

	graphics._webGL.glPoints = new Float32Array(graphics._webGL.points);

	gl.bindBuffer(gl.ARRAY_BUFFER, graphics._webGL.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, graphics._webGL.glPoints, gl.STATIC_DRAW);

	graphics._webGL.glIndicies = new Uint16Array(graphics._webGL.indices);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, graphics._webGL.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, graphics._webGL.glIndicies, gl.STATIC_DRAW);
}

/**
 * Builds a rectangle to draw
 *
 * @static
 * @private
 * @method buildRectangle
 * @param graphics {Graphics}
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildRectangle = function(graphicsData, webGLData)
{
	// --- //
	// need to convert points to a nice regular data
	//
	var rectData = graphicsData.points;
	var x = rectData[0];
	var y = rectData[1];
	var width = rectData[2];
	var height = rectData[3];


	if(graphicsData.fill)
	{
		var color = HEXtoRGB(graphicsData.fillColor);
		var alpha = graphicsData.fillAlpha;

		var r = color[0] * alpha;
		var g = color[1] * alpha;
		var b = color[2] * alpha;

		var verts = webGLData.points;
		var indices = webGLData.indices;

		var vertPos = verts.length/6;

		// start
		verts.push(x, y);
		verts.push(r, g, b, alpha);

		verts.push(x + width, y);
		verts.push(r, g, b, alpha);

		verts.push(x , y + height);
		verts.push(r, g, b, alpha);

		verts.push(x + width, y + height);
		verts.push(r, g, b, alpha);

		// insert 2 dead triangles..
		indices.push(vertPos, vertPos, vertPos+1, vertPos+2, vertPos+3, vertPos+3)
	}

	if(graphicsData.lineWidth)
	{
		graphicsData.points = [x, y,
				  x + width, y,
				  x + width, y + height,
				  x, y + height,
				  x, y];

		PIXI.WebGLGraphics.buildLine(graphicsData, webGLData);
	}

}

/**
 * Builds a circle to draw
 *
 * @static
 * @private
 * @method buildCircle
 * @param graphics {Graphics}
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildCircle = function(graphicsData, webGLData)
{
	// --- //
	// need to convert points to a nice regular data
	//
	var rectData = graphicsData.points;
	var x = rectData[0];
	var y = rectData[1];
	var width = rectData[2];
	var height = rectData[3];

	var totalSegs = 40;
	var seg = (Math.PI * 2) / totalSegs ;

	if(graphicsData.fill)
	{
		var color = HEXtoRGB(graphicsData.fillColor);
		var alpha = graphicsData.fillAlpha;

		var r = color[0] * alpha;
		var g = color[1] * alpha;
		var b = color[2] * alpha;

		var verts = webGLData.points;
		var indices = webGLData.indices;

		var vecPos = verts.length/6;

		indices.push(vecPos);

		for (var i=0; i < totalSegs + 1 ; i++)
		{
			verts.push(x,y, r, g, b, alpha);

			verts.push(x + Math.sin(seg * i) * width,
					   y + Math.cos(seg * i) * height,
					   r, g, b, alpha);

			indices.push(vecPos++, vecPos++);
		};

		indices.push(vecPos-1);
	}

	if(graphicsData.lineWidth)
	{
		graphicsData.points = [];

		for (var i=0; i < totalSegs + 1; i++)
		{
			graphicsData.points.push(x + Math.sin(seg * i) * width,
									 y + Math.cos(seg * i) * height)
		};

		PIXI.WebGLGraphics.buildLine(graphicsData, webGLData);
	}

}

/**
 * Builds a line to draw
 *
 * @static
 * @private
 * @method buildLine
 * @param graphics {Graphics}
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildLine = function(graphicsData, webGLData)
{
	// TODO OPTIMISE!

	var wrap = true;
	var points = graphicsData.points;
	if(points.length == 0)return;

	// get first and last point.. figure out the middle!
	var firstPoint = new PIXI.Point( points[0], points[1] );
	var lastPoint = new PIXI.Point( points[points.length - 2], points[points.length - 1] );

	// if the first point is the last point - goona have issues :)
	if(firstPoint.x == lastPoint.x && firstPoint.y == lastPoint.y)
	{
		points.pop();
		points.pop();

		lastPoint = new PIXI.Point( points[points.length - 2], points[points.length - 1] );

		var midPointX = lastPoint.x + (firstPoint.x - lastPoint.x) *0.5;
		var midPointY = lastPoint.y + (firstPoint.y - lastPoint.y) *0.5;

		points.unshift(midPointX, midPointY);
		points.push(midPointX, midPointY)
	}

	var verts = webGLData.points;
	var indices = webGLData.indices;
	var length = points.length / 2;
	var indexCount = points.length;
	var indexStart = verts.length/6;

	// DRAW the Line
	var width = graphicsData.lineWidth / 2;

	// sort color
	var color = HEXtoRGB(graphicsData.lineColor);
	var alpha = graphicsData.lineAlpha;
	var r = color[0] * alpha;
	var g = color[1] * alpha;
	var b = color[2] * alpha;

	var p1x, p1y, p2x, p2y, p3x, p3y;
	var perpx, perpy, perp2x, perp2y, perp3x, perp3y;
	var ipx, ipy;
	var a1, b1, c1, a2, b2, c2;
	var denom, pdist, dist;

	p1x = points[0];
	p1y = points[1];

	p2x = points[2];
	p2y = points[3];

	perpx = -(p1y - p2y);
	perpy =  p1x - p2x;

	dist = Math.sqrt(perpx*perpx + perpy*perpy);

	perpx /= dist;
	perpy /= dist;
	perpx *= width;
	perpy *= width;

	// start
	verts.push(p1x - perpx , p1y - perpy,
				r, g, b, alpha);

	verts.push(p1x + perpx , p1y + perpy,
				r, g, b, alpha);

	for (var i = 1; i < length-1; i++)
	{
		p1x = points[(i-1)*2];
		p1y = points[(i-1)*2 + 1];

		p2x = points[(i)*2]
		p2y = points[(i)*2 + 1]

		p3x = points[(i+1)*2];
		p3y = points[(i+1)*2 + 1];

		perpx = -(p1y - p2y);
		perpy = p1x - p2x;

		dist = Math.sqrt(perpx*perpx + perpy*perpy);
		perpx /= dist;
		perpy /= dist;
		perpx *= width;
		perpy *= width;

		perp2x = -(p2y - p3y);
		perp2y = p2x - p3x;

		dist = Math.sqrt(perp2x*perp2x + perp2y*perp2y);
		perp2x /= dist;
		perp2y /= dist;
		perp2x *= width;
		perp2y *= width;

		a1 = (-perpy + p1y) - (-perpy + p2y);
	    b1 = (-perpx + p2x) - (-perpx + p1x);
	    c1 = (-perpx + p1x) * (-perpy + p2y) - (-perpx + p2x) * (-perpy + p1y);
	    a2 = (-perp2y + p3y) - (-perp2y + p2y);
	    b2 = (-perp2x + p2x) - (-perp2x + p3x);
	    c2 = (-perp2x + p3x) * (-perp2y + p2y) - (-perp2x + p2x) * (-perp2y + p3y);

	    denom = a1*b2 - a2*b1;

	    if (denom == 0) {
	    	denom+=1;
	    }

	    px = (b1*c2 - b2*c1)/denom;
	    py = (a2*c1 - a1*c2)/denom;

		pdist = (px -p2x) * (px -p2x) + (py -p2y) + (py -p2y);

		if(pdist > 140 * 140)
		{
			perp3x = perpx - perp2x;
			perp3y = perpy - perp2y;

			dist = Math.sqrt(perp3x*perp3x + perp3y*perp3y);
			perp3x /= dist;
			perp3y /= dist;
			perp3x *= width;
			perp3y *= width;

			verts.push(p2x - perp3x, p2y -perp3y);
			verts.push(r, g, b, alpha);

			verts.push(p2x + perp3x, p2y +perp3y);
			verts.push(r, g, b, alpha);

			verts.push(p2x - perp3x, p2y -perp3y);
			verts.push(r, g, b, alpha);

			indexCount++;
		}
		else
		{
			verts.push(px , py);
			verts.push(r, g, b, alpha);

			verts.push(p2x - (px-p2x), p2y - (py - p2y));
			verts.push(r, g, b, alpha);
		}
	}

	p1x = points[(length-2)*2]
	p1y = points[(length-2)*2 + 1]

	p2x = points[(length-1)*2]
	p2y = points[(length-1)*2 + 1]

	perpx = -(p1y - p2y)
	perpy = p1x - p2x;

	dist = Math.sqrt(perpx*perpx + perpy*perpy);
	perpx /= dist;
	perpy /= dist;
	perpx *= width;
	perpy *= width;

	verts.push(p2x - perpx , p2y - perpy)
	verts.push(r, g, b, alpha);

	verts.push(p2x + perpx , p2y + perpy)
	verts.push(r, g, b, alpha);

	indices.push(indexStart);

	for (var i=0; i < indexCount; i++)
	{
		indices.push(indexStart++);
	};

	indices.push(indexStart-1);
}

/**
 * Builds a polygon to draw
 *
 * @static
 * @private
 * @method buildPoly
 * @param graphics {Graphics}
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildPoly = function(graphicsData, webGLData)
{
	var points = graphicsData.points;
	if(points.length < 6)return;

	// get first and last point.. figure out the middle!
	var verts = webGLData.points;
	var indices = webGLData.indices;

	var length = points.length / 2;

	// sort color
	var color = HEXtoRGB(graphicsData.fillColor);
	var alpha = graphicsData.fillAlpha;
	var r = color[0] * alpha;
	var g = color[1] * alpha;
	var b = color[2] * alpha;

	var triangles = PIXI.PolyK.Triangulate(points);

	var vertPos = verts.length / 6;

	for (var i=0; i < triangles.length; i+=3)
	{
		indices.push(triangles[i] + vertPos);
		indices.push(triangles[i] + vertPos);
		indices.push(triangles[i+1] + vertPos);
		indices.push(triangles[i+2] +vertPos);
		indices.push(triangles[i+2] + vertPos);
	};

	for (var i = 0; i < length; i++)
	{
		verts.push(points[i * 2], points[i * 2 + 1],
				   r, g, b, alpha);
	};
}

function HEXtoRGB(hex) {
	return [(hex >> 16 & 0xFF) / 255, ( hex >> 8 & 0xFF) / 255, (hex & 0xFF)/ 255];
}





/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI._defaultFrame = new PIXI.Rectangle(0,0,1,1);

// an instance of the gl context..
// only one at the moment :/
PIXI.gl;

/**
 * the WebGLRenderer is draws the stage and all its content onto a webGL enabled canvas. This renderer
 * should be used for browsers support webGL. This Render works by automatically managing webGLBatchs.
 * So no need for Sprite Batch's or Sprite Cloud's
 * Dont forget to add the view to your DOM or you will not see anything :)
 *
 * @class WebGLRenderer
 * @constructor
 * @param width=0 {Number} the width of the canvas view
 * @param height=0 {Number} the height of the canvas view
 * @param view {Canvas} the canvas to use as a view, optional
 * @param transparent=false {Boolean} the transparency of the render view, default false
 * @param antialias=false {Boolean} sets antialias (only applicable in chrome at the moment)
 *
 */
PIXI.WebGLRenderer = function(width, height, view, transparent, antialias)
{
	// do a catch.. only 1 webGL renderer..

	this.transparent = !!transparent;

	this.width = width || 800;
	this.height = height || 600;

	this.view = view || document.createElement( 'canvas' );
    this.view.width = this.width;
	this.view.height = this.height;

	// deal with losing context..
    var scope = this;
	this.view.addEventListener('webglcontextlost', function(event) { scope.handleContextLost(event); }, false)
	this.view.addEventListener('webglcontextrestored', function(event) { scope.handleContextRestored(event); }, false)

	this.batchs = [];

	try
 	{
        PIXI.gl = this.gl = this.view.getContext("experimental-webgl",  {
    		 alpha: this.transparent,
    		 antialias:!!antialias, // SPEED UP??
    		 premultipliedAlpha:false,
    		 stencil:true
        });
    }
    catch (e)
    {
    	throw new Error(" This browser does not support webGL. Try using the canvas renderer" + this);
    }

    PIXI.initPrimitiveShader();
    PIXI.initDefaultShader();
    PIXI.initDefaultStripShader();

    PIXI.activateDefaultShader();

    var gl = this.gl;
    PIXI.WebGLRenderer.gl = gl;

    this.batch = new PIXI.WebGLBatch(gl);
   	gl.disable(gl.DEPTH_TEST);
   	gl.disable(gl.CULL_FACE);

    gl.enable(gl.BLEND);
    gl.colorMask(true, true, true, this.transparent);

    PIXI.projection = new PIXI.Point(400, 300);

    this.resize(this.width, this.height);
    this.contextLost = false;

    this.stageRenderGroup = new PIXI.WebGLRenderGroup(this.gl);
}

// constructor
PIXI.WebGLRenderer.prototype.constructor = PIXI.WebGLRenderer;

/**
 * Gets a new WebGLBatch from the pool
 *
 * @static
 * @method getBatch
 * @return {WebGLBatch}
 * @private
 */
PIXI.WebGLRenderer.getBatch = function()
{
	if(PIXI._batchs.length == 0)
	{
		return new PIXI.WebGLBatch(PIXI.WebGLRenderer.gl);
	}
	else
	{
		return PIXI._batchs.pop();
	}
}

/**
 * Puts a batch back into the pool
 *
 * @static
 * @method returnBatch
 * @param batch {WebGLBatch} The batch to return
 * @private
 */
PIXI.WebGLRenderer.returnBatch = function(batch)
{
	batch.clean();
	PIXI._batchs.push(batch);
}

/**
 * Renders the stage to its webGL view
 *
 * @method render
 * @param stage {Stage} the Stage element to be rendered
 */
PIXI.WebGLRenderer.prototype.render = function(stage)
{
	if(this.contextLost)return;


	// if rendering a new stage clear the batchs..
	if(this.__stage !== stage)
	{
		// TODO make this work
		// dont think this is needed any more?
		this.__stage = stage;
		this.stageRenderGroup.setRenderable(stage);
	}

	// TODO not needed now...
	// update children if need be
	// best to remove first!
	/*for (var i=0; i < stage.__childrenRemoved.length; i++)
	{
		var group = stage.__childrenRemoved[i].__renderGroup
		if(group)group.removeDisplayObject(stage.__childrenRemoved[i]);
	}*/

	// update any textures
	PIXI.WebGLRenderer.updateTextures();

	// update the scene graph
	PIXI.visibleCount++;
	stage.updateTransform();

	var gl = this.gl;

	// -- Does this need to be set every frame? -- //
	gl.colorMask(true, true, true, this.transparent);
	gl.viewport(0, 0, this.width, this.height);

   	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	gl.clearColor(stage.backgroundColorSplit[0],stage.backgroundColorSplit[1],stage.backgroundColorSplit[2], !this.transparent);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// HACK TO TEST

	this.stageRenderGroup.backgroundColor = stage.backgroundColorSplit;
	this.stageRenderGroup.render(PIXI.projection);

	// interaction
	// run interaction!
	if(stage.interactive)
	{
		//need to add some events!
		if(!stage._interactiveEventsAdded)
		{
			stage._interactiveEventsAdded = true;
			stage.interactionManager.setTarget(this);
		}
	}

	// after rendering lets confirm all frames that have been uodated..
	if(PIXI.Texture.frameUpdates.length > 0)
	{
		for (var i=0; i < PIXI.Texture.frameUpdates.length; i++)
		{
		  	PIXI.Texture.frameUpdates[i].updateFrame = false;
		};

		PIXI.Texture.frameUpdates = [];
	}
}

/**
 * Updates the textures loaded into this webgl renderer
 *
 * @static
 * @method updateTextures
 * @private
 */
PIXI.WebGLRenderer.updateTextures = function()
{
	//TODO break this out into a texture manager...
	for (var i=0; i < PIXI.texturesToUpdate.length; i++) PIXI.WebGLRenderer.updateTexture(PIXI.texturesToUpdate[i]);
	for (var i=0; i < PIXI.texturesToDestroy.length; i++) PIXI.WebGLRenderer.destroyTexture(PIXI.texturesToDestroy[i]);
	PIXI.texturesToUpdate = [];
	PIXI.texturesToDestroy = [];
}

/**
 * Updates a loaded webgl texture
 *
 * @static
 * @method updateTexture
 * @param texture {Texture} The texture to update
 * @private
 */
PIXI.WebGLRenderer.updateTexture = function(texture)
{
	//TODO break this out into a texture manager...
	var gl = PIXI.gl;

	if(!texture._glTexture)
	{
		texture._glTexture = gl.createTexture();
	}

	if(texture.hasLoaded)
	{
		gl.bindTexture(gl.TEXTURE_2D, texture._glTexture);
	 	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

		// reguler...

		if(!texture._powerOf2)
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}
		else
		{
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		}

		gl.bindTexture(gl.TEXTURE_2D, null);
	}
}

/**
 * Destroys a loaded webgl texture
 *
 * @method destroyTexture
 * @param texture {Texture} The texture to update
 * @private
 */
PIXI.WebGLRenderer.destroyTexture = function(texture)
{
	//TODO break this out into a texture manager...
	var gl = PIXI.gl;

	if(texture._glTexture)
	{
		texture._glTexture = gl.createTexture();
		gl.deleteTexture(gl.TEXTURE_2D, texture._glTexture);
	}
}

/**
 * resizes the webGL view to the specified width and height
 *
 * @method resize
 * @param width {Number} the new width of the webGL view
 * @param height {Number} the new height of the webGL view
 */
PIXI.WebGLRenderer.prototype.resize = function(width, height)
{
	this.width = width;
	this.height = height;

	this.view.width = width;
	this.view.height = height;

	this.gl.viewport(0, 0, this.width, this.height);

	//var projectionMatrix = this.projectionMatrix;

	PIXI.projection.x =  this.width/2;
	PIXI.projection.y =  this.height/2;

//	projectionMatrix[0] = 2/this.width;
//	projectionMatrix[5] = -2/this.height;
//	projectionMatrix[12] = -1;
//	projectionMatrix[13] = 1;
}

/**
 * Handles a lost webgl context
 *
 * @method handleContextLost
 * @param event {Event}
 * @private
 */
PIXI.WebGLRenderer.prototype.handleContextLost = function(event)
{
	event.preventDefault();
	this.contextLost = true;
}

/**
 * Handles a restored webgl context
 *
 * @method handleContextRestored
 * @param event {Event}
 * @private
 */
PIXI.WebGLRenderer.prototype.handleContextRestored = function(event)
{
	this.gl = this.view.getContext("experimental-webgl",  {
		alpha: true
    });

	this.initShaders();

	for(var key in PIXI.TextureCache)
	{
        	var texture = PIXI.TextureCache[key].baseTexture;
        	texture._glTexture = null;
        	PIXI.WebGLRenderer.updateTexture(texture);
	};

	for (var i=0; i <  this.batchs.length; i++)
	{
		this.batchs[i].restoreLostContext(this.gl)//
		this.batchs[i].dirty = true;
	};

	PIXI._restoreBatchs(this.gl);

	this.contextLost = false;
}

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI._batchs = [];

/**
 * @private
 */
PIXI._getBatch = function(gl)
{
	if(PIXI._batchs.length == 0)
	{
		return new PIXI.WebGLBatch(gl);
	}
	else
	{
		return PIXI._batchs.pop();
	}
}

/**
 * @private
 */
PIXI._returnBatch = function(batch)
{
	batch.clean();
	PIXI._batchs.push(batch);
}

/**
 * @private
 */
PIXI._restoreBatchs = function(gl)
{
	for (var i=0; i < PIXI._batchs.length; i++)
	{
	  PIXI._batchs[i].restoreLostContext(gl);
	};
}

/**
 * A WebGLBatch Enables a group of sprites to be drawn using the same settings.
 * if a group of sprites all have the same baseTexture and blendMode then they can be grouped into a batch.
 * All the sprites in a batch can then be drawn in one go by the GPU which is hugely efficient. ALL sprites
 * in the webGL renderer are added to a batch even if the batch only contains one sprite. Batching is handled
 * automatically by the webGL renderer. A good tip is: the smaller the number of batchs there are, the faster
 * the webGL renderer will run.
 *
 * @class WebGLBatch
 * @constructor
 * @param gl {WebGLContext} an instance of the webGL context
 */
PIXI.WebGLBatch = function(gl)
{
	this.gl = gl;

	this.size = 0;

	this.vertexBuffer =  gl.createBuffer();
	this.indexBuffer =  gl.createBuffer();
	this.uvBuffer =  gl.createBuffer();
	this.colorBuffer =  gl.createBuffer();
	this.blendMode = PIXI.blendModes.NORMAL;
	this.dynamicSize = 1;
}

// constructor
PIXI.WebGLBatch.prototype.constructor = PIXI.WebGLBatch;

/**
 * Cleans the batch so that is can be returned to an object pool and reused
 *
 * @method clean
 */
PIXI.WebGLBatch.prototype.clean = function()
{
	this.verticies = [];
	this.uvs = [];
	this.indices = [];
	this.colors = [];
	this.dynamicSize = 1;
	this.texture = null;
	this.last = null;
	this.size = 0;
	this.head;
	this.tail;
}

/**
 * Recreates the buffers in the event of a context loss
 *
 * @method restoreLostContext
 * @param gl {WebGLContext}
 */
PIXI.WebGLBatch.prototype.restoreLostContext = function(gl)
{
	this.gl = gl;
	this.vertexBuffer =  gl.createBuffer();
	this.indexBuffer =  gl.createBuffer();
	this.uvBuffer =  gl.createBuffer();
	this.colorBuffer =  gl.createBuffer();
}

/**
 * inits the batch's texture and blend mode based if the supplied sprite
 *
 * @method init
 * @param sprite {Sprite} the first sprite to be added to the batch. Only sprites with
 *		the same base texture and blend mode will be allowed to be added to this batch
 */
PIXI.WebGLBatch.prototype.init = function(sprite)
{
	sprite.batch = this;
	this.dirty = true;
	this.blendMode = sprite.blendMode;
	this.texture = sprite.texture.baseTexture;
	this.head = sprite;
	this.tail = sprite;
	this.size = 1;

	this.growBatch();
}

/**
 * inserts a sprite before the specified sprite
 *
 * @method insertBefore
 * @param sprite {Sprite} the sprite to be added
 * @param nextSprite {nextSprite} the first sprite will be inserted before this sprite
 */
PIXI.WebGLBatch.prototype.insertBefore = function(sprite, nextSprite)
{
	this.size++;

	sprite.batch = this;
	this.dirty = true;
	var tempPrev = nextSprite.__prev;
	nextSprite.__prev = sprite;
	sprite.__next = nextSprite;

	if(tempPrev)
	{
		sprite.__prev = tempPrev;
		tempPrev.__next = sprite;
	}
	else
	{
		this.head = sprite;
	}
}

/**
 * inserts a sprite after the specified sprite
 *
 * @method insertAfter
 * @param sprite {Sprite} the sprite to be added
 * @param  previousSprite {Sprite} the first sprite will be inserted after this sprite
 */
PIXI.WebGLBatch.prototype.insertAfter = function(sprite, previousSprite)
{
	this.size++;

	sprite.batch = this;
	this.dirty = true;

	var tempNext = previousSprite.__next;
	previousSprite.__next = sprite;
	sprite.__prev = previousSprite;

	if(tempNext)
	{
		sprite.__next = tempNext;
		tempNext.__prev = sprite;
	}
	else
	{
		this.tail = sprite
	}
}

/**
 * removes a sprite from the batch
 *
 * @method remove
 * @param sprite {Sprite} the sprite to be removed
 */
PIXI.WebGLBatch.prototype.remove = function(sprite)
{
	this.size--;

	if(this.size == 0)
	{
		sprite.batch = null;
		sprite.__prev = null;
		sprite.__next = null;
		return;
	}

	if(sprite.__prev)
	{
		sprite.__prev.__next = sprite.__next;
	}
	else
	{
		this.head = sprite.__next;
		this.head.__prev = null;
	}

	if(sprite.__next)
	{
		sprite.__next.__prev = sprite.__prev;
	}
	else
	{
		this.tail = sprite.__prev;
		this.tail.__next = null
	}

	sprite.batch = null;
	sprite.__next = null;
	sprite.__prev = null;
	this.dirty = true;
}

/**
 * Splits the batch into two with the specified sprite being the start of the new batch.
 *
 * @method split
 * @param sprite {Sprite} the sprite that indicates where the batch should be split
 * @return {WebGLBatch} the new batch
 */
PIXI.WebGLBatch.prototype.split = function(sprite)
{
	this.dirty = true;

	var batch = new PIXI.WebGLBatch(this.gl);
	batch.init(sprite);
	batch.texture = this.texture;
	batch.tail = this.tail;

	this.tail = sprite.__prev;
	this.tail.__next = null;

	sprite.__prev = null;
	// return a splite batch!

	// TODO this size is wrong!
	// need to recalculate :/ problem with a linked list!
	// unless it gets calculated in the "clean"?

	// need to loop through items as there is no way to know the length on a linked list :/
	var tempSize = 0;
	while(sprite)
	{
		tempSize++;
		sprite.batch = batch;
		sprite = sprite.__next;
	}

	batch.size = tempSize;
	this.size -= tempSize;

	return batch;
}

/**
 * Merges two batchs together
 *
 * @method merge
 * @param batch {WebGLBatch} the batch that will be merged
 */
PIXI.WebGLBatch.prototype.merge = function(batch)
{
	this.dirty = true;

	this.tail.__next = batch.head;
	batch.head.__prev = this.tail;

	this.size += batch.size;

	this.tail = batch.tail;

	var sprite = batch.head;
	while(sprite)
	{
		sprite.batch = this;
		sprite = sprite.__next;
	}
}

/**
 * Grows the size of the batch. As the elements in the batch cannot have a dynamic size this
 * function is used to increase the size of the batch. It also creates a little extra room so
 * that the batch does not need to be resized every time a sprite is added
 *
 * @method growBatch
 */
PIXI.WebGLBatch.prototype.growBatch = function()
{
	var gl = this.gl;
	if( this.size == 1)
	{
		this.dynamicSize = 1;
	}
	else
	{
		this.dynamicSize = this.size * 1.5
	}
	// grow verts
	this.verticies = new Float32Array(this.dynamicSize * 8);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,this.verticies , gl.DYNAMIC_DRAW);

	this.uvs  = new Float32Array( this.dynamicSize * 8 );
	gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.uvs , gl.DYNAMIC_DRAW);

	this.dirtyUVS = true;

	this.colors  = new Float32Array( this.dynamicSize * 4 );
	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.colors , gl.DYNAMIC_DRAW);

	this.dirtyColors = true;

	this.indices = new Uint16Array(this.dynamicSize * 6);
	var length = this.indices.length/6;

	for (var i=0; i < length; i++)
	{
	    var index2 = i * 6;
	    var index3 = i * 4;
		this.indices[index2 + 0] = index3 + 0;
		this.indices[index2 + 1] = index3 + 1;
		this.indices[index2 + 2] = index3 + 2;
		this.indices[index2 + 3] = index3 + 0;
		this.indices[index2 + 4] = index3 + 2;
		this.indices[index2 + 5] = index3 + 3;
	};

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
}

/**
 * Refresh's all the data in the batch and sync's it with the webGL buffers
 *
 * @method refresh
 */
PIXI.WebGLBatch.prototype.refresh = function()
{
	var gl = this.gl;

	if (this.dynamicSize < this.size)
	{
		this.growBatch();
	}

	var indexRun = 0;
	var worldTransform, width, height, aX, aY, w0, w1, h0, h1, index;
	var a, b, c, d, tx, ty;

	var displayObject = this.head;

	while(displayObject)
	{
		index = indexRun * 8;

		var texture = displayObject.texture;

		var frame = texture.frame;
		var tw = texture.baseTexture.width;
		var th = texture.baseTexture.height;

		this.uvs[index + 0] = frame.x / tw;
		this.uvs[index +1] = frame.y / th;

		this.uvs[index +2] = (frame.x + frame.width) / tw;
		this.uvs[index +3] = frame.y / th;

		this.uvs[index +4] = (frame.x + frame.width) / tw;
		this.uvs[index +5] = (frame.y + frame.height) / th;

		this.uvs[index +6] = frame.x / tw;
		this.uvs[index +7] = (frame.y + frame.height) / th;

		displayObject.updateFrame = false;

		colorIndex = indexRun * 4;
		this.colors[colorIndex] = this.colors[colorIndex + 1] = this.colors[colorIndex + 2] = this.colors[colorIndex + 3] = displayObject.worldAlpha;

		displayObject = displayObject.__next;

		indexRun ++;
	}

	this.dirtyUVS = true;
	this.dirtyColors = true;
}

/**
 * Updates all the relevant geometry and uploads the data to the GPU
 *
 * @method update
 */
PIXI.WebGLBatch.prototype.update = function()
{
	var gl = this.gl;
	var worldTransform, width, height, aX, aY, w0, w1, h0, h1, index, index2, index3

	var a, b, c, d, tx, ty;

	var indexRun = 0;

	var displayObject = this.head;

	while(displayObject)
	{
		if(displayObject.vcount === PIXI.visibleCount)
		{
			width = displayObject.texture.frame.width;
			height = displayObject.texture.frame.height;

			// TODO trim??
			aX = displayObject.anchor.x;// - displayObject.texture.trim.x
			aY = displayObject.anchor.y; //- displayObject.texture.trim.y
			w0 = width * (1-aX);
			w1 = width * -aX;

			h0 = height * (1-aY);
			h1 = height * -aY;

			index = indexRun * 8;

			worldTransform = displayObject.worldTransform;

			a = worldTransform[0];
			b = worldTransform[3];
			c = worldTransform[1];
			d = worldTransform[4];
			tx = worldTransform[2];
			ty = worldTransform[5];

			this.verticies[index + 0 ] = a * w1 + c * h1 + tx;
			this.verticies[index + 1 ] = d * h1 + b * w1 + ty;

			this.verticies[index + 2 ] = a * w0 + c * h1 + tx;
			this.verticies[index + 3 ] = d * h1 + b * w0 + ty;

			this.verticies[index + 4 ] = a * w0 + c * h0 + tx;
			this.verticies[index + 5 ] = d * h0 + b * w0 + ty;

			this.verticies[index + 6] =  a * w1 + c * h0 + tx;
			this.verticies[index + 7] =  d * h0 + b * w1 + ty;

			if(displayObject.updateFrame || displayObject.texture.updateFrame)
			{
				this.dirtyUVS = true;

				var texture = displayObject.texture;

				var frame = texture.frame;
				var tw = texture.baseTexture.width;
				var th = texture.baseTexture.height;

				this.uvs[index + 0] = frame.x / tw;
				this.uvs[index +1] = frame.y / th;

				this.uvs[index +2] = (frame.x + frame.width) / tw;
				this.uvs[index +3] = frame.y / th;

				this.uvs[index +4] = (frame.x + frame.width) / tw;
				this.uvs[index +5] = (frame.y + frame.height) / th;

				this.uvs[index +6] = frame.x / tw;
				this.uvs[index +7] = (frame.y + frame.height) / th;

				displayObject.updateFrame = false;
			}

			// TODO this probably could do with some optimisation....
			if(displayObject.cacheAlpha != displayObject.worldAlpha)
			{
				displayObject.cacheAlpha = displayObject.worldAlpha;

				var colorIndex = indexRun * 4;
				this.colors[colorIndex] = this.colors[colorIndex + 1] = this.colors[colorIndex + 2] = this.colors[colorIndex + 3] = displayObject.worldAlpha;
				this.dirtyColors = true;
			}
		}
		else
		{
			index = indexRun * 8;

			this.verticies[index + 0 ] = 0;
			this.verticies[index + 1 ] = 0;

			this.verticies[index + 2 ] = 0;
			this.verticies[index + 3 ] = 0;

			this.verticies[index + 4 ] = 0;
			this.verticies[index + 5 ] = 0;

			this.verticies[index + 6] = 0;
			this.verticies[index + 7] = 0;
		}

		indexRun++;
		displayObject = displayObject.__next;
   }
}

/**
 * Draws the batch to the frame buffer
 *
 * @method render
 */
PIXI.WebGLBatch.prototype.render = function(start, end)
{
	start = start || 0;

	if(end == undefined)end = this.size;

	if(this.dirty)
	{
		this.refresh();
		this.dirty = false;
	}

	if (this.size == 0)return;

	this.update();
	var gl = this.gl;

	//TODO optimize this!

	var shaderProgram = PIXI.shaderProgram;
	gl.useProgram(shaderProgram);

	// update the verts..
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	// ok..
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.verticies)
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
	// update the uvs
   	gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);

    if(this.dirtyUVS)
    {
    	this.dirtyUVS = false;
    	gl.bufferSubData(gl.ARRAY_BUFFER,  0, this.uvs);
    }

    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture._glTexture);

	// update color!
	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);

	if(this.dirtyColors)
    {
    	this.dirtyColors = false;
    	gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.colors);
	}

    gl.vertexAttribPointer(shaderProgram.colorAttribute, 1, gl.FLOAT, false, 0, 0);

	// dont need to upload!
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

	var len = end - start;

    // DRAW THAT this!
    gl.drawElements(gl.TRIANGLES, len * 6, gl.UNSIGNED_SHORT, start * 2 * 6 );
}

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A WebGLBatch Enables a group of sprites to be drawn using the same settings.
 * if a group of sprites all have the same baseTexture and blendMode then they can be
 * grouped into a batch. All the sprites in a batch can then be drawn in one go by the
 * GPU which is hugely efficient. ALL sprites in the webGL renderer are added to a batch
 * even if the batch only contains one sprite. Batching is handled automatically by the
 * webGL renderer. A good tip is: the smaller the number of batchs there are, the faster
 * the webGL renderer will run.
 *
 * @class WebGLBatch
 * @contructor
 * @param gl {WebGLContext} An instance of the webGL context
 */
PIXI.WebGLRenderGroup = function(gl)
{
	this.gl = gl;
	this.root;

	this.backgroundColor;
	this.batchs = [];
	this.toRemove = [];
}

// constructor
PIXI.WebGLRenderGroup.prototype.constructor = PIXI.WebGLRenderGroup;

/**
 * Add a display object to the webgl renderer
 *
 * @method setRenderable
 * @param displayObject {DisplayObject}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.setRenderable = function(displayObject)
{
	// has this changed??
	if(this.root)this.removeDisplayObjectAndChildren(this.root);

	displayObject.worldVisible = displayObject.visible;

	// soooooo //
	// to check if any batchs exist already??

	// TODO what if its already has an object? should remove it
	this.root = displayObject;
	this.addDisplayObjectAndChildren(displayObject);
}

/**
 * Renders the stage to its webgl view
 *
 * @method render
 * @param projection {Object}
 */
PIXI.WebGLRenderGroup.prototype.render = function(projection)
{
	PIXI.WebGLRenderer.updateTextures();

	var gl = this.gl;


	gl.uniform2f(PIXI.shaderProgram.projectionVector, projection.x, projection.y);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

	// will render all the elements in the group
	var renderable;

	for (var i=0; i < this.batchs.length; i++)
	{

		renderable = this.batchs[i];
		if(renderable instanceof PIXI.WebGLBatch)
		{
			this.batchs[i].render();
			continue;
		}

		// non sprite batch..
		var worldVisible = renderable.vcount === PIXI.visibleCount;

		if(renderable instanceof PIXI.TilingSprite)
		{
			if(worldVisible)this.renderTilingSprite(renderable, projection);
		}
		else if(renderable instanceof PIXI.Strip)
		{
			if(worldVisible)this.renderStrip(renderable, projection);
		}
		else if(renderable instanceof PIXI.Graphics)
		{
			if(worldVisible && renderable.renderable) PIXI.WebGLGraphics.renderGraphics(renderable, projection);//, projectionMatrix);
		}
		else if(renderable instanceof PIXI.FilterBlock)
		{
			/*
			 * for now only masks are supported..
			 */
			if(renderable.open)
			{
    			gl.enable(gl.STENCIL_TEST);

				gl.colorMask(false, false, false, false);
				gl.stencilFunc(gl.ALWAYS,1,0xff);
				gl.stencilOp(gl.KEEP,gl.KEEP,gl.REPLACE);

				PIXI.WebGLGraphics.renderGraphics(renderable.mask, projection);

				gl.colorMask(true, true, true, false);
				gl.stencilFunc(gl.NOTEQUAL,0,0xff);
				gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);
			}
			else
			{
				gl.disable(gl.STENCIL_TEST);
			}
		}
	}

}

/**
 * Renders the stage to its webgl view
 *
 * @method handleFilter
 * @param filter {FilterBlock}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.handleFilter = function(filter, projection)
{

}

/**
 * Renders a specific displayObject
 *
 * @method renderSpecific
 * @param displayObject {DisplayObject}
 * @param projection {Object}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.renderSpecific = function(displayObject, projection)
{
	PIXI.WebGLRenderer.updateTextures();

	var gl = this.gl;

	gl.uniform2f(PIXI.shaderProgram.projectionVector, projection.x, projection.y);

	// to do!
	// render part of the scene...

	var startIndex;
	var startBatchIndex;

	var endIndex;
	var endBatchIndex;

	/*
	 *  LOOK FOR THE NEXT SPRITE
	 *  This part looks for the closest next sprite that can go into a batch
	 *  it keeps looking until it finds a sprite or gets to the end of the display
	 *  scene graph
	 */
	var nextRenderable = displayObject.first;
	while(nextRenderable._iNext)
	{
		nextRenderable = nextRenderable._iNext;
		if(nextRenderable.renderable && nextRenderable.__renderGroup)break;
	}
	var startBatch = nextRenderable.batch;

	if(nextRenderable instanceof PIXI.Sprite)
	{
		startBatch = nextRenderable.batch;

		var head = startBatch.head;
		var next = head;

		// ok now we have the batch.. need to find the start index!
		if(head == nextRenderable)
		{
			startIndex = 0;
		}
		else
		{
			startIndex = 1;

			while(head.__next != nextRenderable)
			{
				startIndex++;
				head = head.__next;
			}
		}
	}
	else
	{
		startBatch = nextRenderable;
	}

	// Get the LAST renderable object
	var lastRenderable = displayObject;
	var endBatch;
	var lastItem = displayObject;
	while(lastItem.children.length > 0)
	{
		lastItem = lastItem.children[lastItem.children.length-1];
		if(lastItem.renderable)lastRenderable = lastItem;
	}

	if(lastRenderable instanceof PIXI.Sprite)
	{
		endBatch = lastRenderable.batch;

		var head = endBatch.head;

		if(head == lastRenderable)
		{
			endIndex = 0;
		}
		else
		{
			endIndex = 1;

			while(head.__next != lastRenderable)
			{
				endIndex++;
				head = head.__next;
			}
		}
	}
	else
	{
		endBatch = lastRenderable;
	}

	// TODO - need to fold this up a bit!

	if(startBatch == endBatch)
	{
		if(startBatch instanceof PIXI.WebGLBatch)
		{
			startBatch.render(startIndex, endIndex+1);
		}
		else
		{
			this.renderSpecial(startBatch, projection);
		}
		return;
	}

	// now we have first and last!
	startBatchIndex = this.batchs.indexOf(startBatch);
	endBatchIndex = this.batchs.indexOf(endBatch);

	// DO the first batch
	if(startBatch instanceof PIXI.WebGLBatch)
	{
		startBatch.render(startIndex);
	}
	else
	{
		this.renderSpecial(startBatch, projection);
	}

	// DO the middle batchs..
	for (var i=startBatchIndex+1; i < endBatchIndex; i++)
	{
		renderable = this.batchs[i];

		if(renderable instanceof PIXI.WebGLBatch)
		{
			this.batchs[i].render();
		}
		else
		{
			this.renderSpecial(renderable, projection);
		}
	}

	// DO the last batch..
	if(endBatch instanceof PIXI.WebGLBatch)
	{
		endBatch.render(0, endIndex+1);
	}
	else
	{
		this.renderSpecial(endBatch, projection);
	}
}

/**
 * Renders a specific renderable
 *
 * @method renderSpecial
 * @param renderable {DisplayObject}
 * @param projection {Object}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.renderSpecial = function(renderable, projection)
{
	var worldVisible = renderable.vcount === PIXI.visibleCount

	if(renderable instanceof PIXI.TilingSprite)
	{
		if(worldVisible)this.renderTilingSprite(renderable, projection);
	}
	else if(renderable instanceof PIXI.Strip)
	{
		if(worldVisible)this.renderStrip(renderable, projection);
	}
	else if(renderable instanceof PIXI.CustomRenderable)
	{
		if(worldVisible) renderable.renderWebGL(this, projection);
	}
	else if(renderable instanceof PIXI.Graphics)
	{
		if(worldVisible && renderable.renderable) PIXI.WebGLGraphics.renderGraphics(renderable, projection);
	}
	else if(renderable instanceof PIXI.FilterBlock)
	{
		/*
		 * for now only masks are supported..
		 */

		var gl = PIXI.gl;

		if(renderable.open)
		{
			gl.enable(gl.STENCIL_TEST);

			gl.colorMask(false, false, false, false);
			gl.stencilFunc(gl.ALWAYS,1,0xff);
			gl.stencilOp(gl.KEEP,gl.KEEP,gl.REPLACE);

			PIXI.WebGLGraphics.renderGraphics(renderable.mask, projection);

			// we know this is a render texture so enable alpha too..
			gl.colorMask(true, true, true, true);
			gl.stencilFunc(gl.NOTEQUAL,0,0xff);
			gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);
		}
		else
		{
			gl.disable(gl.STENCIL_TEST);
		}
	}
}

/**
 * Updates a webgl texture
 *
 * @method updateTexture
 * @param displayObject {DisplayObject}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.updateTexture = function(displayObject)
{

	// TODO definitely can optimse this function..

	this.removeObject(displayObject);

	/*
	 *  LOOK FOR THE PREVIOUS RENDERABLE
	 *  This part looks for the closest previous sprite that can go into a batch
	 *  It keeps going back until it finds a sprite or the stage
	 */
	var previousRenderable = displayObject.first;
	while(previousRenderable != this.root)
	{
		previousRenderable = previousRenderable._iPrev;
		if(previousRenderable.renderable && previousRenderable.__renderGroup)break;
	}

	/*
	 *  LOOK FOR THE NEXT SPRITE
	 *  This part looks for the closest next sprite that can go into a batch
	 *  it keeps looking until it finds a sprite or gets to the end of the display
	 *  scene graph
	 */
	var nextRenderable = displayObject.last;
	while(nextRenderable._iNext)
	{
		nextRenderable = nextRenderable._iNext;
		if(nextRenderable.renderable && nextRenderable.__renderGroup)break;
	}

	this.insertObject(displayObject, previousRenderable, nextRenderable);
}

/**
 * Adds filter blocks
 *
 * @method addFilterBlocks
 * @param start {FilterBlock}
 * @param end {FilterBlock}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.addFilterBlocks = function(start, end)
{
	start.__renderGroup = this;
	end.__renderGroup = this;
	/*
	 *  LOOK FOR THE PREVIOUS RENDERABLE
	 *  This part looks for the closest previous sprite that can go into a batch
	 *  It keeps going back until it finds a sprite or the stage
	 */
	var previousRenderable = start;
	while(previousRenderable != this.root)
	{
		previousRenderable = previousRenderable._iPrev;
		if(previousRenderable.renderable && previousRenderable.__renderGroup)break;
	}
	this.insertAfter(start, previousRenderable);

	/*
	 *  LOOK FOR THE NEXT SPRITE
	 *  This part looks for the closest next sprite that can go into a batch
	 *  it keeps looking until it finds a sprite or gets to the end of the display
	 *  scene graph
	 */
	var previousRenderable2 = end;
	while(previousRenderable2 != this.root)
	{
		previousRenderable2 = previousRenderable2._iPrev;
		if(previousRenderable2.renderable && previousRenderable2.__renderGroup)break;
	}
	this.insertAfter(end, previousRenderable2);
}

/**
 * Remove filter blocks
 *
 * @method removeFilterBlocks
 * @param start {FilterBlock}
 * @param end {FilterBlock}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.removeFilterBlocks = function(start, end)
{
	this.removeObject(start);
	this.removeObject(end);
}

/**
 * Adds a display object and children to the webgl context
 *
 * @method addDisplayObjectAndChildren
 * @param displayObject {DisplayObject}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.addDisplayObjectAndChildren = function(displayObject)
{
	if(displayObject.__renderGroup)displayObject.__renderGroup.removeDisplayObjectAndChildren(displayObject);

	/*
	 *  LOOK FOR THE PREVIOUS RENDERABLE
	 *  This part looks for the closest previous sprite that can go into a batch
	 *  It keeps going back until it finds a sprite or the stage
	 */

	var previousRenderable = displayObject.first;
	while(previousRenderable != this.root.first)
	{
		previousRenderable = previousRenderable._iPrev;
		if(previousRenderable.renderable && previousRenderable.__renderGroup)break;
	}

	/*
	 *  LOOK FOR THE NEXT SPRITE
	 *  This part looks for the closest next sprite that can go into a batch
	 *  it keeps looking until it finds a sprite or gets to the end of the display
	 *  scene graph
	 */
	var nextRenderable = displayObject.last;
	while(nextRenderable._iNext)
	{
		nextRenderable = nextRenderable._iNext;
		if(nextRenderable.renderable && nextRenderable.__renderGroup)break;
	}

	// one the display object hits this. we can break the loop

	var tempObject = displayObject.first;
	var testObject = displayObject.last._iNext;
	do
	{
		tempObject.__renderGroup = this;

		if(tempObject.renderable)
		{

			this.insertObject(tempObject, previousRenderable, nextRenderable);
			previousRenderable = tempObject;
		}

		tempObject = tempObject._iNext;
	}
	while(tempObject != testObject)
}

/**
 * Removes a display object and children to the webgl context
 *
 * @method removeDisplayObjectAndChildren
 * @param displayObject {DisplayObject}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.removeDisplayObjectAndChildren = function(displayObject)
{
	if(displayObject.__renderGroup != this)return;

//	var displayObject = displayObject.first;
	var lastObject = displayObject.last;
	do
	{
		displayObject.__renderGroup = null;
		if(displayObject.renderable)this.removeObject(displayObject);
		displayObject = displayObject._iNext;
	}
	while(displayObject)
}

/**
 * Inserts a displayObject into the linked list
 *
 * @method insertObject
 * @param displayObject {DisplayObject}
 * @param previousObject {DisplayObject}
 * @param nextObject {DisplayObject}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.insertObject = function(displayObject, previousObject, nextObject)
{
	// while looping below THE OBJECT MAY NOT HAVE BEEN ADDED
	var previousSprite = previousObject;
	var nextSprite = nextObject;

	/*
	 * so now we have the next renderable and the previous renderable
	 *
	 */
	if(displayObject instanceof PIXI.Sprite)
	{
		var previousBatch
		var nextBatch

		if(previousSprite instanceof PIXI.Sprite)
		{
			previousBatch = previousSprite.batch;
			if(previousBatch)
			{
				if(previousBatch.texture == displayObject.texture.baseTexture && previousBatch.blendMode == displayObject.blendMode)
				{
					previousBatch.insertAfter(displayObject, previousSprite);
					return;
				}
			}
		}
		else
		{
			// TODO reword!
			previousBatch = previousSprite;
		}

		if(nextSprite)
		{
			if(nextSprite instanceof PIXI.Sprite)
			{
				nextBatch = nextSprite.batch;

				//batch may not exist if item was added to the display list but not to the webGL
				if(nextBatch)
				{
					if(nextBatch.texture == displayObject.texture.baseTexture && nextBatch.blendMode == displayObject.blendMode)
					{
						nextBatch.insertBefore(displayObject, nextSprite);
						return;
					}
					else
					{
						if(nextBatch == previousBatch)
						{
							// THERE IS A SPLIT IN THIS BATCH! //
							var splitBatch = previousBatch.split(nextSprite);
							// COOL!
							// add it back into the array
							/*
							 * OOPS!
							 * seems the new sprite is in the middle of a batch
							 * lets split it..
							 */
							var batch = PIXI.WebGLRenderer.getBatch();

							var index = this.batchs.indexOf( previousBatch );
							batch.init(displayObject);
							this.batchs.splice(index+1, 0, batch, splitBatch);

							return;
						}
					}
				}
			}
			else
			{
				// TODO re-word!

				nextBatch = nextSprite;
			}
		}

		/*
		 * looks like it does not belong to any batch!
		 * but is also not intersecting one..
		 * time to create anew one!
		 */

		var batch =  PIXI.WebGLRenderer.getBatch();
		batch.init(displayObject);

		if(previousBatch) // if this is invalid it means
		{
			var index = this.batchs.indexOf( previousBatch );
			this.batchs.splice(index+1, 0, batch);
		}
		else
		{
			this.batchs.push(batch);
		}

		return;
	}
	else if(displayObject instanceof PIXI.TilingSprite)
	{

		// add to a batch!!
		this.initTilingSprite(displayObject);
	//	this.batchs.push(displayObject);

	}
	else if(displayObject instanceof PIXI.Strip)
	{
		// add to a batch!!
		this.initStrip(displayObject);
	//	this.batchs.push(displayObject);
	}
	else if(displayObject)// instanceof PIXI.Graphics)
	{
		//displayObject.initWebGL(this);

		// add to a batch!!
		//this.initStrip(displayObject);
		//this.batchs.push(displayObject);
	}

	this.insertAfter(displayObject, previousSprite);

	// insert and SPLIT!

}

/**
 * Inserts a displayObject into the linked list
 *
 * @method insertAfter
 * @param item {DisplayObject}
 * @param displayObject {DisplayObject} The object to insert
 * @private
 */
PIXI.WebGLRenderGroup.prototype.insertAfter = function(item, displayObject)
{
	if(displayObject instanceof PIXI.Sprite)
	{
		var previousBatch = displayObject.batch;

		if(previousBatch)
		{
			// so this object is in a batch!

			// is it not? need to split the batch
			if(previousBatch.tail == displayObject)
			{
				// is it tail? insert in to batchs
				var index = this.batchs.indexOf( previousBatch );
				this.batchs.splice(index+1, 0, item);
			}
			else
			{
				// TODO MODIFY ADD / REMOVE CHILD TO ACCOUNT FOR FILTERS (also get prev and next) //

				// THERE IS A SPLIT IN THIS BATCH! //
				var splitBatch = previousBatch.split(displayObject.__next);

				// COOL!
				// add it back into the array
				/*
				 * OOPS!
				 * seems the new sprite is in the middle of a batch
				 * lets split it..
				 */
				var index = this.batchs.indexOf( previousBatch );
				this.batchs.splice(index+1, 0, item, splitBatch);
			}
		}
		else
		{
			this.batchs.push(item);
		}
	}
	else
	{
		var index = this.batchs.indexOf( displayObject );
		this.batchs.splice(index+1, 0, item);
	}
}

/**
 * Removes a displayObject from the linked list
 *
 * @method removeObject
 * @param displayObject {DisplayObject} The object to remove
 * @private
 */
PIXI.WebGLRenderGroup.prototype.removeObject = function(displayObject)
{
	// loop through children..
	// display object //

	// add a child from the render group..
	// remove it and all its children!
	//displayObject.cacheVisible = false;//displayObject.visible;

	/*
	 * removing is a lot quicker..
	 *
	 */
	var batchToRemove;

	if(displayObject instanceof PIXI.Sprite)
	{
		// should always have a batch!
		var batch = displayObject.batch;
		if(!batch)return; // this means the display list has been altered befre rendering

		batch.remove(displayObject);

		if(batch.size==0)
		{
			batchToRemove = batch;
		}
	}
	else
	{
		batchToRemove = displayObject;
	}

	/*
	 * Looks like there is somthing that needs removing!
	 */
	if(batchToRemove)
	{
		var index = this.batchs.indexOf( batchToRemove );
		if(index == -1)return;// this means it was added then removed before rendered

		// ok so.. check to see if you adjacent batchs should be joined.
		// TODO may optimise?
		if(index == 0 || index == this.batchs.length-1)
		{
			// wha - eva! just get of the empty batch!
			this.batchs.splice(index, 1);
			if(batchToRemove instanceof PIXI.WebGLBatch)PIXI.WebGLRenderer.returnBatch(batchToRemove);

			return;
		}

		if(this.batchs[index-1] instanceof PIXI.WebGLBatch && this.batchs[index+1] instanceof PIXI.WebGLBatch)
		{
			if(this.batchs[index-1].texture == this.batchs[index+1].texture && this.batchs[index-1].blendMode == this.batchs[index+1].blendMode)
			{
				//console.log("MERGE")
				this.batchs[index-1].merge(this.batchs[index+1]);

				if(batchToRemove instanceof PIXI.WebGLBatch)PIXI.WebGLRenderer.returnBatch(batchToRemove);
				PIXI.WebGLRenderer.returnBatch(this.batchs[index+1]);
				this.batchs.splice(index, 2);
				return;
			}
		}

		this.batchs.splice(index, 1);
		if(batchToRemove instanceof PIXI.WebGLBatch)PIXI.WebGLRenderer.returnBatch(batchToRemove);
	}
}

/**
 * Initializes a tiling sprite
 *
 * @method initTilingSprite
 * @param sprite {TilingSprite} The tiling sprite to initialize
 * @private
 */
PIXI.WebGLRenderGroup.prototype.initTilingSprite = function(sprite)
{
	var gl = this.gl;

	// make the texture tilable..

	sprite.verticies = new Float32Array([0, 0,
										  sprite.width, 0,
										  sprite.width,  sprite.height,
										 0,  sprite.height]);

	sprite.uvs = new Float32Array([0, 0,
									1, 0,
									1, 1,
									0, 1]);

	sprite.colors = new Float32Array([1,1,1,1]);

	sprite.indices =  new Uint16Array([0, 1, 3,2])//, 2]);

	sprite._vertexBuffer = gl.createBuffer();
	sprite._indexBuffer = gl.createBuffer();
	sprite._uvBuffer = gl.createBuffer();
	sprite._colorBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, sprite._vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, sprite.verticies, gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, sprite._uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,  sprite.uvs, gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, sprite._colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, sprite.colors, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sprite._indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sprite.indices, gl.STATIC_DRAW);

//    return ( (x > 0) && ((x & (x - 1)) == 0) );

	if(sprite.texture.baseTexture._glTexture)
	{
    	gl.bindTexture(gl.TEXTURE_2D, sprite.texture.baseTexture._glTexture);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		sprite.texture.baseTexture._powerOf2 = true;
	}
	else
	{
		sprite.texture.baseTexture._powerOf2 = true;
	}
}

/**
 * Renders a Strip
 *
 * @method renderStrip
 * @param strip {Strip} The strip to render
 * @param projection {Object}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.renderStrip = function(strip, projection)
{
	var gl = this.gl;
	var shaderProgram = PIXI.shaderProgram;
//	mat
	//var mat4Real = PIXI.mat3.toMat4(strip.worldTransform);
	//PIXI.mat4.transpose(mat4Real);
	//PIXI.mat4.multiply(projectionMatrix, mat4Real, mat4Real )


	gl.useProgram(PIXI.stripShaderProgram);

	var m = PIXI.mat3.clone(strip.worldTransform);

	PIXI.mat3.transpose(m);

	// set the matrix transform for the
 	gl.uniformMatrix3fv(PIXI.stripShaderProgram.translationMatrix, false, m);
	gl.uniform2f(PIXI.stripShaderProgram.projectionVector, projection.x, projection.y);
	gl.uniform1f(PIXI.stripShaderProgram.alpha, strip.worldAlpha);

/*
	if(strip.blendMode == PIXI.blendModes.NORMAL)
	{
		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	}
	else
	{
		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR);
	}
	*/


	if(!strip.dirty)
	{

		gl.bindBuffer(gl.ARRAY_BUFFER, strip._vertexBuffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, strip.verticies)
	    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

		// update the uvs
	   	gl.bindBuffer(gl.ARRAY_BUFFER, strip._uvBuffer);
	    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

	    gl.activeTexture(gl.TEXTURE0);
	    gl.bindTexture(gl.TEXTURE_2D, strip.texture.baseTexture._glTexture);

		gl.bindBuffer(gl.ARRAY_BUFFER, strip._colorBuffer);
	    gl.vertexAttribPointer(shaderProgram.colorAttribute, 1, gl.FLOAT, false, 0, 0);

		// dont need to upload!
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, strip._indexBuffer);
	}
	else
	{
		strip.dirty = false;
		gl.bindBuffer(gl.ARRAY_BUFFER, strip._vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, strip.verticies, gl.STATIC_DRAW)
	    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

		// update the uvs
	   	gl.bindBuffer(gl.ARRAY_BUFFER, strip._uvBuffer);
	   	gl.bufferData(gl.ARRAY_BUFFER, strip.uvs, gl.STATIC_DRAW)
	    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

	    gl.activeTexture(gl.TEXTURE0);
	    gl.bindTexture(gl.TEXTURE_2D, strip.texture.baseTexture._glTexture);

		gl.bindBuffer(gl.ARRAY_BUFFER, strip._colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, strip.colors, gl.STATIC_DRAW)
	    gl.vertexAttribPointer(shaderProgram.colorAttribute, 1, gl.FLOAT, false, 0, 0);

		// dont need to upload!
	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, strip._indexBuffer);
	    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, strip.indices, gl.STATIC_DRAW);

	}
	//console.log(gl.TRIANGLE_STRIP);

	gl.drawElements(gl.TRIANGLE_STRIP, strip.indices.length, gl.UNSIGNED_SHORT, 0);

  	gl.useProgram(PIXI.shaderProgram);
}

/**
 * Renders a TilingSprite
 *
 * @method renderTilingSprite
 * @param sprite {TilingSprite} The tiling sprite to render
 * @param projectionMatrix {Object}
 * @private
 */
PIXI.WebGLRenderGroup.prototype.renderTilingSprite = function(sprite, projectionMatrix)
{
	var gl = this.gl;
	var shaderProgram = PIXI.shaderProgram;

	var tilePosition = sprite.tilePosition;
	var tileScale = sprite.tileScale;

	var offsetX =  tilePosition.x/sprite.texture.baseTexture.width;
	var offsetY =  tilePosition.y/sprite.texture.baseTexture.height;

	var scaleX =  (sprite.width / sprite.texture.baseTexture.width)  / tileScale.x;
	var scaleY =  (sprite.height / sprite.texture.baseTexture.height) / tileScale.y;

	sprite.uvs[0] = 0 - offsetX;
	sprite.uvs[1] = 0 - offsetY;

	sprite.uvs[2] = (1 * scaleX)  -offsetX;
	sprite.uvs[3] = 0 - offsetY;

	sprite.uvs[4] = (1 *scaleX) - offsetX;
	sprite.uvs[5] = (1 *scaleY) - offsetY;

	sprite.uvs[6] = 0 - offsetX;
	sprite.uvs[7] = (1 *scaleY) - offsetY;

	gl.bindBuffer(gl.ARRAY_BUFFER, sprite._uvBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, sprite.uvs)

	this.renderStrip(sprite, projectionMatrix);
}

/**
 * Initializes a strip to be rendered
 *
 * @method initStrip
 * @param strip {Strip} The strip to initialize
 * @private
 */
PIXI.WebGLRenderGroup.prototype.initStrip = function(strip)
{
	// build the strip!
	var gl = this.gl;
	var shaderProgram = this.shaderProgram;

	strip._vertexBuffer = gl.createBuffer();
	strip._indexBuffer = gl.createBuffer();
	strip._uvBuffer = gl.createBuffer();
	strip._colorBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, strip._vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, strip.verticies, gl.DYNAMIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, strip._uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,  strip.uvs, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, strip._colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, strip.colors, gl.STATIC_DRAW);


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, strip._indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, strip.indices, gl.STATIC_DRAW);
}

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


/**
 * the CanvasRenderer draws the stage and all its content onto a 2d canvas. This renderer should be used for browsers that do not support webGL.
 * Dont forget to add the view to your DOM or you will not see anything :)
 *
 * @class CanvasRenderer
 * @constructor
 * @param width=0 {Number} the width of the canvas view
 * @param height=0 {Number} the height of the canvas view
 * @param view {Canvas} the canvas to use as a view, optional
 * @param transparent=false {Boolean} the transparency of the render view, default false
 */
PIXI.CanvasRenderer = function(width, height, view, transparent)
{
	this.transparent = transparent;

	/**
	 * The width of the canvas view
	 *
	 * @property width
	 * @type Number
	 * @default 800
	 */
	this.width = width || 800;

	/**
	 * The height of the canvas view
	 *
	 * @property height
	 * @type Number
	 * @default 600
	 */
	this.height = height || 600;

	/**
	 * The canvas element that the everything is drawn to
	 *
	 * @property view
	 * @type Canvas
	 */
	this.view = view || document.createElement( 'canvas' );

	/**
	 * The canvas context that the everything is drawn to
	 * @property context
	 * @type Canvas 2d Context
	 */
	this.context = this.view.getContext("2d");

	this.refresh = true;
	// hack to enable some hardware acceleration!
	//this.view.style["transform"] = "translatez(0)";

    this.view.width = this.width;
	this.view.height = this.height;
	this.count = 0;
}

// constructor
PIXI.CanvasRenderer.prototype.constructor = PIXI.CanvasRenderer;

/**
 * Renders the stage to its canvas view
 *
 * @method render
 * @param stage {Stage} the Stage element to be rendered
 */
PIXI.CanvasRenderer.prototype.render = function(stage)
{

	//stage.__childrenAdded = [];
	//stage.__childrenRemoved = [];

	// update textures if need be
	PIXI.texturesToUpdate = [];
	PIXI.texturesToDestroy = [];

	PIXI.visibleCount++;
	stage.updateTransform();

	// update the background color
	if(this.view.style.backgroundColor!=stage.backgroundColorString && !this.transparent)this.view.style.backgroundColor = stage.backgroundColorString;

	this.context.setTransform(1,0,0,1,0,0);
	this.context.clearRect(0, 0, this.width, this.height)
    this.renderDisplayObject(stage);
    //as

    // run interaction!
	if(stage.interactive)
	{
		//need to add some events!
		if(!stage._interactiveEventsAdded)
		{
			stage._interactiveEventsAdded = true;
			stage.interactionManager.setTarget(this);
		}
	}

	// remove frame updates..
	if(PIXI.Texture.frameUpdates.length > 0)
	{
		PIXI.Texture.frameUpdates = [];
	}


}

/**
 * resizes the canvas view to the specified width and height
 *
 * @method resize
 * @param width {Number} the new width of the canvas view
 * @param height {Number} the new height of the canvas view
 */
PIXI.CanvasRenderer.prototype.resize = function(width, height)
{
	this.width = width;
	this.height = height;

	this.view.width = width;
	this.view.height = height;
}

/**
 * Renders a display object
 *
 * @method renderDisplayObject
 * @param displayObject {DisplayObject} The displayObject to render
 * @private
 */
PIXI.CanvasRenderer.prototype.renderDisplayObject = function(displayObject)
{
	// no loger recurrsive!
	var transform;
	var context = this.context;

	context.globalCompositeOperation = 'source-over';

	// one the display object hits this. we can break the loop
	var testObject = displayObject.last._iNext;
	displayObject = displayObject.first;

	do
	{
		transform = displayObject.worldTransform;

		if(!displayObject.visible)
		{
			displayObject = displayObject.last._iNext;
			continue;
		}

		if(!displayObject.renderable)
		{
			displayObject = displayObject._iNext;
			continue;
		}

		if(displayObject instanceof PIXI.Sprite)
		{

			var frame = displayObject.texture.frame;

			if(frame)
			{
				context.globalAlpha = displayObject.worldAlpha;

				context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5]);

				context.drawImage(displayObject.texture.baseTexture.source,
								   frame.x,
								   frame.y,
								   frame.width,
								   frame.height,
								   (displayObject.anchor.x) * -frame.width,
								   (displayObject.anchor.y) * -frame.height,
								   frame.width,
								   frame.height);
			}
	   	}
	   	else if(displayObject instanceof PIXI.Strip)
		{
			context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5])
			this.renderStrip(displayObject);
		}
		else if(displayObject instanceof PIXI.TilingSprite)
		{
			context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5])
			this.renderTilingSprite(displayObject);
		}
		else if(displayObject instanceof PIXI.CustomRenderable)
		{
			displayObject.renderCanvas(this);
		}
		else if(displayObject instanceof PIXI.Graphics)
		{
			context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5])
			PIXI.CanvasGraphics.renderGraphics(displayObject, context);
		}
		else if(displayObject instanceof PIXI.FilterBlock)
		{
			if(displayObject.open)
			{
				context.save();

				var cacheAlpha = displayObject.mask.alpha;
				var maskTransform = displayObject.mask.worldTransform;

				context.setTransform(maskTransform[0], maskTransform[3], maskTransform[1], maskTransform[4], maskTransform[2], maskTransform[5])

				displayObject.mask.worldAlpha = 0.5;

				context.worldAlpha = 0;

				PIXI.CanvasGraphics.renderGraphicsMask(displayObject.mask, context);
				context.clip();

				displayObject.mask.worldAlpha = cacheAlpha;
			}
			else
			{
				context.restore();
			}
		}
	//	count++
		displayObject = displayObject._iNext;


	}
	while(displayObject != testObject)


}

/**
 * Renders a flat strip
 *
 * @method renderStripFlat
 * @param strip {Strip} The Strip to render
 * @private
 */
PIXI.CanvasRenderer.prototype.renderStripFlat = function(strip)
{
	var context = this.context;
	var verticies = strip.verticies;
	var uvs = strip.uvs;

	var length = verticies.length/2;
	this.count++;

	context.beginPath();
	for (var i=1; i < length-2; i++)
	{

		// draw some triangles!
		var index = i*2;

		 var x0 = verticies[index],   x1 = verticies[index+2], x2 = verticies[index+4];
 		 var y0 = verticies[index+1], y1 = verticies[index+3], y2 = verticies[index+5];

		context.moveTo(x0, y0);
		context.lineTo(x1, y1);
		context.lineTo(x2, y2);

	};

	context.fillStyle = "#FF0000";
	context.fill();
	context.closePath();
}

/**
 * Renders a tiling sprite
 *
 * @method renderTilingSprite
 * @param sprite {TilingSprite} The tilingsprite to render
 * @private
 */
PIXI.CanvasRenderer.prototype.renderTilingSprite = function(sprite)
{
	var context = this.context;

	context.globalAlpha = sprite.worldAlpha;

 	if(!sprite.__tilePattern) sprite.__tilePattern = context.createPattern(sprite.texture.baseTexture.source, "repeat");

	context.beginPath();

	var tilePosition = sprite.tilePosition;
	var tileScale = sprite.tileScale;

    // offset
    context.scale(tileScale.x,tileScale.y);
    context.translate(tilePosition.x, tilePosition.y);

	context.fillStyle = sprite.__tilePattern;
	context.fillRect(-tilePosition.x,-tilePosition.y,sprite.width / tileScale.x, sprite.height / tileScale.y);

	context.scale(1/tileScale.x, 1/tileScale.y);
    context.translate(-tilePosition.x, -tilePosition.y);

    context.closePath();
}

/**
 * Renders a strip
 *
 * @method renderStrip
 * @param strip {Strip} The Strip to render
 * @private
 */
PIXI.CanvasRenderer.prototype.renderStrip = function(strip)
{
	var context = this.context;

	// draw triangles!!
	var verticies = strip.verticies;
	var uvs = strip.uvs;

	var length = verticies.length/2;
	this.count++;
	for (var i=1; i < length-2; i++)
	{

		// draw some triangles!
		var index = i*2;

		 var x0 = verticies[index],   x1 = verticies[index+2], x2 = verticies[index+4];
 		 var y0 = verticies[index+1], y1 = verticies[index+3], y2 = verticies[index+5];

  		 var u0 = uvs[index] * strip.texture.width,   u1 = uvs[index+2] * strip.texture.width, u2 = uvs[index+4]* strip.texture.width;
   		 var v0 = uvs[index+1]* strip.texture.height, v1 = uvs[index+3] * strip.texture.height, v2 = uvs[index+5]* strip.texture.height;


		context.save();
		context.beginPath();
		context.moveTo(x0, y0);
		context.lineTo(x1, y1);
		context.lineTo(x2, y2);
		context.closePath();

		context.clip();


        // Compute matrix transform
        var delta = u0*v1 + v0*u2 + u1*v2 - v1*u2 - v0*u1 - u0*v2;
        var delta_a = x0*v1 + v0*x2 + x1*v2 - v1*x2 - v0*x1 - x0*v2;
        var delta_b = u0*x1 + x0*u2 + u1*x2 - x1*u2 - x0*u1 - u0*x2;
        var delta_c = u0*v1*x2 + v0*x1*u2 + x0*u1*v2 - x0*v1*u2 - v0*u1*x2 - u0*x1*v2;
        var delta_d = y0*v1 + v0*y2 + y1*v2 - v1*y2 - v0*y1 - y0*v2;
        var delta_e = u0*y1 + y0*u2 + u1*y2 - y1*u2 - y0*u1 - u0*y2;
        var delta_f = u0*v1*y2 + v0*y1*u2 + y0*u1*v2 - y0*v1*u2 - v0*u1*y2 - u0*y1*v2;




        context.transform(delta_a/delta, delta_d/delta,
                      delta_b/delta, delta_e/delta,
                      delta_c/delta, delta_f/delta);

		context.drawImage(strip.texture.baseTexture.source, 0, 0);
	  	context.restore();
	};

}

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


/**
 * A set of functions used by the canvas renderer to draw the primitive graphics data
 *
 * @class CanvasGraphics
 */
PIXI.CanvasGraphics = function()
{

}


/*
 * Renders the graphics object
 *
 * @static
 * @private
 * @method renderGraphics
 * @param graphics {Graphics}
 * @param context {Context2D}
 */
PIXI.CanvasGraphics.renderGraphics = function(graphics, context)
{
	var worldAlpha = graphics.worldAlpha;

	for (var i=0; i < graphics.graphicsData.length; i++)
	{
		var data = graphics.graphicsData[i];
		var points = data.points;

		context.strokeStyle = color = '#' + ('00000' + ( data.lineColor | 0).toString(16)).substr(-6);

		context.lineWidth = data.lineWidth;

		if(data.type === PIXI.Graphics.POLY)
		{
			context.beginPath();

			context.moveTo(points[0], points[1]);

			for (var j=1; j < points.length/2; j++)
			{
				context.lineTo(points[j * 2], points[j * 2 + 1]);
			}

	      	// if the first and last point are the same close the path - much neater :)
	      	if(points[0] === points[points.length-2] && points[1] === points[points.length-1])
	      	{
	      		context.closePath();
	      	}

			if(data.fill)
			{
				context.globalAlpha = data.fillAlpha * worldAlpha;
				context.fillStyle = color = '#' + ('00000' + ( data.fillColor | 0).toString(16)).substr(-6);
      			context.fill();
			}
			if(data.lineWidth)
			{
				context.globalAlpha = data.lineAlpha * worldAlpha;
      			context.stroke();
			}
		}
		else if(data.type === PIXI.Graphics.RECT)
		{

			// TODO - need to be Undefined!
			if(data.fillColor != undefined)
			{
				context.globalAlpha = data.fillAlpha * worldAlpha;
				context.fillStyle = color = '#' + ('00000' + ( data.fillColor | 0).toString(16)).substr(-6);
				context.fillRect(points[0], points[1], points[2], points[3]);

			}
			if(data.lineWidth)
			{
				context.globalAlpha = data.lineAlpha * worldAlpha;
				context.strokeRect(points[0], points[1], points[2], points[3]);
			}

		}
		else if(data.type == PIXI.Graphics.CIRC)
		{
			// TODO - need to be Undefined!
      		context.beginPath();
			context.arc(points[0], points[1], points[2],0,2*Math.PI);
			context.closePath();

			if(data.fill)
			{
				context.globalAlpha = data.fillAlpha * worldAlpha;
				context.fillStyle = color = '#' + ('00000' + ( data.fillColor | 0).toString(16)).substr(-6);
      			context.fill();
			}
			if(data.lineWidth)
			{
				context.globalAlpha = data.lineAlpha * worldAlpha;
      			context.stroke();
			}
		}
		else if(data.type == PIXI.Graphics.ELIP)
		{

			// elipse code taken from: http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas

			var elipseData =  data.points;

			var w = elipseData[2] * 2;
			var h = elipseData[3] * 2;

			var x = elipseData[0] - w/2;
			var y = elipseData[1] - h/2;

      		context.beginPath();

			var kappa = .5522848,
			ox = (w / 2) * kappa, // control point offset horizontal
			oy = (h / 2) * kappa, // control point offset vertical
			xe = x + w,           // x-end
			ye = y + h,           // y-end
			xm = x + w / 2,       // x-middle
			ym = y + h / 2;       // y-middle

			context.moveTo(x, ym);
			context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
			context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
			context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
			context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);

			context.closePath();

			if(data.fill)
			{
				context.globalAlpha = data.fillAlpha * worldAlpha;
				context.fillStyle = color = '#' + ('00000' + ( data.fillColor | 0).toString(16)).substr(-6);
      			context.fill();
			}
			if(data.lineWidth)
			{
				context.globalAlpha = data.lineAlpha * worldAlpha;
      			context.stroke();
			}
		}

	};
}

/*
 * Renders a graphics mask
 *
 * @static
 * @private
 * @method renderGraphicsMask
 * @param graphics {Graphics}
 * @param context {Context2D}
 */
PIXI.CanvasGraphics.renderGraphicsMask = function(graphics, context)
{
	var worldAlpha = graphics.worldAlpha;

	var len = graphics.graphicsData.length;
	if(len > 1)
	{
		len = 1;
		console.log("Pixi.js warning: masks in canvas can only mask using the first path in the graphics object")
	}

	for (var i=0; i < 1; i++)
	{
		var data = graphics.graphicsData[i];
		var points = data.points;

		if(data.type == PIXI.Graphics.POLY)
		{
			context.beginPath();
			context.moveTo(points[0], points[1]);

			for (var j=1; j < points.length/2; j++)
			{
				context.lineTo(points[j * 2], points[j * 2 + 1]);
			}

	      	// if the first and last point are the same close the path - much neater :)
	      	if(points[0] == points[points.length-2] && points[1] == points[points.length-1])
	      	{
	      		context.closePath();
	      	}

		}
		else if(data.type == PIXI.Graphics.RECT)
		{
			context.beginPath();
			context.rect(points[0], points[1], points[2], points[3]);
			context.closePath();
		}
		else if(data.type == PIXI.Graphics.CIRC)
		{
			// TODO - need to be Undefined!
      		context.beginPath();
			context.arc(points[0], points[1], points[2],0,2*Math.PI);
			context.closePath();
		}
		else if(data.type == PIXI.Graphics.ELIP)
		{

			// elipse code taken from: http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
			var elipseData =  data.points;

			var w = elipseData[2] * 2;
			var h = elipseData[3] * 2;

			var x = elipseData[0] - w/2;
			var y = elipseData[1] - h/2;

      		context.beginPath();

			var kappa = .5522848,
			ox = (w / 2) * kappa, // control point offset horizontal
			oy = (h / 2) * kappa, // control point offset vertical
			xe = x + w,           // x-end
			ye = y + h,           // y-end
			xm = x + w / 2,       // x-middle
			ym = y + h / 2;       // y-middle

			context.moveTo(x, ym);
			context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
			context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
			context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
			context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
			context.closePath();
		}


	};
}

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


/**
 * The Graphics class contains a set of methods that you can use to create primitive shapes and lines.
 * It is important to know that with the webGL renderer only simple polys can be filled at this stage
 * Complex polys will not be filled. Heres an example of a complex poly: http://www.goodboydigital.com/wp-content/uploads/2013/06/complexPolygon.png
 *
 * @class Graphics
 * @extends DisplayObjectContainer
 * @constructor
 */
PIXI.Graphics = function()
{
	PIXI.DisplayObjectContainer.call( this );

	this.renderable = true;

    /**
     * The alpha of the fill of this graphics object
     *
     * @property fillAlpha
     * @type Number
     */
	this.fillAlpha = 1;

    /**
     * The width of any lines drawn
     *
     * @property lineWidth
     * @type Number
     */
	this.lineWidth = 0;

    /**
     * The color of any lines drawn
     *
     * @property lineColor
     * @type String
     */
	this.lineColor = "black";

    /**
     * Graphics data
     *
     * @property graphicsData
     * @type Array
     * @private
     */
	this.graphicsData = [];

    /**
     * Current path
     *
     * @property currentPath
     * @type Object
     * @private
     */
	this.currentPath = {points:[]};
}

// constructor
PIXI.Graphics.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.Graphics.prototype.constructor = PIXI.Graphics;

/**
 * Specifies a line style used for subsequent calls to Graphics methods such as the lineTo() method or the drawCircle() method.
 *
 * @method lineStyle
 * @param lineWidth {Number} width of the line to draw, will update the object's stored style
 * @param color {Number} color of the line to draw, will update the object's stored style
 * @param alpha {Number} alpha of the line to draw, will update the object's stored style
 */
PIXI.Graphics.prototype.lineStyle = function(lineWidth, color, alpha)
{
	if(this.currentPath.points.length == 0)this.graphicsData.pop();

	this.lineWidth = lineWidth || 0;
	this.lineColor = color || 0;
	this.lineAlpha = (alpha == undefined) ? 1 : alpha;

	this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha,
						fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling, points:[], type:PIXI.Graphics.POLY};

	this.graphicsData.push(this.currentPath);
}

/**
 * Moves the current drawing position to (x, y).
 *
 * @method moveTo
 * @param x {Number} the X coord to move to
 * @param y {Number} the Y coord to move to
 */
PIXI.Graphics.prototype.moveTo = function(x, y)
{
	if(this.currentPath.points.length == 0)this.graphicsData.pop();

	this.currentPath = this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha,
						fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling, points:[], type:PIXI.Graphics.POLY};

	this.currentPath.points.push(x, y);

	this.graphicsData.push(this.currentPath);
}

/**
 * Draws a line using the current line style from the current drawing position to (x, y);
 * the current drawing position is then set to (x, y).
 *
 * @method lineTo
 * @param x {Number} the X coord to draw to
 * @param y {Number} the Y coord to draw to
 */
PIXI.Graphics.prototype.lineTo = function(x, y)
{
	this.currentPath.points.push(x, y);
	this.dirty = true;
}

/**
 * Specifies a simple one-color fill that subsequent calls to other Graphics methods
 * (such as lineTo() or drawCircle()) use when drawing.
 *
 * @method beginFill
 * @param color {uint} the color of the fill
 * @param alpha {Number} the alpha
 */
PIXI.Graphics.prototype.beginFill = function(color, alpha)
{
	this.filling = true;
	this.fillColor = color || 0;
	this.fillAlpha = (alpha == undefined) ? 1 : alpha;
}

/**
 * Applies a fill to the lines and shapes that were added since the last call to the beginFill() method.
 *
 * @method endFill
 */
PIXI.Graphics.prototype.endFill = function()
{
	this.filling = false;
	this.fillColor = null;
	this.fillAlpha = 1;
}

/**
 * @method drawRect
 *
 * @param x {Number} The X coord of the top-left of the rectangle
 * @param y {Number} The Y coord of the top-left of the rectangle
 * @param width {Number} The width of the rectangle
 * @param height {Number} The height of the rectangle
 */
PIXI.Graphics.prototype.drawRect = function( x, y, width, height )
{
	if(this.currentPath.points.length == 0)this.graphicsData.pop();

	this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha,
						fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling,
						points:[x, y, width, height], type:PIXI.Graphics.RECT};

	this.graphicsData.push(this.currentPath);
	this.dirty = true;
}

/**
 * Draws a circle.
 *
 * @method drawCircle
 * @param x {Number} The X coord of the center of the circle
 * @param y {Number} The Y coord of the center of the circle
 * @param radius {Number} The radius of the circle
 */
PIXI.Graphics.prototype.drawCircle = function( x, y, radius)
{
	if(this.currentPath.points.length == 0)this.graphicsData.pop();

	this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha,
						fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling,
						points:[x, y, radius, radius], type:PIXI.Graphics.CIRC};

	this.graphicsData.push(this.currentPath);
	this.dirty = true;
}

/**
 * Draws an elipse.
 *
 * @method drawElipse
 * @param x {Number}
 * @param y {Number}
 * @param width {Number}
 * @param height {Number}
 */
PIXI.Graphics.prototype.drawElipse = function( x, y, width, height)
{
	if(this.currentPath.points.length == 0)this.graphicsData.pop();

	this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha,
						fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling,
						points:[x, y, width, height], type:PIXI.Graphics.ELIP};

	this.graphicsData.push(this.currentPath);
	this.dirty = true;
}

/**
 * Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
 *
 * @method clear
 */
PIXI.Graphics.prototype.clear = function()
{
	this.lineWidth = 0;
	this.filling = false;

	this.dirty = true;
	this.clearDirty = true;
	this.graphicsData = [];
}

// SOME TYPES:
PIXI.Graphics.POLY = 0;
PIXI.Graphics.RECT = 1;
PIXI.Graphics.CIRC = 2;
PIXI.Graphics.ELIP = 3;

/**
 * @author Mat Groves http://matgroves.com/
 */

PIXI.Strip = function(texture, width, height)
{
	PIXI.DisplayObjectContainer.call( this );
	this.texture = texture;
	this.blendMode = PIXI.blendModes.NORMAL;

	try
	{
		this.uvs = new Float32Array([0, 1,
				1, 1,
				1, 0, 0,1]);

		this.verticies = new Float32Array([0, 0,
						  0,0,
						  0,0, 0,
						  0, 0]);

		this.colors = new Float32Array([1, 1, 1, 1]);

		this.indices = new Uint16Array([0, 1, 2, 3]);
	}
	catch(error)
	{
		this.uvs = [0, 1,
				1, 1,
				1, 0, 0,1];

		this.verticies = [0, 0,
						  0,0,
						  0,0, 0,
						  0, 0];

		this.colors = [1, 1, 1, 1];

		this.indices = [0, 1, 2, 3];
	}


	/*
	this.uvs = new Float32Array()
	this.verticies = new Float32Array()
	this.colors = new Float32Array()
	this.indices = new Uint16Array()
*/
	this.width = width;
	this.height = height;

	// load the texture!
	if(texture.baseTexture.hasLoaded)
	{
		this.width   = this.texture.frame.width;
		this.height  = this.texture.frame.height;
		this.updateFrame = true;
	}
	else
	{
		this.onTextureUpdateBind = this.onTextureUpdate.bind(this);
		this.texture.addEventListener( 'update', this.onTextureUpdateBind );
	}

	this.renderable = true;
}

// constructor
PIXI.Strip.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.Strip.prototype.constructor = PIXI.Strip;

PIXI.Strip.prototype.setTexture = function(texture)
{
	//TODO SET THE TEXTURES
	//TODO VISIBILITY

	// stop current texture
	this.texture = texture;
	this.width   = texture.frame.width;
	this.height  = texture.frame.height;
	this.updateFrame = true;
}

PIXI.Strip.prototype.onTextureUpdate = function(event)
{
	this.updateFrame = true;
}
// some helper functions..


/**
 * @author Mat Groves http://matgroves.com/
 */


PIXI.Rope = function(texture, points)
{
	PIXI.Strip.call( this, texture );
	this.points = points;

	try
	{
		this.verticies = new Float32Array( points.length * 4);
		this.uvs = new Float32Array( points.length * 4);
		this.colors = new Float32Array(  points.length * 2);
		this.indices = new Uint16Array( points.length * 2);
	}
	catch(error)
	{
		this.verticies = verticies

		this.uvs = uvs
		this.colors = colors
		this.indices = indices
	}

	this.refresh();
}


// constructor
PIXI.Rope.prototype = Object.create( PIXI.Strip.prototype );
PIXI.Rope.prototype.constructor = PIXI.Rope;

PIXI.Rope.prototype.refresh = function()
{
	var points = this.points;
	if(points.length < 1)return;

	var uvs = this.uvs
	var indices = this.indices;
	var colors = this.colors;

	var lastPoint = points[0];
	var nextPoint;
	var perp = {x:0, y:0};
	var point = points[0];

	this.count-=0.2;


	uvs[0] = 0
	uvs[1] = 1
	uvs[2] = 0
	uvs[3] = 1

	colors[0] = 1;
	colors[1] = 1;

	indices[0] = 0;
	indices[1] = 1;

	var total = points.length;

	for (var i =  1; i < total; i++)
	{

		var point = points[i];
		var index = i * 4;
		// time to do some smart drawing!
		var amount = i/(total-1)

		if(i%2)
		{
			uvs[index] = amount;
			uvs[index+1] = 0;

			uvs[index+2] = amount
			uvs[index+3] = 1

		}
		else
		{
			uvs[index] = amount
			uvs[index+1] = 0

			uvs[index+2] = amount
			uvs[index+3] = 1
		}

		index = i * 2;
		colors[index] = 1;
		colors[index+1] = 1;

		index = i * 2;
		indices[index] = index;
		indices[index + 1] = index + 1;

		lastPoint = point;
	}
}

PIXI.Rope.prototype.updateTransform = function()
{

	var points = this.points;
	if(points.length < 1)return;

	var verticies = this.verticies

	var lastPoint = points[0];
	var nextPoint;
	var perp = {x:0, y:0};
	var point = points[0];

	this.count-=0.2;

	verticies[0] = point.x + perp.x
	verticies[1] = point.y + perp.y //+ 200
	verticies[2] = point.x - perp.x
	verticies[3] = point.y - perp.y//+200
	// time to do some smart drawing!

	var total = points.length;

	for (var i =  1; i < total; i++)
	{

		var point = points[i];
		var index = i * 4;

		if(i < points.length-1)
		{
			nextPoint = points[i+1];
		}
		else
		{
			nextPoint = point
		}

		perp.y = -(nextPoint.x - lastPoint.x);
		perp.x = nextPoint.y - lastPoint.y;

		var ratio = (1 - (i / (total-1))) * 10;
				if(ratio > 1)ratio = 1;

		var perpLength = Math.sqrt(perp.x * perp.x + perp.y * perp.y);
		var num = this.texture.height/2//(20 + Math.abs(Math.sin((i + this.count) * 0.3) * 50) )* ratio;
		perp.x /= perpLength;
		perp.y /= perpLength;

		perp.x *= num;
		perp.y *= num;

		verticies[index] = point.x + perp.x
		verticies[index+1] = point.y + perp.y
		verticies[index+2] = point.x - perp.x
		verticies[index+3] = point.y - perp.y

		lastPoint = point;
	}

	PIXI.DisplayObjectContainer.prototype.updateTransform.call( this );
}

PIXI.Rope.prototype.setTexture = function(texture)
{
	// stop current texture
	this.texture = texture;
	this.updateFrame = true;
}





/**
 * @author Mat Groves http://matgroves.com/
 */

/**
 * A tiling sprite is a fast way of rendering a tiling image
 *
 * @class TilingSprite
 * @extends DisplayObjectContainer
 * @constructor
 * @param texture {Texture} the texture of the tiling sprite
 * @param width {Number}  the width of the tiling sprite
 * @param height {Number} the height of the tiling sprite
 */
PIXI.TilingSprite = function(texture, width, height)
{
	PIXI.DisplayObjectContainer.call( this );

	/**
	 * The texture that the sprite is using
	 *
	 * @property texture
	 * @type Texture
	 */
	this.texture = texture;

	/**
	 * The width of the tiling sprite
	 *
	 * @property width
	 * @type Number
	 */
	this.width = width;

	/**
	 * The height of the tiling sprite
	 *
	 * @property height
	 * @type Number
	 */
	this.height = height;

	/**
	 * The scaling of the image that is being tiled
	 *
	 * @property tileScale
	 * @type Point
	 */
	this.tileScale = new PIXI.Point(1,1);

	/**
	 * The offset position of the image that is being tiled
	 *
	 * @property tilePosition
	 * @type Point
	 */
	this.tilePosition = new PIXI.Point(0,0);

	this.renderable = true;

	this.blendMode = PIXI.blendModes.NORMAL
}

// constructor
PIXI.TilingSprite.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.TilingSprite.prototype.constructor = PIXI.TilingSprite;

/**
 * Sets the texture of the tiling sprite
 *
 * @method setTexture
 * @param texture {Texture} The PIXI texture that is displayed by the sprite
 */
PIXI.TilingSprite.prototype.setTexture = function(texture)
{
	//TODO SET THE TEXTURES
	//TODO VISIBILITY

	// stop current texture
	this.texture = texture;
	this.updateFrame = true;
}

/**
 * When the texture is updated, this event will fire to update the frame
 *
 * @method onTextureUpdate
 * @param event
 * @private
 */
PIXI.TilingSprite.prototype.onTextureUpdate = function(event)
{
	this.updateFrame = true;
}


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * based on pixi impact spine implementation made by Eemeli Kelokorpi (@ekelokorpi) https://github.com/ekelokorpi
 *
 * Awesome JS run time provided by EsotericSoftware
 * https://github.com/EsotericSoftware/spine-runtimes
 *
 */

/**
 * A class that enables the you to import and run your spine animations in pixi.
 * Spine animation data needs to be loaded using the PIXI.AssetLoader or PIXI.SpineLoader before it can be used by this class
 * See example 12 (http://www.goodboydigital.com/pixijs/examples/12/) to see a working example and check out the source
 *
 * @class Spine
 * @extends DisplayObjectContainer
 * @constructor
 * @param url {String} The url of the spine anim file to be used
 */
PIXI.Spine = function (url) {
	PIXI.DisplayObjectContainer.call(this);

	this.spineData = PIXI.AnimCache[url];
	this.baseUrl = url.replace(/[^\/]*$/, "");

	if (!this.spineData) {
		throw new Error("Spine data must be preloaded using PIXI.SpineLoader or PIXI.AssetLoader: " + url);
	}

	this.skeleton = new spine.Skeleton(this.spineData);
	this.skeleton.updateWorldTransform();

	this.stateData = new spine.AnimationStateData(this.spineData);
	this.state = new spine.AnimationState(this.stateData);

	this.slotContainers = [];

	for (var i = 0, n = this.skeleton.drawOrder.length; i < n; i++) {
		var slot = this.skeleton.drawOrder[i];
		var attachment = slot.attachment;
		var slotContainer = new PIXI.DisplayObjectContainer();
		this.slotContainers.push(slotContainer);
		this.addChild(slotContainer);
		if (!(attachment instanceof spine.RegionAttachment)) {
			continue;
		}

		if (attachment.rendererObject.name.indexOf(this.baseUrl) === -1) {
			attachment.rendererObject.name = this.baseUrl + attachment.rendererObject.name;
		}
		var spriteName = attachment.rendererObject.name;
		var sprite = this.createSprite(slot, attachment.rendererObject);
		slot.currentSprite = sprite;
		slot.currentSpriteName = spriteName;
		slotContainer.addChild(sprite);
	}
};

PIXI.Spine.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXI.Spine.prototype.constructor = PIXI.Spine;

/*
 * Updates the object transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.Spine.prototype.updateTransform = function () {
	this.lastTime = this.lastTime || Date.now();
	var timeDelta = (Date.now() - this.lastTime) * 0.001;
	this.lastTime = Date.now();
	this.state.update(timeDelta);
	this.state.apply(this.skeleton);
	this.skeleton.updateWorldTransform();

	var drawOrder = this.skeleton.drawOrder;
	for (var i = 0, n = drawOrder.length; i < n; i++) {
		var slot = drawOrder[i];
		var attachment = slot.attachment;
		var slotContainer = this.slotContainers[i];
		if (!(attachment instanceof spine.RegionAttachment)) {
			slotContainer.visible = false;
			continue;
		}

		if (attachment.rendererObject) {
			if (!slot.currentSpriteName || slot.currentSpriteName != attachment.name) {
				if (attachment.rendererObject.name.indexOf(this.baseUrl) === -1) {
					attachment.rendererObject.name = this.baseUrl + attachment.rendererObject.name;
				}
				var spriteName = attachment.rendererObject.name;
				if (slot.currentSprite !== undefined) {
					slot.currentSprite.visible = false;
				}
				slot.sprites = slot.sprites || {};
				if (slot.sprites[spriteName] !== undefined) {
					slot.sprites[spriteName].visible = true;
				} else {
					var sprite = this.createSprite(slot, attachment.rendererObject);
					slotContainer.addChild(sprite);
				}
				slot.currentSprite = slot.sprites[spriteName];
				slot.currentSpriteName = spriteName;
			}
		}
		slotContainer.visible = true;

		var bone = slot.bone;

		slotContainer.position.x = bone.worldX + attachment.x * bone.m00 + attachment.y * bone.m01;
		slotContainer.position.y = bone.worldY + attachment.x * bone.m10 + attachment.y * bone.m11;
		slotContainer.scale.x = bone.worldScaleX;
		slotContainer.scale.y = bone.worldScaleY;

		slotContainer.rotation = -(slot.bone.worldRotation * Math.PI / 180);
	}

	PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);
};


PIXI.Spine.prototype.createSprite = function (slot, descriptor) {
	var name = PIXI.TextureCache[descriptor.name] ? descriptor.name : descriptor.name + ".png";
	var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(name));
	sprite.scale = descriptor.scale;
	sprite.rotation = descriptor.rotation;
	sprite.anchor.x = sprite.anchor.y = 0.5;

	slot.sprites = slot.sprites || {};
	slot.sprites[descriptor.name] = sprite;
	return sprite;
};

/*
 * Awesome JS run time provided by EsotericSoftware
 *
 * https://github.com/EsotericSoftware/spine-runtimes
 *
 */

var spine = {};

spine.BoneData = function (name, parent) {
	this.name = name;
	this.parent = parent;
};
spine.BoneData.prototype = {
	length: 0,
	x: 0, y: 0,
	rotation: 0,
	scaleX: 1, scaleY: 1
};

spine.SlotData = function (name, boneData) {
	this.name = name;
	this.boneData = boneData;
};
spine.SlotData.prototype = {
	r: 1, g: 1, b: 1, a: 1,
	attachmentName: null
};

spine.Bone = function (boneData, parent) {
	this.data = boneData;
	this.parent = parent;
	this.setToSetupPose();
};
spine.Bone.yDown = false;
spine.Bone.prototype = {
	x: 0, y: 0,
	rotation: 0,
	scaleX: 1, scaleY: 1,
	m00: 0, m01: 0, worldX: 0, // a b x
	m10: 0, m11: 0, worldY: 0, // c d y
	worldRotation: 0,
	worldScaleX: 1, worldScaleY: 1,
	updateWorldTransform: function (flipX, flipY) {
		var parent = this.parent;
		if (parent != null) {
			this.worldX = this.x * parent.m00 + this.y * parent.m01 + parent.worldX;
			this.worldY = this.x * parent.m10 + this.y * parent.m11 + parent.worldY;
			this.worldScaleX = parent.worldScaleX * this.scaleX;
			this.worldScaleY = parent.worldScaleY * this.scaleY;
			this.worldRotation = parent.worldRotation + this.rotation;
		} else {
			this.worldX = this.x;
			this.worldY = this.y;
			this.worldScaleX = this.scaleX;
			this.worldScaleY = this.scaleY;
			this.worldRotation = this.rotation;
		}
		var radians = this.worldRotation * Math.PI / 180;
		var cos = Math.cos(radians);
		var sin = Math.sin(radians);
		this.m00 = cos * this.worldScaleX;
		this.m10 = sin * this.worldScaleX;
		this.m01 = -sin * this.worldScaleY;
		this.m11 = cos * this.worldScaleY;
		if (flipX) {
			this.m00 = -this.m00;
			this.m01 = -this.m01;
		}
		if (flipY) {
			this.m10 = -this.m10;
			this.m11 = -this.m11;
		}
		if (spine.Bone.yDown) {
			this.m10 = -this.m10;
			this.m11 = -this.m11;
		}
	},
	setToSetupPose: function () {
		var data = this.data;
		this.x = data.x;
		this.y = data.y;
		this.rotation = data.rotation;
		this.scaleX = data.scaleX;
		this.scaleY = data.scaleY;
	}
};

spine.Slot = function (slotData, skeleton, bone) {
	this.data = slotData;
	this.skeleton = skeleton;
	this.bone = bone;
	this.setToSetupPose();
};
spine.Slot.prototype = {
	r: 1, g: 1, b: 1, a: 1,
	_attachmentTime: 0,
	attachment: null,
	setAttachment: function (attachment) {
		this.attachment = attachment;
		this._attachmentTime = this.skeleton.time;
	},
	setAttachmentTime: function (time) {
		this._attachmentTime = this.skeleton.time - time;
	},
	getAttachmentTime: function () {
		return this.skeleton.time - this._attachmentTime;
	},
	setToSetupPose: function () {
		var data = this.data;
		this.r = data.r;
		this.g = data.g;
		this.b = data.b;
		this.a = data.a;

		var slotDatas = this.skeleton.data.slots;
		for (var i = 0, n = slotDatas.length; i < n; i++) {
			if (slotDatas[i] == data) {
				this.setAttachment(!data.attachmentName ? null : this.skeleton.getAttachmentBySlotIndex(i, data.attachmentName));
				break;
			}
		}
	}
};

spine.Skin = function (name) {
	this.name = name;
	this.attachments = {};
};
spine.Skin.prototype = {
	addAttachment: function (slotIndex, name, attachment) {
		this.attachments[slotIndex + ":" + name] = attachment;
	},
	getAttachment: function (slotIndex, name) {
		return this.attachments[slotIndex + ":" + name];
	},
	_attachAll: function (skeleton, oldSkin) {
		for (var key in oldSkin.attachments) {
			var colon = key.indexOf(":");
			var slotIndex = parseInt(key.substring(0, colon));
			var name = key.substring(colon + 1);
			var slot = skeleton.slots[slotIndex];
			if (slot.attachment && slot.attachment.name == name) {
				var attachment = this.getAttachment(slotIndex, name);
				if (attachment) slot.setAttachment(attachment);
			}
		}
	}
};

spine.Animation = function (name, timelines, duration) {
	this.name = name;
	this.timelines = timelines;
	this.duration = duration;
};
spine.Animation.prototype = {
	apply: function (skeleton, time, loop) {
		if (loop && this.duration != 0) time %= this.duration;
		var timelines = this.timelines;
		for (var i = 0, n = timelines.length; i < n; i++)
			timelines[i].apply(skeleton, time, 1);
	},
	mix: function (skeleton, time, loop, alpha) {
		if (loop && this.duration != 0) time %= this.duration;
		var timelines = this.timelines;
		for (var i = 0, n = timelines.length; i < n; i++)
			timelines[i].apply(skeleton, time, alpha);
	}
};

spine.binarySearch = function (values, target, step) {
	var low = 0;
	var high = Math.floor(values.length / step) - 2;
	if (high == 0) return step;
	var current = high >>> 1;
	while (true) {
		if (values[(current + 1) * step] <= target)
			low = current + 1;
		else
			high = current;
		if (low == high) return (low + 1) * step;
		current = (low + high) >>> 1;
	}
};
spine.linearSearch = function (values, target, step) {
	for (var i = 0, last = values.length - step; i <= last; i += step)
		if (values[i] > target) return i;
	return -1;
};

spine.Curves = function (frameCount) {
	this.curves = []; // dfx, dfy, ddfx, ddfy, dddfx, dddfy, ...
	this.curves.length = (frameCount - 1) * 6;
};
spine.Curves.prototype = {
	setLinear: function (frameIndex) {
		this.curves[frameIndex * 6] = 0/*LINEAR*/;
	},
	setStepped: function (frameIndex) {
		this.curves[frameIndex * 6] = -1/*STEPPED*/;
	},
	/** Sets the control handle positions for an interpolation bezier curve used to transition from this keyframe to the next.
	 * cx1 and cx2 are from 0 to 1, representing the percent of time between the two keyframes. cy1 and cy2 are the percent of
	 * the difference between the keyframe's values. */
	setCurve: function (frameIndex, cx1, cy1, cx2, cy2) {
		var subdiv_step = 1 / 10/*BEZIER_SEGMENTS*/;
		var subdiv_step2 = subdiv_step * subdiv_step;
		var subdiv_step3 = subdiv_step2 * subdiv_step;
		var pre1 = 3 * subdiv_step;
		var pre2 = 3 * subdiv_step2;
		var pre4 = 6 * subdiv_step2;
		var pre5 = 6 * subdiv_step3;
		var tmp1x = -cx1 * 2 + cx2;
		var tmp1y = -cy1 * 2 + cy2;
		var tmp2x = (cx1 - cx2) * 3 + 1;
		var tmp2y = (cy1 - cy2) * 3 + 1;
		var i = frameIndex * 6;
		var curves = this.curves;
		curves[i] = cx1 * pre1 + tmp1x * pre2 + tmp2x * subdiv_step3;
		curves[i + 1] = cy1 * pre1 + tmp1y * pre2 + tmp2y * subdiv_step3;
		curves[i + 2] = tmp1x * pre4 + tmp2x * pre5;
		curves[i + 3] = tmp1y * pre4 + tmp2y * pre5;
		curves[i + 4] = tmp2x * pre5;
		curves[i + 5] = tmp2y * pre5;
	},
	getCurvePercent: function (frameIndex, percent) {
		percent = percent < 0 ? 0 : (percent > 1 ? 1 : percent);
		var curveIndex = frameIndex * 6;
		var curves = this.curves;
		var dfx = curves[curveIndex];
		if (!dfx/*LINEAR*/) return percent;
		if (dfx == -1/*STEPPED*/) return 0;
		var dfy = curves[curveIndex + 1];
		var ddfx = curves[curveIndex + 2];
		var ddfy = curves[curveIndex + 3];
		var dddfx = curves[curveIndex + 4];
		var dddfy = curves[curveIndex + 5];
		var x = dfx, y = dfy;
		var i = 10/*BEZIER_SEGMENTS*/ - 2;
		while (true) {
			if (x >= percent) {
				var lastX = x - dfx;
				var lastY = y - dfy;
				return lastY + (y - lastY) * (percent - lastX) / (x - lastX);
			}
			if (i == 0) break;
			i--;
			dfx += ddfx;
			dfy += ddfy;
			ddfx += dddfx;
			ddfy += dddfy;
			x += dfx;
			y += dfy;
		}
		return y + (1 - y) * (percent - x) / (1 - x); // Last point is 1,1.
	}
};

spine.RotateTimeline = function (frameCount) {
	this.curves = new spine.Curves(frameCount);
	this.frames = []; // time, angle, ...
	this.frames.length = frameCount * 2;
};
spine.RotateTimeline.prototype = {
	boneIndex: 0,
	getFrameCount: function () {
		return this.frames.length / 2;
	},
	setFrame: function (frameIndex, time, angle) {
		frameIndex *= 2;
		this.frames[frameIndex] = time;
		this.frames[frameIndex + 1] = angle;
	},
	apply: function (skeleton, time, alpha) {
		var frames = this.frames;
		if (time < frames[0]) return; // Time is before first frame.

		var bone = skeleton.bones[this.boneIndex];

		if (time >= frames[frames.length - 2]) { // Time is after last frame.
			var amount = bone.data.rotation + frames[frames.length - 1] - bone.rotation;
			while (amount > 180)
				amount -= 360;
			while (amount < -180)
				amount += 360;
			bone.rotation += amount * alpha;
			return;
		}

		// Interpolate between the last frame and the current frame.
		var frameIndex = spine.binarySearch(frames, time, 2);
		var lastFrameValue = frames[frameIndex - 1];
		var frameTime = frames[frameIndex];
		var percent = 1 - (time - frameTime) / (frames[frameIndex - 2/*LAST_FRAME_TIME*/] - frameTime);
		percent = this.curves.getCurvePercent(frameIndex / 2 - 1, percent);

		var amount = frames[frameIndex + 1/*FRAME_VALUE*/] - lastFrameValue;
		while (amount > 180)
			amount -= 360;
		while (amount < -180)
			amount += 360;
		amount = bone.data.rotation + (lastFrameValue + amount * percent) - bone.rotation;
		while (amount > 180)
			amount -= 360;
		while (amount < -180)
			amount += 360;
		bone.rotation += amount * alpha;
	}
};

spine.TranslateTimeline = function (frameCount) {
	this.curves = new spine.Curves(frameCount);
	this.frames = []; // time, x, y, ...
	this.frames.length = frameCount * 3;
};
spine.TranslateTimeline.prototype = {
	boneIndex: 0,
	getFrameCount: function () {
		return this.frames.length / 3;
	},
	setFrame: function (frameIndex, time, x, y) {
		frameIndex *= 3;
		this.frames[frameIndex] = time;
		this.frames[frameIndex + 1] = x;
		this.frames[frameIndex + 2] = y;
	},
	apply: function (skeleton, time, alpha) {
		var frames = this.frames;
		if (time < frames[0]) return; // Time is before first frame.

		var bone = skeleton.bones[this.boneIndex];

		if (time >= frames[frames.length - 3]) { // Time is after last frame.
			bone.x += (bone.data.x + frames[frames.length - 2] - bone.x) * alpha;
			bone.y += (bone.data.y + frames[frames.length - 1] - bone.y) * alpha;
			return;
		}

		// Interpolate between the last frame and the current frame.
		var frameIndex = spine.binarySearch(frames, time, 3);
		var lastFrameX = frames[frameIndex - 2];
		var lastFrameY = frames[frameIndex - 1];
		var frameTime = frames[frameIndex];
		var percent = 1 - (time - frameTime) / (frames[frameIndex + -3/*LAST_FRAME_TIME*/] - frameTime);
		percent = this.curves.getCurvePercent(frameIndex / 3 - 1, percent);

		bone.x += (bone.data.x + lastFrameX + (frames[frameIndex + 1/*FRAME_X*/] - lastFrameX) * percent - bone.x) * alpha;
		bone.y += (bone.data.y + lastFrameY + (frames[frameIndex + 2/*FRAME_Y*/] - lastFrameY) * percent - bone.y) * alpha;
	}
};

spine.ScaleTimeline = function (frameCount) {
	this.curves = new spine.Curves(frameCount);
	this.frames = []; // time, x, y, ...
	this.frames.length = frameCount * 3;
};
spine.ScaleTimeline.prototype = {
	boneIndex: 0,
	getFrameCount: function () {
		return this.frames.length / 3;
	},
	setFrame: function (frameIndex, time, x, y) {
		frameIndex *= 3;
		this.frames[frameIndex] = time;
		this.frames[frameIndex + 1] = x;
		this.frames[frameIndex + 2] = y;
	},
	apply: function (skeleton, time, alpha) {
		var frames = this.frames;
		if (time < frames[0]) return; // Time is before first frame.

		var bone = skeleton.bones[this.boneIndex];

		if (time >= frames[frames.length - 3]) { // Time is after last frame.
			bone.scaleX += (bone.data.scaleX - 1 + frames[frames.length - 2] - bone.scaleX) * alpha;
			bone.scaleY += (bone.data.scaleY - 1 + frames[frames.length - 1] - bone.scaleY) * alpha;
			return;
		}

		// Interpolate between the last frame and the current frame.
		var frameIndex = spine.binarySearch(frames, time, 3);
		var lastFrameX = frames[frameIndex - 2];
		var lastFrameY = frames[frameIndex - 1];
		var frameTime = frames[frameIndex];
		var percent = 1 - (time - frameTime) / (frames[frameIndex + -3/*LAST_FRAME_TIME*/] - frameTime);
		percent = this.curves.getCurvePercent(frameIndex / 3 - 1, percent);

		bone.scaleX += (bone.data.scaleX - 1 + lastFrameX + (frames[frameIndex + 1/*FRAME_X*/] - lastFrameX) * percent - bone.scaleX) * alpha;
		bone.scaleY += (bone.data.scaleY - 1 + lastFrameY + (frames[frameIndex + 2/*FRAME_Y*/] - lastFrameY) * percent - bone.scaleY) * alpha;
	}
};

spine.ColorTimeline = function (frameCount) {
	this.curves = new spine.Curves(frameCount);
	this.frames = []; // time, r, g, b, a, ...
	this.frames.length = frameCount * 5;
};
spine.ColorTimeline.prototype = {
	slotIndex: 0,
	getFrameCount: function () {
		return this.frames.length / 2;
	},
	setFrame: function (frameIndex, time, x, y) {
		frameIndex *= 5;
		this.frames[frameIndex] = time;
		this.frames[frameIndex + 1] = r;
		this.frames[frameIndex + 2] = g;
		this.frames[frameIndex + 3] = b;
		this.frames[frameIndex + 4] = a;
	},
	apply: function (skeleton, time, alpha) {
		var frames = this.frames;
		if (time < frames[0]) return; // Time is before first frame.

		var slot = skeleton.slots[this.slotIndex];

		if (time >= frames[frames.length - 5]) { // Time is after last frame.
			var i = frames.length - 1;
			slot.r = frames[i - 3];
			slot.g = frames[i - 2];
			slot.b = frames[i - 1];
			slot.a = frames[i];
			return;
		}

		// Interpolate between the last frame and the current frame.
		var frameIndex = spine.binarySearch(frames, time, 5);
		var lastFrameR = frames[frameIndex - 4];
		var lastFrameG = frames[frameIndex - 3];
		var lastFrameB = frames[frameIndex - 2];
		var lastFrameA = frames[frameIndex - 1];
		var frameTime = frames[frameIndex];
		var percent = 1 - (time - frameTime) / (frames[frameIndex - 5/*LAST_FRAME_TIME*/] - frameTime);
		percent = this.curves.getCurvePercent(frameIndex / 5 - 1, percent);

		var r = lastFrameR + (frames[frameIndex + 1/*FRAME_R*/] - lastFrameR) * percent;
		var g = lastFrameG + (frames[frameIndex + 2/*FRAME_G*/] - lastFrameG) * percent;
		var b = lastFrameB + (frames[frameIndex + 3/*FRAME_B*/] - lastFrameB) * percent;
		var a = lastFrameA + (frames[frameIndex + 4/*FRAME_A*/] - lastFrameA) * percent;
		if (alpha < 1) {
			slot.r += (r - slot.r) * alpha;
			slot.g += (g - slot.g) * alpha;
			slot.b += (b - slot.b) * alpha;
			slot.a += (a - slot.a) * alpha;
		} else {
			slot.r = r;
			slot.g = g;
			slot.b = b;
			slot.a = a;
		}
	}
};

spine.AttachmentTimeline = function (frameCount) {
	this.curves = new spine.Curves(frameCount);
	this.frames = []; // time, ...
	this.frames.length = frameCount;
	this.attachmentNames = []; // time, ...
	this.attachmentNames.length = frameCount;
};
spine.AttachmentTimeline.prototype = {
	slotIndex: 0,
	getFrameCount: function () {
            return this.frames.length;
	},
	setFrame: function (frameIndex, time, attachmentName) {
		this.frames[frameIndex] = time;
		this.attachmentNames[frameIndex] = attachmentName;
	},
	apply: function (skeleton, time, alpha) {
		var frames = this.frames;
		if (time < frames[0]) return; // Time is before first frame.

		var frameIndex;
		if (time >= frames[frames.length - 1]) // Time is after last frame.
			frameIndex = frames.length - 1;
		else
			frameIndex = spine.binarySearch(frames, time, 1) - 1;

		var attachmentName = this.attachmentNames[frameIndex];
		skeleton.slots[this.slotIndex].setAttachment(!attachmentName ? null : skeleton.getAttachmentBySlotIndex(this.slotIndex, attachmentName));
	}
};

spine.SkeletonData = function () {
	this.bones = [];
	this.slots = [];
	this.skins = [];
	this.animations = [];
};
spine.SkeletonData.prototype = {
	defaultSkin: null,
	/** @return May be null. */
	findBone: function (boneName) {
		var bones = this.bones;
		for (var i = 0, n = bones.length; i < n; i++)
			if (bones[i].name == boneName) return bones[i];
		return null;
	},
	/** @return -1 if the bone was not found. */
	findBoneIndex: function (boneName) {
		var bones = this.bones;
		for (var i = 0, n = bones.length; i < n; i++)
			if (bones[i].name == boneName) return i;
		return -1;
	},
	/** @return May be null. */
	findSlot: function (slotName) {
		var slots = this.slots;
		for (var i = 0, n = slots.length; i < n; i++) {
			if (slots[i].name == slotName) return slot[i];
		}
		return null;
	},
	/** @return -1 if the bone was not found. */
	findSlotIndex: function (slotName) {
		var slots = this.slots;
		for (var i = 0, n = slots.length; i < n; i++)
			if (slots[i].name == slotName) return i;
		return -1;
	},
	/** @return May be null. */
	findSkin: function (skinName) {
		var skins = this.skins;
		for (var i = 0, n = skins.length; i < n; i++)
			if (skins[i].name == skinName) return skins[i];
		return null;
	},
	/** @return May be null. */
	findAnimation: function (animationName) {
		var animations = this.animations;
		for (var i = 0, n = animations.length; i < n; i++)
			if (animations[i].name == animationName) return animations[i];
		return null;
	}
};

spine.Skeleton = function (skeletonData) {
	this.data = skeletonData;

	this.bones = [];
	for (var i = 0, n = skeletonData.bones.length; i < n; i++) {
		var boneData = skeletonData.bones[i];
		var parent = !boneData.parent ? null : this.bones[skeletonData.bones.indexOf(boneData.parent)];
		this.bones.push(new spine.Bone(boneData, parent));
	}

	this.slots = [];
	this.drawOrder = [];
	for (var i = 0, n = skeletonData.slots.length; i < n; i++) {
		var slotData = skeletonData.slots[i];
		var bone = this.bones[skeletonData.bones.indexOf(slotData.boneData)];
		var slot = new spine.Slot(slotData, this, bone);
		this.slots.push(slot);
		this.drawOrder.push(slot);
	}
};
spine.Skeleton.prototype = {
	x: 0, y: 0,
	skin: null,
	r: 1, g: 1, b: 1, a: 1,
	time: 0,
	flipX: false, flipY: false,
	/** Updates the world transform for each bone. */
	updateWorldTransform: function () {
		var flipX = this.flipX;
		var flipY = this.flipY;
		var bones = this.bones;
		for (var i = 0, n = bones.length; i < n; i++)
			bones[i].updateWorldTransform(flipX, flipY);
	},
	/** Sets the bones and slots to their setup pose values. */
	setToSetupPose: function () {
		this.setBonesToSetupPose();
		this.setSlotsToSetupPose();
	},
	setBonesToSetupPose: function () {
		var bones = this.bones;
		for (var i = 0, n = bones.length; i < n; i++)
			bones[i].setToSetupPose();
	},
	setSlotsToSetupPose: function () {
		var slots = this.slots;
		for (var i = 0, n = slots.length; i < n; i++)
			slots[i].setToSetupPose(i);
	},
	/** @return May return null. */
	getRootBone: function () {
		return this.bones.length == 0 ? null : this.bones[0];
	},
	/** @return May be null. */
	findBone: function (boneName) {
		var bones = this.bones;
		for (var i = 0, n = bones.length; i < n; i++)
			if (bones[i].data.name == boneName) return bones[i];
		return null;
	},
	/** @return -1 if the bone was not found. */
	findBoneIndex: function (boneName) {
		var bones = this.bones;
		for (var i = 0, n = bones.length; i < n; i++)
			if (bones[i].data.name == boneName) return i;
		return -1;
	},
	/** @return May be null. */
	findSlot: function (slotName) {
		var slots = this.slots;
		for (var i = 0, n = slots.length; i < n; i++)
			if (slots[i].data.name == slotName) return slots[i];
		return null;
	},
	/** @return -1 if the bone was not found. */
	findSlotIndex: function (slotName) {
		var slots = this.slots;
		for (var i = 0, n = slots.length; i < n; i++)
			if (slots[i].data.name == slotName) return i;
		return -1;
	},
	setSkinByName: function (skinName) {
		var skin = this.data.findSkin(skinName);
		if (!skin) throw "Skin not found: " + skinName;
		this.setSkin(skin);
	},
	/** Sets the skin used to look up attachments not found in the {@link SkeletonData#getDefaultSkin() default skin}. Attachments
	 * from the new skin are attached if the corresponding attachment from the old skin was attached.
	 * @param newSkin May be null. */
	setSkin: function (newSkin) {
		if (this.skin && newSkin) newSkin._attachAll(this, this.skin);
		this.skin = newSkin;
	},
	/** @return May be null. */
	getAttachmentBySlotName: function (slotName, attachmentName) {
		return this.getAttachmentBySlotIndex(this.data.findSlotIndex(slotName), attachmentName);
	},
	/** @return May be null. */
	getAttachmentBySlotIndex: function (slotIndex, attachmentName) {
		if (this.skin) {
			var attachment = this.skin.getAttachment(slotIndex, attachmentName);
			if (attachment) return attachment;
		}
		if (this.data.defaultSkin) return this.data.defaultSkin.getAttachment(slotIndex, attachmentName);
		return null;
	},
	/** @param attachmentName May be null. */
	setAttachment: function (slotName, attachmentName) {
		var slots = this.slots;
		for (var i = 0, n = slots.size; i < n; i++) {
			var slot = slots[i];
			if (slot.data.name == slotName) {
				var attachment = null;
				if (attachmentName) {
					attachment = this.getAttachment(i, attachmentName);
					if (attachment == null) throw "Attachment not found: " + attachmentName + ", for slot: " + slotName;
				}
				slot.setAttachment(attachment);
				return;
			}
		}
		throw "Slot not found: " + slotName;
	},
	update: function (delta) {
		time += delta;
	}
};

spine.AttachmentType = {
	region: 0
};

spine.RegionAttachment = function () {
	this.offset = [];
	this.offset.length = 8;
	this.uvs = [];
	this.uvs.length = 8;
};
spine.RegionAttachment.prototype = {
	x: 0, y: 0,
	rotation: 0,
	scaleX: 1, scaleY: 1,
	width: 0, height: 0,
	rendererObject: null,
	regionOffsetX: 0, regionOffsetY: 0,
	regionWidth: 0, regionHeight: 0,
	regionOriginalWidth: 0, regionOriginalHeight: 0,
	setUVs: function (u, v, u2, v2, rotate) {
		var uvs = this.uvs;
		if (rotate) {
			uvs[2/*X2*/] = u;
			uvs[3/*Y2*/] = v2;
			uvs[4/*X3*/] = u;
			uvs[5/*Y3*/] = v;
			uvs[6/*X4*/] = u2;
			uvs[7/*Y4*/] = v;
			uvs[0/*X1*/] = u2;
			uvs[1/*Y1*/] = v2;
		} else {
			uvs[0/*X1*/] = u;
			uvs[1/*Y1*/] = v2;
			uvs[2/*X2*/] = u;
			uvs[3/*Y2*/] = v;
			uvs[4/*X3*/] = u2;
			uvs[5/*Y3*/] = v;
			uvs[6/*X4*/] = u2;
			uvs[7/*Y4*/] = v2;
		}
	},
	updateOffset: function () {
		var regionScaleX = this.width / this.regionOriginalWidth * this.scaleX;
		var regionScaleY = this.height / this.regionOriginalHeight * this.scaleY;
		var localX = -this.width / 2 * this.scaleX + this.regionOffsetX * regionScaleX;
		var localY = -this.height / 2 * this.scaleY + this.regionOffsetY * regionScaleY;
		var localX2 = localX + this.regionWidth * regionScaleX;
		var localY2 = localY + this.regionHeight * regionScaleY;
		var radians = this.rotation * Math.PI / 180;
		var cos = Math.cos(radians);
		var sin = Math.sin(radians);
		var localXCos = localX * cos + this.x;
		var localXSin = localX * sin;
		var localYCos = localY * cos + this.y;
		var localYSin = localY * sin;
		var localX2Cos = localX2 * cos + this.x;
		var localX2Sin = localX2 * sin;
		var localY2Cos = localY2 * cos + this.y;
		var localY2Sin = localY2 * sin;
		var offset = this.offset;
		offset[0/*X1*/] = localXCos - localYSin;
		offset[1/*Y1*/] = localYCos + localXSin;
		offset[2/*X2*/] = localXCos - localY2Sin;
		offset[3/*Y2*/] = localY2Cos + localXSin;
		offset[4/*X3*/] = localX2Cos - localY2Sin;
		offset[5/*Y3*/] = localY2Cos + localX2Sin;
		offset[6/*X4*/] = localX2Cos - localYSin;
		offset[7/*Y4*/] = localYCos + localX2Sin;
	},
	computeVertices: function (x, y, bone, vertices) {
		x += bone.worldX;
		y += bone.worldY;
		var m00 = bone.m00;
		var m01 = bone.m01;
		var m10 = bone.m10;
		var m11 = bone.m11;
		var offset = this.offset;
		vertices[0/*X1*/] = offset[0/*X1*/] * m00 + offset[1/*Y1*/] * m01 + x;
		vertices[1/*Y1*/] = offset[0/*X1*/] * m10 + offset[1/*Y1*/] * m11 + y;
		vertices[2/*X2*/] = offset[2/*X2*/] * m00 + offset[3/*Y2*/] * m01 + x;
		vertices[3/*Y2*/] = offset[2/*X2*/] * m10 + offset[3/*Y2*/] * m11 + y;
		vertices[4/*X3*/] = offset[4/*X3*/] * m00 + offset[5/*X3*/] * m01 + x;
		vertices[5/*X3*/] = offset[4/*X3*/] * m10 + offset[5/*X3*/] * m11 + y;
		vertices[6/*X4*/] = offset[6/*X4*/] * m00 + offset[7/*Y4*/] * m01 + x;
		vertices[7/*Y4*/] = offset[6/*X4*/] * m10 + offset[7/*Y4*/] * m11 + y;
	}
}

spine.AnimationStateData = function (skeletonData) {
	this.skeletonData = skeletonData;
	this.animationToMixTime = {};
};
spine.AnimationStateData.prototype = {
        defaultMix: 0,
	setMixByName: function (fromName, toName, duration) {
		var from = this.skeletonData.findAnimation(fromName);
		if (!from) throw "Animation not found: " + fromName;
		var to = this.skeletonData.findAnimation(toName);
		if (!to) throw "Animation not found: " + toName;
		this.setMix(from, to, duration);
	},
	setMix: function (from, to, duration) {
		this.animationToMixTime[from.name + ":" + to.name] = duration;
	},
	getMix: function (from, to) {
		var time = this.animationToMixTime[from.name + ":" + to.name];
            return time ? time : this.defaultMix;
	}
};

spine.AnimationState = function (stateData) {
	this.data = stateData;
	this.queue = [];
};
spine.AnimationState.prototype = {
	current: null,
	previous: null,
	currentTime: 0,
	previousTime: 0,
	currentLoop: false,
	previousLoop: false,
	mixTime: 0,
	mixDuration: 0,
	update: function (delta) {
		this.currentTime += delta;
		this.previousTime += delta;
		this.mixTime += delta;

		if (this.queue.length > 0) {
			var entry = this.queue[0];
			if (this.currentTime >= entry.delay) {
				this._setAnimation(entry.animation, entry.loop);
				this.queue.shift();
			}
		}
	},
	apply: function (skeleton) {
		if (!this.current) return;
		if (this.previous) {
			this.previous.apply(skeleton, this.previousTime, this.previousLoop);
			var alpha = this.mixTime / this.mixDuration;
			if (alpha >= 1) {
				alpha = 1;
				this.previous = null;
			}
			this.current.mix(skeleton, this.currentTime, this.currentLoop, alpha);
		} else
			this.current.apply(skeleton, this.currentTime, this.currentLoop);
	},
	clearAnimation: function () {
		this.previous = null;
		this.current = null;
		this.queue.length = 0;
	},
	_setAnimation: function (animation, loop) {
		this.previous = null;
		if (animation && this.current) {
			this.mixDuration = this.data.getMix(this.current, animation);
			if (this.mixDuration > 0) {
				this.mixTime = 0;
				this.previous = this.current;
				this.previousTime = this.currentTime;
				this.previousLoop = this.currentLoop;
			}
		}
		this.current = animation;
		this.currentLoop = loop;
		this.currentTime = 0;
	},
	/** @see #setAnimation(Animation, Boolean) */
	setAnimationByName: function (animationName, loop) {
		var animation = this.data.skeletonData.findAnimation(animationName);
		if (!animation) throw "Animation not found: " + animationName;
		this.setAnimation(animation, loop);
	},
	/** Set the current animation. Any queued animations are cleared and the current animation time is set to 0.
	 * @param animation May be null. */
	setAnimation: function (animation, loop) {
		this.queue.length = 0;
		this._setAnimation(animation, loop);
	},
	/** @see #addAnimation(Animation, Boolean, Number) */
	addAnimationByName: function (animationName, loop, delay) {
		var animation = this.data.skeletonData.findAnimation(animationName);
		if (!animation) throw "Animation not found: " + animationName;
		this.addAnimation(animation, loop, delay);
	},
	/** Adds an animation to be played delay seconds after the current or last queued animation.
	 * @param delay May be <= 0 to use duration of previous animation minus any mix duration plus the negative delay. */
	addAnimation: function (animation, loop, delay) {
		var entry = {};
		entry.animation = animation;
		entry.loop = loop;

		if (!delay || delay <= 0) {
			var previousAnimation = this.queue.length == 0 ? this.current : this.queue[this.queue.length - 1].animation;
			if (previousAnimation != null)
				delay = previousAnimation.duration - this.data.getMix(previousAnimation, animation) + (delay || 0);
			else
				delay = 0;
		}
		entry.delay = delay;

		this.queue.push(entry);
	},
	/** Returns true if no animation is set or if the current time is greater than the animation duration, regardless of looping. */
	isComplete: function () {
		return !this.current || this.currentTime >= this.current.duration;
	}
};

spine.SkeletonJson = function (attachmentLoader) {
	this.attachmentLoader = attachmentLoader;
};
spine.SkeletonJson.prototype = {
	scale: 1,
	readSkeletonData: function (root) {
		var skeletonData = new spine.SkeletonData();

		// Bones.
		var bones = root["bones"];
		for (var i = 0, n = bones.length; i < n; i++) {
			var boneMap = bones[i];
			var parent = null;
			if (boneMap["parent"]) {
				parent = skeletonData.findBone(boneMap["parent"]);
				if (!parent) throw "Parent bone not found: " + boneMap["parent"];
			}
			var boneData = new spine.BoneData(boneMap["name"], parent);
			boneData.length = (boneMap["length"] || 0) * this.scale;
			boneData.x = (boneMap["x"] || 0) * this.scale;
			boneData.y = (boneMap["y"] || 0) * this.scale;
			boneData.rotation = (boneMap["rotation"] || 0);
			boneData.scaleX = boneMap["scaleX"] || 1;
			boneData.scaleY = boneMap["scaleY"] || 1;
			skeletonData.bones.push(boneData);
		}

		// Slots.
		var slots = root["slots"];
		for (var i = 0, n = slots.length; i < n; i++) {
			var slotMap = slots[i];
			var boneData = skeletonData.findBone(slotMap["bone"]);
			if (!boneData) throw "Slot bone not found: " + slotMap["bone"];
			var slotData = new spine.SlotData(slotMap["name"], boneData);

			var color = slotMap["color"];
			if (color) {
				slotData.r = spine.SkeletonJson.toColor(color, 0);
				slotData.g = spine.SkeletonJson.toColor(color, 1);
				slotData.b = spine.SkeletonJson.toColor(color, 2);
				slotData.a = spine.SkeletonJson.toColor(color, 3);
			}

			slotData.attachmentName = slotMap["attachment"];

			skeletonData.slots.push(slotData);
		}

		// Skins.
		var skins = root["skins"];
		for (var skinName in skins) {
			if (!skins.hasOwnProperty(skinName)) continue;
			var skinMap = skins[skinName];
			var skin = new spine.Skin(skinName);
			for (var slotName in skinMap) {
				if (!skinMap.hasOwnProperty(slotName)) continue;
				var slotIndex = skeletonData.findSlotIndex(slotName);
				var slotEntry = skinMap[slotName];
				for (var attachmentName in slotEntry) {
					if (!slotEntry.hasOwnProperty(attachmentName)) continue;
					var attachment = this.readAttachment(skin, attachmentName, slotEntry[attachmentName]);
					if (attachment != null) skin.addAttachment(slotIndex, attachmentName, attachment);
				}
			}
			skeletonData.skins.push(skin);
			if (skin.name == "default") skeletonData.defaultSkin = skin;
		}

		// Animations.
		var animations = root["animations"];
		for (var animationName in animations) {
			if (!animations.hasOwnProperty(animationName)) continue;
			this.readAnimation(animationName, animations[animationName], skeletonData);
		}

		return skeletonData;
	},
	readAttachment: function (skin, name, map) {
		name = map["name"] || name;

		var type = spine.AttachmentType[map["type"] || "region"];

		if (type == spine.AttachmentType.region) {
			var attachment = new spine.RegionAttachment();
			attachment.x = (map["x"] || 0) * this.scale;
			attachment.y = (map["y"] || 0) * this.scale;
			attachment.scaleX = map["scaleX"] || 1;
			attachment.scaleY = map["scaleY"] || 1;
			attachment.rotation = map["rotation"] || 0;
			attachment.width = (map["width"] || 32) * this.scale;
			attachment.height = (map["height"] || 32) * this.scale;
			attachment.updateOffset();

			attachment.rendererObject = {};
			attachment.rendererObject.name = name;
			attachment.rendererObject.scale = {};
			attachment.rendererObject.scale.x = attachment.scaleX;
			attachment.rendererObject.scale.y = attachment.scaleY;
			attachment.rendererObject.rotation = -attachment.rotation * Math.PI / 180;
			return attachment;
		}

            throw "Unknown attachment type: " + type;
	},

	readAnimation: function (name, map, skeletonData) {
		var timelines = [];
		var duration = 0;

		var bones = map["bones"];
		for (var boneName in bones) {
			if (!bones.hasOwnProperty(boneName)) continue;
			var boneIndex = skeletonData.findBoneIndex(boneName);
			if (boneIndex == -1) throw "Bone not found: " + boneName;
			var boneMap = bones[boneName];

			for (var timelineName in boneMap) {
				if (!boneMap.hasOwnProperty(timelineName)) continue;
				var values = boneMap[timelineName];
				if (timelineName == "rotate") {
					var timeline = new spine.RotateTimeline(values.length);
					timeline.boneIndex = boneIndex;

					var frameIndex = 0;
					for (var i = 0, n = values.length; i < n; i++) {
						var valueMap = values[i];
						timeline.setFrame(frameIndex, valueMap["time"], valueMap["angle"]);
						spine.SkeletonJson.readCurve(timeline, frameIndex, valueMap);
						frameIndex++;
					}
					timelines.push(timeline);
					duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 2 - 2]);

				} else if (timelineName == "translate" || timelineName == "scale") {
					var timeline;
					var timelineScale = 1;
					if (timelineName == "scale")
						timeline = new spine.ScaleTimeline(values.length);
					else {
						timeline = new spine.TranslateTimeline(values.length);
						timelineScale = this.scale;
					}
					timeline.boneIndex = boneIndex;

					var frameIndex = 0;
					for (var i = 0, n = values.length; i < n; i++) {
						var valueMap = values[i];
						var x = (valueMap["x"] || 0) * timelineScale;
						var y = (valueMap["y"] || 0) * timelineScale;
						timeline.setFrame(frameIndex, valueMap["time"], x, y);
						spine.SkeletonJson.readCurve(timeline, frameIndex, valueMap);
						frameIndex++;
					}
					timelines.push(timeline);
					duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 3 - 3]);

				} else
					throw "Invalid timeline type for a bone: " + timelineName + " (" + boneName + ")";
			}
		}
		var slots = map["slots"];
		for (var slotName in slots) {
			if (!slots.hasOwnProperty(slotName)) continue;
			var slotMap = slots[slotName];
			var slotIndex = skeletonData.findSlotIndex(slotName);

			for (var timelineName in slotMap) {
				if (!slotMap.hasOwnProperty(timelineName)) continue;
				var values = slotMap[timelineName];
				if (timelineName == "color") {
					var timeline = new spine.ColorTimeline(values.length);
					timeline.slotIndex = slotIndex;

					var frameIndex = 0;
					for (var i = 0, n = values.length; i < n; i++) {
						var valueMap = values[i];
						var color = valueMap["color"];
						var r = spine.SkeletonJson.toColor(color, 0);
						var g = spine.SkeletonJson.toColor(color, 1);
						var b = spine.SkeletonJson.toColor(color, 2);
						var a = spine.SkeletonJson.toColor(color, 3);
						timeline.setFrame(frameIndex, valueMap["time"], r, g, b, a);
						spine.SkeletonJson.readCurve(timeline, frameIndex, valueMap);
						frameIndex++;
					}
					timelines.push(timeline);
					duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 5 - 5]);

				} else if (timelineName == "attachment") {
					var timeline = new spine.AttachmentTimeline(values.length);
					timeline.slotIndex = slotIndex;

					var frameIndex = 0;
					for (var i = 0, n = values.length; i < n; i++) {
						var valueMap = values[i];
						timeline.setFrame(frameIndex++, valueMap["time"], valueMap["name"]);
					}
					timelines.push(timeline);
                        duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);

				} else
					throw "Invalid timeline type for a slot: " + timelineName + " (" + slotName + ")";
			}
		}
		skeletonData.animations.push(new spine.Animation(name, timelines, duration));
	}
};
spine.SkeletonJson.readCurve = function (timeline, frameIndex, valueMap) {
	var curve = valueMap["curve"];
	if (!curve) return;
	if (curve == "stepped")
		timeline.curves.setStepped(frameIndex);
	else if (curve instanceof Array)
		timeline.curves.setCurve(frameIndex, curve[0], curve[1], curve[2], curve[3]);
};
spine.SkeletonJson.toColor = function (hexString, colorIndex) {
	if (hexString.length != 8) throw "Color hexidecimal length must be 8, recieved: " + hexString;
	return parseInt(hexString.substring(colorIndex * 2, 2), 16) / 255;
};

spine.Atlas = function (atlasText, textureLoader) {
	this.textureLoader = textureLoader;
	this.pages = [];
	this.regions = [];

	var reader = new spine.AtlasReader(atlasText);
	var tuple = [];
	tuple.length = 4;
	var page = null;
	while (true) {
		var line = reader.readLine();
		if (line == null) break;
		line = reader.trim(line);
		if (line.length == 0)
			page = null;
		else if (!page) {
			page = new spine.AtlasPage();
			page.name = line;

			page.format = spine.Atlas.Format[reader.readValue()];

			reader.readTuple(tuple);
			page.minFilter = spine.Atlas.TextureFilter[tuple[0]];
			page.magFilter = spine.Atlas.TextureFilter[tuple[1]];

			var direction = reader.readValue();
			page.uWrap = spine.Atlas.TextureWrap.clampToEdge;
			page.vWrap = spine.Atlas.TextureWrap.clampToEdge;
			if (direction == "x")
				page.uWrap = spine.Atlas.TextureWrap.repeat;
			else if (direction == "y")
				page.vWrap = spine.Atlas.TextureWrap.repeat;
			else if (direction == "xy")
				page.uWrap = page.vWrap = spine.Atlas.TextureWrap.repeat;

			textureLoader.load(page, line);

			this.pages.push(page);

		} else {
			var region = new spine.AtlasRegion();
			region.name = line;
			region.page = page;

			region.rotate = reader.readValue() == "true";

			reader.readTuple(tuple);
			var x = parseInt(tuple[0]);
			var y = parseInt(tuple[1]);

			reader.readTuple(tuple);
			var width = parseInt(tuple[0]);
			var height = parseInt(tuple[1]);

			region.u = x / page.width;
			region.v = y / page.height;
			if (region.rotate) {
				region.u2 = (x + height) / page.width;
				region.v2 = (y + width) / page.height;
			} else {
				region.u2 = (x + width) / page.width;
				region.v2 = (y + height) / page.height;
			}
			region.x = x;
			region.y = y;
			region.width = Math.abs(width);
			region.height = Math.abs(height);

			if (reader.readTuple(tuple) == 4) { // split is optional
				region.splits = [parseInt(tuple[0]), parseInt(tuple[1]), parseInt(tuple[2]), parseInt(tuple[3])];

				if (reader.readTuple(tuple) == 4) { // pad is optional, but only present with splits
					region.pads = [parseInt(tuple[0]), parseInt(tuple[1]), parseInt(tuple[2]), parseInt(tuple[3])];

					reader.readTuple(tuple);
				}
			}

			region.originalWidth = parseInt(tuple[0]);
			region.originalHeight = parseInt(tuple[1]);

			reader.readTuple(tuple);
			region.offsetX = parseInt(tuple[0]);
			region.offsetY = parseInt(tuple[1]);

			region.index = parseInt(reader.readValue());

			this.regions.push(region);
		}
	}
};
spine.Atlas.prototype = {
	findRegion: function (name) {
		var regions = this.regions;
		for (var i = 0, n = regions.length; i < n; i++)
			if (regions[i].name == name) return regions[i];
		return null;
	},
	dispose: function () {
		var pages = this.pages;
		for (var i = 0, n = pages.length; i < n; i++)
			this.textureLoader.unload(pages[i].rendererObject);
	},
	updateUVs: function (page) {
		var regions = this.regions;
		for (var i = 0, n = regions.length; i < n; i++) {
			var region = regions[i];
			if (region.page != page) continue;
			region.u = region.x / page.width;
			region.v = region.y / page.height;
			if (region.rotate) {
				region.u2 = (region.x + region.height) / page.width;
				region.v2 = (region.y + region.width) / page.height;
			} else {
				region.u2 = (region.x + region.width) / page.width;
				region.v2 = (region.y + region.height) / page.height;
			}
		}
	}
};

spine.Atlas.Format = {
	alpha: 0,
	intensity: 1,
	luminanceAlpha: 2,
	rgb565: 3,
	rgba4444: 4,
	rgb888: 5,
	rgba8888: 6
};

spine.Atlas.TextureFilter = {
	nearest: 0,
	linear: 1,
	mipMap: 2,
	mipMapNearestNearest: 3,
	mipMapLinearNearest: 4,
	mipMapNearestLinear: 5,
	mipMapLinearLinear: 6
};

spine.Atlas.TextureWrap = {
	mirroredRepeat: 0,
	clampToEdge: 1,
	repeat: 2
};

spine.AtlasPage = function () {};
spine.AtlasPage.prototype = {
	name: null,
	format: null,
	minFilter: null,
	magFilter: null,
	uWrap: null,
	vWrap: null,
	rendererObject: null,
	width: 0,
	height: 0
};

spine.AtlasRegion = function () {};
spine.AtlasRegion.prototype = {
	page: null,
	name: null,
	x: 0, y: 0,
	width: 0, height: 0,
	u: 0, v: 0, u2: 0, v2: 0,
	offsetX: 0, offsetY: 0,
	originalWidth: 0, originalHeight: 0,
	index: 0,
	rotate: false,
	splits: null,
	pads: null,
};

spine.AtlasReader = function (text) {
	this.lines = text.split(/\r\n|\r|\n/);
};
spine.AtlasReader.prototype = {
	index: 0,
	trim: function (value) {
		return value.replace(/^\s+|\s+$/g, "");
	},
	readLine: function () {
		if (this.index >= this.lines.length) return null;
		return this.lines[this.index++];
	},
	readValue: function () {
		var line = this.readLine();
		var colon = line.indexOf(":");
		if (colon == -1) throw "Invalid line: " + line;
		return this.trim(line.substring(colon + 1));
	},
	/** Returns the number of tuple values read (2 or 4). */
	readTuple: function (tuple) {
		var line = this.readLine();
		var colon = line.indexOf(":");
		if (colon == -1) throw "Invalid line: " + line;
		var i = 0, lastMatch= colon + 1;
		for (; i < 3; i++) {
			var comma = line.indexOf(",", lastMatch);
			if (comma == -1) {
				if (i == 0) throw "Invalid line: " + line;
				break;
			}
			tuple[i] = this.trim(line.substr(lastMatch, comma - lastMatch));
			lastMatch = comma + 1;
		}
		tuple[i] = this.trim(line.substring(lastMatch));
		return i + 1;
	}
}

spine.AtlasAttachmentLoader = function (atlas) {
	this.atlas = atlas;
}
spine.AtlasAttachmentLoader.prototype = {
	newAttachment: function (skin, type, name) {
		switch (type) {
		case spine.AttachmentType.region:
			var region = this.atlas.findRegion(name);
			if (!region) throw "Region not found in atlas: " + name + " (" + type + ")";
			var attachment = new spine.RegionAttachment(name);
			attachment.rendererObject = region;
			attachment.setUVs(region.u, region.v, region.u2, region.v2, region.rotate);
			attachment.regionOffsetX = region.offsetX;
			attachment.regionOffsetY = region.offsetY;
			attachment.regionWidth = region.width;
			attachment.regionHeight = region.height;
			attachment.regionOriginalWidth = region.originalWidth;
			attachment.regionOriginalHeight = region.originalHeight;
			return attachment;
		}
		throw "Unknown attachment type: " + type;
	}
}

PIXI.AnimCache = {};
spine.Bone.yDown = true;

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


/**
 * This object is one that will allow you to specify custom rendering functions based on render type
 *
 * @class CustomRenderable
 * @extends DisplayObject
 * @constructor
 */
PIXI.CustomRenderable = function()
{
	PIXI.DisplayObject.call( this );

}

// constructor
PIXI.CustomRenderable.prototype = Object.create( PIXI.DisplayObject.prototype );
PIXI.CustomRenderable.prototype.constructor = PIXI.CustomRenderable;

/**
 * If this object is being rendered by a CanvasRenderer it will call this callback
 *
 * @method renderCanvas
 * @param renderer {CanvasRenderer} The renderer instance
 */
PIXI.CustomRenderable.prototype.renderCanvas = function(renderer)
{
	// override!
}

/**
 * If this object is being rendered by a WebGLRenderer it will call this callback to initialize
 *
 * @method initWebGL
 * @param renderer {WebGLRenderer} The renderer instance
 */
PIXI.CustomRenderable.prototype.initWebGL = function(renderer)
{
	// override!
}

/**
 * If this object is being rendered by a WebGLRenderer it will call this callback
 *
 * @method renderWebGL
 * @param renderer {WebGLRenderer} The renderer instance
 */
PIXI.CustomRenderable.prototype.renderWebGL = function(renderGroup, projectionMatrix)
{
	// not sure if both needed? but ya have for now!
	// override!
}


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.BaseTextureCache = {};
PIXI.texturesToUpdate = [];
PIXI.texturesToDestroy = [];

/**
 * A texture stores the information that represents an image. All textures have a base texture
 *
 * @class BaseTexture
 * @uses EventTarget
 * @constructor
 * @param source {String} the source object (image or canvas)
 */
PIXI.BaseTexture = function(source)
{
	PIXI.EventTarget.call( this );

	/**
	 * [read-only] The width of the base texture set when the image has loaded
	 *
	 * @property width
	 * @type Number
	 * @readOnly
	 */
	this.width = 100;

	/**
	 * [read-only] The height of the base texture set when the image has loaded
	 *
	 * @property height
	 * @type Number
	 * @readOnly
	 */
	this.height = 100;

	/**
	 * [read-only] Describes if the base texture has loaded or not
	 *
	 * @property hasLoaded
	 * @type Boolean
	 * @readOnly
	 */
	this.hasLoaded = false;

	/**
	 * The source that is loaded to create the texture
	 *
	 * @property source
	 * @type Image
	 */
	this.source = new Image();


	if(!source)return;

	var request,
		scope = this;

	function imageFromArrayBuffer (imageArrayBuffer) {
		var blob = new Blob([imageArrayBuffer]),
			imageURI = window.URL.createObjectURL(blob);

		scope.source.onload = function () {

			scope.hasLoaded = true;
			scope.width = scope.source.width;
			scope.height = scope.source.height;

			// add it to somewhere...
			PIXI.texturesToUpdate.push(scope);
			scope.dispatchEvent( { type: 'loaded', content: scope } );
		}

		scope.source.src = imageURI;
	}

	if (!!window.openDatabase || !!window.indexedDB || !!window.webkitIndexedDB || !!window.mozIndexedDB || !!window.oIndexedDB || !!window.msIndexedDB) {
		localforage.getItem(source, function(imageArrayBuffer) {

			if (imageArrayBuffer) {
				console.log(source + ' was loaded from cache.');
				imageFromArrayBuffer(imageArrayBuffer);

			} else {
				console.log(source + ' was requested from network.');
				request = new XMLHttpRequest();
				request.open('GET', source, true);
				request.responseType = 'arraybuffer';

				request.addEventListener('readystatechange', function() {
					if (request.readyState == 4) { // readyState DONE
						localforage.setItem(source, request.response, function(imageArrayBuffer) {
							imageFromArrayBuffer(imageArrayBuffer);
						})
					}
				});

				request.send(null);
			}
		});

	} else {
		console.log('No cache optimizations for ' + source);
		scope.source.onload = function () {

			scope.hasLoaded = true;
			scope.width = scope.source.width;
			scope.height = scope.source.height;

			// add it to somewhere...
			PIXI.texturesToUpdate.push(scope);
			scope.dispatchEvent( { type: 'loaded', content: scope } );
		}

		scope.source.src = source;
	}

/*
	if(this.source instanceof Image || this.source instanceof HTMLImageElement)
	{
		if(this.source.complete)
		{
			this.hasLoaded = true;
			this.width = this.source.width;
			this.height = this.source.height;

			PIXI.texturesToUpdate.push(this);
		}
		else
		{

			var scope = this;
			this.source.onload = function(){

				scope.hasLoaded = true;
				scope.width = scope.source.width;
				scope.height = scope.source.height;

				// add it to somewhere...
				PIXI.texturesToUpdate.push(scope);
				scope.dispatchEvent( { type: 'loaded', content: scope } );
			}
			//	this.image.src = imageUrl;
		}
	}
	else
	{
		this.hasLoaded = true;
		this.width = this.source.width;
		this.height = this.source.height;

		PIXI.texturesToUpdate.push(this);
	}
*/

	this._powerOf2 = false;
}

PIXI.BaseTexture.prototype.constructor = PIXI.BaseTexture;

/**
 * Destroys this base texture
 *
 * @method destroy
 */
PIXI.BaseTexture.prototype.destroy = function()
{
	if(this.source instanceof Image)
	{
		this.source.src = null;
	}
	this.source = null;
	PIXI.texturesToDestroy.push(this);
}

/**
 * Helper function that returns a base texture based on an image url
 * If the image is not in the base texture cache it will be  created and loaded
 *
 * @static
 * @method fromImage
 * @param imageUrl {String} The image url of the texture
 * @return BaseTexture
 */
PIXI.BaseTexture.fromImage = function(imageUrl, crossorigin)
{
	var baseTexture = PIXI.BaseTextureCache[imageUrl];
	if(!baseTexture)
	{
		// new Image() breaks tex loading in some versions of Chrome.
		// See https://code.google.com/p/chromium/issues/detail?id=238071

/*
		var image = new Image();//document.createElement('img');
		if (crossorigin)
		{
			image.crossOrigin = '';
		}
		image.src = imageUrl;
*/

		baseTexture = new PIXI.BaseTexture(imageUrl); //image
		PIXI.BaseTextureCache[imageUrl] = baseTexture;
	}

	return baseTexture;
}

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.TextureCache = {};
PIXI.FrameCache = {};

/**
 * A texture stores the information that represents an image or part of an image. It cannot be added
 * to the display list directly. To do this use PIXI.Sprite. If no frame is provided then the whole image is used
 *
 * @class Texture
 * @uses EventTarget
 * @constructor
 * @param baseTexture {BaseTexture} The base texture source to create the texture from
 * @param frmae {Rectangle} The rectangle frame of the texture to show
 */
PIXI.Texture = function(baseTexture, frame)
{
	PIXI.EventTarget.call( this );

	if(!frame)
	{
		this.noFrame = true;
		frame = new PIXI.Rectangle(0,0,1,1);
	}

	if(baseTexture instanceof PIXI.Texture)
		baseTexture = baseTexture.baseTexture;

	/**
	 * The base texture of this texture
	 *
	 * @property baseTexture
	 * @type BaseTexture
	 */
	this.baseTexture = baseTexture;

	/**
	 * The frame specifies the region of the base texture that this texture uses
	 *
	 * @property frame
	 * @type Rectangle
	 */
	this.frame = frame;

	/**
	 * The trim point
	 *
	 * @property trim
	 * @type Point
	 */
	this.trim = new PIXI.Point();

	this.scope = this;

	if(baseTexture.hasLoaded)
	{
		if(this.noFrame)frame = new PIXI.Rectangle(0,0, baseTexture.width, baseTexture.height);
		//console.log(frame)

		this.setFrame(frame);
	}
	else
	{
		var scope = this;
		baseTexture.addEventListener( 'loaded', function(){ scope.onBaseTextureLoaded()} );
	}
}

PIXI.Texture.prototype.constructor = PIXI.Texture;

/**
 * Called when the base texture is loaded
 *
 * @method onBaseTextureLoaded
 * @param event
 * @private
 */
PIXI.Texture.prototype.onBaseTextureLoaded = function(event)
{
	var baseTexture = this.baseTexture;
	baseTexture.removeEventListener( 'loaded', this.onLoaded );

	if(this.noFrame)this.frame = new PIXI.Rectangle(0,0, baseTexture.width, baseTexture.height);
	this.noFrame = false;
	this.width = this.frame.width;
	this.height = this.frame.height;

	this.scope.dispatchEvent( { type: 'update', content: this } );
}

/**
 * Destroys this texture
 *
 * @method destroy
 * @param destroyBase {Boolean} Whether to destroy the base texture as well
 */
PIXI.Texture.prototype.destroy = function(destroyBase)
{
	if(destroyBase)this.baseTexture.destroy();
}

/**
 * Specifies the rectangle region of the baseTexture
 *
 * @method setFrame
 * @param frame {Rectangle} The frame of the texture to set it to
 */
PIXI.Texture.prototype.setFrame = function(frame)
{
	this.frame = frame;
	this.width = frame.width;
	this.height = frame.height;

	if(frame.x + frame.width > this.baseTexture.width || frame.y + frame.height > this.baseTexture.height)
	{
		throw new Error("Texture Error: frame does not fit inside the base Texture dimensions " + this);
	}

	this.updateFrame = true;

	PIXI.Texture.frameUpdates.push(this);
	//this.dispatchEvent( { type: 'update', content: this } );
}

/**
 * Helper function that returns a texture based on an image url
 * If the image is not in the texture cache it will be  created and loaded
 *
 * @static
 * @method fromImage
 * @param imageUrl {String} The image url of the texture
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 * @return Texture
 */
PIXI.Texture.fromImage = function(imageUrl, crossorigin)
{
	var texture = PIXI.TextureCache[imageUrl];

	if(!texture)
	{
		texture = new PIXI.Texture(PIXI.BaseTexture.fromImage(imageUrl, crossorigin));
		PIXI.TextureCache[imageUrl] = texture;
	}

	return texture;
}

/**
 * Helper function that returns a texture based on a frame id
 * If the frame id is not in the texture cache an error will be thrown
 *
 * @static
 * @method fromFrame
 * @param frameId {String} The frame id of the texture
 * @return Texture
 */
PIXI.Texture.fromFrame = function(frameId)
{
	var texture = PIXI.TextureCache[frameId];
	if(!texture)throw new Error("The frameId '"+ frameId +"' does not exist in the texture cache " + this);
	return texture;
}

/**
 * Helper function that returns a texture based on a canvas element
 * If the canvas is not in the texture cache it will be  created and loaded
 *
 * @static
 * @method fromCanvas
 * @param canvas {Canvas} The canvas element source of the texture
 * @return Texture
 */
PIXI.Texture.fromCanvas = function(canvas)
{
	var	baseTexture = new PIXI.BaseTexture(canvas);
	return new PIXI.Texture(baseTexture);
}


/**
 * Adds a texture to the textureCache.
 *
 * @static
 * @method addTextureToCache
 * @param texture {Texture}
 * @param id {String} the id that the texture will be stored against.
 */
PIXI.Texture.addTextureToCache = function(texture, id)
{
	PIXI.TextureCache[id] = texture;
}

/**
 * Remove a texture from the textureCache.
 *
 * @static
 * @method removeTextureFromCache
 * @param id {String} the id of the texture to be removed
 * @return {Texture} the texture that was removed
 */
PIXI.Texture.removeTextureFromCache = function(id)
{
	var texture = PIXI.TextureCache[id]
	PIXI.TextureCache[id] = null;
	return texture;
}

// this is more for webGL.. it contains updated frames..
PIXI.Texture.frameUpdates = [];


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 A RenderTexture is a special texture that allows any pixi displayObject to be rendered to it.

 __Hint__: All DisplayObjects (exmpl. Sprites) that renders on RenderTexture should be preloaded.
 Otherwise black rectangles will be drawn instead.

 RenderTexture takes snapshot of DisplayObject passed to render method. If DisplayObject is passed to render method, position and rotation of it will be ignored. For example:

	var renderTexture = new PIXI.RenderTexture(800, 600);
	var sprite = PIXI.Sprite.fromImage("spinObj_01.png");
	sprite.position.x = 800/2;
	sprite.position.y = 600/2;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;
	renderTexture.render(sprite);

 Sprite in this case will be rendered to 0,0 position. To render this sprite at center DisplayObjectContainer should be used:

	var doc = new PIXI.DisplayObjectContainer();
	doc.addChild(sprite);
	renderTexture.render(doc);  // Renders to center of renderTexture

 @class RenderTexture
 @extends Texture
 @constructor
 @param width {Number} The width of the render texture
 @param height {Number} The height of the render texture
 */
PIXI.RenderTexture = function(width, height)
{
	PIXI.EventTarget.call( this );

	this.width = width || 100;
	this.height = height || 100;

	this.indetityMatrix = PIXI.mat3.create();

	this.frame = new PIXI.Rectangle(0, 0, this.width, this.height);

	if(PIXI.gl)
	{
		this.initWebGL();
	}
	else
	{
		this.initCanvas();
	}
}

PIXI.RenderTexture.prototype = Object.create( PIXI.Texture.prototype );
PIXI.RenderTexture.prototype.constructor = PIXI.RenderTexture;

/**
 * Initializes the webgl data for this texture
 *
 * @method initWebGL
 * @private
 */
PIXI.RenderTexture.prototype.initWebGL = function()
{
	var gl = PIXI.gl;
	this.glFramebuffer = gl.createFramebuffer();

   	gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer );

    this.glFramebuffer.width = this.width;
    this.glFramebuffer.height = this.height;

	this.baseTexture = new PIXI.BaseTexture();

	this.baseTexture.width = this.width;
	this.baseTexture.height = this.height;

    this.baseTexture._glTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.baseTexture._glTexture);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  this.width,  this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	this.baseTexture.isRender = true;

	gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer );
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.baseTexture._glTexture, 0);

	// create a projection matrix..
	this.projection = new PIXI.Point(this.width/2 , this.height/2);

	// set the correct render function..
	this.render = this.renderWebGL;


}


PIXI.RenderTexture.prototype.resize = function(width, height)
{

	this.width = width;
	this.height = height;

	if(PIXI.gl)
	{
		this.projection.x = this.width/2
		this.projection.y = this.height/2;

		var gl = PIXI.gl;
		gl.bindTexture(gl.TEXTURE_2D, this.baseTexture._glTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  this.width,  this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	}
	else
	{

		this.frame.width = this.width
		this.frame.height = this.height;
		this.renderer.resize(this.width, this.height);
	}
}

/**
 * Initializes the canvas data for this texture
 *
 * @method initCanvas
 * @private
 */
PIXI.RenderTexture.prototype.initCanvas = function()
{
	this.renderer = new PIXI.CanvasRenderer(this.width, this.height, null, 0);

	this.baseTexture = new PIXI.BaseTexture(this.renderer.view);
	this.frame = new PIXI.Rectangle(0, 0, this.width, this.height);

	this.render = this.renderCanvas;
}

/**
 * This function will draw the display object to the texture.
 *
 * @method renderWebGL
 * @param displayObject {DisplayObject} The display object to render this texture on
 * @param clear {Boolean} If true the texture will be cleared before the displayObject is drawn
 * @private
 */
PIXI.RenderTexture.prototype.renderWebGL = function(displayObject, position, clear)
{
	var gl = PIXI.gl;

	// enable the alpha color mask..
	gl.colorMask(true, true, true, true);

	gl.viewport(0, 0, this.width, this.height);

	gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFramebuffer );

	if(clear)
	{
		gl.clearColor(0,0,0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
	}

	// THIS WILL MESS WITH HIT TESTING!
	var children = displayObject.children;

	//TODO -? create a new one??? dont think so!
	var originalWorldTransform = displayObject.worldTransform;
	displayObject.worldTransform = PIXI.mat3.create();//sthis.indetityMatrix;
	// modify to flip...
	displayObject.worldTransform[4] = -1;
	displayObject.worldTransform[5] = this.projection.y * 2;


	if(position)
	{
		displayObject.worldTransform[2] = position.x;
		displayObject.worldTransform[5] -= position.y;
	}

	PIXI.visibleCount++;
	displayObject.vcount = PIXI.visibleCount;

	for(var i=0,j=children.length; i<j; i++)
	{
		children[i].updateTransform();
	}

	var renderGroup = displayObject.__renderGroup;

	if(renderGroup)
	{
		if(displayObject == renderGroup.root)
		{
			renderGroup.render(this.projection);
		}
		else
		{
			renderGroup.renderSpecific(displayObject, this.projection);
		}
	}
	else
	{
		if(!this.renderGroup)this.renderGroup = new PIXI.WebGLRenderGroup(gl);
		this.renderGroup.setRenderable(displayObject);
		this.renderGroup.render(this.projection);
	}

	displayObject.worldTransform = originalWorldTransform;
}


/**
 * This function will draw the display object to the texture.
 *
 * @method renderCanvas
 * @param displayObject {DisplayObject} The display object to render this texture on
 * @param clear {Boolean} If true the texture will be cleared before the displayObject is drawn
 * @private
 */
PIXI.RenderTexture.prototype.renderCanvas = function(displayObject, position, clear)
{
	var children = displayObject.children;

	displayObject.worldTransform = PIXI.mat3.create();

	if(position)
	{
		displayObject.worldTransform[2] = position.x;
		displayObject.worldTransform[5] = position.y;
	}


	for(var i=0,j=children.length; i<j; i++)
	{
		children[i].updateTransform();
	}

	if(clear)this.renderer.context.clearRect(0,0, this.width, this.height);

    this.renderer.renderDisplayObject(displayObject);

    this.renderer.context.setTransform(1,0,0,1,0,0);


  //  PIXI.texturesToUpdate.push(this.baseTexture);
}


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A Class that loads a bunch of images / sprite sheet / bitmap font files. Once the
 * assets have been loaded they are added to the PIXI Texture cache and can be accessed
 * easily through PIXI.Texture.fromImage() and PIXI.Sprite.fromImage()
 * When all items have been loaded this class will dispatch a "onLoaded" event
 * As each individual item is loaded this class will dispatch a "onProgress" event
 *
 * @class AssetLoader
 * @constructor
 * @uses EventTarget
 * @param {Array<String>} assetURLs an array of image/sprite sheet urls that you would like loaded
 *      supported. Supported image formats include "jpeg", "jpg", "png", "gif". Supported
 *      sprite sheet data formats only include "JSON" at this time. Supported bitmap font
 *      data formats include "xml" and "fnt".
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */
PIXI.AssetLoader = function(assetURLs, crossorigin)
{
	PIXI.EventTarget.call(this);

	/**
	 * The array of asset URLs that are going to be loaded
     *
	 * @property assetURLs
	 * @type Array<String>
	 */
	this.assetURLs = assetURLs;

    /**
     * Whether the requests should be treated as cross origin
     *
     * @property crossorigin
     * @type Boolean
     */
	this.crossorigin = crossorigin;

    /**
     * Maps file extension to loader types
     *
     * @property loadersByType
     * @type Object
     */
    this.loadersByType = {
        "jpg":  PIXI.ImageLoader,
        "jpeg": PIXI.ImageLoader,
        "png":  PIXI.ImageLoader,
        "gif":  PIXI.ImageLoader,
        "json": PIXI.JsonLoader,
        "anim": PIXI.SpineLoader,
        "xml":  PIXI.BitmapFontLoader,
        "fnt":  PIXI.BitmapFontLoader
    };


};

/**
 * Fired when an item has loaded
 * @event onProgress
 */

/**
 * Fired when all the assets have loaded
 * @event onComplete
 */

// constructor
PIXI.AssetLoader.prototype.constructor = PIXI.AssetLoader;

/**
 * Starts loading the assets sequentially
 *
 * @method load
 */
PIXI.AssetLoader.prototype.load = function()
{
    var scope = this;

	this.loadCount = this.assetURLs.length;

    for (var i=0; i < this.assetURLs.length; i++)
	{
		var fileName = this.assetURLs[i];
		var fileType = fileName.split(".").pop().toLowerCase();

        var loaderClass = this.loadersByType[fileType];
        if(!loaderClass)
            throw new Error(fileType + " is an unsupported file type");

        var loader = new loaderClass(fileName, this.crossorigin);

        loader.addEventListener("loaded", function()
        {
            scope.onAssetLoaded();
        });
        loader.load();
	}
};

/**
 * Invoked after each file is loaded
 *
 * @method onAssetLoaded
 * @private
 */
PIXI.AssetLoader.prototype.onAssetLoaded = function()
{
    this.loadCount--;
	this.dispatchEvent({type: "onProgress", content: this});
	if(this.onProgress) this.onProgress();

	if(this.loadCount == 0)
	{
		this.dispatchEvent({type: "onComplete", content: this});
		if(this.onComplete) this.onComplete();
	}
};


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The json file loader is used to load in JSON data and parsing it
 * When loaded this class will dispatch a "loaded" event
 * If load failed this class will dispatch a "error" event
 *
 * @class JsonLoader
 * @uses EventTarget
 * @constructor
 * @param url {String} The url of the JSON file
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */
PIXI.JsonLoader = function (url, crossorigin) {
	PIXI.EventTarget.call(this);

	/**
	 * The url of the bitmap font data
	 *
	 * @property url
	 * @type String
	 */
	this.url = url;

	/**
	 * Whether the requests should be treated as cross origin
	 *
	 * @property crossorigin
	 * @type Boolean
	 */
	this.crossorigin = crossorigin;

	/**
	 * [read-only] The base url of the bitmap font data
	 *
	 * @property baseUrl
	 * @type String
	 * @readOnly
	 */
	this.baseUrl = url.replace(/[^\/]*$/, "");

	/**
	 * [read-only] Whether the data has loaded yet
	 *
	 * @property loaded
	 * @type Boolean
	 * @readOnly
	 */
	this.loaded = false;

};

// constructor
PIXI.JsonLoader.prototype.constructor = PIXI.JsonLoader;

/**
 * Loads the JSON data
 *
 * @method load
 */
PIXI.JsonLoader.prototype.load = function () {

	var scope = this;

	function makeRequest() {
		scope.ajaxRequest = new AjaxRequest();

		scope.ajaxRequest.onreadystatechange = function () {
			if (scope.ajaxRequest.readyState == 4) {
				if (scope.ajaxRequest.status == 200 || window.location.href.indexOf("http") == -1) {
					scope.json = JSON.parse(scope.ajaxRequest.responseText);

					localforage.setItem(scope.url, scope.json, function() {
						scope.onJSONLoaded();
					})
				} else {
					scope.onError();
				}
			}
		};

		scope.ajaxRequest.open("GET", scope.url, true);
		if (scope.ajaxRequest.overrideMimeType) scope.ajaxRequest.overrideMimeType("application/json");
		scope.ajaxRequest.send(null);

	}


	localforage.getItem(scope.url, function(json) {
		if (json) {

			console.log(scope.url + ' was loaded from cache.');
			scope.json = JSON.parse(JSON.stringify(json));
			scope.onJSONLoaded();
		} else {

			console.log(scope.url + ' was loaded from network.');
			makeRequest();
		}

	})

};

/**
 * Invoke when JSON file is loaded
 *
 * @method onJSONLoaded
 * @private
 */
PIXI.JsonLoader.prototype.onJSONLoaded = function () {





			if(this.json.frames)
			{
				// sprite sheet
				var scope = this;
				var textureUrl = this.baseUrl + this.json.meta.image;
				var image = new PIXI.ImageLoader(textureUrl, this.crossorigin);
				var frameData = this.json.frames;

				this.texture = image.texture.baseTexture;
				image.addEventListener("loaded", function (event) {
					scope.onLoaded();
				});

				for (var i in frameData) {

					var fullIndex = this.baseUrl + i;
					var rect = frameData[i].frame;
					if (rect) {
						PIXI.TextureCache[fullIndex] = new PIXI.Texture(this.texture, {
							x: rect.x,
							y: rect.y,
							width: rect.w,
							height: rect.h
						});
						if (frameData[i].trimmed) {
							//var realSize = frameData[i].spriteSourceSize;
							PIXI.TextureCache[fullIndex].realSize = frameData[i].spriteSourceSize;
							PIXI.TextureCache[fullIndex].trim.x = 0; // (realSize.x / rect.w)
							// calculate the offset!
						}
					}
				}

				image.load();

			}
			else if(this.json.bones)
			{
				// spine animation
				var spineJsonParser = new spine.SkeletonJson();
				var skeletonData = spineJsonParser.readSkeletonData(this.json);
				PIXI.AnimCache[this.url] = skeletonData;
				this.onLoaded();
			}
			else
			{
				this.onLoaded();
			}

};

/**
 * Invoke when json file loaded
 *
 * @method onLoaded
 * @private
 */
PIXI.JsonLoader.prototype.onLoaded = function () {
	this.loaded = true;
	this.dispatchEvent({
		type: "loaded",
		content: this
	});
};

/**
 * Invoke when error occured
 *
 * @method onError
 * @private
 */
PIXI.JsonLoader.prototype.onError = function () {
	this.dispatchEvent({
		type: "error",
		content: this
	});
};
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The sprite sheet loader is used to load in JSON sprite sheet data
 * To generate the data you can use http://www.codeandweb.com/texturepacker and publish the "JSON" format
 * There is a free version so thats nice, although the paid version is great value for money.
 * It is highly recommended to use Sprite sheets (also know as texture atlas") as it means sprite"s can be batched and drawn together for highly increased rendering speed.
 * Once the data has been loaded the frames are stored in the PIXI texture cache and can be accessed though PIXI.Texture.fromFrameId() and PIXI.Sprite.fromFromeId()
 * This loader will also load the image file that the Spritesheet points to as well as the data.
 * When loaded this class will dispatch a "loaded" event
 *
 * @class SpriteSheetLoader
 * @uses EventTarget
 * @constructor
 * @param url {String} The url of the sprite sheet JSON file
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */

PIXI.SpriteSheetLoader = function (url, crossorigin) {
	/*
	 * i use texture packer to load the assets..
	 * http://www.codeandweb.com/texturepacker
	 * make sure to set the format as "JSON"
	 */
	PIXI.EventTarget.call(this);

	/**
	 * The url of the bitmap font data
	 *
	 * @property url
	 * @type String
	 */
	this.url = url;

	/**
	 * Whether the requests should be treated as cross origin
	 *
	 * @property crossorigin
	 * @type Boolean
	 */
	this.crossorigin = crossorigin;

	/**
	 * [read-only] The base url of the bitmap font data
	 *
	 * @property baseUrl
	 * @type String
	 * @readOnly
	 */
	this.baseUrl = url.replace(/[^\/]*$/, "");

    /**
     * The texture being loaded
     *
     * @property texture
     * @type Texture
     */
    this.texture = null;

    /**
     * The frames of the sprite sheet
     *
     * @property frames
     * @type Object
     */
	this.frames = {};
};

// constructor
PIXI.SpriteSheetLoader.prototype.constructor = PIXI.SpriteSheetLoader;

/**
 * This will begin loading the JSON file
 *
 * @method load
 */
PIXI.SpriteSheetLoader.prototype.load = function () {
	var scope = this;
	var jsonLoader = new PIXI.JsonLoader(this.url, this.crossorigin);
	jsonLoader.addEventListener("loaded", function (event) {
		scope.json = event.content.json;
		scope.onJSONLoaded();
	});
	jsonLoader.load();
};

/**
 * Invoke when JSON file is loaded
 *
 * @method onJSONLoaded
 * @private
 */
PIXI.SpriteSheetLoader.prototype.onJSONLoaded = function () {
	var scope = this;
	var textureUrl = this.baseUrl + this.json.meta.image;
	var image = new PIXI.ImageLoader(textureUrl, this.crossorigin);
	var frameData = this.json.frames;

	this.texture = image.texture.baseTexture;
	image.addEventListener("loaded", function (event) {
		scope.onLoaded();
	});

	for (var i in frameData) {
		var fullIndex = this.baseUrl + i;
		var rect = frameData[i].frame;
		if (rect) {
			PIXI.TextureCache[fullIndex] = new PIXI.Texture(this.texture, {
				x: rect.x,
				y: rect.y,
				width: rect.w,
				height: rect.h
			});
			if (frameData[fullIndex].trimmed) {
				//var realSize = frameData[i].spriteSourceSize;
				PIXI.TextureCache[fullIndex].realSize = frameData[i].spriteSourceSize;
				PIXI.TextureCache[fullIndex].trim.x = 0; // (realSize.x / rect.w)
				// calculate the offset!
			}
		}
	}

	image.load();
};
/**
 * Invoke when all files are loaded (json and texture)
 *
 * @method onLoaded
 * @private
 */
PIXI.SpriteSheetLoader.prototype.onLoaded = function () {
	this.dispatchEvent({
		type: "loaded",
		content: this
	});
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The image loader class is responsible for loading images file formats ("jpeg", "jpg", "png" and "gif")
 * Once the image has been loaded it is stored in the PIXI texture cache and can be accessed though PIXI.Texture.fromFrameId() and PIXI.Sprite.fromFromeId()
 * When loaded this class will dispatch a 'loaded' event
 *
 * @class ImageLoader
 * @uses EventTarget
 * @constructor
 * @param url {String} The url of the image
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */
PIXI.ImageLoader = function(url, crossorigin)
{
    PIXI.EventTarget.call(this);

    /**
     * The texture being loaded
     *
     * @property texture
     * @type Texture
     */
    this.texture = PIXI.Texture.fromImage(url, crossorigin);
};

// constructor
PIXI.ImageLoader.prototype.constructor = PIXI.ImageLoader;

/**
 * Loads image or takes it from cache
 *
 * @method load
 */
PIXI.ImageLoader.prototype.load = function()
{
    if(!this.texture.baseTexture.hasLoaded)
    {
        var scope = this;
        this.texture.baseTexture.addEventListener("loaded", function()
        {
            scope.onLoaded();
        });
    }
    else
    {
        this.onLoaded();
    }
};

/**
 * Invoked when image file is loaded or it is already cached and ready to use
 *
 * @method onLoaded
 * @private
 */
PIXI.ImageLoader.prototype.onLoaded = function()
{
    this.dispatchEvent({type: "loaded", content: this});
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The xml loader is used to load in XML bitmap font data ("xml" or "fnt")
 * To generate the data you can use http://www.angelcode.com/products/bmfont/
 * This loader will also load the image file as the data.
 * When loaded this class will dispatch a "loaded" event
 *
 * @class BitmapFontLoader
 * @uses EventTarget
 * @constructor
 * @param url {String} The url of the sprite sheet JSON file
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */
PIXI.BitmapFontLoader = function(url, crossorigin)
{
    /*
     * i use texture packer to load the assets..
     * http://www.codeandweb.com/texturepacker
     * make sure to set the format as "JSON"
     */
    PIXI.EventTarget.call(this);

    /**
     * The url of the bitmap font data
     *
     * @property url
     * @type String
     */
    this.url = url;

    /**
     * Whether the requests should be treated as cross origin
     *
     * @property crossorigin
     * @type Boolean
     */
    this.crossorigin = crossorigin;

    /**
     * [read-only] The base url of the bitmap font data
     *
     * @property baseUrl
     * @type String
     * @readOnly
     */
    this.baseUrl = url.replace(/[^\/]*$/, "");

    /**
     * [read-only] The texture of the bitmap font
     *
     * @property baseUrl
     * @type String
     */
    this.texture = null;
};

// constructor
PIXI.BitmapFontLoader.prototype.constructor = PIXI.BitmapFontLoader;

/**
 * Loads the XML font data
 *
 * @method load
 */
PIXI.BitmapFontLoader.prototype.load = function()
{
    this.ajaxRequest = new XMLHttpRequest();
    var scope = this;
    this.ajaxRequest.onreadystatechange = function()
    {
        scope.onXMLLoaded();
    };

    this.ajaxRequest.open("GET", this.url, true);
    if (this.ajaxRequest.overrideMimeType) this.ajaxRequest.overrideMimeType("application/xml");
    this.ajaxRequest.send(null)
};

/**
 * Invoked when XML file is loaded, parses the data
 *
 * @method onXMLLoaded
 * @private
 */
PIXI.BitmapFontLoader.prototype.onXMLLoaded = function()
{
    if (this.ajaxRequest.readyState == 4)
    {
        if (this.ajaxRequest.status == 200 || window.location.href.indexOf("http") == -1)
        {
            var textureUrl = this.baseUrl + this.ajaxRequest.responseXML.getElementsByTagName("page")[0].attributes.getNamedItem("file").nodeValue;
            var image = new PIXI.ImageLoader(textureUrl, this.crossorigin);
            this.texture = image.texture.baseTexture;

            var data = {};
            var info = this.ajaxRequest.responseXML.getElementsByTagName("info")[0];
            var common = this.ajaxRequest.responseXML.getElementsByTagName("common")[0];
            data.font = info.attributes.getNamedItem("face").nodeValue;
            data.size = parseInt(info.attributes.getNamedItem("size").nodeValue, 10);
            data.lineHeight = parseInt(common.attributes.getNamedItem("lineHeight").nodeValue, 10);
            data.chars = {};

            //parse letters
            var letters = this.ajaxRequest.responseXML.getElementsByTagName("char");

            for (var i = 0; i < letters.length; i++)
            {
                var charCode = parseInt(letters[i].attributes.getNamedItem("id").nodeValue, 10);

                var textureRect = {
                    x: parseInt(letters[i].attributes.getNamedItem("x").nodeValue, 10),
                    y: parseInt(letters[i].attributes.getNamedItem("y").nodeValue, 10),
                    width: parseInt(letters[i].attributes.getNamedItem("width").nodeValue, 10),
                    height: parseInt(letters[i].attributes.getNamedItem("height").nodeValue, 10)
                };
                PIXI.TextureCache[charCode] = new PIXI.Texture(this.texture, textureRect);

                data.chars[charCode] = {
                    xOffset: parseInt(letters[i].attributes.getNamedItem("xoffset").nodeValue, 10),
                    yOffset: parseInt(letters[i].attributes.getNamedItem("yoffset").nodeValue, 10),
                    xAdvance: parseInt(letters[i].attributes.getNamedItem("xadvance").nodeValue, 10),
                    kerning: {},
                    texture:new PIXI.Texture(this.texture, textureRect)

                };
            }

            //parse kernings
            var kernings = this.ajaxRequest.responseXML.getElementsByTagName("kerning");
            for (i = 0; i < kernings.length; i++)
            {
               var first = parseInt(kernings[i].attributes.getNamedItem("first").nodeValue, 10);
               var second = parseInt(kernings[i].attributes.getNamedItem("second").nodeValue, 10);
               var amount = parseInt(kernings[i].attributes.getNamedItem("amount").nodeValue, 10);

                data.chars[second].kerning[first] = amount;

            }

            PIXI.BitmapText.fonts[data.font] = data;

            var scope = this;
            image.addEventListener("loaded", function() {
                scope.onLoaded();
            });
            image.load();
        }
    }
};

/**
 * Invoked when all files are loaded (xml/fnt and texture)
 *
 * @method onLoaded
 * @private
 */
PIXI.BitmapFontLoader.prototype.onLoaded = function()
{
    this.dispatchEvent({type: "loaded", content: this});
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * based on pixi impact spine implementation made by Eemeli Kelokorpi (@ekelokorpi) https://github.com/ekelokorpi
 *
 * Awesome JS run time provided by EsotericSoftware
 * https://github.com/EsotericSoftware/spine-runtimes
 *
 */

/**
 * The Spine loader is used to load in JSON spine data
 * To generate the data you need to use http://esotericsoftware.com/ and export the "JSON" format
 * Due to a clash of names  You will need to change the extension of the spine file from *.json to *.anim for it to load
 * See example 12 (http://www.goodboydigital.com/pixijs/examples/12/) to see a working example and check out the source
 * You will need to generate a sprite sheet to accompany the spine data
 * When loaded this class will dispatch a "loaded" event
 *
 * @class Spine
 * @uses EventTarget
 * @constructor
 * @param url {String} The url of the JSON file
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */
PIXI.SpineLoader = function(url, crossorigin)
{
	PIXI.EventTarget.call(this);

	/**
	 * The url of the bitmap font data
	 *
	 * @property url
	 * @type String
	 */
	this.url = url;

	/**
	 * Whether the requests should be treated as cross origin
	 *
	 * @property crossorigin
	 * @type Boolean
	 */
	this.crossorigin = crossorigin;

	/**
	 * [read-only] Whether the data has loaded yet
	 *
	 * @property loaded
	 * @type Boolean
	 * @readOnly
	 */
	this.loaded = false;
}

PIXI.SpineLoader.prototype.constructor = PIXI.SpineLoader;

/**
 * Loads the JSON data
 *
 * @method load
 */
PIXI.SpineLoader.prototype.load = function () {

	var scope = this;
	var jsonLoader = new PIXI.JsonLoader(this.url, this.crossorigin);
	jsonLoader.addEventListener("loaded", function (event) {
		scope.json = event.content.json;
		scope.onJSONLoaded();
	});
	jsonLoader.load();
};

/**
 * Invoke when JSON file is loaded
 *
 * @method onJSONLoaded
 * @private
 */
PIXI.SpineLoader.prototype.onJSONLoaded = function (event) {
	var spineJsonParser = new spine.SkeletonJson();
	var skeletonData = spineJsonParser.readSkeletonData(this.json);

	PIXI.AnimCache[this.url] = skeletonData;

	this.onLoaded();
};

/**
 * Invoke when JSON file is loaded
 *
 * @method onLoaded
 * @private
 */
PIXI.SpineLoader.prototype.onLoaded = function () {
	this.loaded = true;
    this.dispatchEvent({type: "loaded", content: this});
};


/**

 * @author Mat Groves http://matgroves.com/ @Doormat23

 */



 if (typeof exports !== 'undefined') {

    if (typeof module !== 'undefined' && module.exports) {

      exports = module.exports = PIXI;

    }

    exports.PIXI = PIXI;

  } else {

    root.PIXI = PIXI;

  }





}).call(this);
/*!
    localForage -- Offline Storage, Improved
    Version 0.8.1
    http://mozilla.github.io/localForage
    (c) 2013-2014 Mozilla, Apache License 2.0
*/
(function() {
var define, requireModule, require, requirejs;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  requirejs = require = requireModule = function(name) {
  requirejs._eak_seen = registry;

    if (seen[name]) { return seen[name]; }
    seen[name] = {};

    if (!registry[name]) {
      throw new Error("Could not find module " + name);
    }

    var mod = registry[name],
        deps = mod.deps,
        callback = mod.callback,
        reified = [],
        exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(resolve(deps[i])));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;

    function resolve(child) {
      if (child.charAt(0) !== '.') { return child; }
      var parts = child.split("/");
      var parentBase = name.split("/").slice(0, -1);

      for (var i=0, l=parts.length; i<l; i++) {
        var part = parts[i];

        if (part === '..') { parentBase.pop(); }
        else if (part === '.') { continue; }
        else { parentBase.push(part); }
      }

      return parentBase.join("/");
    }
  };
})();

define("promise/all", 
  ["./utils","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global toString */

    var isArray = __dependency1__.isArray;
    var isFunction = __dependency1__.isFunction;

    /**
      Returns a promise that is fulfilled when all the given promises have been
      fulfilled, or rejected if any of them become rejected. The return promise
      is fulfilled with an array that gives all the values in the order they were
      passed in the `promises` array argument.

      Example:

      ```javascript
      var promise1 = RSVP.resolve(1);
      var promise2 = RSVP.resolve(2);
      var promise3 = RSVP.resolve(3);
      var promises = [ promise1, promise2, promise3 ];

      RSVP.all(promises).then(function(array){
        // The array here would be [ 1, 2, 3 ];
      });
      ```

      If any of the `promises` given to `RSVP.all` are rejected, the first promise
      that is rejected will be given as an argument to the returned promises's
      rejection handler. For example:

      Example:

      ```javascript
      var promise1 = RSVP.resolve(1);
      var promise2 = RSVP.reject(new Error("2"));
      var promise3 = RSVP.reject(new Error("3"));
      var promises = [ promise1, promise2, promise3 ];

      RSVP.all(promises).then(function(array){
        // Code here never runs because there are rejected promises!
      }, function(error) {
        // error.message === "2"
      });
      ```

      @method all
      @for RSVP
      @param {Array} promises
      @param {String} label
      @return {Promise} promise that is fulfilled when all `promises` have been
      fulfilled, or rejected if any of them become rejected.
    */
    function all(promises) {
      /*jshint validthis:true */
      var Promise = this;

      if (!isArray(promises)) {
        throw new TypeError('You must pass an array to all.');
      }

      return new Promise(function(resolve, reject) {
        var results = [], remaining = promises.length,
        promise;

        if (remaining === 0) {
          resolve([]);
        }

        function resolver(index) {
          return function(value) {
            resolveAll(index, value);
          };
        }

        function resolveAll(index, value) {
          results[index] = value;
          if (--remaining === 0) {
            resolve(results);
          }
        }

        for (var i = 0; i < promises.length; i++) {
          promise = promises[i];

          if (promise && isFunction(promise.then)) {
            promise.then(resolver(i), reject);
          } else {
            resolveAll(i, promise);
          }
        }
      });
    }

    __exports__.all = all;
  });
define("promise/asap", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var browserGlobal = (typeof window !== 'undefined') ? window : {};
    var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
    var local = (typeof global !== 'undefined') ? global : (this === undefined? window:this);

    // node
    function useNextTick() {
      return function() {
        process.nextTick(flush);
      };
    }

    function useMutationObserver() {
      var iterations = 0;
      var observer = new BrowserMutationObserver(flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    function useSetTimeout() {
      return function() {
        local.setTimeout(flush, 1);
      };
    }

    var queue = [];
    function flush() {
      for (var i = 0; i < queue.length; i++) {
        var tuple = queue[i];
        var callback = tuple[0], arg = tuple[1];
        callback(arg);
      }
      queue = [];
    }

    var scheduleFlush;

    // Decide what async method to use to triggering processing of queued callbacks:
    if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
      scheduleFlush = useNextTick();
    } else if (BrowserMutationObserver) {
      scheduleFlush = useMutationObserver();
    } else {
      scheduleFlush = useSetTimeout();
    }

    function asap(callback, arg) {
      var length = queue.push([callback, arg]);
      if (length === 1) {
        // If length is 1, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        scheduleFlush();
      }
    }

    __exports__.asap = asap;
  });
define("promise/config", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var config = {
      instrument: false
    };

    function configure(name, value) {
      if (arguments.length === 2) {
        config[name] = value;
      } else {
        return config[name];
      }
    }

    __exports__.config = config;
    __exports__.configure = configure;
  });
define("promise/polyfill", 
  ["./promise","./utils","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    /*global self*/
    var RSVPPromise = __dependency1__.Promise;
    var isFunction = __dependency2__.isFunction;

    function polyfill() {
      var local;

      if (typeof global !== 'undefined') {
        local = global;
      } else if (typeof window !== 'undefined' && window.document) {
        local = window;
      } else {
        local = self;
      }

      var es6PromiseSupport = 
        "Promise" in local &&
        // Some of these methods are missing from
        // Firefox/Chrome experimental implementations
        "resolve" in local.Promise &&
        "reject" in local.Promise &&
        "all" in local.Promise &&
        "race" in local.Promise &&
        // Older version of the spec had a resolver object
        // as the arg rather than a function
        (function() {
          var resolve;
          new local.Promise(function(r) { resolve = r; });
          return isFunction(resolve);
        }());

      if (!es6PromiseSupport) {
        local.Promise = RSVPPromise;
      }
    }

    __exports__.polyfill = polyfill;
  });
define("promise/promise", 
  ["./config","./utils","./all","./race","./resolve","./reject","./asap","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __exports__) {
    "use strict";
    var config = __dependency1__.config;
    var configure = __dependency1__.configure;
    var objectOrFunction = __dependency2__.objectOrFunction;
    var isFunction = __dependency2__.isFunction;
    var now = __dependency2__.now;
    var all = __dependency3__.all;
    var race = __dependency4__.race;
    var staticResolve = __dependency5__.resolve;
    var staticReject = __dependency6__.reject;
    var asap = __dependency7__.asap;

    var counter = 0;

    config.async = asap; // default async is asap;

    function Promise(resolver) {
      if (!isFunction(resolver)) {
        throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
      }

      if (!(this instanceof Promise)) {
        throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
      }

      this._subscribers = [];

      invokeResolver(resolver, this);
    }

    function invokeResolver(resolver, promise) {
      function resolvePromise(value) {
        resolve(promise, value);
      }

      function rejectPromise(reason) {
        reject(promise, reason);
      }

      try {
        resolver(resolvePromise, rejectPromise);
      } catch(e) {
        rejectPromise(e);
      }
    }

    function invokeCallback(settled, promise, callback, detail) {
      var hasCallback = isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        try {
          value = callback(detail);
          succeeded = true;
        } catch(e) {
          failed = true;
          error = e;
        }
      } else {
        value = detail;
        succeeded = true;
      }

      if (handleThenable(promise, value)) {
        return;
      } else if (hasCallback && succeeded) {
        resolve(promise, value);
      } else if (failed) {
        reject(promise, error);
      } else if (settled === FULFILLED) {
        resolve(promise, value);
      } else if (settled === REJECTED) {
        reject(promise, value);
      }
    }

    var PENDING   = void 0;
    var SEALED    = 0;
    var FULFILLED = 1;
    var REJECTED  = 2;

    function subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      subscribers[length] = child;
      subscribers[length + FULFILLED] = onFulfillment;
      subscribers[length + REJECTED]  = onRejection;
    }

    function publish(promise, settled) {
      var child, callback, subscribers = promise._subscribers, detail = promise._detail;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        invokeCallback(settled, child, callback, detail);
      }

      promise._subscribers = null;
    }

    Promise.prototype = {
      constructor: Promise,

      _state: undefined,
      _detail: undefined,
      _subscribers: undefined,

      then: function(onFulfillment, onRejection) {
        var promise = this;

        var thenPromise = new this.constructor(function() {});

        if (this._state) {
          var callbacks = arguments;
          config.async(function invokePromiseCallback() {
            invokeCallback(promise._state, thenPromise, callbacks[promise._state - 1], promise._detail);
          });
        } else {
          subscribe(this, thenPromise, onFulfillment, onRejection);
        }

        return thenPromise;
      },

      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };

    Promise.all = all;
    Promise.race = race;
    Promise.resolve = staticResolve;
    Promise.reject = staticReject;

    function handleThenable(promise, value) {
      var then = null,
      resolved;

      try {
        if (promise === value) {
          throw new TypeError("A promises callback cannot return that same promise.");
        }

        if (objectOrFunction(value)) {
          then = value.then;

          if (isFunction(then)) {
            then.call(value, function(val) {
              if (resolved) { return true; }
              resolved = true;

              if (value !== val) {
                resolve(promise, val);
              } else {
                fulfill(promise, val);
              }
            }, function(val) {
              if (resolved) { return true; }
              resolved = true;

              reject(promise, val);
            });

            return true;
          }
        }
      } catch (error) {
        if (resolved) { return true; }
        reject(promise, error);
        return true;
      }

      return false;
    }

    function resolve(promise, value) {
      if (promise === value) {
        fulfill(promise, value);
      } else if (!handleThenable(promise, value)) {
        fulfill(promise, value);
      }
    }

    function fulfill(promise, value) {
      if (promise._state !== PENDING) { return; }
      promise._state = SEALED;
      promise._detail = value;

      config.async(publishFulfillment, promise);
    }

    function reject(promise, reason) {
      if (promise._state !== PENDING) { return; }
      promise._state = SEALED;
      promise._detail = reason;

      config.async(publishRejection, promise);
    }

    function publishFulfillment(promise) {
      publish(promise, promise._state = FULFILLED);
    }

    function publishRejection(promise) {
      publish(promise, promise._state = REJECTED);
    }

    __exports__.Promise = Promise;
  });
define("promise/race", 
  ["./utils","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global toString */
    var isArray = __dependency1__.isArray;

    /**
      `RSVP.race` allows you to watch a series of promises and act as soon as the
      first promise given to the `promises` argument fulfills or rejects.

      Example:

      ```javascript
      var promise1 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve("promise 1");
        }, 200);
      });

      var promise2 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve("promise 2");
        }, 100);
      });

      RSVP.race([promise1, promise2]).then(function(result){
        // result === "promise 2" because it was resolved before promise1
        // was resolved.
      });
      ```

      `RSVP.race` is deterministic in that only the state of the first completed
      promise matters. For example, even if other promises given to the `promises`
      array argument are resolved, but the first completed promise has become
      rejected before the other promises became fulfilled, the returned promise
      will become rejected:

      ```javascript
      var promise1 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve("promise 1");
        }, 200);
      });

      var promise2 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          reject(new Error("promise 2"));
        }, 100);
      });

      RSVP.race([promise1, promise2]).then(function(result){
        // Code here never runs because there are rejected promises!
      }, function(reason){
        // reason.message === "promise2" because promise 2 became rejected before
        // promise 1 became fulfilled
      });
      ```

      @method race
      @for RSVP
      @param {Array} promises array of promises to observe
      @param {String} label optional string for describing the promise returned.
      Useful for tooling.
      @return {Promise} a promise that becomes fulfilled with the value the first
      completed promises is resolved with if the first completed promise was
      fulfilled, or rejected with the reason that the first completed promise
      was rejected with.
    */
    function race(promises) {
      /*jshint validthis:true */
      var Promise = this;

      if (!isArray(promises)) {
        throw new TypeError('You must pass an array to race.');
      }
      return new Promise(function(resolve, reject) {
        var results = [], promise;

        for (var i = 0; i < promises.length; i++) {
          promise = promises[i];

          if (promise && typeof promise.then === 'function') {
            promise.then(resolve, reject);
          } else {
            resolve(promise);
          }
        }
      });
    }

    __exports__.race = race;
  });
define("promise/reject", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**
      `RSVP.reject` returns a promise that will become rejected with the passed
      `reason`. `RSVP.reject` is essentially shorthand for the following:

      ```javascript
      var promise = new RSVP.Promise(function(resolve, reject){
        reject(new Error('WHOOPS'));
      });

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      Instead of writing the above, your code now simply becomes the following:

      ```javascript
      var promise = RSVP.reject(new Error('WHOOPS'));

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      @method reject
      @for RSVP
      @param {Any} reason value that the returned promise will be rejected with.
      @param {String} label optional string for identifying the returned promise.
      Useful for tooling.
      @return {Promise} a promise that will become rejected with the given
      `reason`.
    */
    function reject(reason) {
      /*jshint validthis:true */
      var Promise = this;

      return new Promise(function (resolve, reject) {
        reject(reason);
      });
    }

    __exports__.reject = reject;
  });
define("promise/resolve", 
  ["exports"],
  function(__exports__) {
    "use strict";
    function resolve(value) {
      /*jshint validthis:true */
      if (value && typeof value === 'object' && value.constructor === this) {
        return value;
      }

      var Promise = this;

      return new Promise(function(resolve) {
        resolve(value);
      });
    }

    __exports__.resolve = resolve;
  });
define("promise/utils", 
  ["exports"],
  function(__exports__) {
    "use strict";
    function objectOrFunction(x) {
      return isFunction(x) || (typeof x === "object" && x !== null);
    }

    function isFunction(x) {
      return typeof x === "function";
    }

    function isArray(x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    }

    // Date.now is not available in browsers < IE9
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Compatibility
    var now = Date.now || function() { return new Date().getTime(); };


    __exports__.objectOrFunction = objectOrFunction;
    __exports__.isFunction = isFunction;
    __exports__.isArray = isArray;
    __exports__.now = now;
  });
requireModule('promise/polyfill').polyfill();
}());// Some code originally from async_storage.js in
// [Gaia](https://github.com/mozilla-b2g/gaia).
(function() {
    'use strict';

    // Originally found in https://github.com/mozilla-b2g/gaia/blob/e8f624e4cc9ea945727278039b3bc9bcb9f8667a/shared/js/async_storage.js

    // Promises!
    var Promise = (typeof module !== 'undefined' && module.exports) ?
                  require('promise') : this.Promise;

    var db = null;
    var dbInfo = {};

    // Initialize IndexedDB; fall back to vendor-prefixed versions if needed.
    var indexedDB = indexedDB || this.indexedDB || this.webkitIndexedDB ||
                    this.mozIndexedDB || this.OIndexedDB ||
                    this.msIndexedDB;

    // If IndexedDB isn't available, we get outta here!
    if (!indexedDB) {
        return;
    }

    // Open the IndexedDB database (automatically creates one if one didn't
    // previously exist), using any options set in the config.
    function _initStorage(options) {
        if (options) {
            for (var i in options) {
                dbInfo[i] = options[i];
            }
        }

        return new Promise(function(resolve, reject) {
            var openreq = indexedDB.open(dbInfo.name, dbInfo.version);
            openreq.onerror = function withStoreOnError() {
                reject(openreq.error);
            };
            openreq.onupgradeneeded = function withStoreOnUpgradeNeeded() {
                // First time setup: create an empty object store
                openreq.result.createObjectStore(dbInfo.storeName);
            };
            openreq.onsuccess = function withStoreOnSuccess() {
                db = openreq.result;
                resolve();
            };
        });
    }

    function getItem(key, callback) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.ready().then(function() {
                var store = db.transaction(dbInfo.storeName, 'readonly')
                              .objectStore(dbInfo.storeName);
                var req = store.get(key);

                req.onsuccess = function() {
                    var value = req.result;
                    if (value === undefined) {
                        value = null;
                    }

                    if (callback) {
                        callback(value);
                    }

                    resolve(value);
                };

                req.onerror = function() {
                    if (callback) {
                        callback(null, req.error);
                    }

                    reject(req.error);
                };
            });
        });
    }

    function setItem(key, value, callback) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.ready().then(function() {
                var store = db.transaction(dbInfo.storeName, 'readwrite')
                              .objectStore(dbInfo.storeName);

                // Cast to undefined so the value passed to callback/promise is
                // the same as what one would get out of `getItem()` later.
                // This leads to some weirdness (setItem('foo', undefined) will
                // return "null"), but it's not my fault localStorage is our
                // baseline and that it's weird.
                if (value === undefined) {
                    value = null;
                }

                var req = store.put(value, key);
                req.onsuccess = function() {
                    if (callback) {
                        callback(value);
                    }

                    resolve(value);
                };
                req.onerror = function() {
                    if (callback) {
                        callback(null, req.error);
                    }

                    reject(req.error);
                };
            });
        });
    }

    function removeItem(key, callback) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.ready().then(function() {
                var store = db.transaction(dbInfo.storeName, 'readwrite')
                              .objectStore(dbInfo.storeName);

                // We use `['delete']` instead of `.delete` because IE 8 will
                // throw a fit if it sees the reserved word "delete" in this
                // scenario. See: https://github.com/mozilla/localForage/pull/67
                //
                // This can be removed once we no longer care about IE 8, for
                // what that's worth.
                // TODO: Write a test against this? Maybe IE in general? Also,
                // make sure the minify step doesn't optimise this to `.delete`,
                // though it currently doesn't.
                var req = store['delete'](key);
                req.onsuccess = function() {
                    if (callback) {
                        callback();
                    }

                    resolve();
                };

                req.onerror = function() {
                    if (callback) {
                        callback(req.error);
                    }

                    reject(req.error);
                };

                // The request will be aborted if we've exceeded our storage
                // space. In this case, we will reject with a specific
                // "QuotaExceededError".
                req.onabort = function(event) {
                    var error = event.target.error;
                    if (error === 'QuotaExceededError') {
                        if (callback) {
                            callback(error);
                        }

                        reject(error);
                    }
                };
            });
        });
    }

    function clear(callback) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.ready().then(function() {
                var store = db.transaction(dbInfo.storeName, 'readwrite')
                              .objectStore(dbInfo.storeName);
                var req = store.clear();

                req.onsuccess = function() {
                    if (callback) {
                        callback();
                    }

                    resolve();
                };

                req.onerror = function() {
                    if (callback) {
                        callback(null, req.error);
                    }

                    reject(req.error);
                };
            });
        });
    }

    function length(callback) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.ready().then(function() {
                var store = db.transaction(dbInfo.storeName, 'readonly')
                              .objectStore(dbInfo.storeName);
                var req = store.count();

                req.onsuccess = function() {
                    if (callback) {
                        callback(req.result);
                    }

                    resolve(req.result);
                };

                req.onerror = function() {
                    if (callback) {
                        callback(null, req.error);
                    }

                    reject(req.error);
                };
            });
        });
    }

    function key(n, callback) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            if (n < 0) {
                if (callback) {
                    callback(null);
                }

                resolve(null);

                return;
            }

            _this.ready().then(function() {
                var store = db.transaction(dbInfo.storeName, 'readonly')
                              .objectStore(dbInfo.storeName);

                var advanced = false;
                var req = store.openCursor();
                req.onsuccess = function() {
                    var cursor = req.result;
                    if (!cursor) {
                        // this means there weren't enough keys
                        if (callback) {
                            callback(null);
                        }

                        resolve(null);

                        return;
                    }

                    if (n === 0) {
                        // We have the first key, return it if that's what they
                        // wanted.
                        if (callback) {
                            callback(cursor.key);
                        }

                        resolve(cursor.key);
                    } else {
                        if (!advanced) {
                            // Otherwise, ask the cursor to skip ahead n
                            // records.
                            advanced = true;
                            cursor.advance(n);
                        } else {
                            // When we get here, we've got the nth key.
                            if (callback) {
                                callback(cursor.key);
                            }

                            resolve(cursor.key);
                        }
                    }
                };

                req.onerror = function() {
                    if (callback) {
                        callback(null, req.error);
                    }

                    reject(req.error);
                };
            });
        });
    }

    var asyncStorage = {
        _driver: 'asyncStorage',
        _initStorage: _initStorage,
        getItem: getItem,
        setItem: setItem,
        removeItem: removeItem,
        clear: clear,
        length: length,
        key: key
    };

    if (typeof define === 'function' && define.amd) {
        define('asyncStorage', function() {
            return asyncStorage;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = asyncStorage;
    } else {
        this.asyncStorage = asyncStorage;
    }
}).call(this);
// If IndexedDB isn't available, we'll fall back to localStorage.
// Note that this will have considerable performance and storage
// side-effects (all data will be serialized on save and only data that
// can be converted to a string via `JSON.stringify()` will be saved).
(function() {
    'use strict';

    var keyPrefix = '';
    var dbInfo = {};
    // Promises!
    var Promise = (typeof module !== 'undefined' && module.exports) ?
                  require('promise') : this.Promise;
    var localStorage = null;

    // If the app is running inside a Google Chrome packaged webapp, or some
    // other context where localStorage isn't available, we don't use
    // localStorage. This feature detection is preferred over the old
    // `if (window.chrome && window.chrome.runtime)` code.
    // See: https://github.com/mozilla/localForage/issues/68
    try {
        // Initialize localStorage and create a variable to use throughout
        // the code.
        localStorage = this.localStorage;
    } catch (e) {
        return;
    }

    // Config the localStorage backend, using options set in the config.
    function _initStorage(options) {
        if (options) {
            for (var i in options) {
                dbInfo[i] = options[i];
            }
        }

        keyPrefix = dbInfo.name + '/';

        return Promise.resolve();
    }

    var SERIALIZED_MARKER = '__lfsc__:';
    var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;

    // OMG the serializations!
    var TYPE_ARRAYBUFFER = 'arbf';
    var TYPE_BLOB = 'blob';
    var TYPE_INT8ARRAY = 'si08';
    var TYPE_UINT8ARRAY = 'ui08';
    var TYPE_UINT8CLAMPEDARRAY = 'uic8';
    var TYPE_INT16ARRAY = 'si16';
    var TYPE_INT32ARRAY = 'si32';
    var TYPE_UINT16ARRAY = 'ur16';
    var TYPE_UINT32ARRAY = 'ui32';
    var TYPE_FLOAT32ARRAY = 'fl32';
    var TYPE_FLOAT64ARRAY = 'fl64';
    var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;

    // Remove all keys from the datastore, effectively destroying all data in
    // the app's key/value store!
    function clear(callback) {
        var _this = this;
        return new Promise(function(resolve) {
            _this.ready().then(function() {
                localStorage.clear();

                if (callback) {
                    callback();
                }

                resolve();
            });
        });
    }

    // Retrieve an item from the store. Unlike the original async_storage
    // library in Gaia, we don't modify return values at all. If a key's value
    // is `undefined`, we pass that value to the callback function.
    function getItem(key, callback) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.ready().then(function() {
                try {
                    var result = localStorage.getItem(keyPrefix + key);

                    // If a result was found, parse it from the serialized
                    // string into a JS object. If result isn't truthy, the key
                    // is likely undefined and we'll pass it straight to the
                    // callback.
                    if (result) {
                        result = _deserialize(result);
                    }

                    if (callback) {
                        callback(result, null);
                    }

                    resolve(result);
                } catch (e) {
                    if (callback) {
                        callback(null, e);
                    }

                    reject(e);
                }
            });
        });
    }

    // Same as localStorage's key() method, except takes a callback.
    function key(n, callback) {
        var _this = this;
        return new Promise(function(resolve) {
            _this.ready().then(function() {
                var result = localStorage.key(n);

                // Remove the prefix from the key, if a key is found.
                if (result) {
                    result = result.substring(keyPrefix.length);
                }

                if (callback) {
                    callback(result);
                }
                resolve(result);
            });
        });
    }

    // Supply the number of keys in the datastore to the callback function.
    function length(callback) {
        var _this = this;
        return new Promise(function(resolve) {
            _this.ready().then(function() {
                var result = localStorage.length;

                if (callback) {
                    callback(result);
                }

                resolve(result);
            });
        });
    }

    // Remove an item from the store, nice and simple.
    function removeItem(key, callback) {
        var _this = this;
        return new Promise(function(resolve) {
            _this.ready().then(function() {
                localStorage.removeItem(keyPrefix + key);

                if (callback) {
                    callback();
                }

                resolve();
            });
        });
    }

    // Deserialize data we've inserted into a value column/field. We place
    // special markers into our strings to mark them as encoded; this isn't
    // as nice as a meta field, but it's the only sane thing we can do whilst
    // keeping localStorage support intact.
    //
    // Oftentimes this will just deserialize JSON content, but if we have a
    // special marker (SERIALIZED_MARKER, defined above), we will extract
    // some kind of arraybuffer/binary data/typed array out of the string.
    function _deserialize(value) {
        // If we haven't marked this string as being specially serialized (i.e.
        // something other than serialized JSON), we can just return it and be
        // done with it.
        if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
            return JSON.parse(value);
        }

        // The following code deals with deserializing some kind of Blob or
        // TypedArray. First we separate out the type of data we're dealing
        // with from the data itself.
        var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
        var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);

        // Fill the string into a ArrayBuffer.
        var buffer = new ArrayBuffer(serializedString.length * 2); // 2 bytes for each char
        var bufferView = new Uint16Array(buffer);
        for (var i = serializedString.length - 1; i >= 0; i--) {
            bufferView[i] = serializedString.charCodeAt(i);
        }

        // Return the right type based on the code/type set during
        // serialization.
        switch (type) {
            case TYPE_ARRAYBUFFER:
                return buffer;
            case TYPE_BLOB:
                return new Blob([buffer]);
            case TYPE_INT8ARRAY:
                return new Int8Array(buffer);
            case TYPE_UINT8ARRAY:
                return new Uint8Array(buffer);
            case TYPE_UINT8CLAMPEDARRAY:
                return new Uint8ClampedArray(buffer);
            case TYPE_INT16ARRAY:
                return new Int16Array(buffer);
            case TYPE_UINT16ARRAY:
                return new Uint16Array(buffer);
            case TYPE_INT32ARRAY:
                return new Int32Array(buffer);
            case TYPE_UINT32ARRAY:
                return new Uint32Array(buffer);
            case TYPE_FLOAT32ARRAY:
                return new Float32Array(buffer);
            case TYPE_FLOAT64ARRAY:
                return new Float64Array(buffer);
            default:
                throw new Error('Unkown type: ' + type);
        }
    }

    // Converts a buffer to a string to store, serialized, in the backend
    // storage library.
    function _bufferToString(buffer) {
        var str = '';
        var uint16Array = new Uint16Array(buffer);

        try {
            str = String.fromCharCode.apply(null, uint16Array);
        } catch (e) {
            // This is a fallback implementation in case the first one does
            // not work. This is required to get the phantomjs passing...
            for (var i = 0; i < uint16Array.length; i++) {
                str += String.fromCharCode(uint16Array[i]);
            }
        }

        return str;
    }

    // Serialize a value, afterwards executing a callback (which usually
    // instructs the `setItem()` callback/promise to be executed). This is how
    // we store binary data with localStorage.
    function _serialize(value, callback) {
        var valueString = '';
        if (value) {
            valueString = value.toString();
        }

        // Cannot use `value instanceof ArrayBuffer` or such here, as these
        // checks fail when running the tests using casper.js...
        //
        // TODO: See why those tests fail and use a better solution.
        if (value && (value.toString() === '[object ArrayBuffer]' ||
                      value.buffer && value.buffer.toString() === '[object ArrayBuffer]')) {
            // Convert binary arrays to a string and prefix the string with
            // a special marker.
            var buffer;
            var marker = SERIALIZED_MARKER;

            if (value instanceof ArrayBuffer) {
                buffer = value;
                marker += TYPE_ARRAYBUFFER;
            } else {
                buffer = value.buffer;

                if (valueString === '[object Int8Array]') {
                    marker += TYPE_INT8ARRAY;
                } else if (valueString === '[object Uint8Array]') {
                    marker += TYPE_UINT8ARRAY;
                } else if (valueString === '[object Uint8ClampedArray]') {
                    marker += TYPE_UINT8CLAMPEDARRAY;
                } else if (valueString === '[object Int16Array]') {
                    marker += TYPE_INT16ARRAY;
                } else if (valueString === '[object Uint16Array]') {
                    marker += TYPE_UINT16ARRAY;
                } else if (valueString === '[object Int32Array]') {
                    marker += TYPE_INT32ARRAY;
                } else if (valueString === '[object Uint32Array]') {
                    marker += TYPE_UINT32ARRAY;
                } else if (valueString === '[object Float32Array]') {
                    marker += TYPE_FLOAT32ARRAY;
                } else if (valueString === '[object Float64Array]') {
                    marker += TYPE_FLOAT64ARRAY;
                } else {
                    callback(new Error("Failed to get type for BinaryArray"));
                }
            }

            callback(marker + _bufferToString(buffer));
        } else if (valueString === "[object Blob]") {
            // Conver the blob to a binaryArray and then to a string.
            var fileReader = new FileReader();

            fileReader.onload = function() {
                var str = _bufferToString(this.result);

                callback(SERIALIZED_MARKER + TYPE_BLOB + str);
            };

            fileReader.readAsArrayBuffer(value);
        } else {
            try {
                callback(JSON.stringify(value));
            } catch (e) {
                if (this.console && this.console.error) {
                    this.console.error("Couldn't convert value into a JSON string: ", value);
                }

                callback(null, e);
            }
        }
    }

    // Set a key's value and run an optional callback once the value is set.
    // Unlike Gaia's implementation, the callback function is passed the value,
    // in case you want to operate on that value only after you're sure it
    // saved, or something like that.
    function setItem(key, value, callback) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.ready().then(function() {
                // Convert undefined values to null.
                // https://github.com/mozilla/localForage/pull/42
                if (value === undefined) {
                    value = null;
                }

                // Save the original value to pass to the callback.
                var originalValue = value;

                _serialize(value, function(value, error) {
                    if (error) {
                        if (callback) {
                            callback(null, error);
                        }

                        reject(error);
                    } else {
                        try {
                            localStorage.setItem(keyPrefix + key, value);
                        } catch (e) {
                            // localStorage capacity exceeded.
                            // TODO: Make this a specific error/event.
                            if (e.name === 'QuotaExceededError' ||
                                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                                if (callback) {
                                    callback(null, e);
                                }

                                reject(e);
                            }
                        }

                        if (callback) {
                            callback(originalValue);
                        }

                        resolve(originalValue);
                    }
                });
            });
        });
    }

    var localStorageWrapper = {
        _driver: 'localStorageWrapper',
        _initStorage: _initStorage,
        // Default API, from Gaia/localStorage.
        getItem: getItem,
        setItem: setItem,
        removeItem: removeItem,
        clear: clear,
        length: length,
        key: key
    };

    if (typeof define === 'function' && define.amd) {
        define('localStorageWrapper', function() {
            return localStorageWrapper;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = localStorageWrapper;
    } else {
        this.localStorageWrapper = localStorageWrapper;
    }
}).call(this);
/*
 * Includes code from:
 *
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function() {
    'use strict';

    // Sadly, the best way to save binary data in WebSQL is Base64 serializing
    // it, so this is how we store it to prevent very strange errors with less
    // verbose ways of binary <-> string data storage.
    var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    // Promises!
    var Promise = (typeof module !== 'undefined' && module.exports) ?
                  require('promise') : this.Promise;

    var openDatabase = this.openDatabase;
    var db = null;
    var dbInfo = {};

    var SERIALIZED_MARKER = '__lfsc__:';
    var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;

    // OMG the serializations!
    var TYPE_ARRAYBUFFER = 'arbf';
    var TYPE_BLOB = 'blob';
    var TYPE_INT8ARRAY = 'si08';
    var TYPE_UINT8ARRAY = 'ui08';
    var TYPE_UINT8CLAMPEDARRAY = 'uic8';
    var TYPE_INT16ARRAY = 'si16';
    var TYPE_INT32ARRAY = 'si32';
    var TYPE_UINT16ARRAY = 'ur16';
    var TYPE_UINT32ARRAY = 'ui32';
    var TYPE_FLOAT32ARRAY = 'fl32';
    var TYPE_FLOAT64ARRAY = 'fl64';
    var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;

    // If WebSQL methods aren't available, we can stop now.
    if (!openDatabase) {
        return;
    }

    // Open the WebSQL database (automatically creates one if one didn't
    // previously exist), using any options set in the config.
    function _initStorage(options) {
        var _this = this;

        if (options) {
            for (var i in options) {
                dbInfo[i] = typeof(options[i]) !== 'string' ? options[i].toString() : options[i];
            }
        }

        return new Promise(function(resolve) {
            // Open the database; the openDatabase API will automatically
            // create it for us if it doesn't exist.
            try {
                db = openDatabase(dbInfo.name, dbInfo.version,
                                  dbInfo.description, dbInfo.size);
            } catch (e) {
                return _this.setDriver('localStorageWrapper').then(resolve);
            }

            // Create our key/value table if it doesn't exist.
            db.transaction(function(t) {
                t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + 
                             ' (id INTEGER PRIMARY KEY, key unique, value)', [], function() {
                    resolve();
                }, null);
            });
        });
    }

    function getItem(key, callback) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.ready().then(function() {
                db.transaction(function(t) {
                    t.executeSql('SELECT * FROM ' + dbInfo.storeName + 
                                 ' WHERE key = ? LIMIT 1', [key], function(t, results) {
                        var result = results.rows.length ? results.rows.item(0).value : null;

                        // Check to see if this is serialized content we need to
                        // unpack.
                        if (result) {
                            result = _deserialize(result);
                        }

                        if (callback) {
                            callback(result);
                        }

                        resolve(result);
                    }, function(t, error) {
                        if (callback) {
                            callback(null, error);
                        }

                        reject(error);
                    });
                });
            });
        });
    }

    function setItem(key, value, callback) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.ready().then(function() {
                // The localStorage API doesn't return undefined values in an
                // "expected" way, so undefined is always cast to null in all
                // drivers. See: https://github.com/mozilla/localForage/pull/42
                if (value === undefined) {
                    value = null;
                }

                // Save the original value to pass to the callback.
                var originalValue = value;

                _serialize(value, function(value, error) {
                    if (error) {
                        reject(error);
                    } else {
                        db.transaction(function(t) {
                            t.executeSql('INSERT OR REPLACE INTO ' + dbInfo.storeName + 
                                         ' (key, value) VALUES (?, ?)', [key, value], function() {
                                if (callback) {
                                    callback(originalValue);
                                }

                                resolve(originalValue);
                            }, function(t, error) {
                                if (callback) {
                                    callback(null, error);
                                }

                                reject(error);
                            });
                        }, function(sqlError) { // The transaction failed; check
                                                // to see if it's a quota error.
                            if (sqlError.code === sqlError.QUOTA_ERR) {
                                // We reject the callback outright for now, but
                                // it's worth trying to re-run the transaction.
                                // Even if the user accepts the prompt to use
                                // more storage on Safari, this error will
                                // be called.
                                //
                                // TODO: Try to re-run the transaction.
                                if (callback) {
                                    callback(null, sqlError);
                                }

                                reject(sqlError);
                            }
                        });
                    }
                });
            });
        });
    }

    function removeItem(key, callback) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.ready().then(function() {
                db.transaction(function(t) {
                    t.executeSql('DELETE FROM ' + dbInfo.storeName + 
                                 ' WHERE key = ?', [key], function() {
                        if (callback) {
                            callback();
                        }

                        resolve();
                    }, function(t, error) {
                        if (callback) {
                            callback(error);
                        }

                        reject(error);
                    });
                });
            });
        });
    }

    // Deletes every item in the table.
    // TODO: Find out if this resets the AUTO_INCREMENT number.
    function clear(callback) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.ready().then(function() {
                db.transaction(function(t) {
                    t.executeSql('DELETE FROM ' + dbInfo.storeName, [], function() {
                        if (callback) {
                            callback();
                        }

                        resolve();
                    }, function(t, error) {
                        if (callback) {
                            callback(error);
                        }

                        reject(error);
                    });
                });
            });
        });
    }

    // Does a simple `COUNT(key)` to get the number of items stored in
    // localForage.
    function length(callback) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.ready().then(function() {
                db.transaction(function(t) {
                    // Ahhh, SQL makes this one soooooo easy.
                    t.executeSql('SELECT COUNT(key) as c FROM ' + 
                                 dbInfo.storeName, [], function(t, results) {
                        var result = results.rows.item(0).c;

                        if (callback) {
                            callback(result);
                        }

                        resolve(result);
                    }, function(t, error) {
                        if (callback) {
                            callback(null, error);
                        }

                        reject(error);
                    });
                });
            });
        });
    }

    // Return the key located at key index X; essentially gets the key from a
    // `WHERE id = ?`. This is the most efficient way I can think to implement
    // this rarely-used (in my experience) part of the API, but it can seem
    // inconsistent, because we do `INSERT OR REPLACE INTO` on `setItem()`, so
    // the ID of each key will change every time it's updated. Perhaps a stored
    // procedure for the `setItem()` SQL would solve this problem?
    // TODO: Don't change ID on `setItem()`.
    function key(n, callback) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.ready().then(function() {
                db.transaction(function(t) {
                    t.executeSql('SELECT key FROM ' + dbInfo.storeName +
                                 ' WHERE id = ? LIMIT 1', [n + 1], function(t, results) {
                        var result = results.rows.length ? results.rows.item(0).key : null;

                        if (callback) {
                            callback(result);
                        }

                        resolve(result);
                    }, function(t, error) {
                        if (callback) {
                            callback(null, error);
                        }

                        reject(error);
                    });
                });
            });
        });
    }

    // Converts a buffer to a string to store, serialized, in the backend
    // storage library.
    function _bufferToString(buffer) {
        // base64-arraybuffer
        var bytes = new Uint8Array(buffer);
        var i;
        var base64String = '';

        for (i = 0; i < bytes.length; i += 3) {
            /*jslint bitwise: true */
            base64String += BASE_CHARS[bytes[i] >> 2];
            base64String += BASE_CHARS[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
            base64String += BASE_CHARS[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
            base64String += BASE_CHARS[bytes[i + 2] & 63];
        }

        if ((bytes.length % 3) === 2) {
            base64String = base64String.substring(0, base64String.length - 1) + "=";
        } else if (bytes.length % 3 === 1) {
            base64String = base64String.substring(0, base64String.length - 2) + "==";
        }

        return base64String;
    }

    // Deserialize data we've inserted into a value column/field. We place
    // special markers into our strings to mark them as encoded; this isn't
    // as nice as a meta field, but it's the only sane thing we can do whilst
    // keeping localStorage support intact.
    //
    // Oftentimes this will just deserialize JSON content, but if we have a
    // special marker (SERIALIZED_MARKER, defined above), we will extract
    // some kind of arraybuffer/binary data/typed array out of the string.
    function _deserialize(value) {
        // If we haven't marked this string as being specially serialized (i.e.
        // something other than serialized JSON), we can just return it and be
        // done with it.
        if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
            return JSON.parse(value);
        }

        // The following code deals with deserializing some kind of Blob or
        // TypedArray. First we separate out the type of data we're dealing
        // with from the data itself.
        var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
        var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);

        // Fill the string into a ArrayBuffer.
        var bufferLength = serializedString.length * 0.75;
        var len = serializedString.length;
        var i;
        var p = 0;
        var encoded1, encoded2, encoded3, encoded4;

        if (serializedString[serializedString.length - 1] === "=") {
            bufferLength--;
            if (serializedString[serializedString.length - 2] === "=") {
                bufferLength--;
            }
        }

        var buffer = new ArrayBuffer(bufferLength);
        var bytes = new Uint8Array(buffer);

        for (i = 0; i < len; i+=4) {
            encoded1 = BASE_CHARS.indexOf(serializedString[i]);
            encoded2 = BASE_CHARS.indexOf(serializedString[i+1]);
            encoded3 = BASE_CHARS.indexOf(serializedString[i+2]);
            encoded4 = BASE_CHARS.indexOf(serializedString[i+3]);

            /*jslint bitwise: true */
            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }

        // Return the right type based on the code/type set during
        // serialization.
        switch (type) {
            case TYPE_ARRAYBUFFER:
                return buffer;
            case TYPE_BLOB:
                return new Blob([buffer]);
            case TYPE_INT8ARRAY:
                return new Int8Array(buffer);
            case TYPE_UINT8ARRAY:
                return new Uint8Array(buffer);
            case TYPE_UINT8CLAMPEDARRAY:
                return new Uint8ClampedArray(buffer);
            case TYPE_INT16ARRAY:
                return new Int16Array(buffer);
            case TYPE_UINT16ARRAY:
                return new Uint16Array(buffer);
            case TYPE_INT32ARRAY:
                return new Int32Array(buffer);
            case TYPE_UINT32ARRAY:
                return new Uint32Array(buffer);
            case TYPE_FLOAT32ARRAY:
                return new Float32Array(buffer);
            case TYPE_FLOAT64ARRAY:
                return new Float64Array(buffer);
            default:
                throw new Error('Unkown type: ' + type);
        }
    }

    // Serialize a value, afterwards executing a callback (which usually
    // instructs the `setItem()` callback/promise to be executed). This is how
    // we store binary data with localStorage.
    function _serialize(value, callback) {
        var valueString = '';
        if (value) {
            valueString = value.toString();
        }

        // Cannot use `value instanceof ArrayBuffer` or such here, as these
        // checks fail when running the tests using casper.js...
        //
        // TODO: See why those tests fail and use a better solution.
        if (value && (value.toString() === '[object ArrayBuffer]' ||
                      value.buffer && value.buffer.toString() === '[object ArrayBuffer]')) {
            // Convert binary arrays to a string and prefix the string with
            // a special marker.
            var buffer;
            var marker = SERIALIZED_MARKER;

            if (value instanceof ArrayBuffer) {
                buffer = value;
                marker += TYPE_ARRAYBUFFER;
            } else {
                buffer = value.buffer;

                if (valueString === '[object Int8Array]') {
                    marker += TYPE_INT8ARRAY;
                } else if (valueString === '[object Uint8Array]') {
                    marker += TYPE_UINT8ARRAY;
                } else if (valueString === '[object Uint8ClampedArray]') {
                    marker += TYPE_UINT8CLAMPEDARRAY;
                } else if (valueString === '[object Int16Array]') {
                    marker += TYPE_INT16ARRAY;
                } else if (valueString === '[object Uint16Array]') {
                    marker += TYPE_UINT16ARRAY;
                } else if (valueString === '[object Int32Array]') {
                    marker += TYPE_INT32ARRAY;
                } else if (valueString === '[object Uint32Array]') {
                    marker += TYPE_UINT32ARRAY;
                } else if (valueString === '[object Float32Array]') {
                    marker += TYPE_FLOAT32ARRAY;
                } else if (valueString === '[object Float64Array]') {
                    marker += TYPE_FLOAT64ARRAY;
                } else {
                    callback(new Error("Failed to get type for BinaryArray"));
                }
            }

            callback(marker + _bufferToString(buffer));
        } else if (valueString === "[object Blob]") {
            // Conver the blob to a binaryArray and then to a string.
            var fileReader = new FileReader();

            fileReader.onload = function() {
                var str = _bufferToString(this.result);

                callback(SERIALIZED_MARKER + TYPE_BLOB + str);
            };

            fileReader.readAsArrayBuffer(value);
        } else {
            try {
                callback(JSON.stringify(value));
            } catch (e) {
                if (this.console && this.console.error) {
                    this.console.error("Couldn't convert value into a JSON string: ", value);
                }

                callback(null, e);
            }
        }
    }

    var webSQLStorage = {
        _driver: 'webSQLStorage',
        _initStorage: _initStorage,
        getItem: getItem,
        setItem: setItem,
        removeItem: removeItem,
        clear: clear,
        length: length,
        key: key
    };

    if (typeof define === 'function' && define.amd) {
        define('webSQLStorage', function() {
            return webSQLStorage;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = webSQLStorage;
    } else {
        this.webSQLStorage = webSQLStorage;
    }
}).call(this);
(function() {
    'use strict';

    // Promises!
    var Promise = (typeof module !== 'undefined' && module.exports) ?
                  require('promise') : this.Promise;

    // Avoid those magic constants!
    var MODULE_TYPE_DEFINE = 1;
    var MODULE_TYPE_EXPORT = 2;
    var MODULE_TYPE_WINDOW = 3;

    // Attaching to window (i.e. no module loader) is the assumed,
    // simple default.
    var moduleType = MODULE_TYPE_WINDOW;

    // Find out what kind of module setup we have; if none, we'll just attach
    // localForage to the main window.
    if (typeof define === 'function' && define.amd) {
        moduleType = MODULE_TYPE_DEFINE;
    } else if (typeof module !== 'undefined' && module.exports) {
        moduleType = MODULE_TYPE_EXPORT;
    }

    // Initialize IndexedDB; fall back to vendor-prefixed versions if needed.
    var indexedDB = indexedDB || this.indexedDB || this.webkitIndexedDB ||
                    this.mozIndexedDB || this.OIndexedDB ||
                    this.msIndexedDB;

    var supportsIndexedDB = indexedDB &&
                            indexedDB.open('_localforage_spec_test', 1)
                                     .onupgradeneeded === null;

    // Check for WebSQL.
    var openDatabase = this.openDatabase;

    // The actual localForage object that we expose as a module or via a global.
    // It's extended by pulling in one of our other libraries.
    var _this = this;
    var localForage = {
        INDEXEDDB: 'asyncStorage',
        LOCALSTORAGE: 'localStorageWrapper',
        WEBSQL: 'webSQLStorage',

        _config: {
            description: '',
            name: 'localforage',
            // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
            // we can use without a prompt.
            size: 4980736,
            storeName: 'keyvaluepairs',
            version: 1.0
        },

        // Set any config values for localForage; can be called anytime before
        // the first API call (e.g. `getItem`, `setItem`).
        // We loop through options so we don't overwrite existing config
        // values.
        config: function(options) {
            // If the options argument is an object, we use it to set values.
            // Otherwise, we return either a specified config value or all
            // config values.
            if (typeof(options) === 'object') {
                // If localforage is ready and fully initialized, we can't set
                // any new configuration values. Instead, we return an error.
                if (this._ready) {
                    return new Error("Can't call config() after localforage " +
                                     "has been used.");
                }

                for (var i in options) {
                    this._config[i] = options[i];
                }

                return true;
            } else if (typeof(options) === 'string') {
                return this._config[options];
            } else {
                return this._config;
            }
        },

        driver: function() {
            return this._driver || null;
        },

        _ready: Promise.reject(new Error("setDriver() wasn't called")),

        setDriver: function(driverName, callback) {
            var driverSet = new Promise(function(resolve, reject) {
                if ((!supportsIndexedDB &&
                     driverName === localForage.INDEXEDDB) ||
                    (!openDatabase && driverName === localForage.WEBSQL)) {
                    reject(localForage);

                    return;
                }

                localForage._ready = null;

                // We allow localForage to be declared as a module or as a library
                // available without AMD/require.js.
                if (moduleType === MODULE_TYPE_DEFINE) {
                    require([driverName], function(lib) {
                        localForage._extend(lib);

                        resolve(localForage);
                    });

                    // Return here so we don't resolve the promise twice.
                    return;
                } else if (moduleType === MODULE_TYPE_EXPORT) {
                    // Making it browserify friendly
                    var driver;
                    switch (driverName) {
                        case localForage.INDEXEDDB:
                            driver = require('./drivers/indexeddb');
                            break;
                        case localForage.LOCALSTORAGE:
                            driver = require('./drivers/localstorage');
                            break;
                        case localForage.WEBSQL:
                            driver = require('./drivers/websql');
                    }

                    localForage._extend(driver);
                } else {
                    localForage._extend(_this[driverName]);
                }

                resolve(localForage);
            });

            driverSet.then(callback, callback);

            return driverSet;
        },

        ready: function(callback) {
            if (this._ready === null) {
                this._ready = this._initStorage(this._config);
            }

            this._ready.then(callback, callback);

            return this._ready;
        },

        _extend: function(libraryMethodsAndProperties) {
            for (var i in libraryMethodsAndProperties) {
                if (libraryMethodsAndProperties.hasOwnProperty(i)) {
                    this[i] = libraryMethodsAndProperties[i];
                }
            }
        }
    };

    // Select our storage library.
    var storageLibrary;
    // Check to see if IndexedDB is available and if it is the latest
    // implementation; it's our preferred backend library. We use "_spec_test"
    // as the name of the database because it's not the one we'll operate on,
    // but it's useful to make sure its using the right spec.
    // See: https://github.com/mozilla/localForage/issues/128
    if (supportsIndexedDB) {
        storageLibrary = localForage.INDEXEDDB;
    } else if (openDatabase) { // WebSQL is available, so we'll use that.
        storageLibrary = localForage.WEBSQL;
    } else { // If nothing else is available, we use localStorage.
        storageLibrary = localForage.LOCALSTORAGE;
    }

    // If window.localForageConfig is set, use it for configuration.
    if (this.localForageConfig) {
        localForage.config = this.localForageConfig;
    }

    // Set the (default) driver.
    localForage.setDriver(storageLibrary);

    // We allow localForage to be declared as a module or as a library
    // available without AMD/require.js.
    if (moduleType === MODULE_TYPE_DEFINE) {
        define(function() {
            return localForage;
        });
    } else if (moduleType === MODULE_TYPE_EXPORT) {
        module.exports = localForage;
    } else {
        this.localforage = localForage;
    }
}).call(this);

var globals = {

	paths: {},
	graph: {},
	objects: {},
	triggers: {},
	objectClicked: false,
	viewport: {
		resize: false,
		scale: 1
	},
	scale: 1,
	volume: 0.5,
	locale: 'ru'
}
var scene = function scene() {

	/* Private */
	var stage, // сцена
		renderer, // оператор рендеринга
		masterCanvas, // Физический канвас на вьюпорте
		playGround,
		x = 0, y = 0; // точки отсчета для сцены

	function repaintCanvas() {
		requestAnimFrame(repaintCanvas);
		renderer.render(stage);
	}

	/* Public */

	return {

		// Инициализация сцены
		// Передается селектор физического канваса

		// p.canvasSelector
		init: function ( p ) {
			var _this = this;

			// Обертка над оператором рендера PIXI
			masterCanvas = document.getElementById(p.canvasId); // указатель на DOM
			stage = new PIXI.Stage(0x000000, true); // Корневая сцена

			_this.scale = globals.sceneHeight/masterCanvas.clientHeight;
			_this.width = _this.scale * masterCanvas.clientWidth;
			_this.height = _this.scale * masterCanvas.clientHeight;

			renderer = new PIXI.CanvasRenderer(_this.width, globals.sceneHeight, masterCanvas, false);

			window.addEventListener('resize', function() {
				_this.scale = globals.sceneHeight/masterCanvas.clientHeight;
				_this.width = _this.scale * masterCanvas.clientWidth;
				_this.height = _this.scale * masterCanvas.clientHeight;

				renderer.resize(_this.width, globals.sceneHeight);

				globals.scale = globals.sceneHeight / document.body.clientHeight;

				if (globals.objects.hero) {
					globals.objects.hero.move({
						x: globals.objects.hero.image.position.x,
						y: globals.objects.hero.image.position.y
					})
				}

				if (!!graph) {
					graph.buildGraph({});
				}
			})

			// Контейнер сцены
			// его будем двигать для смещения сцены относительно вьюпорта
			var playGround = new PIXI.DisplayObjectContainer();
			playGround.position.x = x;
			playGround.position.y = y;

			// Добавили контейнер
			stage.addChild( playGround );

			// Запустили перерисовку холста
			repaintCanvas();

			_this.stage = stage;
			_this.playGround = playGround;
			_this.zindex = Z.zindex;

			return _this;
		},

		// На сцену в произвольный момент может быть добавлен один из существующих объектов
		// p.image
		addObj: function ( p ) {
			var _this = this;

			Z.addZindex( p );

			if (p.ai) {
				p.ai.start();
			}

			return _this;
		},

		// Смещение сцены (не путать со смещением объекта)
		// p.dx
		// p.dy
		move: function ( p ) {
			var _this = this,
				maxYShift = ( _this.height / globals.scale - (_this.height / globals.scale ) * (globals.viewport.scale ) ) * globals.scale,
				maxXShift = ( _this.width / globals.scale - (globals.sceneWidth / globals.scale ) * (globals.viewport.scale ) ) * globals.scale;

			_this.playGround.position.x = ( p.dx || _this.playGround.position.x );
			_this.playGround.position.y = ( p.dy || _this.playGround.position.y );

			_this.playGround.position.x = _this.playGround.position.x < maxXShift
				? maxXShift
				: _this.playGround.position.x;

			_this.playGround.position.x = _this.playGround.position.x > 0
				? 0
				: _this.playGround.position.x;

			_this.playGround.position.y = _this.playGround.position.y < maxYShift
				? maxYShift
				: _this.playGround.position.y;

			_this.playGround.position.y = _this.playGround.position.y > 0
				? 0
				: _this.playGround.position.y;

			if (debug) {
				document.querySelector('.debug__wrap').scrollLeft = (( p.dx || _this.playGround.position.x ) / globals.scale * (-1));
			}

			return _this;
		}
	}
}();

var Z = function() {

	var zindex = {
			'base': {
				'index': null,
				'next': null,
				'children': null
			}
		}

	return {
		getZindex: function () {
			return zindex;
		},
		addZindex: function ( p ) {
			function addChild(next ) {
				var child = Math.random();

				zindex[p.z].children[child] = {
					'index': p.pz,
					'data': p,
					'next': next
				}

				p.priorityZindex = child; // отражает индекс приоритета в дереве Z-плоскостей

				return zindex[p.z].children[child];
			}

			// Если еще нет такой плоскости
			if (zindex[p.z] === undefined) {
				// создаем

				zindex[p.z] = {
					index: p.z,
					next: null,
					children: {
						'base': {
							'index': null,
							'data': null,
							'next': null
						}
					}
				}

				// Добавляем целевой приоритет в конец списка
				zindex[p.z].children['base'].next = addChild(null);
			}

			// добавляем в индекс
			var currentPlain = zindex['base'],
				previousPlain = zindex['base'],
				stackIndex = 0;

			while(currentPlain !== null) {

				// если текущая плоскость — не корневая
				if (currentPlain.index !== null) {
					stackIndex += Object.keys(currentPlain.children).length-1;

					// Индекс текущей плоскости меньше, чем целевой.
					// Можно перейти дальше
					if (currentPlain.index < p.z) {
						if (currentPlain.next !== null) {
							previousPlain = currentPlain; // сохранить предыдущую на всякий случай
							currentPlain = currentPlain.next; // продолжили обход
						} else {
							currentPlain.next = zindex[p.z];
							break;
						}
					} else {

						// Индекс текущей плоскости превышает целевой.
						// Это означает, что объекта с целевым индексом еще нет с списке
						// Нужно добавить — поправить две ссылки
						if (currentPlain.index > p.z) {
							zindex[p.z].next = previousPlain.next; // следующим объектом для нового элемета станет тот, который раньше был следущим для предыдущего
							previousPlain.next = zindex[p.z]; // новый элемент станет следующим для того, кто раньше был предыдущим
							break; // ссылки проставили, можно покидать список. Приоритет вывода мы установили, когда создавали плоскость
						} else {

							// В списке уже сушествует плоскость с таким индексом
							// Всё, что нужно сделать — проставить нужный приоритет вывода
							var currentPriorityPlain = currentPlain.children.base,
								previousPriorityPlain = currentPlain.children.base

							while (currentPriorityPlain !== null) {

								if (currentPriorityPlain.index !== null) {
									stackIndex++;

									// Пропускаем все приоритеты ниже и равные указанному
									if (currentPriorityPlain.index <= p.pz) {
										if (currentPriorityPlain.next !== null) {
											previousPriorityPlain = currentPriorityPlain;
											currentPriorityPlain = currentPriorityPlain.next;
										} else {
											// Добавляем целевой приоритет в конец списка
											currentPriorityPlain.next = addChild(null);
											// Выходим
											break;
										}
									} else {
										// Нашли первый приоритет, который больше целевого. Вставляем перед ним
										previousPriorityPlain.next = addChild(previousPriorityPlain.next)
										// Выходим
										break;
									}

								} else {
									if (currentPriorityPlain.next !== null) {
										previousPriorityPlain = currentPriorityPlain;
										currentPriorityPlain = currentPriorityPlain.next;
									} else {
										// Добавляем целевой приоритет в конец списка
										currentPriorityPlain.next = addChild(null);
										// Выходим
										break;
									}
								}
							}

							break;
						}
					}
				} else {

					// Плоскость — корневая
					if (currentPlain.next == null) {

						// Кроме корневой плоскости в списке ничего нет.
						currentPlain.next = zindex[p.z]; // добавили новую плоскость следующей за корневой
						break; // вышли из цикла
					} else {

						// Кроме корневой плоскости в списке что-то есть
						currentPlain = currentPlain.next; // начали обход
					}
				}
			}
			p.stackZindex = stackIndex; // отражает позицию в стеке на отрисовку

			Z.drawZindex(scene.playGround);
		},
		changeZindex: function ( p ) {
			// Оч. грубо — удалим приоритет из списка
			// плоскость можно не трогать — вдруг понадобится?

			// Затем измение значение плоскости в объекте
			var currentStackIndex = p.obj.stackZindex,
				currentZindex = p.obj.z,
				currentPriorityZIndex = p.obj.priorityZindex,
				objectPriorityIndex = p.obj.pz,
				currentPriorityPlain = zindex[currentZindex].children.base;

			while (currentPriorityPlain.next !== zindex[currentZindex].children[currentPriorityZIndex]) {
				currentPriorityPlain = currentPriorityPlain.next;
			}
			currentPriorityPlain.next = currentPriorityPlain.next.next;

			delete zindex[currentZindex].children[currentPriorityZIndex];
			p.obj.z = p.z;

			Z.addZindex(p.obj);
		},
		drawZindex: function (playGround) {
			var currentPlain = zindex.base.next;

			// Оч. грубо — удалим все элементы и нарисуем из списка всё заново
			while (scene.playGround.children.length) {
				scene.playGround.removeChild(scene.playGround.children[0]);
			}

			while (currentPlain !== null) {
				var currentPriorityPlain = currentPlain.children.base.next;

				while (currentPriorityPlain !== null) {
					scene.playGround.addChild( currentPriorityPlain.data.image );
					currentPriorityPlain = currentPriorityPlain.next;
				}

				currentPlain = currentPlain.next;
			}
		}
	}

}();
var viewport = (function() {
	var magicYHeroShift = 0;


	function viewportInitScale( p ) {
		globals.viewport.resize = true;
		globals.viewport.distance = Math.sqrt( ( p.x1 - p.x2 )*( p.x1 - p.x2 ) + ( p.y1 - p.y2 )*( p.y1 - p.y2 ) );

		globals.viewport.sceneX = scene.playGround.position.x - globals.objects.hero.image.position.x * (1 - globals.viewport.scale);
		globals.viewport.sceneY = scene.playGround.position.y - (globals.objects.hero.image.position.y + magicYHeroShift) * (1 - globals.viewport.scale);
	}

	function viewportProcessScale( p ) {
		var newDistance = Math.sqrt( ( p.x1 - p.x2 )*( p.x1 - p.x2 ) + ( p.y1 - p.y2 )*( p.y1 - p.y2 ) ),
			k = globals.viewport.scale * (newDistance / globals.viewport.distance);

		// не обрабатывать, если масштаб меньше 1
		if (k < 1) {
			globals.viewport.scale = 1;
			return false;
		}

		if (k > 2.5) {
			globals.viewport.scale = 2.5;
			return false;
		}

		var x = (globals.objects.hero.image.position.x) * (1-k),
			y = (globals.objects.hero.image.position.y + magicYHeroShift) * (1-k),
			rx = globals.viewport.sceneX + x,
			ry = globals.viewport.sceneY + y,
			maxYShift = (scene.height / globals.scale - (scene.height / globals.scale ) * (k) ) * globals.scale,
			maxXShift = (scene.width / globals.scale - (globals.sceneWidth / globals.scale ) * (k) ) * globals.scale;

		rx = rx < maxXShift
			? maxXShift
			: rx;

		rx = (rx > 0)
			? 0
			: rx;

		ry = ry < maxYShift
			? maxYShift
			: ry;

		ry = (ry > 0)
			? 0
			: ry;

		scene.playGround.scale = {
			x: k,
			y: k
		};

		scene.playGround.position.x = rx;
		scene.playGround.position.y = ry;

		globals.viewport.x = x;
		globals.viewport.y = y;
	}

	function viewportSaveScale() {
		setTimeout(function() {
			globals.viewport.resize = false;
		}, 100)

		globals.viewport.scale = scene.playGround.scale.x;
	}

	function attachEvents() {

		if ('ontouchend' in document) {

			window.addEventListener('touchstart', function(e) {
				e.preventDefault();

				if (e.touches.length > 1) {
					viewportInitScale({
						x1: e.touches[0].pageX,
						x2: e.touches[1].pageX,
						y1: e.touches[0].pageY,
						y2: e.touches[1].pageY
					})
				}
			})

			window.addEventListener('touchmove', function(e) {
				if ( (globals.viewport.resize) && (e.touches.length > 1) ) {
					viewportProcessScale({
						x1: e.touches[0].pageX,
						x2: e.touches[1].pageX,
						y1: e.touches[0].pageY,
						y2: e.touches[1].pageY
					})
				}
			})

			window.addEventListener('touchend', function(e) {
				if ( globals.viewport.resize ) {
					viewportSaveScale();
				}
			})

		} else {

			window.addEventListener('mousedown', function(e) {
				if (e.altKey) {
					viewportInitScale({
						x1: e.pageX,
						x2: 0,
						y1: e.pageY,
						y2: 0
					})
				}
			})

			window.addEventListener('mousemove', function(e) {
				if (globals.viewport.resize) {
					viewportProcessScale({
						x1: e.pageX,
						x2: 0,
						y1: e.pageY,
						y2: 0
					})
				}
			})

			window.addEventListener('mouseup', function(e) {
				if (globals.viewport.resize) {
				 viewportSaveScale()
				}
			})

		}
	}

	return {

		init: function() {
			attachEvents();
		}
	}

})()
var pathfinder = (function() {

	// Прохождение по массиву путей
	// У промежуточных путей targetChain считается конечной точкой,
	// у последнего пути — берется из параметра
	function processPaths( p ) {
		var servicePoints,
			step = p.currentObject.step,
			resultPath = [];

		function getAnimation( p ) {
			var resultAnimation = {
				animation: p.animation,
				speed: p.speed
			}

			// Приоритет анимаций —
			// 1. Задана явно
			// 2. Взята из параметров траектории для этого объкта
			// 3. Первая анимация из всех доступных для этого объекта
			resultAnimation.animation = resultAnimation.animation || (globals.paths[ p.pathId ].objects && globals.paths[ p.pathId ].objects[ p.obj ] && globals.paths[ p.pathId ].objects[ p.obj ].animation) || globals.objects[ p.obj ].image.spineData.animations[0].name;
			resultAnimation.speed = resultAnimation.speed || (globals.paths[ p.pathId ].objects && globals.paths[ p.pathId ].objects[ p.obj ] && globals.paths[ p.pathId ].objects[ p.obj ].speed) || 0;

			return resultAnimation;
		}

		// Вычисляет целевой targetChain на промежуточных путях, а также шаг,
		// возникающий после достижения этого targetChain
		function getServicePoint(path0, path1) {
			var serviceChain,
				serviceStep;

			var path0point1 = {
				x: globals.paths[ path0 ].dots[0].mainHandle.x,
				y: globals.paths[ path0 ].dots[0].mainHandle.y
			}

			var path0point2 = {
				x: globals.paths[ path0 ].dots[ globals.paths[ path0 ].dots.length-1 ].mainHandle.x,
				y: globals.paths[ path0 ].dots[ globals.paths[ path0 ].dots.length-1 ].mainHandle.y
			}

			var path1point1 = {
				x: globals.paths[ path1 ].dots[0].mainHandle.x,
				y: globals.paths[ path1 ].dots[0].mainHandle.y,
			}

			var path1point2 = {
				x: globals.paths[ path1 ].dots[ globals.paths[ path1 ].dots.length-1 ].mainHandle.x,
				y: globals.paths[ path1 ].dots[ globals.paths[ path1 ].dots.length-1 ].mainHandle.y
			}

			if ( (path0point1.x == path1point1.x) && (path0point1.y == path1point1.y) ) {
				serviceChain = 0;
				serviceStep = 0;
			}

			if ( (path0point1.x == path1point2.x) && (path0point1.y == path1point2.y) ) {
				serviceChain = 0;
				serviceStep = globals.paths[ path1 ].steps.length;
			}

			if ( (path0point2.x == path1point1.x) && (path0point2.y == path1point1.y) ) {
				serviceChain = globals.paths[ path0 ].controlPath.length-1;
				serviceStep = 0;
			}

			if ( (path0point2.x == path1point2.x) && (path0point2.y == path1point2.y) ) {
				serviceChain = globals.paths[ path0 ].controlPath.length-1;
				serviceStep = globals.paths[ path1 ].steps.length;
			}

			return {
				serviceChain: serviceChain,
				serviceStep: serviceStep
			}
		}

		if (p.pathArray.length > 1) {
			for (var i = 1; i < p.pathArray.length; i++) {
				var pathId = p.pathArray[i-1],
					objectAnimation = getAnimation({
						obj: p.currentObject.id,
						pathId: pathId,
						animation: p.animationName,
						speed: p.speedValue
					});

				servicePoints = getServicePoint( p.pathArray[i-1], p.pathArray[i] );

				resultPath.push({
					pathId: pathId,
					targetChain: servicePoints.serviceChain,
					animation: objectAnimation.animation,
					speed: objectAnimation.speed,
					step: step
				})

				step = servicePoints.serviceStep;
			}
		}

		var pathId = p.pathArray[ p.pathArray.length-1 ],
			objectAnimation = getAnimation({
				obj: p.currentObject.id,
				pathId: pathId,
				animation: p.animationName,
				speed: p.speedValue
			});

		resultPath.push({
			pathId: pathId,
			targetChain: p.targetChain,
			animation: objectAnimation.animation,
			speed: objectAnimation.speed,
			step: step
		});

		queue.addToObjPaths({
			objectId: p.currentObject.id,
			paths: resultPath,
			callback: p.callback
		})
	}

	function buildPathArray( p ) {
		// Построение списка путей, необходимых для достижения конечной вершины графа
		if ( p.resultPath.graphIdEnd == null) return false;
		var targetPath = globals.graph[ p.resultPath.graphIdStart].targets[ p.resultPath.graphIdEnd],
			pathArray = [];

		for (var pathSteps = 1; pathSteps < targetPath.path.length; pathSteps++ ) {
			pathArray.push(globals.graph[ targetPath.path[pathSteps-1] ].targets[ targetPath.path[pathSteps] ].pathName );
		}

		pathArray.push( p.resultPath.path);

		if (pathArray[0] !==  p.currentObject.path) {
			pathArray.unshift( p.currentObject.path );
		}

		processPaths( {
			pathArray: pathArray,
			targetChain: p.resultPath.chain,
			currentObject: p.currentObject,
			animationName: p.animationName,
			speedValue: p.speedValue,
			callback: p.callback
		} );
	}

	function findPathToChain( p ) {
		if (!p.currentObject || !globals.paths[p.path] || !globals.paths[ p.currentObject.path ]) return false;

		var path = p.path,
			chain = p.chain,
			currentObject = p.currentObject,

			// Предполагаем, что у искомого пути от объекта до заданной точки в исходном (худшем) состоянии
			// бесконечное число шагов, начальная и конечная вершина графа не определены
			resultPath = p.resultPath || { steps: Number.POSITIVE_INFINITY, graphIdStart: null, graphIdEnd: null },

			candidatePath = [
				{
					steps: globals.paths[path].controlPath[chain].step,
					graphId: globals.paths[path].dots[0].graphId
				},
				{
					steps: globals.paths[path].steps.length - globals.paths[path].controlPath[chain].step,
					graphId: globals.paths[path].dots[ globals.paths[path].dots.length-1 ].graphId
				}
			],

			minPath = {
				steps: Number.POSITIVE_INFINITY,
				graphIdStart: null,
				graphIdEnd: null
			},

			// Отражает количество шагов от объекта до ближайших двух вершин графа
			currentPath = [
				{
					steps: currentObject.step,
					graphId: globals.paths[ currentObject.path ].dots[0].graphId
				},
				{
					steps: globals.paths[ currentObject.path ].steps.length - currentObject.step,
					graphId: globals.paths[ currentObject.path ].dots[ globals.paths[ currentObject.path ].dots.length-1 ].graphId
				}
			];

		// Пары кратчайших путей (2*2)
		for (var currentPathVar = 0 ; currentPathVar < 2; currentPathVar++) {
			for (var candidatePathVar = 0 ; candidatePathVar < 2; candidatePathVar++) {

				var tDistance = currentPath[currentPathVar].steps +
					candidatePath[candidatePathVar].steps +
					globals.graph[ currentPath[currentPathVar].graphId ].targets[ candidatePath[candidatePathVar].graphId ].distance;

				if ( (tDistance) < minPath.steps ) {

					minPath = {
						steps: tDistance,
						graphIdStart: currentPath[currentPathVar].graphId,
						graphIdEnd: candidatePath[candidatePathVar].graphId
					}
				}

			}
		}

		// Сохраняется путь с минимальным числом шагов
		if ( resultPath.steps > minPath.steps ) {

			return {
				steps: minPath.steps,
				graphIdStart: minPath.graphIdStart,
				graphIdEnd: minPath.graphIdEnd,
				path: path,
				chain: chain
			}
		} else {
			return resultPath;
		}
	}

	/**
	* Перемещает объект точку, заданную координатами клика
	* @param
	*/
	function moveObjectByCoords( p ) {
		var currentObject = globals.objects[p.id];
		if (!currentObject) return false;

		// Анимации для перемещения
		/* var animations = globals.hero.image.state.data.skeletonData.animations,
			animationName = 'new';*/

		// Скорость перехода между анимациями
		//globals.hero.image.stateData.setMixByName("new", "stop", 0.8);

		// Поиск шага, сопоставленного с областью клика

		var resultPath = {};

		// перебрать все траектории, понять, на которых из них может лежать целевая точка
		for (path in globals.paths) {
			if ( !globals.paths[path].controlPath || globals.paths[path].breakpath ) continue;

			for (var chain = 0; chain < globals.paths[path].controlPath.length; chain++) {
				if (globals.paths[path].controlPath[chain].rect.contains( p.x * globals.scale, p.y * globals.scale )) {

					// Поиск ближайшей вершины графа из попадающих в область клика
					resultPath = JSON.parse(JSON.stringify(findPathToChain( {
						currentObject: currentObject,
						path: path,
						chain: chain
					})));
				}
			}
		}

		buildPathArray( {
			resultPath: resultPath,
			currentObject: currentObject
		} )
	}

	function moveObjectByChain( p ) {
		var currentObject = globals.objects[p.id];
		if (!currentObject) return false;

		var resultPath = findPathToChain( {
				currentObject: currentObject,
				path: p.path,
				chain: p.chain
			} );

		buildPathArray( {
			resultPath: resultPath,
			currentObject: currentObject,
			animationName: p.animationName,
			speedValue: p.speedValue,
			callback: p.callback
		} )
	}

	function attachPathFinderListeners() {

		if ('ontouchend' in document) {

			window.addEventListener('touchend', function(e) {
				if (globals.objectClicked || globals.viewport.resize) {
					globals.objectClicked = false;
					globals.viewport.resize = false;
					return false;
				}

				if (globals.preventClick) {
					return false;
				}

				moveObjectByCoords({
					id: 'hero',
					x: (e.changedTouches[0].pageX - (scene.playGround.position.x / globals.scale)) / globals.viewport.scale ,
					y: (e.changedTouches[0].pageY - (scene.playGround.position.y / globals.scale)) / globals.viewport.scale
				})
			})

		} else {

			window.addEventListener('click', function(e) {
				if (globals.objectClicked || globals.viewport.resize) {
					globals.objectClicked = false;
					globals.viewport.resize = false;
					return false;
				}

				if (globals.preventClick) {
					return false;
				}

				moveObjectByCoords({
					id: 'hero',
					x: (e.pageX - (scene.playGround.position.x / globals.scale)) / globals.viewport.scale,
					y: (e.pageY - (scene.playGround.position.y / globals.scale)) / globals.viewport.scale
				})


			})

		}

	}

	return {
		start: function() {
			attachPathFinderListeners();
		},

		// p.id
		// p.path
		// p.chain
		moveObjectByChain: function( p ) {
			moveObjectByChain( p );
		}
	}

})();



function ai() {

	var probMatrix = [
		[
			{yes: 1, no: 1},
			{yes: 3, no: 2},
			{yes: 2, no: 2},
			{yes: 3, no: 3},
			{yes: 1, no: 2}
		],
		[
			{yes: 2, no: 4},
			{yes: 0, no: 0},
			{yes: 4, no: 1},
			{yes: 3, no: 3},
			{yes: 1, no: 2}
		],
		[
			{yes: 1, no: 3},
			{yes: 2, no: 1},
			{yes: 1, no: 1},
			{yes: 5, no: 3},
			{yes: 1, no: 2}
		],
		[
			{yes: 1, no: 2},
			{yes: 3, no: 1},
			{yes: 2, no: 2},
			{yes: 3, no: 3},
			{yes: 1, no: 2}
		],
		[
			{yes: 3, no: 5},
			{yes: 2, no: 1},
			{yes: 3, no: 2},
			{yes: 2, no: 2},
			{yes: 0, no: 0}
		]
	],
	obj,
	moveAnimation,
	stayAnimation,
	availablesPaths,
	lookDistance,
	stayTime,
	currentState,
	heroIsVisible = false,
	stop = false;

	function stayOnPlace() {
		currentState = 0;

		setTimeout(function() {
			processAction();
		}, utils.getRandomValue(stayTime) );
	}

	function rotateObject() {
		currentState = 1;

		obj.image.scale.x *= -1;

		processAction();
	}

	function moveToPoint() {
		currentState = 2;

		if (moveAnimation && availablesPaths) {

			var targetChain =  utils.getRandomValue(globals.paths[availablesPaths].controlPath.length-1);

			obj.moveTo({
				path: availablesPaths,
				chain: targetChain,
				animationName: moveAnimation,
				callback: function () {
					processAction();
				}
			})

		} else {
			processAction();
		}
	}

	function playAnimation() {
		currentState = 3;

		if (stayAnimation) {
			obj.animate({
				animation: stayAnimation,
				callback: function () {
					processAction();
				}
			})
		} else {
			processAction();
		}
	}

	function lookAround() {

		currentState = 4;

		if (utils.getDistance({
			x1: obj.image.position.x,
			x2: globals.objects.hero.image.position.x,
			y1: obj.image.position.y,
			y2: globals.objects.hero.image.position.y
		}) < lookDistance) {
			heroIsVisible = true;
		} else {
			heroIsVisible = false;
		}

		processAction();
	}

	function processAction() {
		if (stop) return;

		var prob = utils.getRandomValue(10),
			sum = 0,
			isVisible = heroIsVisible
				? 'yes'
				: 'no';

		for (var i = 0; i < 4; i++)	 {
			sum += probMatrix[currentState][i][isVisible];

			if (sum >= prob) break;
		}

		switch (i) {

			case 0:
				stayOnPlace();
				break;

			case 1:
				rotateObject();
				break;

			case 2:
				moveToPoint();
				break;

			case 3:
				playAnimation();
				break;

			default:
				lookAround();
		}

	}

	function initParams( p ) {

		probMatrix = p.probMatrix || probMatrix;
		moveAnimation = p.moveAnimation || false;
		stayAnimation = p.stayAnimation || false;
		availablesPaths = p.availablesPaths || false;
		lookDistance = p.lookDistance || 300;
		stayTime = p.stayTime || 3000;
		obj = p.obj;
	}

	return {

		init: function ( p ) {

			initParams( p );

			return this;
		},

		start: function() {
			stop = false;
			currentState = 4;
			processAction();
		},

		stop: function() {
			stop = true;
		}
	}
}
function obj() {

	/* Private */
	var animations = {},
		x = -9999,
		y = -9999,
		z = 1,
		pz = 1,
		step = null,
		path = null;
	/* Public */

	return {

		// Создает объект из заданного ресурса
		// в заданную точку (необязательно)
		// с заданной анимацией (необязательно)

		// p.image
		// p.x
		// p.y
		// p.z
		// p.animation
		create: function ( p ) {
			var _this = this;
			if (p.src === undefined) return false;

			function setObjectPosition() {
				_this.image.position.x = (p.x !== undefined) ? p.x : x;
				_this.image.position.y = (p.y !== undefined) ? p.y : y;
				_this.z = (p.z !== undefined) ? p.z : z;
				_this.pz = (p.pz !== undefined) ? p.pz : pz;

				// Если объект расположен на траектории, нет необходимости явно задавать его координаты
				_this.step = (p.step !== undefined) ? p.step : step;
				_this.path = (p.path !== undefined) ? p.path : path;

				if ( (_this.step !== null) && (_this.path !== null) ) {
					if ( (p.x === undefined) || (p.y === undefined) ) {
						_this.image.position.x = globals.paths[ _this.path ].steps[ _this.step ].x;
						_this.image.position.y = globals.paths[ _this.path ].steps[ _this.step ].y;
					}
				}
			}

			function setObjectScale() {
				_this.image.scale.x = _this.image.scale.y = (p.scale !== undefined) ? p.scale : 1
			}

			function setReverse() {
				if (p.reverse) {
					_this.image.scale.x *= -1;
					//_this.image.position.x = centerX - _this.image.scale.x * containerWidth / 2;
				}
			}

			function generateRandomObjectId() {
				var objectId = Math.random().toString();
				if ( globals.objects[objectId] !== undefined) {
					return generateRandomObjectId();
				} else {
					return objectId;
				}
			}

			function setAnimation() {
				if (p.animation) {
					_this.animation = {};

					for (var animationName in p.animation) {
						_this.animation[animationName] = {};

						if (p.animation[animationName].soundSrc) {

							_this.animation[animationName].track = track().load({
								obj: _this,
								url: p.animation[animationName].soundSrc
							})
						}
					}
				}
			}

			function setInteractive() {
				if (p.interactive) {
					_this.image.setInteractive(true);

					_this.image.click = _this.image.tap = function (data) {
						if (globals.viewport.resize) return false;

						globals.objectClicked = true;

						relay.drop({
							obj: _this.id,
							type: 'objectClick'
						});
					}

					_this.image.mouseover = function () {

						document.body.className += ' _cursor';
					}

					_this.image.mouseout = function () {
						document.body.className = document.body.className.replace(/\s_cursor/ig, '');
					}
				}
			}

			function setAI() {
				if (p.ai) {

					_this.ai = ai().init({

						probMatrix: p.ai.probMatrix,
						moveAnimation: p.ai.moveAnimation,
						stayAnimation: p.ai.stayAnimation,
						availablesPaths: p.ai.availablesPaths,
						lookDistance: p.ai.lookDistance,
						obj: _this
					});
				}

			}

			if (p.src.indexOf('.anim') !== -1) {

				var id = p.name
					? p.name
					: generateRandomObjectId();

				_this.type = 'spine';
				_this.src = p.src;
				_this.image = new PIXI.Spine( p.src );
				_this.id = id;
				//_this.image.state.setAnimationByName("stop", false); // STOP

				globals.objects[ id ] = _this;

				relay.drop({
					obj: id,
					type: 'objectAdded'
				});

			} else {
				_this.type = 'image';
				_this.src = p.src;
				_this.image = new PIXI.Sprite.fromImage( p.src );
			}

			setObjectPosition();
			setObjectScale();
			setReverse();
			setAnimation();
			setInteractive();
			setAI();

			return _this;
		},

		// Двигает объект по горизонтали/вертикали, коэффициенту удаления
		// На первом этапе принимаем, что коэффициент удаления не оказывает влияния
		// на скорость движения и размер (перспективу), а только лишь на порядок отрисовки
		// аналог z-index

		// Скорость движения будет зависеть от текущей анимации

		// p.x
		// p.y
		// p.z
		move: function ( p ) {
			var _this = this;

			if (p.y !== undefined) {
				_this.image.position.y = p.y;
			}

			if (p.x !== undefined) {
				var dx = p.x - _this.image.position.x;

				// Идем назад
				if ( dx < 0 ) {

					// Автоматический разворот модели в зависимости от направления движения
					if ( (_this.image.state.current.name !== 'stairCaseWalk' && _this.id !== 'tree') && (_this.image.scale.x > 0) ) {
						_this.image.scale.x *= -1;
					}
				}

				// Идем вперед
				if ( dx > 0 ) {

					// Автоматический разворот модели в зависимости от направления движения
					if ( (_this.image.state.current.name != 'stairCaseWalk') && (_this.image.scale.x < 0) )  {
						_this.image.scale.x *= -1;
					}
				}

				_this.image.position.x = p.x;

				if ( _this.id == 'hero' ) {

					var screenHalfWidth = scene.width / 2 / globals.viewport.scale,
						screenHalfHeight = scene.height / 2 / globals.viewport.scale,
						dx1 = (_this.image.position.x - screenHalfWidth ) * globals.viewport.scale,
						dy1 = (_this.image.position.y - (50/globals.scale) - screenHalfHeight ) * globals.viewport.scale;

					scene.move({
						dx: (0-dx1),
						dy: (0-dy1)
					})

				}

			}

			if (p.z !== undefined) {
				Z.changeZindex({
					obj: _this,
					z: p.z
				});
			}

			return _this;
		},

		moveTo: function( p ) {
			var _this = this;

			pathfinder.moveObjectByChain({
				id: _this.id,
				path: p.path,
				chain: p.chain,
				animationName: p.animationName,
				speedValue: p.speedValue,
				callback: p.callback
			});

			return _this;
		},

		//p.animation
		animate: function( p ) {
			var _this = this,
				callback = p.callback || function() {};

			_this.image.state.setAnimationByName( p.animation , false);

			if (_this.animation && _this.animation[p.animation]) {
				_this.animation[p.animation].track.play();
			}

			var duration = _this.image.state.current.duration * 1000,
				animationId = Math.random();

			setTimeout(function() {
				callback();

				relay.drop({
					obj: _this,
					type: 'endAnimation',
					animation: p.animation,
					id: animationId
				});
			}, duration)

			relay.drop({
				obj: _this,
				type: 'startAnimation',
				animation: p.animation,
				id: animationId
			});

			return _this;
		},

		getPosition: function() {

			var _this = this,
				path = _this.path,
				chain,
				graphId,
				orientation = Math.abs(_this.image.scale.x)/_this.image.scale.x;

			for (var i = 0; i < globals.paths[ _this.path ].controlPath.length; i++) {

				if ( Math.abs(globals.paths[ _this.path ].controlPath[i].step - _this.step) < 10 ) {

					chain = i;
					break;
				}

			}

			if ( _this.step < 10 ) {
				graphId = globals.paths[ path ].dots[0].graphId;
			}

			if ( Math.abs(globals.paths[ path ].steps.length - _this.step) < 10 ) {
				graphId = globals.paths[ path ].dots[ globals.paths[ path ].dots.length-1 ].graphId;
			}

			return {
				path: path,
				chain: chain,
				graphId: graphId,
				orientation: orientation
			}

		}
	}
}
var utils = (function() {

	return {

		getRandomValue: function ( low, high ) {
			var innerLow = high
					? low
					: 0,
				innerHigh = high
					? high
					: low;

			return innerLow + Math.round( Math.random()*(innerHigh-innerLow) );
		},

		// Возвращает Эвклидово расстояния
		//p.x1
		//p.y1
		//p.x2
		//p.y2
		getDistance: function( p ) {
			var xDistance = p.x2 - p.x1,
				yDistance = p.y2 - p.y1;

			return Math.sqrt( xDistance*xDistance + yDistance*yDistance );
		},

		// Возвращает координаты точку на отрезке
		//p.x1
		//p.y1
		//p.x2
		//p.y2
		//p.t
		getLinePointCoords: function( p ) {
			return {
				x: (p.x2 - p.x1) * p.t + p.x1,
				y: (p.y2 - p.y1) *  p.t + p.y1,
			}
		},

		// Возвращает координаты точки в кривой Безье
		//p.x1
		//p.y1
		//p.ax1
		//p.ay1
		//p.ax2
		//p.ay2
		//p.x2
		//p.y2
		//p.t
		getBezierPointCoords: function( p ) {
			function polynom(z) {
				var at = (1 - p.t);

				return (at * at * at * z.p0) + (3 * p.t * at * at * z.p1) + (3 * p.t * p.t * at * z.p2) + (p.t * p.t * p.t * z.p3);
			}

			return {
				x: polynom( { p0: p.x1, p1: p.ax1, p2: p.ax2, p3: p.x2 } ),
				y: polynom( { p0: p.y1, p1: p.ay1, p2: p.ay2, p3: p.y2 } )
			}
		},

		// Возвращает позицию управляющих точек на кривой Безье
		//p.x1
		//p.y1
		//p.x2
		//p.y2
		getAdditionalBezierPointsCoords: function( p ) {
			var a1 = utils.getLinePointCoords({
				x1: p.x1,
				y1: p.y1,
				x2: p.x2,
				y2: p.y2,
				t: 0.3
			})

			var a2 = utils.getLinePointCoords({
				x1: p.x1,
				y1: p.y1,
				x2: p.x2,
				y2: p.y2,
				t: 0.7
			})

			return {
				ax1: a1.x,
				ay1: a1.y,
				ax2: a2.x,
				ay2: a2.y
			}
		},

		// Строит рекурсивно атомарные шаги по заданной кривой Безье длиной не более допустимого расстояния
		//p.x1
		//p.y1
		//p.ax1
		//p.ay1
		//p.ax2
		//p.ay2
		//p.x2
		//p.y2
		//p.t1,
		//p.t2
		buildCurveSteps: function( p ) {
			// максимально допустимое расстояние в пикселах
			var maxDistance = 1.4

			var path = {};

			// считаем среднюю точку в заданном интервале [t1, t2]
			var middleT = p.t1 + (p.t2 - p.t1)/2;

			// получаем координаты точек при t = t1, middleT, t2
			var pointInT = utils.getBezierPointCoords({
				x1: p.x1,
				y1: p.y1,
				ax1: p.ax1,
				ay1: p.ay1,
				ax2: p.ax2,
				ay2: p.ay2,
				x2: p.x2,
				y2: p.y2,
				t: middleT
			});

			var pointInT1 = utils.getBezierPointCoords({
				x1: p.x1,
				y1: p.y1,
				ax1: p.ax1,
				ay1: p.ay1,
				ax2: p.ax2,
				ay2: p.ay2,
				x2: p.x2,
				y2: p.y2,
				t: p.t1
			});

			var pointInT2 = utils.getBezierPointCoords({
				x1: p.x1,
				y1: p.y1,
				ax1: p.ax1,
				ay1: p.ay1,
				ax2: p.ax2,
				ay2: p.ay2,
				x2: p.x2,
				y2: p.y2,
				t: p.t2
			});

			// обход дерева слева
			var leftDistance = utils.getDistance({
				x1: pointInT1.x,
				y1: pointInT1.y,
				x2: pointInT.x,
				y2: pointInT.y
			})

			if ( leftDistance > maxDistance ) {

				// Если можно разбить ветвь дальше, рекурсивно разбиваем
				var innerLeftSteps = utils.buildCurveSteps({
					x1: p.x1,
					y1: p.y1,
					ax1: p.ax1,
					ay1: p.ay1,
					ax2: p.ax2,
					ay2: p.ay2,
					x2: p.x2,
					y2: p.y2,
					t1: p.t1,
					t2: middleT
				});

				// добавляем полученные точки в текущий путь
				for (var i in innerLeftSteps) {
					path[i] = innerLeftSteps[i];
				}

			} else {

				// Ветвь нельзя разбить дальше
				// Добавляем полученную точку к пути и возвращаемся обратно по стеку
				path[middleT] = pointInT;
				return path;
			}

			// обход дерева справа
			var rightDistance = utils.getDistance({
				x1: pointInT.x,
				y1: pointInT.y,
				x2: pointInT2.x,
				y2: pointInT2.y
			})

			if ( rightDistance >= maxDistance ) {

				// Рекурсивно строим ветку (фактически работает только левый обход)
				var innerRightSteps = utils.buildCurveSteps({
					x1: p.x1,
					y1: p.y1,
					ax1: p.ax1,
					ay1: p.ay1,
					ax2: p.ax2,
					ay2: p.ay2,
					x2: p.x2,
					y2: p.y2,
					t1: middleT,
					t2: p.t2
				});

				// Если ветвь можно разбить, добавляем полученные точки к текущему пути
				for (var i in innerRightSteps) {
					path[i] = innerRightSteps[i];
				}
			}

			// Добавим текущую среднюю точку в путь, если её еще там нет
			path[middleT] = {
				x: pointInT.x,
				y: pointInT.y
			}

			// Случай, когда весь путь уже построен
			if ((p.t1 == 0) && (p.t2 == 1)) {

				// Добавляем граничные точки
				path[0] = {
					x: p.x1,
					y: p.y1
				}

				path[1] = {
					x: p.x2,
					y: p.y2
				}

				// Разворачиваем объект в сортированный массив
				var keyArr = [],
					result = [];

				for (var i in path) {
					keyArr.push(i);
				}

				keyArr = keyArr.sort();

				for (var i = 0; i < keyArr.length; i++) {
					result.push(path[keyArr[i]]);
				}

				// Финальный возврат пути в виде массива
				return result;
			}

			// Рекурсивный возврат пути
			return path;
		},

		// Генерирует управляющий контур для траектории
		// p.pathId
		buildControlPoligon: function( p ) {

			var touchRadiusDistance = 100;
			var currentPath = globals.paths[p.pathId];

			var controlPath = [];

			/*var touchPointCount = Math.round( currentPath.steps.length / touchRadiusDistance );

			for (var touchPoint = 0; touchPoint < touchPointCount; touchPoint++) {
				var startTouchPoint = {
					x: currentPath.steps[touchPoint*touchRadiusDistance].x - (touchRadiusDistance/2),
					y: currentPath.steps[touchPoint*touchRadiusDistance].y - (touchRadiusDistance/2)
				}
				console.log(touchPoint*touchRadiusDistance);
				ctx.rect( startTouchPoint.x, startTouchPoint.y, touchRadiusDistance, touchRadiusDistance );

			}*/

			var lastPoint = 0;

			for (var i = 0; i < currentPath.steps.length; i++) {

				var distance = utils.getDistance({
					x1: currentPath.steps[lastPoint].x,
					y1: currentPath.steps[lastPoint].y,
					x2: currentPath.steps[i].x,
					y2: currentPath.steps[i].y,
				})

				if (distance > touchRadiusDistance) {

					// создание
					var startTouchPoint = {
						x: currentPath.steps[lastPoint].x - (touchRadiusDistance/2),
						y: currentPath.steps[lastPoint].y - (touchRadiusDistance/2)
					}

					controlPath.push({
						rect: new PIXI.Rectangle(startTouchPoint.x, startTouchPoint.y, touchRadiusDistance, touchRadiusDistance),
						step: lastPoint
					})

					lastPoint = i;
				}
			}

			var startTouchPoint = {
				x: currentPath.steps[lastPoint].x - (touchRadiusDistance/2),
				y: currentPath.steps[lastPoint].y - (touchRadiusDistance/2)
			}

			// создание
			controlPath.push({
				rect: new PIXI.Rectangle(startTouchPoint.x, startTouchPoint.y, currentPath.steps[currentPath.steps.length-1].x - startTouchPoint.x+ (touchRadiusDistance/2), currentPath.steps[currentPath.steps.length-1].y - startTouchPoint.y + (touchRadiusDistance/2)),
				step: (currentPath.steps.length-1)
			})

			currentPath.controlPath = controlPath;
		},

		processPaths: function( p ) {
			var callback = p
				? p.callback || function() {}
				: function() {};

			for (path in globals.paths) {
				if (globals.paths[path].dots.length) {

					globals.paths[path].steps = [];
					for (var i = 1; i < globals.paths[path].dots.length; i++) {

						var stepsArray = utils.buildCurveSteps({
							x1: globals.paths[path].dots[i-1].mainHandle.x,
							y1: globals.paths[path].dots[i-1].mainHandle.y,
							ax1: globals.paths[path].dots[i-1].nextHandle.x,
							ay1: globals.paths[path].dots[i-1].nextHandle.y,
							ax2: globals.paths[path].dots[i].prevHandle.x,
							ay2: globals.paths[path].dots[i].prevHandle.y,
							x2: globals.paths[path].dots[i].mainHandle.x,
							y2: globals.paths[path].dots[i].mainHandle.y,
							t1: 0,
							t2: 1
						})

						for (var j = 0; j < stepsArray.length; j++) {
							globals.paths[path].steps.push({
								x: stepsArray[j].x,
								y: stepsArray[j].y
							})
						}
					}

					// генерация управляющей области
					if (globals.paths[path].steps.length) {
						utils.buildControlPoligon({
							pathId: path
						})
					}

				}

			}

			callback();

		},

		fadeIn: function() {
			document.querySelector('.black-fade').className += ' black-fade_active';
		},

		fadeOut: function() {
			document.querySelector('.black-fade').className = document.querySelector('.black-fade').className.replace(/\sblack-fade_active/ig, '');
		}
	}

})();






var graph = (function() {

	var serviceGraph,
		adjacencyMatrix;

	function makeIdByCoords(x, y) {

		return Math.round(x).toString() + '_' + Math.round(y).toString();
	}

	// Добаввляет данные в структуру ServiceGraph, отражающую связь между вершинами графа, определенных координатами
	// таким образом, две вершины разных отрезков, располашающихся в одной точке, образуют одну вершину
	function addToGraph(pathName, linkToPathPoint1, linkToPathPoint2, point1, point2, distance) {

		// Если таких координат еще вообще нет, создаем структуру данных
		if ( serviceGraph[point1] === undefined ) {
			serviceGraph[point1] = {
				link: {}
			};
		}

		// Поле link содержит информацию, каким путям принадлежит эта вершина.
		// Если записи о принадлежности для заданного пути нет, создать
		if (serviceGraph[point1].link[pathName] === undefined  ) {
			serviceGraph[point1].link[pathName] = linkToPathPoint1;
		}

		// Аналогично для второй вершины
		if ( serviceGraph[point2] === undefined ) {
			serviceGraph[point2] = {
				link: {}
			};
		}

		if (serviceGraph[point2].link[pathName] === undefined  ) {
			serviceGraph[point2].link[pathName] = linkToPathPoint2;
		}

		// Если нет информации о связи данных двух вершин, создать
		// записывается расстояние между ними и имя пути (id)
		if ( serviceGraph[point1][point2] === undefined ) {
			serviceGraph[point1][point2] = {
				distance: distance,
				path: pathName
			}
		}

		// В обратную сторону путь тоже идет
		if ( serviceGraph[point2][point1] === undefined ) {
			serviceGraph[point2][point1] = {
				distance: distance,
				path: pathName
			}
		}
	}

	// Вычисление кратчайшей дистанции
	function calculateShortestDistance() {
		var n = adjacencyMatrix[0].length;

		for (var k = 0; k < n; k++) {
			for (var i = 0; i < n; i++) {
				for (var j = 0; j < n; j++) {

					// Если суммарное расстояние кандидатов при разбиении меньше, чем текущий путь,
					// значение дистанции текущего пути перезаписывается суммой расстояний,
					if (adjacencyMatrix[i][j].distance > (adjacencyMatrix[i][k].distance + adjacencyMatrix[k][j].distance) ) {
						adjacencyMatrix[i][j].distance = adjacencyMatrix[i][k].distance + adjacencyMatrix[k][j].distance;

						// запишем составные части пути заново — для первого кандидата и второго
						adjacencyMatrix[i][j].path = [];

						// для текущего поля матрицы записывается массив кратчайших путей
						for (var e1 = 0; e1 < adjacencyMatrix[i][k].path.length; e1++) {
							adjacencyMatrix[i][j].path.push( adjacencyMatrix[i][k].path[e1] );
						}

						// с единицы — чтобы не дублировать точку пересечения
						for (var e2 = 1; e2 < adjacencyMatrix[k][j].path.length; e2++) {
							adjacencyMatrix[i][j].path.push( adjacencyMatrix[k][j].path[e2] );
						}
					}

				}
			}
		}
	}

	// Построение матрицы достижимости
	function buildAdjacencyMatrix( p ) {
		var reference = [],
			callback = (p && p.callback) || function() {};

		// Пересобираем объект в массив, потому что нам важен порядок их следования для построения матрицы достижимости
		for (var point in serviceGraph) {
			reference.push(point);
		}

		// Матрица двумерна, создаем
		adjacencyMatrix = new Array(reference.length);

		for (var i = 0; i < reference.length; i++) {
			adjacencyMatrix[i] = new Array(reference.length);

			for (var j = 0; j < reference.length; j++) {

				// Если расстояние между вершинами существует и не равно 0, берем его
				// Если расстояние равно нулю (одна и та же вершина), это нужно записать отдельно
				// Если расстояние неизвестно, приравниваем его к бесконечности
				var distance = (serviceGraph[ reference[i] ][ reference[j] ])
					? serviceGraph[ reference[i] ][ reference[j] ].distance
					: (i == j)
						? 0
						: Number.POSITIVE_INFINITY;

				// Если вершина не одна и та же, запишем путь как пару вершин
				var path = (distance)
					? [i, j]
					: [];

				// При инициализации матрицы для каждой пары вершин укажем расстояние
				adjacencyMatrix[i][j] = {
					path: path,
					distance: distance
				}
			}
		}

		// После инициализации посчитали кратчайшие расстояния
		calculateShortestDistance();

		// Записываем результат работы в граф так, чтобы каждая вершина имела информацию о том,
		// с кем она связана, на каком расстоянии и как достичь одну вершину из другой
		for (var point = 0; point < reference.length; point++) {

			globals.graph[point] = {
				targets: {},
				links: {}
			}

			for (var linkId in serviceGraph[ reference[point] ].link) {

				serviceGraph[ reference[point] ].link[linkId].graphId = point;

				globals.graph[point].links[linkId] = serviceGraph[ reference[point] ].link[linkId];

				for (var otherId = 0; otherId < reference.length; otherId++) {
					//console.log(reference[point], reference[otherId]);
					var pathName = (serviceGraph[ reference[point] ][ reference[otherId] ] !== undefined)
						? serviceGraph[ reference[point] ][ reference[otherId] ].path
						: false;

					globals.graph[point].targets[ otherId ] = {
						distance: adjacencyMatrix[point][otherId].distance,
						path: [],
						pathName: pathName
					}

					for (var graphPath = 0; graphPath < adjacencyMatrix[point][otherId].path.length; graphPath++) {
						globals.graph[point].targets[otherId].path.push( adjacencyMatrix[point][otherId].path[graphPath] );
					}
				}


			}
		}

		callback();
	}


	return {
		// Строит граф
		buildGraph: function( p ) {

			globals.graph = {},
			serviceGraph = {},
			adjacencyMatrix = {};

			for (var path in globals.paths) {
				var point1 = globals.paths[path].dots[0].mainHandle;
				var point2 = globals.paths[path].dots[ globals.paths[path].dots.length-1 ].mainHandle;
				var distance = (globals.paths[path].breakpath)
					? Number.POSITIVE_INFINITY
					: globals.paths[path].steps.length;

				addToGraph(path, globals.paths[path].dots[0], globals.paths[path].dots[ globals.paths[path].dots.length-1 ], makeIdByCoords(point1.x, point1.y), makeIdByCoords(point2.x, point2.y), distance);
			}

			buildAdjacencyMatrix( p );
		},

		// Просто выводит матрицу достижимости
		getAdjacencyMatrix: function() {

			return adjacencyMatrix;
		},

		// Отдает вершину графа, если совпадает с заданным шагом
		getGraphIdByStep: function( p ) {

			if (p.step < 10) {
				return globals.paths[p.path].dots[ 0 ].graphId;
			} else if ( (globals.paths[p.path].steps.length-1) - p.step < 10  ) {
				return globals.paths[p.path].dots[ globals.paths[p.path].dots.length-1 ].graphId;
			} else {
				return undefined;
			}
		}
	}
})();
var move = (function() {

	function move( p ) {
		var modelStep = globals.objects[p.id].step,
			currentPath = globals.paths[ p.path ],
			targetStep = currentPath.controlPath[ p.chain ].step,
			callback = p.callback || function() {};

		globals.objects[p.id].path = p.path;

		if (Math.abs(modelStep - targetStep) < p.speed  ) {
			callback();
			return;
		}

		// Направление движения
		var stepDirection = currentPath.controlPath[ p.chain ].step - globals.objects[p.id].step;
		stepDirection != 0
			? stepDirection = stepDirection / Math.abs(stepDirection)
			: 0;

		audio.updateWorldSound({
			id: p.id
		})

		// Анимация запукается циклически
		if (globals.objects[p.id].image.state.isComplete()) {
			globals.objects[p.id].image.state.setAnimationByName( p.animation , false);

			if (globals.objects[p.id].animation && globals.objects[p.id].animation[p.animation]) {
				globals.objects[p.id].animation[p.animation].track.play();
			}
		}

		globals.objects[p.id].step = globals.objects[p.id].step + stepDirection * p.speed;

		if (currentPath.steps[ globals.objects[p.id].step ] === undefined) {
			globals.objects[p.id].step = currentPath.steps.length-1;
		}


		globals.objects[p.id].move({
			x: currentPath.steps[ globals.objects[p.id].step ].x,
			y: currentPath.steps[ globals.objects[p.id].step ].y,
		})

	}


	return {
		setMovement: function( p ) {
			move( p );
		}
	}

})();
var queue = (function() {

	var objects = {};

	function processQueue() {
		var removedObjects = [];

		// Очистка исполненных объектов
		function removeObjects() {
			for (var i = 0; i < removedObjects.length; i++) {
				delete objects[removedObjects[i]];
			}
		}

		// Перебираются все анимируемые объекты (всё, что есть в очереди)
		for (var obj in objects) {
			var objectPathsLength = objects[obj].length;

			// Если у текущего объекта в очереди есть цепочки анимаций на исполнение,
			// обрабатывается текущая первая из них
			if (objectPathsLength) {

				// Если текущая анимация объекта определна и отличается от заданной,
				// сбросить её — новая анимация подхватится сама
				if ((!!globals.objects[obj].image.state.current) && (objects[obj][0].animation !== globals.objects[obj].image.state.current.name) ) {
					globals.objects[obj].image.state.clearAnimation();
				}

				// Если анимация происходит на месте,
				// просто вызовем метод однократного проигрывания анимации.
				// на время проигрывания анимации выставим временный флаг, предотвращающий исполнение
				// следующих анимаций в очереди, после завершения проигрывания снимем этот флаг
				if (!objects[obj][0].speed) {

					if (!objects[obj][0].playingNow) {
						globals.objects[obj].animate({
							animation: objects[obj][0].animation,
							callback: function() {
								// Сохраняем путь
								globals.objects[obj].path = objects[obj][0].pathId;

								// Если только что завершенная анимация объекта не последняя в его цепочке,
								// значение текущего шага устанавливается на первое из следующей анимации в цепочке
								globals.objects[obj].step = objects[obj][1]
									? objects[obj][1].step
									: globals.objects[obj].step;

								// После завершения исполнения анимации выкинуть её из цепочки объекта
								// а также те идущие непосредственно за ней, если их скорость == 0
								while ( (objects[obj].length) && (!objects[obj][0].speed) ) {
									var oldPath = objects[obj].shift();
								}

								relay.drop({
									obj: obj,
									graphId: graph.getGraphIdByStep({
										path: globals.objects[obj].path,
										step: globals.objects[obj].step
									}),
									type: 'stop'
								});
							}
						})
						objects[obj][0].playingNow = true;
					} else {
						continue;
					}

				} else {
					// Анимация происходит поступательно — задана скорость перемещения

					move.setMovement({
						id: obj,
						path: objects[obj][0].pathId,
						chain: objects[obj][0].targetChain,
						animation: objects[obj][0].animation,
						speed: objects[obj][0].speed,
						callback: function() {
							// Если только что завершенная анимация объекта не последняя в его цепочке,
							// значение текущего шага устанавливается на первое из следующей анимации в цепочке
							globals.objects[obj].step = objects[obj][1]
								? objects[obj][1].step
								: globals.objects[obj].step;

							// После завершения исполнения анимации выкинуть её из цепочки объекта
							var objectCallback = objects[obj].callback || function() {},
								oldPath = objects[obj].shift();

							if (!objects[obj].length) {
								// Цепочка анимаций закончилась, нужно остановиться

								if (obj == 'hero') {
									globals.objects[ obj ].image.state.setAnimationByName("stop", false); // STOP
								}

								objectCallback();

								relay.drop({
									obj: obj,
									graphId: graph.getGraphIdByStep({
										path: globals.objects[obj].path,
										step: globals.objects[obj].step
									}),
									type: 'stop'
								});

							} else {
								// Закончилась только текущая анимация, промежуточное сообщение

								relay.drop({
									obj: obj,
									graphId: graph.getGraphIdByStep({
										path: objects[obj][0].pathId,
										step: globals.objects[obj].step
									}),
									type: 'breakpoint'
								});
							}
						}
					})

				}

			} else {
				// Если цепочка анимаций для объекта пустая, добавляем его на вычистку из очереди
				// Удалять будем по завершении цикла всё вместе, поэтому массив
				removedObjects.push(obj);
			}

		}

		// Удалить объекты без цепочек анимаций
		removeObjects();

		// Запустить цикл очереди заново
		requestAnimationFrame( function() {
			processQueue();
		} );
	}

	return {

		// Добавляет анимацию в очередь.
		// Если такой объект уже есть в очереди,
		// добавленная анимация будет выполнена сразу же после уже запланированных для данного объекта.
		// Очередь обрабатывает все анимируемые объекты со скоростью ~ 60 раз в секунду.
		// После того, как цепочка анимаций для объекта полностью выполнена, он автоматически выкидывается из очереди
		//
		// p.objectId
		// p.paths
		addToObjPaths: function( p ) {
			objects[p.objectId] = p.paths;
			objects[p.objectId].callback = p.callback;

			relay.drop({
				obj: p.objectId,
				graphId: graph.getGraphIdByStep({
					path: globals.objects[ p.objectId ].path,
					step: globals.objects[ p.objectId ].step
				}),
				type: 'start'
			});

			return this;
		},

		// Запускает агент очереди;
		// Агент крутится в фоне и следит за добавлением объектов в очереди
		// Как только в очередь добавляется объект, начинается исполнение его анимации
		startQueue: function() {
			processQueue();

			return this;
		}
	}

})()
var relay = (function() {

	return {

		drop: function( p ) {
			var _this = this,
				evt, objEvt,
				inGraphId = p.graphId
					? '.inGraphId.' + p.graphId
					: '';

			if (typeof window.CustomEvent === 'function') {
				evt = new CustomEvent( p.type , {detail: p });
				objEvt = new CustomEvent( p.obj + '.' + p.type + inGraphId , {detail: p });
			} else {
				evt = document.createEvent( 'CustomEvent' );
				evt.initCustomEvent(p.type, true, true, p );

				objEvt = document.createEvent( 'CustomEvent' );
				objEvt.initCustomEvent( p.obj + '.' + p.type + inGraphId, true, true, p );
			}

			document.dispatchEvent(evt);
			document.dispatchEvent(objEvt);

			return _this;

		},

		listen: function( eventName ) {
			var _this = this;

			document.addEventListener(eventName, function( p ) {
				console.log( p.detail );
			})

			return _this;
		}
	}
})();
// Снег
document.addEventListener('snow.objectAdded', function( p ) {
	(function startSnow() {
		globals.objects.snow.animate({
			animation: 'animation',
			callback: function() {
				startSnow();
			}
		})
	})();
});

// Дерево откатывается
function moveTree() {
	globals.paths.jump2.breakpath = true;
	globals.paths.tree1.breakpath = true;
	graph.buildGraph({
		callback: function() {
			globals.objects.tree.moveTo({
				path: 'groundTreeToLeft',
				chain: 4,
				animationName: 'animation',
				speedValue: 2
			})
		}
	});

}

document.addEventListener('hero.stop.inGraphId.8', function( p ) { moveTree() })
document.addEventListener('hero.breakpoint.inGraphId.8', function( p ) { moveTree() })

// Клик на птицу
document.addEventListener('bird.objectClick', function( p ) {

	if ( (globals.objects.hero.getPosition().path == 'treeInside') && (globals.objects.hero.getPosition().graphId == 4) ) {
		// Запретить пользователю ходить на время анимации
		globals.preventClick = true;

		globals.objects.hero.animate({
			animation: 'slope',
			callback: function() {

				// Разрешить спуститься
				globals.paths.treeToBucket.breakpath = false;

				graph.buildGraph({
					callback: function() {

						// Дойти до ведра
						globals.objects.hero.moveTo( {
							path: 'treeToBucket',
							chain: 0,
							animationName: 'new',
							speedValue: 3,
							callback: function() {

								// Бросить ведро вниз
								globals.objects.bucket.animate({
									animation: 'bucket',
									callback: function() {

										// Развернуть героя для спуска по веревке
										if (globals.objects.hero.getPosition().orientation == 1) {
											globals.objects.hero.image.scale.x *= -1;
										}

										// Спустить героя на землю
										globals.objects.hero.moveTo( {
											path: 'groundTreeToLeft',
											chain: 1
										})

									}
								})
							}
						})

					}
				});
			}
		})

		// Запустить птицу через таймер, потому что улетает в середине анимации
		setTimeout(function() {
			globals.objects.bird.moveTo( {
				path: 'birdTreePath',
				chain: 3,
				animationName: 'bird',
				speedValue: 4
			})

		}, 400)

	}

	// Если потянуться за птицей с земли
	if ( (globals.objects.hero.path == 'treeToSemaphore') && (globals.objects.hero.step == 207) &&
		(globals.objects.bird.path == 'birdTreePath') && (globals.objects.bird.step == 456 ) ) {

		globals.objects.hero.animate({
			animation: 'ReachOut'
		})

		// Птица улетает до того, как герой дотянется
		setTimeout(function() {

			globals.objects.bird.moveTo( {
				path: 'birdTreePath2',
				chain: 3,
				animationName: 'bird',
				speedValue: 4
			})

		}, 300)
	}
});

// Спуск героя по веревке на землю
document.addEventListener('hero.breakpoint.inGraphId.5', function( p ) {
	if ( !globals.triggers.heroOnTheGround) {
		// Запретить подниматься обратно наверх
		globals.paths.bucketToGround.breakpath = true;

		graph.buildGraph({
			callback: function() {

				// Разрешить пользователю ходить
				globals.triggers.heroOnTheGround = true;
				globals.preventClick = false;
			}
		});
	}
});

// Крышка мусорного бака шевелится
function checkGarbageBucket() {

	if (globals.triggers.garbageBucketIsOpen) return;

	var currentChain = globals.objects.hero.getPosition().chain;

	if (currentChain > 1 && currentChain < 9) {

		globals.objects.garbageBucket.animate({
			animation: 'live'
		})
	}

	setTimeout(function() {
		if ( globals.objects.hero.getPosition().path !== 'treeToSemaphore' ) return;
		checkGarbageBucket();
	}, 1200);
}

document.addEventListener('hero.stop.inGraphId.5', function( p ) { checkGarbageBucket() })
document.addEventListener('hero.breakpoint.inGraphId.5', function( p ) { checkGarbageBucket() })
document.addEventListener('hero.stop.inGraphId.11', function( p ) { checkGarbageBucket() })
document.addEventListener('hero.breakpoint.inGraphId.11', function( p ) { checkGarbageBucket() })

document.addEventListener('garbageBucket.objectClick', function( p ) {
	if ( globals.triggers.garbageBucketIsOpen ) return;

	var currentChain = globals.objects.hero.getPosition().chain;
	if ( !((globals.objects.hero.getPosition().path == 'treeToSemaphore') && (currentChain == 6 || currentChain == 7)) ) return;

 	globals.triggers.garbageBucketIsOpen = true;
	globals.objects.garbageBucket.animate({
		animation: 'open',
		callback: function() {

			globals.objects.butterfly.move({
				z: 15
			})

			globals.triggers.butterflyIsFree = true;

			globals.objects.butterfly.moveTo( {
				path: 'butterflyPath2',
				chain: 0,
				animationName: 'butterfly',
				speedValue: 4
			})

		}
	})
})

// Клик на злодея под деревом
document.addEventListener('villain.objectClick', function( p ) {

	// Если герой стоит вплотную к злодею, можно попробовать его поймать
	if ( (globals.objects.hero.getPosition().path == 'groundTreeToLeft') && (globals.objects.hero.getPosition().chain == 3) ) {
		globals.objects.hero.animate({
			animation: 'catch',
			callback: function() {
				globals.objects.villain.animate({
					animation: 'animation'
				})
			}
		})
	} else {
		globals.objects.villain.animate({
			animation: 'animation'
		})
	}

	hint.message('villainFirstHintText');
});

// Светофор качается
document.addEventListener('semaphore.objectAdded', function( p ) {

	(function startSemaphore() {
		if (!globals.triggers.stopSemaphore) {
			globals.objects.semaphore.animate({
				animation: 'trafficLight',
				callback: function() {
					startSemaphore();
				}
			})
		}
	})();

});

// Положить птицу в Светофор
document.addEventListener('semaphore.objectClick', function( p ) {
	if ( globals.triggers.semaphoreIsClickable ) {

		if ( globals.objects.hero.getPosition().graphId == 17 ) {

			globals.triggers.stopSemaphore = true;

			// Остановить качание светофора
			globals.objects.semaphore.animate({
				animation: 'trafficLight_stop'
			})

			// Герой тянется к светофору
			globals.objects.hero.animate({
				animation: 'ReachOut'
			})

			// Таймер, потому что до завершения анимации
			setTimeout(function() {
				// Показать птицу в светофоре
				if (globals.triggers.butterflyWasCatched) {

					globals.objects.butterfly.move({
						z: 15
					})

					// Разрешить ходить за шлагбаум
					globals.paths.semaphoreToTV.breakpath = false;
					graph.buildGraph({
						callback: function() {

							//шлагбаум поднимается
							globals.objects.barrier.animate({
								animation: 'barrier'
							})

							clearTimeout( globals.triggers.centralActionHint );
						}
					});
				}
			}, 400);
		}
	}
});




// Бабочка летает

function catchButterfly() {
	globals.objects.hero.animate({
		animation: 'catch',
		callback: function() {
			globals.triggers.butterflyWasCatched = true;
			globals.preventClick = false;
		}
	})

	globals.objects.butterfly.move({
		z: 0
	})

	globals.objects.butterfly.moveTo( {
		path: 'butterflyStopPath',
		chain: 1,
		animationName: 'butterfly',
		speedValue: 10
	})
}

document.addEventListener('butterfly.stop.inGraphId.18', function( p ) {
	globals.objects.butterfly.moveTo( {
		path: 'butterflyPath2',
		chain: 0,
		animationName: 'butterfly',
		speedValue: 4
	})

	if ( globals.triggers.butterflyCanBeCatched) {

		if (globals.objects.hero.getPosition().path == 'treeToSemaphore' && globals.objects.hero.getPosition().chain == 6) {
			globals.preventClick = true;
			catchButterfly();
		}

	}
})

document.addEventListener('butterfly.stop.inGraphId.19', function( p ) {
	globals.objects.butterfly.moveTo( {
		path: 'butterflyPath3',
		chain: 0,
		animationName: 'butterfly',
		speedValue: 4
	})

	if ( globals.triggers.butterflyCanBeCatched) {

		if (globals.objects.hero.getPosition().path == 'treeToSemaphore' && globals.objects.hero.getPosition().chain == 5) {
			globals.preventClick = true;
			catchButterfly();
		}

	}
})

document.addEventListener('butterfly.stop.inGraphId.20', function( p ) {
	globals.objects.butterfly.moveTo( {
		path: 'butterflyPath4',
		chain: 0,
		animationName: 'butterfly',
		speedValue: 4
	})

	if ( (globals.triggers.butterflyCanBeCatched) ) {

		if (globals.objects.hero.getPosition().graphId == 11 ) {
			globals.preventClick = true;
			catchButterfly();
		}

	}
})

document.addEventListener('butterfly.stop.inGraphId.21', function( p ) {
	globals.objects.butterfly.moveTo( {
		path: 'butterflyPath',
		chain: 0,
		animationName: 'butterfly',
		speedValue: 3
	})

	if ( globals.triggers.butterflyCanBeCatched) {

		if (globals.objects.hero.getPosition().path == 'treeToSemaphore' && globals.objects.hero.getPosition().chain == 7) {
			globals.preventClick = true;
			catchButterfly();
		}

	}
})

document.addEventListener('butterfly.objectClick', function( p ) {

	if (globals.triggers.butterflyInerval) {
		clearInterval(globals.triggers.butterflyInerval);
	}

	if ( !globals.triggers.butterflyCanBeCatched ) {

		if ( globals.objects.butterfly.getPosition().path == 'butterflyPath' ) {
			globals.objects.hero.moveTo({
				path: 'treeToSemaphore',
				chain: 8
			})
		}

		if ( globals.objects.butterfly.getPosition().path == 'butterflyPath2' ) {
			globals.objects.hero.moveTo({
				path: 'treeToSemaphore',
				chain: 7
			})
		}

		if ( globals.objects.butterfly.getPosition().path == 'butterflyPath3' ) {
			globals.objects.hero.moveTo({
				path: 'treeToSemaphore',
				chain: 6
			})
		}

		if ( globals.objects.butterfly.getPosition().path == 'butterflyPath4' ) {
			globals.objects.hero.moveTo({
				path: 'treeToSemaphore',
				chain: 5
			})
		}

	}

	globals.triggers.butterflyCanBeCatched = true;

	globals.triggers.butterflyInerval = setTimeout(function() {
		globals.triggers.butterflyCanBeCatched = false;
	}, 25000);


});



function getTheStone(cb) {
	var callback = cb || function() {};

	if (!globals.triggers.ihavestone) {
		globals.objects.hero.animate({
			animation: 'slope',
			callback: function() {
				globals.triggers.ihavestone	 = true;
				callback();
			}
		})

		setTimeout(function() {
			globals.objects.stone.move({
				z: 0
			})

			globals.objects.stone.moveTo({
				path: 'stoneToHand',
				chain: 1,
				speedValue: 20
			})
		}, 700)

	} else {
		callback();
	}

}

// Кинуть камень в злодея

function dropToVillain() {

	getTheStone(function() {

		globals.preventClick = false;

		if (globals.objects.hero.getPosition().orientation == -1) {
			globals.objects.hero.image.scale.x *= -1;
		}

		globals.objects.stone.move({
			z: 10
		})

		globals.objects.stone.moveTo({
			path: 'stoneToHand',
			chain: 3,
			speedValue: 18,
			callback: function() {

				globals.objects.stone.move({
					z: 0
				})

				globals.objects.villain2.ai.stop();
				globals.objects.villain2.moveTo( {
					path: 'semaphoreVillainPath',
					chain: 1,
					animationName: 'down',
					speedValue: 15
				});

				globals.paths.semaphoreTurnOnPath.breakpath = false;

/* === */
//				globals.paths.semaphoreToTV.breakpath = false;
/* === */
				graph.buildGraph({
					callback: function() {
						globals.triggers.semaphoreIsClickable = true;
					}
				});

				globals.objects.villain2.image.setInteractive(false);

			}
		})
	})
}

document.addEventListener('stone.objectClick', function( p ) {

	if ( globals.objects.hero.getPosition().graphId == 11 ) {
		getTheStone();
	}
})

document.addEventListener('villain2.objectClick', function( p ) {

	if (globals.objects.hero.getPosition().graphId == 11) {
		dropToVillain();
	} else if ( ~['treeToSemaphore', 'semaphoreBreakPath'].indexOf( globals.objects.hero.getPosition().path ) ) {
		globals.objects.hero.moveTo( {
			path: 'treeToSemaphore',
			chain: 8,
			animationName: 'new',
			speedValue: 3,
			callback: function() {
				dropToVillain();
			}
		});
	}
});

// Телевизор
function TVPictures() {
	globals.objects.tv.animate({
		animation: 'TV stop',
		callback: function() {
			TVPictures();
		}
	})
}

document.addEventListener('tv.objectClick', function( p ) {

	if ( globals.objects.hero.path == 'TVPath' ) {

		globals.objects.hero.moveTo( {
			path: 'TVPath',
			chain: 2,
			callback: function() {

				globals.objects.tv.animate({
					animation: 'TV run',
					callback: function() {

						globals.paths.pathToMonitors.breakpath = false;
						graph.buildGraph();

						TVPictures();
					}
				})
			}
		});
	}
});

//второй вариант
document.addEventListener('roadSing.objectClick', function( p ){

   if( (globals.objects.hero.getPosition().path == 'elephantPath') && (globals.objects.hero.getPosition().chain == 1) ){

	   globals.objects.hero.animate({
		   animation:'ReachOut',
		   callback: function(){

			   //знак меняется на противоположный
			   globals.objects.roadSing.animate({
				   animation:'roadSing',
				   callback: function () {

					   //дверь открывается
					   globals.objects.doorToTheNextLavel.animate({
						   animation:'door',
						   callback: function () {
								globals.triggers.exit = true;

								clearTimeout( globals.triggers.levelEndHint );
						   }
					   })

				   }
			   });
		   }
	   })
   }

})

// Конец уровня
document.addEventListener('hero.stop.inGraphId.32', function( p ) {

	if (globals.triggers.exit) {
		audio.fadeOut();
		utils.fadeIn();
	} else {
		hint.message('endPathFailText');
	}
})

/* === Подсказки */



// Лестница

function stairHint() {
	var time = utils.getRandomValue(10000, 20000);

	globals.triggers.stairHint = setTimeout(function() {
		hint.message('stairHintText');
		stairHint();
	}, time);
}

document.addEventListener('hero.objectAdded', function( p ) {
	stairHint();
})

document.addEventListener('hero.stop.inGraphId.2', function( p ) {
	if (!globals.triggers.bucketHint) bucketHint();
	clearTimeout( globals.triggers.stairHint );
})

document.addEventListener('hero.breakpoint.inGraphId.2', function( p ) {
	if (!globals.triggers.bucketHint) bucketHint();
	clearTimeout( globals.triggers.stairHint );

})

// Ведро
function bucketHint() {
	var time = utils.getRandomValue(10000, 20000);

	globals.triggers.bucketHint = setTimeout(function() {

		if ( ~['tree1', 'jump2', 'treeInside', 'treeToBucket'].indexOf(globals.objects.hero.getPosition().path)  ) {
			hint.message('bucketHintText');
		}
		bucketHint();

	}, time);
}

document.addEventListener('hero.stop.inGraphId.3', function( p ) {
	if (!globals.triggers.centralActionHint) centralAction();
	clearTimeout( globals.triggers.bucketHint );
})

document.addEventListener('hero.breakpoint.inGraphId.3', function( p ) {
	if (!globals.triggers.centralActionHint) centralAction();
	clearTimeout( globals.triggers.bucketHint );
})

// Центральная сцена
function centralAction() {
	var time = utils.getRandomValue(10000, 20000);

	globals.triggers.centralActionHint = setTimeout(function() {

		if (globals.triggers.semaphoreIsClickable && (globals.triggers.butterflyWasCatched || globals.triggers.butterflyIsFree)) {
			hint.message('semaphoreHintText');
		} else if ( globals.objects.hero.getPosition().path == 'treeToSemaphore' && !globals.triggers.butterflyWasCatched && !globals.triggers.butterflyIsFree ) {
			hint.message('garbageHintText');
		} else if ( globals.objects.hero.getPosition().path == 'semaphoreBreakPath' && !globals.triggers.semaphoreIsClickable ) {
			hint.message('villainHintText');
		}

		centralAction();
	}, time);
}

document.addEventListener('hero.stop.inGraphId.13', function( p ) {
	if (!globals.triggers.levelEndHint) levelEnd();
})

document.addEventListener('hero.breakpoint.inGraphId.13', function( p ) {
	if (!globals.triggers.levelEndHint) levelEnd();
})

// Переключатель на выход
function levelEnd() {

	var time = utils.getRandomValue(10000, 20000);

	globals.triggers.levelEndHint = setTimeout(function() {

		if ( ~['endPath', 'endPath1', 'elephantPath'].indexOf(globals.objects.hero.getPosition().path)  ) {
			hint.message('finalGarbageHintText');
		}

		levelEnd();
	}, time);
}
function track() {

	var sound = false,
		parentObject;

	return {

		source: false,

		load: function ( p ) {

			var _this = this,
				callback = p.callback || function() {};

			if ( audio.getContext() ) {

				parentObject = p.obj;

				var xhr = new XMLHttpRequest();
				xhr.open('GET', p.url, true);
				xhr.responseType = 'arraybuffer';
				xhr.onload = function(e) {

					audio.getContext().decodeAudioData(
						this.response,
						function (decodedArrayBuffer) {
							sound = decodedArrayBuffer;

							parentObject.panner = audio.getContext().createPanner();
							parentObject.panner.rolloffFactor = 0.01;
							parentObject.panner.connect( audio.getGainNode() );

							if (Object.keys(p.obj).length !== 1) {

								audio.updateWorldSound({
									id: p.obj.id
								})
							}

							callback();
							return _this;

						}, function (e) {
							// fail
						});

					callback();
				};
				xhr.send();

			} else {
				callback();
			}

			return _this;
		},

		play: function ( p ) {

			var _this = this,
				loop = (p && p.loop) || false,
				callback = (p && p.callback) || function() {};

			if (sound) {
				_this.source = audio.getContext().createBufferSource();

				_this.source.buffer = sound;
				_this.source.connect( parentObject.panner );
				_this.source.loop = loop;

				_this.source.start(0);

				setTimeout(function() {
					callback();
				}, _this.source.buffer.duration * 1000);
			}

			return _this;
		},

		stop: function() {
			this.source && this.source.stop();
		}
	}
}


var audio = (function() {

	var context,
		gainNode,
		fadeDuration = 1,
		fadeOverlay,
		splashMusic = track(),
		backgroundMusic = track();

	function initContext() {
		try {
			window.AudioContext = window.AudioContext||window.webkitAudioContext;
			context = (context === undefined)
				? new AudioContext()
				: context;

			gainNode = (context.createGain)
						? context.createGain()
						: context.createGainNode();

			gainNode.connect(context.destination);
		} catch(e) {
			context = false;
			document.body.className += ' _nomusic';
		}

	}

	function updateSound( p ) {

		var soundObj = globals.objects[p.id];

		if (soundObj.panner) {
			soundObj.panner.setPosition(soundObj.image.position.x, soundObj.image.position.y, 0);
		}

		if ( (context) && (p.id == 'hero') ) {
			context.listener.setPosition(soundObj.image.position.x, soundObj.image.position.y, 0);
		}
	}

	function startSplashSound() {

		splashMusic.load({

			obj: {},
			url: 'assets/music/splash.ogg',
			callback: function() {

				splashMusic.play({
					loop: true
				})

			}
		})
	}

	function startBackgroundSound() {

		backgroundMusic.load({

			obj: globals.objects.hero,
			url: 'assets/music/background.ogg',
			callback: function() {

				backgroundMusic.play({
					loop: true
				})
			}
		})
	}

	function updateVolume() {
		if (context) {
			var currTime  = audio.getContext().currentTime;

			audio.getGainNode().gain.linearRampToValueAtTime(globals.volume, currTime);
		}
	}

	function handleVisibilityChange() {

		if (document.webkitHidden || document.hidden) {
			audio.fadeOut();
		} else {
			audio.fadeIn();
		}
	}

	return {

		init: function () {

			//initContext();
			updateVolume();

			document.addEventListener("visibilitychange", function() {
				handleVisibilityChange();
			});

			document.addEventListener("webkitvisibilitychange", function() {
				handleVisibilityChange();
			});

			return this;
		},

		initBackgroundSound: function () {
			startBackgroundSound();

			return this;
		},

		initSplashSound: function () {
			startSplashSound();

			return this;
		},

		finishSplashSound: function () {

			if (audio.getContext()) {

				var duration = 1,
					currTime = audio.getContext().currentTime;

				audio.fadeOut();

				setTimeout(function() {
					splashMusic.stop();
					splashMusic.play = function() {};
					audio.fadeIn();
				}, 1000)
			}

			return this;

		},

		updateWorldSound: function ( p ) {
			updateSound( p );

			return this;
		},

		setVolume: function () {
			updateVolume();

			return this;
		},

	 	fadeIn: function () {
			if (context) {
				var currTime  = audio.getContext().currentTime;

				audio.getGainNode().gain.linearRampToValueAtTime(0, currTime);
				audio.getGainNode().gain.linearRampToValueAtTime(globals.volume, currTime + fadeDuration);
			}
		},

	 	fadeOut:function () {
			if (context) {
				var currTime  = audio.getContext().currentTime;

				audio.getGainNode().gain.linearRampToValueAtTime(globals.volume, currTime);
				audio.getGainNode().gain.linearRampToValueAtTime(0, currTime + fadeDuration);
			}
		},

		getContext: function () {
			return context;
		},

		getGainNode: function() {
			return gainNode;
		}
	}
})()
var video = (function() {

	var videoPlayer = false;

	return {

		init: function() {
			videoPlayer = document.querySelector('video');

			if ( (videoPlayer.canPlayType('video/mp4') !== 'maybe') || (navigator.userAgent.toLowerCase().match(/ipad|iphone|ipod/i) !== null) ) {
				videoPlayer = false;
			}
			return this;
		},

		play: function( callback ) {

			var callback = callback || function () {};

			function finishVideo() {
				videoPlayer.style.display = 'none';
				videoPlayer.pause();
				callback();
			}

			if (videoPlayer) {
				videoPlayer.style.display = 'block';

				videoPlayer.onended = videoPlayer.onclick = function () {
					finishVideo();
				}

				videoPlayer.play();
			} else {
				callback();
			}
			return this;
		}
	}

})();
var translations = {
	villainFirstHintText: {
		'ru': 'Этот сиккарах выглядит рассерженным. Вряд ли он пропустит меня.'
	},
	stairHintText: {
		'ru': 'Высоко тут...',
		'en': 'I feel dizzy'
	},
	bucketHintText: {
		'ru': 'Додумался же кто-то повесить ведро на дерево!',
		'en': 'Bucket on tree looks very strange'
	},
	semaphoreHintText: {
		'ru': 'Наверное, светофор должен быть зеленым...',
		'en': 'It would be nice turn semaphore on...'
	},
	garbageHintText: {
		'ru': 'Кажется, в баке кто-то есть...',
		'en': 'I think I saw something...'
	},
	villainHintText: {
		'ru': 'Вот бы скинуть Кривоноса с забора!',
		'en': 'The villain of the way.'
	},
	finalGarbageHintText: {
		'ru': 'Кто знает, что может быть в этой куче мусора?',
		'en': 'Some surprise in this garbage heap?'
	},
	endPathFailText: {
		'ru': 'Глухой забор.',
		'en': 'Closed.'
	}

}
var hint = (function() {

	var hint,
		currentTimeout,
		messageStack = [],
		showDuration = 5000,
		isActive = false;


	function show( text ) {

		showMessage();
	}

	function check() {
		if (!messageStack.length) {
			hint.className = hint.className.replace(/\shint_active/ig, '');
			hint.innerHTML = '';
			isActive = false;
			return;
		}

		if (isActive) {
			return;
		}

		hint.className += ' hint_active';
		hint.innerHTML = messageStack.shift();

		isActive = true;
		currentTimeout = setTimeout(function() {
			isActive = false;
			check();
		}, showDuration)
	}

	return {
		init: function () {

			hint = document.querySelector('.hint');
			hint.onclick = function () {

				clearTimeout(currentTimeout);
				isActive = false;
				check();
			}

			globals.locale = window.navigator.userLanguage || window.navigator.language || globals.locale;
			globals.locale = globals.locale.split('-')[0].toLowerCase();

			return this;

		},

		message: function ( text ) {

			if (translations[text] && translations[text][globals.locale]) {
				messageStack.push( translations[text][globals.locale] );
				check();
			}

			return this;
		},

		clearQueue: function () {

			messageStack = [];
			clearTimeout(currentTimeout);
			isActive = false;

			return this;
		}
	}

})();
var loader = (function() {

	// Предзагрузка ресурсов
	function initResources( p ) {
		var assetsLoader = new PIXI.AssetLoader(p.resources),
			callback = p.callback || function() {};

		assetsLoader.onComplete = function () {
			callback();
		}

		assetsLoader.load();
	}

	// Извлечение путей
	function buildPaths ( p ) {
		var callback = p.callback || function() {};

		// Построить траектории
		utils.processPaths({
			callback: function() {

				// Построить граф
				graph.buildGraph({
					callback: function() {
						callback();
						pathfinder.start();
					}
				});

			}
		})
	}

	return {

		init: function( p ) {
			var callback = p.callback || function () {};

			// предзагрузить ресурсы
			initResources({
				resources: p.resources,
				callback: function () {

					globals.sceneWidth = 3828;
					globals.sceneHeight = 800;

					globals.scale = globals.sceneHeight / document.body.clientHeight;

					buildPaths({
						callback: callback
					});
				}
			})
		}
	}

})();

function init() {

	localforage.config({
		name: 'gameOfDemiurges',
		version: 1.0,
		size: 20*1024*1024,
		storeName: 'keyvaluepairs',
		description: 'Offline Storage'
	});

	loader.init({
		resources: [
			"assets/models/ready/hero/hero.json",
			"assets/models/ready/hero/hero.anim",

			"assets/models/ready/bird/bird.json",
			"assets/models/ready/bird/bird.anim",

			"assets/models/ready/villain/villain.json",
			"assets/models/ready/villain/villain.anim",

			"assets/models/ready/villain2/villain2.json",
			"assets/models/ready/villain2/villain2.anim",

			"assets/models/ready/bucket/bucket.json",
			"assets/models/ready/bucket/bucket.anim",

			"assets/models/ready/garbageBucket/garbageBucket.json",
			"assets/models/ready/garbageBucket/garbageBucket.anim",

			"assets/models/ready/stone/stone.json",
			"assets/models/ready/stone/stone.anim",

			"assets/models/ready/semaphore/semaphore.json",
			"assets/models/ready/semaphore/semaphore.anim",

			"assets/models/ready/butterfly/butterfly.json",
			"assets/models/ready/butterfly/butterfly.anim",

			"assets/models/ready/tv/tv.json",
			"assets/models/ready/tv/tv.anim",

			"assets/models/ready/additionalHero1/addHero1.json",
			"assets/models/ready/additionalHero1/addHero1.anim",

			"assets/models/ready/additionalHero2/additionalHero2.json",
			"assets/models/ready/additionalHero2/additionalHero2.anim",

			"assets/models/ready/elephant/elephant.json",
			"assets/models/ready/elephant/elephant.anim",

			"assets/models/ready/doorToTheNextLavel/doorToTheNextLavel.json",
			"assets/models/ready/doorToTheNextLavel/doorToTheNextLavel.anim",

			"assets/models/ready/barrier/barrier.json",
			"assets/models/ready/barrier/barrier.anim",

			"assets/models/ready/roadSing/roadSing.json",
			"assets/models/ready/roadSing/roadSing.anim",

			"assets/background/background.jpg",
			"assets/background/backgroundVillainPatch.png",

			"assets/models/ready/snow/snow.json",
			"assets/models/ready/snow/snow.anim",

			"assets/models/ready/tree/tree.json",
			"assets/models/ready/tree/tree.anim"
		],
		callback: function () {

			var currentPath = 'stair2',
				birdPath = 'birdTreePath',
				groundPath = 'groundTreeToLeft',
				semaphoreVillainPath = 'semaphoreVillainPath',
				butterflyPath = 'butterflyPath',
				stoneToHand = 'stoneToHand',
				addHero2Path = 'addHero2Path',
				elephantPath = 'elephantPath',
				elephantPathEnd = 'elephantPathEnd',
				pathToMonitors = 'pathToMonitors',
				pathToRoadSing = 'pathToRoadSing',
				endPath = 'endPath',
				endPath1 = 'endPath1';

			var background = obj().create({
				src: 'assets/background/background.jpg',
				name: 'background',
				x: 0,
				y: 0,
				z: 5
			});

			var backgroundVillainPatch = obj().create({
				src: 'assets/background/backgroundVillainPatch.png',
				name: 'backgroundVillainPatch',
				x: 1582,
				y: 600,
				z: 10
			});

			var tree = obj().create({
				name: 'tree',
				src: 'assets/models/ready/tree/tree.anim',
				z: 10,
				pz: 10,
				scale: 1.15,
				step: 275,
				path: groundPath
			});

			var snow = obj().create({
				name: 'snow',
				src: 'assets/models/ready/snow/snow.anim',
				x: 950,
				y: 800,
				z: 20,
				pz: 10
			});

			var hero = obj().create({
				name: 'hero',
				src: 'assets/models/ready/hero/hero.anim',
				z: 15,
				pz: 10,
				scale: 0.4,
				step: 0,
				path: currentPath
			});

			var villain = obj().create({
				name: 'villain',
				src: 'assets/models/ready/villain/villain.anim',
				z: 15,
				pz: 5,
				scale: 0.4,
				step: 440,
				path: groundPath,
				interactive: true,
				ai: {
					stayAnimation: 'animation'
				},
				animation: {
					animation: {
						soundSrc: 'assets/models/ready/villain/villain_sound.ogg'
					}
				}
			});

			var villain2 = obj().create({
				name: 'villain2',
				src: 'assets/models/ready/villain2/villain2.anim',
				z: 7,
				pz: 5,
				scale: 1,
				step: 0,
				path: semaphoreVillainPath,
				interactive: true,
				ai: {
					stayAnimation: 'animation'
				},
				animation: {
					animation: {
						soundSrc: 'assets/models/ready/villain2/villain2_sound.ogg'
					}
				}
			});

			var bird = obj().create({
				name: 'bird',
				src: 'assets/models/ready/bird/bird.anim',
				z: 15,
				pz: 5,
				step: 0,
				path: birdPath,
				interactive: true,
				ai: {
					stayAnimation: 'bird'
				},
				animation: {
					bird: {
						soundSrc: 'assets/models/ready/bird/bird_sound.ogg'
					}
				}
			});

			var bucket = obj().create({
				name: 'bucket',
				src: 'assets/models/ready/bucket/bucket.anim',
				x: 530,
				y: 293,
				z: 13,
				pz: 5
			});

			var garbageBucket = obj().create({
				name: 'garbageBucket',
				src: 'assets/models/ready/garbageBucket/garbageBucket.anim',
				x: 1193,
				y: 647,
				z: 10,
				interactive: true
			});

			var semaphore = obj().create({
				name: 'semaphore',
				src: 'assets/models/ready/semaphore/semaphore.anim',
				x: 1500,
				y: 730,
				z: 10,
				interactive: true,
				animation: {
					trafficLight: {
						soundSrc: 'assets/models/ready/semaphore/semaphore_sound.ogg'
					}
				}
			});

			var stone = obj().create({
				name:'stone',
				src: 'assets/models/ready/stone/stone.anim',
				path: stoneToHand,
				step: 20,
				z: 10,
				pz:  15,
				interactive: true
			});

			var barrier = obj().create({
				name: 'barrier',
				src: 'assets/models/ready/barrier/barrier.anim',
				x:1750,
				y: 610,
				z: 10
			});

			var butterfly = obj().create({
				name: 'butterfly',
				src: 'assets/models/ready/butterfly/butterfly.anim',
				scale: 0.35,
				z: 0,
				pz: 5,
				step: 0,
				path: butterflyPath,
				interactive: true
			});

			var tv = obj().create({
				name: 'tv',
				src: 'assets/models/ready/tv/tv.anim',
				z: 20,
				pz: 5,
				x: 2370,
				y: 840,
				interactive: true,
				animation: {
					'TV run': {
						soundSrc: 'assets/models/ready/tv/tv_sound.ogg'
					},
					'TV stop': {
						soundSrc: 'assets/models/ready/tv/tv_sound.ogg'
					}
				}
			});

			var addHero1 = obj().create({
				name: 'addHero1',
				src: 'assets/models/ready/additionalHero1/addHero1.anim',
				z:15,
				pz: 10,
				step:110,
				path: endPath1,
				ai: {
					moveAnimation: 'addHero1',
					availablesPaths: endPath1
				}
			});

			var addHero2 = obj().create({
				name: 'addHero2',
				src: 'assets/models/ready/additionalHero2/additionalHero2.anim',
				z:10,
				pz: 10,
				step:240,
				path: elephantPathEnd,
				ai: {
					stayAnimation: 'animation',
					stayTime: 5000
				},
				animation: {
					animation: {
						soundSrc: 'assets/models/ready/additionalHero2/additionalHero2_sound.ogg'
					}
				}
			});

			var elephant = obj().create({
				name: 'elephant',
				src: 'assets/models/ready/elephant/elephant.anim',
				z:10,
				pz: 10,
				scale: 0.8,
				step:0,
				path: addHero2Path,
				interactive: false,
				ai: {
					moveAnimation: 'Elefant',
					availablesPaths: addHero2Path,
					stayTime: 6000
				}
			});

			var doorToTheNextLavel = obj().create({
				name:'doorToTheNextLavel',
				src: 'assets/models/ready/doorToTheNextLavel/doorToTheNextLavel.anim',
				x: 3700,
				y: 550,
				z: 10,
				animation: {
					door: {
						soundSrc: 'assets/models/ready/doorToTheNextLavel/door_sound.ogg'
					}
				}
			});

			var roadSing = obj().create({
				name:'roadSing',
				src: 'assets/models/ready/roadSing/roadSing.anim',
				x: 3485,
				y: 285,
				z: 10,
				interactive: true
			});

			// Переходы между анимациями


			globals.objects.hero.image.stateData.setMixByName("new", "stairCaseWalk", 0);
			globals.objects.hero.image.stateData.setMixByName("new", "stop", 0.3);
			globals.objects.semaphore.image.stateData.setMixByName("trafficLight", "trafficLight_stop", 0.5);

			audio.initBackgroundSound();

			scene
				.init({
					canvasId: 'view'
				})
				.addObj(background)
				.addObj(backgroundVillainPatch)
				.addObj(tree)
				.addObj(snow)
				.addObj(hero)
				.addObj(villain)
				.addObj(villain2)
				.addObj(bird)
				.addObj(bucket)
				.addObj(garbageBucket)
				.addObj(semaphore)
				.addObj(butterfly)
				.addObj(tv)
				.addObj(addHero1)
				.addObj(addHero2)
				.addObj(elephant)
				.addObj(stone)
				.addObj(doorToTheNextLavel)
				.addObj(barrier)
				.addObj(roadSing);

			viewport.init();

			queue.startQueue();

			if (debug) {
				document.querySelector('.debug__wrap' ).style.display = "block";
				debugTraect.init();
			}

		}
	})
}

document.addEventListener("DOMContentLoaded", function () {

	function fullScreen() {
		var html = document.body;

		if (html.requestFullScreen) {
			html.requestFullScreen();
		} else if (html.mozRequestFullScreen) {
			html.mozRequestFullScreen();
		} else if (html.webkitRequestFullScreen) {
			html.webkitRequestFullScreen();
		}

	}

	audio
		.init()
		.initSplashSound();

	video.init();
	hint.init();

	if (!debug) {
		document.body.className += ' _noscroll';

		document.querySelector('.start__volume').onmousemove = document.querySelector('.start__volume').onchange = function () {
			globals.volume = this.value;
			audio.setVolume();
		}

		document.querySelector('.start__language option[value="' + globals.locale + '"]').selected = true;

		document.querySelector('.start__language').onchange = function () {
			globals.locale = this.value;
		}

		document.querySelector('.start__run').onclick = function () {
			document.body.removeChild( document.querySelector('.start') );
			fullScreen();

			audio.finishSplashSound();

			video.play(function() {
				init();
			});

		}
	} else {
		init();
	}
})