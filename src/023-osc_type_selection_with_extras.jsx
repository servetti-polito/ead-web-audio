/* eslint-disable react/prop-types */

import {useState} from 'react';
import './App.css';
import {AudioContextComponent, Slider, ToggleTextButton, Select} from './Tools.jsx'
import {AudioAnalyser} from "./AudioAnalyser.jsx";

const audioCtx = new AudioContext();

function App() {

    const defaultOsc1Frequency = 440;
    const defaultOsc1Type = "square";

    const [audioNodes, setAudioNodes] = useState({});
    const [osc1Frequency, setOsc1Frequency] = useState(defaultOsc1Frequency);
    const [osc1Type, setOsc1Type] = useState(defaultOsc1Type);

    function start() {
        const analyser = new AnalyserNode(audioCtx);
        const osc = new OscillatorNode(audioCtx, {frequency: osc1Frequency});

        const gain = new GainNode(audioCtx);
        const filter = new BiquadFilterNode(audioCtx);
        filter.frequency.value = 1000;
        filter.type = "notch";

        gain.gain.value = 0.5;
        osc.type = osc1Type;
        // Let's add Gain and Filter

        osc.connect(gain);
        gain.connect(filter);
        filter.connect(audioCtx.destination);
        filter.connect(analyser);

        osc.start();

        setAudioNodes((audioNodes) => ({...audioNodes, osc, analyser}))
    }

    function stop() {
        audioNodes.osc.disconnect();
        setAudioNodes((audioNodes) => ({...audioNodes, osc: null}))
    }


    // executed every time a state changes
    if (audioNodes?.osc) {
        if (audioNodes.osc.frequency.value !== osc1Frequency)
            audioNodes.osc.frequency.value = osc1Frequency;

        if (audioNodes.osc.type !== osc1Type) {
            audioNodes.osc.type = osc1Type;
        }

    }

    return (
        <>
            <h1>Oscillator filtering and gain nodes</h1>
            <p></p>
            <AudioContextComponent audioCtx={audioCtx}/>
            <p></p>
            <ToggleTextButton handleClick={[start, stop]} text={["Start", "Stop"]}/>
            <p></p>
            <Slider label={"Osc1 Frequency"}
                    name="osc1Frequency" min={220} max={3520} step={1}
                    value={osc1Frequency}
                    handleChange={(ev) => setOsc1Frequency(ev.target.value)}
            />
            <p></p>
            <Select label={"Osc1 Type"}
                    selected={defaultOsc1Type}
                    values={["sine", "square", "sawtooth", "triangle"]}
                    handleChange={(ev) => {
                        setOsc1Type(ev.target.value);
                    }}/>
            <p></p>
            <AudioAnalyser analyser={audioNodes?.analyser} sampleRate={audioCtx?.sampleRate}/>
        </>
    )
}


export default App
