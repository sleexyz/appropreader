var React = require('react'),
    objectAssign = require('object-assign'),
    myUtil = require('./MyUtil.js');

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
    },
    onClick: function(event) {
        return this.props.changeVoiceFn(this.props._key);
    },
    render: function() {
        var style = {
            "borderRight": "5px solid " + myUtil.hsla(this.props.color, 1),
        };
        if (this.props.selected) {
            //style["opacity"] =  1;
            //style["background"] =  hsla(this.props.color, 1);
        }else {
            //style["opacity"] =  0.2;
            //style["background"] =  hsla(this.props.color, 0.5);
        }
        return <span
            className={"voiceChoice"}
            onClick={this.onClick}
            style={style}>
            {this.props.name}
        </span>
    }
});
module.exports = VoiceChooser;
