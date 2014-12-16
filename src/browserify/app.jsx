var React = require('react/addons'),
    assert = require('assert'),
    objectAssign = require("object-assign"),
    myUtil = require('./MyUtil.js'),
    Block = require("./Block.jsx"),
    VoiceChooser = require("./VoiceChooser.jsx");


var states = [
    {
        value: "Before The Law\nby Franz Kafka\n\nTranslated by Ian Johnston\n\n\nBefore the law sits a gatekeeper. ",
        voice: "original"
    },
    {
        value: "Here is a shitty annotation!",
        voice: "me"
    },
    {
        value: "To this gatekeeper comes a man from the country who asks to gain entry into the law. But the gatekeeper says that he cannot grant him entry at the moment. The man thinks about it and then asks if he will be allowed to come in later on. “It is possible,” says the gatekeeper, “but not now.” At the moment the gate to the law stands open, as always, and the gatekeeper walks to the side, so the man bends over in order to see through the gate into the inside. When the gatekeeper notices that, he laughs and says: “If it tempts you so much, try it in spite of my prohibition. But take note: I am powerful. And I am only the most lowly gatekeeper. But from room to room stand gatekeepers, each more powerful than the other. I can’t endure even one glimpse of the third.” The man from the country has not expected such difficulties: the law should always be accessible for everyone, he thinks, but as he now looks more closely at the gatekeeper in his fur coat, at his large pointed nose and his long, thin, black Tartar’s beard, he decides that it would be better to wait until he gets permission to go inside. The gatekeeper gives him a stool and allows him to sit down at the side in front of the gate. There he sits for days and years. He makes many attempts to be let in, and he wears the gatekeeper out with his requests. The gatekeeper often interrogates him briefly, questioning him about his homeland and many other things, but they are indifferent questions, the kind great men put, and at the end he always tells him once more that he cannot let him inside yet. The man, who has equipped himself with many things for his journey, spends everything, no matter how valuable, to win over the gatekeeper. The latter takes it all but, as he does so, says, “I am taking this only so that you do not think you have failed to do anything.” During the many years the man observes the gatekeeper almost continuously. He forgets the other gatekeepers, and this one seems to him the only obstacle for entry into the law. He curses the unlucky circumstance, in the first years thoughtlessly and out loud, later, as he grows old, he still mumbles to himself. He becomes childish and, since in the long years studying the gatekeeper he has come to know the fleas in his fur collar, he even asks the fleas to help him persuade the gatekeeper. Finally his eyesight grows weak, and he does not know whether things are really darker around him or whether his eyes are merely deceiving him. But he recognizes now in the darkness an illumination which breaks inextinguishably out of the gateway to the law. Now he no longer has much time to live. Before his death he gathers in his head all his experiences of the entire time up into one question which he has not yet put to the gatekeeper. He waves to him, since he can no longer lift up his stiffening body.",
        voice: "original"
    },
    {
        value: "Hmm... I wonder what is going to happen...",
        voice: "me"
    },
    {
        value: "The gatekeeper has to bend way down to him, for the great difference has changed things to the disadvantage of the man. “What do you still want to know, then?” asks the gatekeeper. “You are insatiable.” “Everyone strives after the law,” says the man, “so how is that in these many years no one except me has requested entry?” The gatekeeper sees that the man is already dying and, in order to reach his diminishing sense of hearing, he shouts at him, “Here no one else can gain entry, since this entrance was assigned only to you. I’m going now to close it.",
        voice: "original"
    },
    {
        value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        voice: "me"
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

    updateFn: function(value, blockIndex) {
        var blocks = this.state.blocks;
        var newState = React.addons.update(this.state, {
            blocks: new function() {
                var arr = [];
                arr[blockIndex] = {};
                arr[blockIndex].value = {$set: value};
                return arr;
            }()
        });
        this.setState(newState);

    },
    changeVoiceFn: function(key) {
        if (key == this.state.currentVoice) return;
        this.setState({"currentVoice": key});
    },
    componentWillUpdate: function() {
        var node = this.refs.content.getDOMNode();
        this.scrollHeight = node.scrollHeight;
        this.scrollTop = node.scrollTop;
    },
    componentDidUpdate: function() {
        //scrolling stuff 
        var node = this.refs.content.getDOMNode();
        console.log({
            "tagname": node.tagName,
            "node.scrollTop": node.scrollTop,
            "node.scrollHeight": node.scrollHeight,
            "this.scrollTop": this.scrollTop,
            "this.scrollHeight": this.scrollHeight});
        //console.log("State Changed!", this.state);
    },
    render: function() {
        var items = [];
        this.state.blocks.forEach(function(block, blockIndex){
            var color = this.state.voices[block.voice].color;

            var props = {
                key: block.key,
                value: block.value,
                blockIndex: blockIndex,
                belongsToCurrentVoice: (block.voice == this.state.currentVoice),
                splitFn: this.splitFn,
                deleteFn: this.deleteFn,
                updateFn: this.updateFn,
                toTextarea: {
                    style: {
                        "resize": "none",
                        "borderRight": "0.6em solid " + myUtil.hsla(color, 1),
                    },
                },
                ref: "block" + blockIndex
            }
            if (this.state.currentVoice === block.voice) {
            } else {
                props.toTextarea.style.opacity = 0.4;
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
