/**
  * ui.js
  *
  * Handles all interactions from the user
  * @author Chris Sheppard
  *
  **/

  var Ui = Class({
    initialize: function() {

      this.config = {
        resourceArea1:      document.getElementById('ui_resources'),
        resourceArea2:      document.getElementById('ui_resources2'),
        btnArea:            document.getElementById('ui_buttonArea'),
        iWidth:             250,
        iHeight:            250,
        bg:                 "#dddddd",
        buttonSlots:        3,
        currentSelectedUnit: {}
      };

      this.btnArray = [];

      //draw the pixi canvas
      if( this._ready() ) {
        // Set up scene
        this.stage    = new PIXI.Stage(this.config.bg, true);
        this.renderer  = PIXI.autoDetectRenderer(this.config.iWidth, this.config.iHeight, null);

        //requestAnimFrame( animate );
        // Start building game
        this.config.btnArea.appendChild(this.renderer.view);
      }

      this._generateGrid();
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
        if ( !this.config.btnArea ) {
            this._log( 'btnArea does not exist in DOM' );
            bReady = false;
        }
        return bReady;
    },
    /**
      * _generateGrid
      * Creates new button objects grid within a multidemional array
      *
      * @pete removed @param slot (int) AS this.config.buttonSlots IS GLOBAL
      * @return null
      **/
    _generateGrid:function() {
      var j = 0, k = 0;
      for (var i = 0, t = this.config.buttonSlots*this.config.buttonSlots; i < t; i++) {
        this.btnArray[i] = new Button(j, k);

        if((i+1) % 3 === 0) {
          k++; j = 0;
        } else {
          j++;
        }
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
      * _clearUI
      * Clears the unit on a non interactive click
      *
      * @return null
      **/
    _clearUI: function() {
      //clear unit
      //clear ui
      console.log(clear);
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
        if ( !this.config.resourceArea1 ) {
          console.log("Menu cannot be found!");
        }
        this.config.resourceArea1.innerHTML = ui_input;
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
      this.btnArray[8].setButtonAction(function(){
        _this.btnArray[8].back();
        _this._handleUnitOptions();
      });

      for (var i = 0, t = this.config.buttonSlots*this.config.buttonSlots; i < t; i++) {
        //console.log(this.config.currentSelectedUnit.builder[i]);
        if(this.config.currentSelectedUnit.builder[i] !== undefined || t < 8) {
          this.btnArray[i].setVisiablity(true);
          //fixing the closure loop problem
          function handler(n) {
            _this.btnArray[n].setButtonAction(function(){
              _this.btnArray[n].build(_this.config.currentSelectedUnit.builder[n]);
            });
          }
          handler(i);
        }
          this.btnArray[i].displayBtn(this.stage);
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


      //display buttons
      //slot 0: attack
      if(this.config.currentSelectedUnit.offense) {
          this.btnArray[0].setVisiablity(true);
          this.btnArray[0].setButtonAction(function(){
            _this.btnArray[0].attack();
          });
      }
      //slot 1: stop
      //slot 2: move
      if(this.config.currentSelectedUnit.move) {
          this.btnArray[1].setVisiablity(true);
          this.btnArray[1].setButtonAction(function(){
            _this.btnArray[1].move();
          });
          this.btnArray[2].setVisiablity(true);
          this.btnArray[2].setButtonAction(function(){
            _this.btnArray[2].stop();
          });
      }
      //slot 8: build menu
      if(Object.keys(this.config.currentSelectedUnit.builder).length > 0) {
          this.btnArray[8].setVisiablity(true);
          this.btnArray[8].setButtonAction(function(){
            _this.btnArray[8].buildOptions();
            _this._handleBuildOptions();
          });
      }

      for (var i = 0, t = this.config.buttonSlots*this.config.buttonSlots; i < t; i++) {
          this.btnArray[i].displayBtn(this.stage);
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
  initialize: function(posX, posY) {
    this.image        = "./imgs/btn.png";

    var texture       = PIXI.Texture.fromImage(this.image),
        btn           = new PIXI.Sprite(texture);
    btn.interactive   = true;
    btn.buttonMode    = true;
    btn.anchor.x      = 0;
    btn.anchor.y      = 0;

    // INTERACTIONS
    btn.mousedown     = this.mouseDown;
    btn.mouseup       = this.mouseup;

    // START POS
    btn.position.x    = 80 * posX;
    btn.position.y    = 80 * posY;

    btn.visible       = false;

    this.masterBtn    = btn;
  },
  setVisiablity: function(vis) {
    this.masterBtn.visible = vis;
  },
  getVisiablity: function() {
    return this.masterBtn.visible;
  },
  setButtonAction: function(func){
    this.masterBtn.mouseup = func;
  },
  /**
    * mouseDown
    * default mouse down functiopnality
    *
    * @return null
    **/
  mouseDown: function(data) {
    //this.data = data;
    this.alpha        = 0.5;
  },
  /**
    * mouseup
    * default mouse up functiopnality
    *
    * @return null
    **/
  mouseup: function(data) {
    //this.data = data;
    this.alpha        = 1;
  },
  /**
    * mousehover
    * default mouse hover functiopnality
    *
    * @return null
    **/
  mousehover: function(data) {
    //this.data = data;
    this.alpha        = 0.7;
  },
  /**
    * displayBtn
    * Writes button to the canvas stage
    *
    * @return null
    **/
  displayBtn: function(stage) {
    stage.addChild(this.masterBtn);
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
    this.masterBtn.alpha = 1;
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
    this.masterBtn.alpha = 1;
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
    this.masterBtn.alpha = 1;
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
    this.masterBtn.alpha = 1;
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
    this.masterBtn.alpha = 1;
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
    this.masterBtn.alpha = 1;
    if(callback instanceof Function)
      callback();

  }
});

//useful to know: array[] = []    ===    multidemional array