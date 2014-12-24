var React = require('react/addons'),
    assert = require('assert'),
    objectAssign = require("object-assign"),
    myUtil = require('./MyUtil.js'),
    Block = require("./Block.jsx"),
    VoiceChooser = require("./VoiceChooser.jsx");


var states = [
    {
        voice: "original",
        text: "Hello"
    },
    {
        voice: "me",
        text: "Hi.\nWhat is this?"
    },
    {
        voice: "original",
        text: "This is a nonlinear conversation."
    },
    {
        voice: "me",
        text: "Oh\nSeems pretty linear to me..."
    },
];


/**
 * Makes a valid block state.
 * Really just gives unique key to block.
 * Every time a block mutates, it needs to get a new block state.
 */
var _genBlock = (function (){
    var counter = 0;

    function nextKey() {
        var output = "key_" + counter;
        counter += 1;
        return output;
    }
    return function(object) {
        if (object){
            return objectAssign({}, object, {"key": nextKey()});
        }
        //else throw error!
    }
})();

var Doc = React.createClass({
    getInitialState: function() {
        return {
            blocks: states.map(function(state) {
                return _genBlock(state);
            }),
            voices: {
                "original": {
                    "name": "original",
                    "color": {
                        "h": 70,
                        "s": "20%",
                        "l": "50%",
                    }
                },
                "me": {
                    "name": "me",
                    "color": {
                        "h": 170,
                        "s": "20%",
                        "l": "50%",
                    }
                }
            },
            currentVoice: "original"
        };
    },
        /**
         * Updates text of a block
         * @param blockIndex
         * @param text
         */
    updateFn: function(blockIndex, text, callback) {
        var newState = React.addons.update(this.state, {
            "blocks": (function() {
                var arr = [];
                arr[blockIndex] = {};
                arr[blockIndex].text= {$set: text};
                return arr;
            })()
        });
        this.setState(newState, callback);
    },
        /**
         * deletes block
         * @param blockIndex
         */
    deleteFn: function(blockIndex, callback) {
        var newState = React.addons.update(this.state, {
            "blocks": {
                "$splice": [[blockIndex, 1]]
            }
        });
        this.setState(newState, callback);
    },
        /**
         * changes current voice
         * @param key
         */
    changeVoiceFn: function(key) {
        if (key == this.state.currentVoice) return;
        this.setState({"currentVoice": key});
    },
        /**
         * Splits block
         * @param blockIndex
         * @param caretPos
         */
    splitFn: function(blockIndex, caretPos) {
        var block = this.state.blocks[blockIndex];
        var text = block.text
        var left = text.slice(0, caretPos)
        var right = text.slice(caretPos);
        if (left.length === 0) {
            var newState = React.addons.update(this.state, {
                "blocks": {
                    "$splice": [[blockIndex, 0, this._newBlock()]]
                }
            });
            this.setState(newState, function() {
                this._reconcile(blockIndex);
            });
        }
    },
        /**
         * combines contiguous blocks of the same owner
         * @param blockIndex
         */
    _reconcile: function(blockIndex) {
        var left = this.state.blocks[blockIndex - 1];
        var mid = this.state.blocks[blockIndex];
        console.log([left.text, mid.text]);
 //       var right = this.state.blocks[blockIndex + 1];
        if (left) {
            if (left.voice === mid.voice) {
                this.updateFn(blockIndex - 1, left.text + mid.text, function() {
                    this.deleteFn(blockIndex, function() {
                        var elem = document.getElementById("block" + (blockIndex - 1));
                        elem.focus();
                        var range = document.createRange();
                        range.selectNodeContents(elem);
                        range.collapse(false);
                        selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }.bind(this));
                }.bind(this));
            }
        }
    },
    _newBlock: function() {
        return _genBlock({
            "voice": this.state.currentVoice,
            "text": "\n"
        });
    },
    componentDidUpdate: function() {
        console.log("");
        this.state.blocks.forEach(function(block) {
            console.log(block);
        });
    },
    render: function() {
        var blocks = [];
        this.state.blocks.forEach(function(block, blockIndex){
            var color = this.state.voices[block.voice].color;

            var props = {
                id: "block" + blockIndex,
                text: block.text,
                blockIndex: blockIndex,
                editable: (block.voice == this.state.currentVoice),
                updateFn: this.updateFn,
                splitFn: this.splitFn,
                ref: "block" + blockIndex
            }
            blocks.push(<div key={block.key}><Block
                    {...props}
                    /></div>);
        }.bind(this));
        return (
                <div id={"Doc"}>
                    <header>
                        <VoiceChooser
                        changeVoiceFn={this.changeVoiceFn}
                        voices={this.state.voices}
                        currentVoice={this.state.currentVoice}/>
                    </header>
                    <div id={"contentContainer"}>
                        <div id={"content"} ref={"content"}>
                            {blocks}
                        </div >
                    </div>
                </div>
               );
    },
});



React.render(
        <Doc/>,
        document.body);
