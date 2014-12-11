var React = require('react');
var assert = require('assert');
var Textarea = require('react-textarea-autosize');
var objectAssign = require("object-assign");


var strs = ["Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."];


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
            blocks: strs.map(function(str) {
                return genBlock({
                    "voice": "original",
                    "value": str 
                });
            }),
            voices: {
                "original": {
                    "name": "original",
                    "color": "#eeeee",
                },
                "me": {
                    "name": "me",
                    "color": "#ff0000",
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
            voice: "me",
            value: "poop"
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

    updateFn: function(value, blockIndex) {
        var blocks = this.state.blocks;
        var block = blocks[blockIndex];
        objectAssign(block, {"value": value});

        this.setState({blocks: blocks});
    },
    changeVoiceFn: function(key) {
        if (key == this.state.currentVoice) return;
        this.setState({"currentVoice": key});
    },
    componentDidUpdate: function() {
        console.log("State change!",this.state);
    },
    render: function() {
        var items = [];
        this.state.blocks.forEach(function(block, blockIndex){
            var blockIndex = blockIndex;
            var style = {
                "color": this.state.voices[block.voice].color,
                "background": (this.state.currentVoice === block.voice) 
                    ? "#dddddd"
                    : "#ffffff"
            };
            items.push(<Block 
                    key={block.key}
                    value={block.value}
                    splitFn={this.splitFn}
                    deleteFn={this.deleteFn}
                    blockIndex={blockIndex}
                    updateFn={this.updateFn}
                    style={style}
                    ref={block + blockIndex}
                    />);
        }.bind(this));
        return (
                <div>
                    <header>
                        <span> appropreader </span>
                        <VoiceChooser
                        changeVoiceFn={this.changeVoiceFn}
                        voices={this.state.voices}
                        currentVoice={this.state.currentVoice}/>
                    </header>
                    <div id={"content"}>
                    {items}
                    </div>
                </div>
               );
    }
});

var Block = React.createClass({
    propTypes: {
        splitFn: React.PropTypes.func
    },
    onKeyPress: function(event) {
        //event.preventDefault();
        if (event.which == 13) { //enter
            var textarea = this.refs["child"].getTextarea();
            var strIndex = textarea.selectionStart;
            this.props.splitFn(strIndex, this.props.blockIndex);
        }
    },
    onKeyUp: function(event) {
        console.log(event);
        //event.preventDefault();
        
        if (event.which == 8) { //backspace
            event.preventDefault();
            var textarea = this.refs["child"].getTextarea();
            if(textarea.value.length == 0 ) {
                console.log("empty!");
            }
        }
    },
    delete: function() {
        this.props.deleteFn(this.props.blockIndex);
    },
    onChange: function(event) {
        this.props.updateFn(event.target.value, this.props.blockIndex);
    },
    render: function() {
        return <Textarea
            className={"Textarea"}
        onKeyPress={this.onKeyPress}
        onKeyUp={this.onKeyUp}
        onChange={this.onChange}
        value={this.props.value}
        style={this.props.style}
        ref="child"
            />
    }
});
var VoiceChooser = React.createClass({
    propTypes: {
        changeVoiceFn: React.PropTypes.func,
        voices: React.PropTypes.object,
        currentVoice: React.PropTypes.string
    },
    render: function() {
        var voicechoices = [];
        Object.keys(this.props.voices).map(function(key){
            var voice = this.props.voices[key];

            if (this.props.currentVoice === key) {
                voice.selected = true;
                voice.key = key;
                voice._key = key;
            } else{
                voice.selected = false;
                voice.key = key;
                voice._key = key;
            }

            var voicechoice = <VoiceChoice
                {...voice}
                changeVoiceFn={this.props.changeVoiceFn}
                />
            voicechoices.push(voicechoice);
        }.bind(this));
        return <span className={"VoiceChooser"}>
                    {voicechoices}
                </span>
    }
});

var VoiceChoice = React.createClass({
    propTypes: {
        name: React.PropTypes.string,
        selected: React.PropTypes.bool,
        _key: React.PropTypes.string,
        changeVoiceFn: React.PropTypes.func
            //color... I can vary it...
    },
    onClick: function(event) {
        return this.props.changeVoiceFn(this.props._key);
    },
    render: function() {
        var style = {
            "color": this.props.color,
        };
        if (this.props.selected) {
            style["background"] =  "#eeeeee";
        }
        return <span
            className={"voiceChoice"}
            onClick={this.onClick}
            style={style}>
            {this.props.name}
        </span>
    }
});

React.render(
        <Doc/>,
        document.body);
