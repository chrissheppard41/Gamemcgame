/**
  * game.js
  *
  * Contains all game related JS code. Integrates with pixi.js lib <./pixi.js>
  *
  * __constructor
  * @param object config Object containing game params
  **/
var Game = Class({
    initialize: function(config, ui) {

      // Dynamic vars
      this.config            = config;
      this.assets            = {};

      this.uiObj = ui;

      // Static vars
      this.config.gridHeight = 20;
      this.config.gridWidth  = 20;

      if( this._ready() ) {
          // Set up scene
          this.stage = this._setStage();
          this.renderer = this._renderer();
          this.stage.click = function(e) {
            ui.clearUI();
          };

          // Start building game
          this._mountRenderer(this.renderer.view);
          this._loadAssets();
      }
    },

    /**
      * _animate
      * Method called during frame render - allows for in-object scope access to vars
      *
      * @return null
      **/
    _animate:function () {

    },

    /**
      * _loadAssets
      * Fetch / Create actors and position them
      **/
    _loadAssets:function() {
        this._loadGrid();


        //combat units
        this._testDragableHead(20, 20, "./imgs/face.png", {
          builder: {},//list of units this unit can build
          playerName: "#player_name",//name of the player
          unitName: "Test name",//name of the unit
          unitDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae quam sit amet sapien hendrerit aliquam.",//description
          unitHealth: 200,//current health of the unit
          maxUnitHeath: 200,//max health of the unit
          level: 1,//current level of the unit
          move: true,//can the unit move?
          offense: true,//does th eunit have offensive abilities
          img: "#noimage",//the image of the unit
          mine: true,//does this unit belong to me?
        });
        this._testDragableHead(100, 50, "./imgs/face.png", {
          builder: {},
          playerName: "#player_name",
          unitName: "Test name 2",
          unitDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae quam sit amet sapien hendrerit aliquam. Does some really cool actions of kick-ass-ery",
          unitHealth: 200,
          maxUnitHeath: 200,
          level: 1,
          move: true,
          offense: true,
          img: "#noimage",
          mine: true,
        });


        //buildings
        this._testDragableHead(150, 150, "./imgs/face_building.png", {
          builder: [
            {
              unit: "unit1",
              btn: "imgs/btn_u1.png",
            },
            {
              unit: "unit2",
              btn: "imgs/btn_u2.png",
            },
            {
              unit: "unit3",
              btn: "imgs/btn_u3.png",
            },
            {
              unit: "unit4",
              btn: "imgs/btn_u4.png",
            },
            {
              unit: "unit5",
              btn: "imgs/btn_u5.png",
            }
          ],
          playerName: "#player_name",
          unitName: "Building name",
          unitDesc: "Fort kick ass",
          unitHealth: 1500,
          maxUnitHeath: 1500,
          level: 1,
          move: false,
          offense: false,
          img: "#noimage",
          mine: true,
        });


        //builders
        this._testDragableHead(140, 250, "./imgs/face_builder.png", {
          builder: [
            {
              unit: "unit1",
              btn: "imgs/btn_u1.png",
            },
            {
              unit: "unit2",
              btn: "imgs/btn_u2.png",
            },
            {
              unit: "unit3",
              btn: "imgs/btn_u3.png",
            }
          ],
          playerName: "#player_name",
          unitName: "Unit builder name",
          unitDesc: "This guy builds stuff",
          unitHealth: 100,
          maxUnitHeath: 100,
          level: 1,
          move: true,
          offense: false,
          img: "#noimage",
          mine: true,
        });



        this._testDragableHead(150, 200, "./imgs/face_enemy.png", {
          builder: [
            {
              unit: "unit1",
            },
            {
              unit: "unit2",
            },
            {
              unit: "unit3",
            }
          ],
          playerName: "#player_name2",
          unitName: "Test name 2 enemy",
          unitDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae quam sit amet sapien hendrerit aliquam. Does some really cool actions of kick-ass-ery",
          unitHealth: 200,
          maxUnitHeath: 200,
          level: 1,
          move: true,
          offense: true,
          img: "#noimage",
          mine: false,
        });
    },

    _testDragableHead:function(xPos, yPos, unitI, ui_unit) {
        var texture      = PIXI.Texture.fromImage(unitI),
            face         = new PIXI.Sprite(texture);
        face.interactive = true;
        face.buttonMode  = true;
        face.anchor.x    = 0.5;
        face.anchor.y    = 0.5;

        // FOR CLICK FUNCTION SCOPE
        var parent = this;

        // INTERACTIONS
        face.mousedown = function(data) {
            this.data = data;
            this.alpha = 0.5;
            this.dragging = true;
        };
        face.mouseup   = face.mouseupoutside = function(data) {
            this.alpha = 1
            this.dragging = false;
            // set the interaction data to null
            this.data = null;

            // Lock to nearest grid co-ord
            var xlo = (this.position.x%parent.config.gridWidth),
                ylo = (this.position.y%parent.config.gridHeight);
            if (xlo != 0) {
                if (xlo > (parent.config.gridWidth / 2)) {
                    xlo = (parent.config.gridWidth - xlo) * -1;
                }
                this.position.x -= xlo;
            }
            if (ylo != 0) {
                if (ylo > (parent.config.gridHeight / 2)) {
                    ylo = (parent.config.gridHeight - ylo) * -1;
                }
                this.position.y -= ylo;
            }

            parent.uiObj.draw(ui_unit);
        };
        face.mousemove = function(data)
        {
            if(this.dragging)
            {
                // need to get parent coords..
                var newPosition = this.data.getLocalPosition(this.parent);
                this.position.x = newPosition.x;
                this.position.y = newPosition.y;
            }
        }

        // START POS
        face.position.x    = xPos;
        face.position.y    = yPos;

        this.stage.addChild(face);
    },

    /**
      * _loadGrid
      * Build grid system
      **/
    _loadGrid:function() {

        // COLLECT GRID DATA
        var grid        = PIXI.Texture.fromImage("./imgs/grid1.png"),
            grid_b      = PIXI.Texture.fromImage("./imgs/grid3.png"),
            grid_hover  = PIXI.Texture.fromImage("./imgs/grid2.png"),
            grid_height = Math.floor(this.config.iHeight / this.config.gridHeight),
            grid_width  = Math.floor(this.config.iWidth / this.config.gridWidth);
        // ENSURE AN EVEN NUMBER OF SQUARES PER SIDE
        if (grid_width%2 != 0)
            grid_width--;
        var grid_count  = (grid_height * grid_width),
            halfwayline = (grid_width/2);

        // CREATE GRID
        var ypos = 1;
        for (var i=0; i < grid_count; i++) {
            var lo   = i%grid_width,
                xpos = (lo+1);
            if (i != 0 && (lo == 0))
                ypos++;
            if (xpos > halfwayline) {
                // team b
            } else {
                // team a
            }
            var sq = new PIXI.Sprite(grid);
            sq.anchor.x = 1;
            sq.anchor.y = 1;
            sq.position.x = xpos*this.config.gridWidth;
            sq.position.y = ypos*this.config.gridHeight;

            // FOR CLICK FUNCTION SCOPE
            var parent = this;

            // GRID INTERACTIONS
            sq.interactive = true;
            sq.mouseover = function(data) {
                this.isOver = true;
                if (this.isdown) return;
                this.setTexture(grid_hover);
            };
            sq.mouseout = function(data) {
                this.isOver = false;
                if (this.isdown) return;
                this.setTexture(grid);
            };
            sq.click = function(data) {
                var o = parent.config.oGameTools;
                o.style.display = 'block';
                o.style.left = String(this.position.x) + 'px';
                o.style.top  = String(this.position.y - o.offsetHeight) + 'px';
            };

            this.stage.addChild(sq);
        }
    },

    /**
      * _mountRenderer
      * Assign the renderer to the DOM
      **/
    _mountRenderer:function (view) {
        this.config.oGameObj.appendChild(view);
    },

    /**
      * _setStage
      * Calls pixi.js Stage method
      **/
    _setStage:function () {
        var stage = new PIXI.Stage(this.config.bg, true);
        return stage;
    },

    /**
      * _renderer
      * Calls pixi.js autoDetectRenderer method
      **/
    _renderer:function () {
        var renderer = PIXI.autoDetectRenderer(this.config.iWidth, this.config.iHeight, null);
        return renderer;
    },

    /**
      * _ready
      * Perform all checks to see if game is ready to be loaded.
      *
      * @return null
      **/
    _ready:function () {
        var bReady = true;
        if ( !this.config.oGameObj ) {
            this._log( 'oGameObj does not exist in DOM' );
            bReady = false;
        }
        return bReady;
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