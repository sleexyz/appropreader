var React = require('react/addons'),
    assert = require('assert'),
    objectAssign = require("object-assign"),
    myUtil = require('./MyUtil.js'),
    Block = require("./Block.jsx"),
    VoiceChooser = require("./VoiceChooser.jsx");


var states = [
    {
        voice: "original",
        text: "Hello\n"
    },
    {
        voice: "me",
        text: "Hi.\nWhat is this?\n"
    },
    {
        voice: "original",
        text: "This is a nonlinear conversation.\n"
    },
    {
        voice: "me",
        text: "Oh\nSeems pretty linear to me...\n"
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
        return objectAssign({}, object, {"key": nextKey()});
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
                this._reconcile(blockIndex - 1, function() {
                    this._focusEnd(blockIndex - 1);
                }.bind(this), function() {
                    this._focusEnd(blockIndex);
                }.bind(this));
            }.bind(this));
        } else if ((right.length === 0)
                || ((right.length === 1) && (right === '\n'))) {
            var newState = React.addons.update(this.state, {
                "blocks": {
                    "$splice": [[blockIndex + 1, 0, this._newBlock()]]
                }
            });
            this.setState(newState, function() {
                this._reconcile(blockIndex + 1, function() {
                    this._focusBeginning(blockIndex + 1);
                }.bind(this), function() {
                    this._focusBeginning(blockIndex + 1);
                }.bind(this));
            }.bind(this));
        } else {
            if ((right[0] === '\n') && (right.length > 1)) { //newline fix
                left = left + "\n";
                right = right.slice(1);
            }
            var leftBlock = objectAssign({}, this.state.blocks[blockIndex]);
            leftBlock.text = left;
            var rightBlock = _genBlock(leftBlock);
            rightBlock.text = right;
            var midBlock = this._newBlock();
            var newState = React.addons.update(this.state, {
                "blocks": {
                    "$splice": [[blockIndex, 1, leftBlock, midBlock, rightBlock]]
                }
            });
            this.setState(newState, function() {
                this._focusBeginning(blockIndex + 1)
            }.bind(this));
        }
    },
        /**
         * combines contiguous blocks of the same owner
         * @param blockIndex
         * @param cb
         * @param failcb
         */
    _reconcile: function(blockIndex, cb, failcb) {
        var left = this.state.blocks[blockIndex];
        var right = this.state.blocks[blockIndex + 1];
        if (left && right) {
            if (left.voice === right.voice) {
                this.updateFn(blockIndex, left.text + right.text, function() {
                    this.deleteFn(blockIndex + 1, cb);
                }.bind(this));
            }
        } else {
            failcb();
        }
    },
        /**
         * Changes focus to the block with the given blockIndex
         * Goes to beginning
         * @param blockIndex
         */
    _focusBeginning: function(blockIndex) {
        var elem = document.getElementById("block" + (blockIndex));
       // elem.focus();
        var range = document.createRange();
        range.selectNodeContents(elem);
        range.collapse(true);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    },
        /**
         * Changes focus to the block with the given blockIndex
         * Goes to end
         * @param blockIndex
         */
    _focusEnd: function(blockIndex) {
        var elem = document.getElementById("block" + (blockIndex));
       // elem.focus();
        var range = document.createRange();
        range.selectNodeContents(elem);
        range.collapse(false);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
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
                deleteFn: this.deleteFn,
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
