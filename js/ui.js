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
        btnArea:      document.getElementById('ui_buttonArea'),
        iWidth:       250,
        iHeight:      250,
        bg:           "#dddddd",
        buttonSlots:  3
      };

      //draw the pixi canvas
      if( this._ready() ) {
        // Set up scene
        this.stage    = new PIXI.Stage(this.config.bg, true);
        this.renderer  = PIXI.autoDetectRenderer(this.config.iWidth, this.config.iHeight, null);

        //requestAnimFrame( animate );
        // Start building game
        this.config.btnArea.appendChild(this.renderer.view);
      }


      this._generateGrid(this.config.buttonSlots);
    },
    /**
      * public function draw
      * Draws items onto the UI, for example, when you click a unit on the screen, action buttons display, unit info appears
      *
      * @param input
      * @return null
      **/
    draw:function (input) {
      //example input:
      /*input = {
        builder: {},
        unitName: "Test name",
        unitDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae quam sit amet sapien hendrerit aliquam.",
        unitHealth: 200,
        maxUnitHeath: 200,
        level: 1,
        img: "#noimage",
      };*/

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

      //console.log(ui_unit);
        //take input unit object(s)
        //use that data to:
        // - Is a builder
        // - Is a unit
        // - Is a building
        //display normal build data

        //clear stage and set buttonSlots
        //this._clearStage();
        //display buttons
        //slot 1: attack
        if(input.offense) {console.log("attack");
          this.btnArray[0][0].disabled = false;
        }
        //slot 2: stop
        //slot 3: move
        if(input.move) {console.log("move");
          this.btnArray[1][0].disabled = false;
          this.btnArray[2][0].disabled = false;
        }
        //slot 9: build menu
        if(Object.keys(input.builder).length > 0) {console.log("build");
          this.btnArray[2][2].disabled = false;
        }

        for(var ii = 0; ii < this.config.buttonSlots; ii++) {
          for(var jj = 0; jj < this.config.buttonSlots; jj++) {
            if(!this.btnArray[ii][jj].disabled) {
              this.btnArray[ii][jj].displayBtn(this.stage);
            }
          }
        }
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
      * @param slot (int)
      * @return null
      **/
    _generateGrid:function(slot) {
      this.btnArray = [];

      for(var i = 0; i < slot; i++) {
        this.btnArray[i] = [];
        for(var j = 0; j < slot; j++) {
          this.btnArray[i][j] = new Button(i, j);
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
      for(var ii = 0; ii < this.config.buttonSlots; ii++) {
          for(var jj = 0; jj < this.config.buttonSlots; jj++) {
            console.log("here 1");
            this.btnArray[ii][jj].disabled = true;
            this.btnArray[ii][jj].removeBtn(this.stage);
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
  initialize: function(posX, posY) {
    this.image        = "./imgs/btn.png";
    this.disabled     = true;


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

    this.masterBtn    = btn;

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
    * removeBtn
    * Removes button from the canvas stage
    *
    * @return null
    **/
  removeBtn: function(stage) {
            console.log("here 2");
            console.log(stage);
            console.log(this.masterBtn);

            if(stage.contains(this.masterBtn)) {
    stage.removeChild(this.masterBtn);
            }

            console.log("here 3");
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
});

//useful to know: array[] = []    ===    multidemional array