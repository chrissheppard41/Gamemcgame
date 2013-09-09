/**
  * ui.js
  *
  * Handles all interactions from the user
  * @author Chris Sheppard
  *
  **/

  var Ui = Class({
    initialize: function() {
      var _this = this;
      this.config = {
        gameobj:            document.getElementById('gameobj'),//grabs the canvas container
        canvas:             document.getElementById('gameobj').getElementsByTagName("canvas"),//grabs the canvas from the container

        ui_resourceArea:    document.getElementById('ui_resources'),//the resource element
        ui_btnArea:         document.getElementById('ui_buttonArea'),//the button element
        ui_unitInfo:        document.getElementById('ui_unitInfo'),//the unit information element
        ui_miniMap:         document.getElementById('ui_miniMap'),//the minimap element

        iWidth:             250,//the button area width
        iHeight:            250,//the button area height
        bg:                 "#dddddd",//background colour for the button area
        buttonSlots:        3,//grid area(if = to 3 that would result with a 3x3 grid)
        currentSelectedUnit: {},//the currently selected unit
        screenPos: {//used to get the current screen position to the map
          top:              0,
          left:             0
        },
        scrollSpeed:        5//the speed of the scroll
      };

      this.btnArray = [];//init. the button array
      this._generateGrid();//draws the grid
      this._drawUI();//draws the UI area

      //set up listeniner for key detection
      document.onkeydown = function(e) {
        _this._keyDetection(e, _this);
      };
    },
    /**
      * _drawUI
      * draws the UI interface on command
      *
      * @return null
      **/
    _drawUI: function() {
      this.config.ui_resourceArea.style.display   = "block";
      this.config.ui_btnArea.style.display        = "block";
      this.config.ui_unitInfo.style.display       = "block";
      this.config.ui_miniMap.style.display        = "block";
    },
    /**
      * _keyDetection
      * left right, up down
      *
      * @return null
      **/
    _keyDetection: function(e, _this) {
      e = e || window.event;

      var style = window.getComputedStyle(_this.config.gameobj, null);

      if (e.keyCode == '37') {
        if(_this.config.screenPos.left < 0) {
          _this.config.screenPos.left += _this.config.scrollSpeed;
        }
      }
      if (e.keyCode == '38') {
        if(_this.config.screenPos.top < 0) {
          _this.config.screenPos.top  += _this.config.scrollSpeed;
        }
      }
      if (e.keyCode == '39') {
        if(_this.config.screenPos.left > (parseInt(style.getPropertyValue('width'),10)) - _this.config.canvas[0].getAttribute("width")) {
          _this.config.screenPos.left -= _this.config.scrollSpeed;
        }
      }
      if (e.keyCode == '40') {
        if(_this.config.screenPos.top > (parseInt(style.getPropertyValue('height'),10)) - _this.config.canvas[0].getAttribute("height")) {
          _this.config.screenPos.top  -= _this.config.scrollSpeed;
        }
      }
    },
    /**
      * setScreenPos
      * Called in the animation area, the current position of the screen to the map
      *
      * @return null
      **/
    setScreenPos: function() {
      this.config.canvas[0].style.left    = this.config.screenPos.left;
      this.config.canvas[0].style.top     = this.config.screenPos.top;
    },
    /**
      * public function draw
      * Draws items onto the UI, for example, when you click a unit on the screen, action buttons display, unit info appears
      *
      * @param input
      * @return null
      **/
    draw:function (input) {
      var _this = this;

      var ui_text = "<div id='ui_unitCont'>" +
                    " <div id='ui_unitImgSection'>" +
                    "  <div id='ui_unitImg'>" + input.img + "</div>" +
                    "  <div id='ui_unitLevel'>#unitlevel</div>" +
                    "  <div id='ui_unitHealth'>" + input.unitHealth + "/" + input.maxUnitHeath + "</div>" +
                    " </div>" +
                    " <div id='ui_unitInfoSection'>" +
                    "  <div id='ui_playerName'>" + input.playerName + "</div>" +
                    "  <div id='ui_unitName'>" + input.unitName + "</div>" +
                    "  <div id='ui_unitDescr'>" + input.unitDesc + "</div>" +
                    " </div>" +
                    "</div>";

      var ui_unit = document.getElementById("ui_unitInfo");

      ui_unit.innerHTML = ui_text;

      //pass the currently selected unit into the system
      this.config.currentSelectedUnit = input;

      this._handleUnitOptions();
    },
    /**
      * _ready
      * Perform all checks to see if game is ready to be loaded.
      *
      * @return null
      **/
    _ready:function () {
        var bReady = true;
        if ( !this.config.ui_btnArea ) {
            this._log( 'ui_btnArea does not exist in DOM' );
            bReady = false;
        }
        return bReady;
    },
    /**
      * _generateGrid
      * Creates new button objects grid within a multidemional array
      *
      * @return null
      **/
    _generateGrid:function() {
      for (var i = 0, t = this.config.buttonSlots*this.config.buttonSlots; i < t; i++) {
        this.btnArray[i] = new Button(i);
      }
    },
    /**
      * _clearStage
      * Clearing the stage of buttons
      *
      * @return null
      **/
    _clearStage: function() {
        for (var i = 0, t = this.config.buttonSlots*this.config.buttonSlots; i < t; i++) {
            this.btnArray[i].setVisiablity(false);
        }
    },
    /**
      * clearUI
      * Clears the unit on a non interactive click
      *
      * @return null
      **/
    clearUI: function() {
      this._clearStage();
      this.config.ui_unitInfo.innerHTML = "";
      this.config.currentSelectedUnit = {};
    },
    /**
      * displayMenu
      * Displays a nofication in the centre of the screen
      *
      * @param ui_menu, ui_message
      * @return null
      **/
    displayMenu: function(ui_menu, ui_message) {
        var menu = document.getElementById(ui_menu);
        if ( !menu ) {
          console.log("Menu cannot be found!");
        }
        menu.innerHTML = ui_message;
        menu.style.display = "block";

        setTimeout(function(){
          menu.style.display = "none";
          menu.innerHTML = "";
        },3000);

    },
    /**
      * handleResources
      * Displays a the updating resource count
      *
      * @param ui_menu, ui_input
      * @return null
      **/
    handleResources: function(ui_input) {
        if ( !this.config.ui_resourceArea1 ) {
          console.log("Menu cannot be found!");
        }
        this.config.ui_resourceArea1.innerHTML = ui_input;
    },
    /**
      * _handleBuildOptions
      * Displays the list of buttons and presents a back button to the units options
      *
      * @return null
      **/
    _handleBuildOptions: function() {
      var _this = this;
      this._clearStage();

      //slot 8: back button
      this.btnArray[8].setVisiablity(true);
      this.btnArray[8].setName("imgs/btn_ba.png");
      this.btnArray[8].setButtonAction(function(){
        _this.btnArray[8].back();
        _this._handleUnitOptions();
      });

      for (var i = 0, t = this.config.buttonSlots*this.config.buttonSlots; i < t; i++) {
        //console.log(this.config.currentSelectedUnit.builder[i]);
        if(this.config.currentSelectedUnit.builder[i] !== undefined || t < 8) {
          this.btnArray[i].setVisiablity(true);
          this.btnArray[i].setName(this.config.currentSelectedUnit.builder[i].btn);
          //fixing the closure loop problem
          function handler(n) {
            _this.btnArray[n].setButtonAction(function(){
              _this.btnArray[n].build(_this.config.currentSelectedUnit.builder[n]);
            });
          }
          handler(i);
        }
          this.btnArray[i].draw(this.config.ui_btnArea);
      }
    },
    /**
      * _handleUnitOptions
      * Displays the list of buttons
      *
      * @return null
      **/
    _handleUnitOptions: function() {
      var _this = this;
      this._clearStage();
      //do a check for multiple selected units later

      if(this.config.currentSelectedUnit.mine) {
        //display buttons
        //slot 0: attack
        if(this.config.currentSelectedUnit.offense) {
            this.btnArray[0].setVisiablity(true);
            this.btnArray[0].setName("imgs/btn_a.png");
            this.btnArray[0].setButtonAction(function(){
              _this.btnArray[0].attack();
            });
        }
        //slot 1: stop
        //slot 2: move
        if(this.config.currentSelectedUnit.move) {
            this.btnArray[1].setVisiablity(true);
            this.btnArray[1].setName("imgs/btn_m.png");
            this.btnArray[1].setButtonAction(function(){
              _this.btnArray[1].move();
            });
            this.btnArray[2].setVisiablity(true);
            this.btnArray[2].setName("imgs/btn_s.png");
            this.btnArray[2].setButtonAction(function(){
              _this.btnArray[2].stop();
            });
        }
        //slot 8: build menu
        if(Object.keys(this.config.currentSelectedUnit.builder).length > 0) {
            this.btnArray[8].setVisiablity(true);
            this.btnArray[8].setName("imgs/btn_b.png");
            this.btnArray[8].setButtonAction(function(){
              _this.btnArray[8].buildOptions();
              _this._handleBuildOptions();
            });
        }

        for (var i = 0, t = this.config.buttonSlots*this.config.buttonSlots; i < t; i++) {
            this.btnArray[i].draw(this.config.ui_btnArea);
        }
      }
    },
    /**
      * toString
      * Writes object string to the console
      *
      * @return null
      **/
    toString: function() {
      console.log("UI front based functionality");
    },
    /**
      * _log
      * Simple layer that allows possible log management down the line.
      *
      * @return null
      **/
    _log:function (s) {
        console.log( s );
    }
});

/**
  * Button.js
  *
  * Handles the button operations and has a list of assignable functionality
  * @author Chris Sheppard
  *
  **/
var Button = Class({
  /**
    * Button initialize
    * Sets up 1 button within a grid thats within the canvas
    *
    * @param posX, posY
    * @return null
    **/
  initialize: function(pid) {
    //create element
    //add listener add default click with a callback
    this.id = pid;
    this.btn = document.createElement("input");
    this.btn.type = "image";
    this.btn.id = "grid" + pid;
    this.btn.innerHTML = pid;
    this.btn.onmousedown = this.mouseDown;
    this.btn.onmouseup = this.mouseUp;
  },
  /**
    * draw
    * Writes button to the area stage
    *
    * @return null
    **/
  draw: function(area) {
    area.appendChild(this.btn);
  },
  setVisiablity: function(vis) {
    if(vis)
      this.btn.style.display = "block";
    else
      this.btn.style.display = "none";

  },
  getVisiablity: function() {
    return this.btn.style.display;
  },
  setButtonAction: function(func){
    this.btn.onmouseup = func;
  },
  setName: function(name) {
    this.btn.src = name;
  },
  /**
    * mouseDown
    * default mouse down functiopnality
    *
    * @return null
    **/
  mouseDown: function(e) {
    //this.data = data;
    //console.log("down");
  },
  /**
    * mouseUp
    * default mouse up functiopnality
    *
    * @return null
    **/
  mouseUp: function(e) {
    //this.data = data;
    //console.log("up");
  },
  /**
    * mousehover
    * default mouse hover functiopnality
    *
    * @return null
    **/
  mousehover: function(e) {
    //this.data = data;
    this.alpha        = 0.7;
  },
  /**
    * toString
    * Writes object string to the console
    *
    * @return null
    **/
  toString: function() {
    console.log("Btn: " + ((btn.position.x*btn.position.y)/80));
  },
  /**
    * actions area
    * Lists the extra functionality for the buttons, this must be as flexable as possible
    */
  /**
    * attack
    * handles the button click
    *
    * @return null
    **/
  attack: function(data, callback) {
    console.log("attack");
    this.btn.alpha = 1;
    if(callback instanceof Function)
      callback();
  },
  /**
    * move
    * handles the button click
    *
    * @return null
    **/
  move: function(data, callback) {
    console.log("move");
    this.btn.alpha = 1;
    if(callback instanceof Function)
      callback();
  },
  /**
    * stop
    * handles the button click
    *
    * @return null
    **/
  stop: function(data, callback) {
    console.log("stop");
    this.btn.alpha = 1;
    if(callback instanceof Function)
      callback();
  },
    /**
    * buildOptions
    * handles the button click
    *
    * @return null
    **/
  buildOptions: function(data, callback) {
    console.log("buildOptions");
    this.btn.alpha = 1;
    if(callback instanceof Function)
      callback();
  },
    /**
    * back
    * handles the button click
    *
    * @return null
    **/
  back: function(data, callback) {
    console.log("back");
    this.btn.alpha = 1;
    if(callback instanceof Function)
      callback();
  },
    /**
    * build
    * handles the button click
    *
    * @return null
    **/
  build: function(data, callback) {
    console.log("build -> ", data);
    this.btn.alpha = 1;
    if(callback instanceof Function)
      callback();

  }
});