var React = require('react/addons'),
    assert = require('assert'),
    objectAssign = require("object-assign"),
    myUtil = require('./MyUtil.js'),
    Block = require("./Block.jsx"),
    VoiceChooser = require("./VoiceChooser.jsx");


var states = [
    {
        voice: "original",
        html: "poop"
    },
    {
        voice: "me",
        html: "poopie"
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
    splitFn: function(strIndex, blockIndex) {
        //TODO:check for cases on splitting for nothing! (eg at the beginning/end
        //also make sure no invisible divs sneaking out, while checking for this

        console.log("Split!", strIndex, blockIndex);
        var blocks = this.state.blocks;

        var original = blocks[blockIndex];
        var origstr = blocks[blockIndex].value;

        var left = objectAssign({}, original, {value: origstr.slice(0, strIndex)});

        var mid = {
            voice: this.state.currentVoice,
            value: ""
        };

        var right = objectAssign({}, original, {value: origstr.slice(strIndex)});

        blocks.splice(blockIndex, 1, genBlock(left), genBlock(mid), genBlock(right));
        this.setState({blocks: blocks});
    },

    deleteFn: function(blockIndex) {
        var blocks = this.state.blocks;
        blocks.splice(blockIndex,1);
        this.setState({blocks: blocks});
    },

    updateFn: function(html, blockIndex) {
        var blocks = this.state.blocks;
        var newState = React.addons.update(this.state, {
            blocks: new function() {
                var arr = [];
                arr[blockIndex] = {};
                arr[blockIndex].html = {$set: html};
                return arr;
            }()
        });
        this.setState(newState);
    },
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
        console.log("State Changed!", this.state);
    },
    render: function() {
        var items = [];
        this.state.blocks.forEach(function(block, blockIndex){
            var color = this.state.voices[block.voice].color;

            var props = {
                key: block.key,
                html: block.html,
                blockIndex: blockIndex,
                belongsToCurrentVoice: (block.voice == this.state.currentVoice),
                splitFn: this.splitFn,
                deleteFn: this.deleteFn,
                updateFn: this.updateFn,
                toTextarea: {
                    style: {
                        "resize": "none",
                        "display": "inline",
                        "whiteSpace": "pre-wrap",
                        //"borderRight": "0.6em solid " + myUtil.hsla(color, 1),
                    },
                },
                ref: "block" + blockIndex
            }
            if (this.state.currentVoice === block.voice) {
            } else {
                props.toTextarea.style.color = "rgba(0,0,0,0.4)";
            }
            items.push(<Block
                    {...props}
                    />);
        }.bind(this));
        return (
                <div id={"Doc"}>
                    <header>
                        <span> @ </span>
                        <VoiceChooser
                        changeVoiceFn={this.changeVoiceFn}
                        voices={this.state.voices}
                        currentVoice={this.state.currentVoice}/>
                    </header>
                    <div id={"content"} ref={"content"}>
                    {items}
                    </div>
                </div>
               );
    }
});



React.render(
        <Doc/>,
        document.body);
