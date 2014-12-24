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
var genBlock = (function (){
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
                return genBlock(state);
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
         * Updates html of a block
         * @param html
         * @param blockIndex
         */
    updateFn: function(text, blockIndex) {
        var blocks = this.state.blocks;
        var newState = React.addons.update(this.state, {
            blocks: new function() {
                var arr = [];
                arr[blockIndex] = {};
                arr[blockIndex].text= {$set: text};
                return arr;
            }()
        });
        this.setState(newState);
    },
        /**
         * changes current voice
         * @param key
         */
    changeVoiceFn: function(key) {
        if (key == this.state.currentVoice) return;
        this.setState({"currentVoice": key});
        this.state.blocks.forEach(function(block, blockIndex) {
            console.log("forcingUpdate of block" + blockIndex);
            this.refs["block" + blockIndex].forceUpdate();
        }.bind(this));
    },
    componentWillUpdate: function() {
        var node = this.refs.content.getDOMNode();
        this.scrollHeight = node.scrollHeight;
        this.scrollTop = node.scrollTop;
    },
    componentDidUpdate: function() {
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
                style: {
                    "resize": "none",
                    "whiteSpace": "pre-wrap",
                    //"borderRight": "0.6em solid " + myUtil.hsla(color, 1),
                },
                ref: "block" + blockIndex
            }
            if (this.state.currentVoice === block.voice) {
            } else {
                props.style.color = "rgba(0,0,0,0.4)";
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
