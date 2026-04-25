export default function BootSequence({ onComplete }) {
  return (
    <div className="boot-sequence" id="boot-sequence">
      <div className="boot-line boot-welcome">Welcome to DOSBox v0.74-3</div>
      <div className="boot-line">&nbsp;</div>
      <div className="boot-line">
        <span className="boot-text">For a short introduction for new users type: </span>
        <span className="boot-highlight-yellow">INTRO</span>
      </div>
      <div className="boot-line">
        <span className="boot-text">For supported shell commands type: </span>
        <span className="boot-highlight-yellow">HELP</span>
      </div>
      <div className="boot-line">&nbsp;</div>
      <div className="boot-line">
        <span className="boot-text">To adjust the emulated CPU speed, use </span>
        <span className="boot-highlight-red">ctrl-F11</span>
        <span className="boot-text"> and </span>
        <span className="boot-highlight-red">ctrl-F12</span>
        <span className="boot-text">.</span>
      </div>
      <div className="boot-line">
        <span className="boot-text">To activate the keymapper </span>
        <span className="boot-highlight-red">ctrl-F1</span>
        <span className="boot-text">.</span>
      </div>
      <div className="boot-line">
        <span className="boot-text">For more information read the </span>
        <span className="boot-highlight-cyan">README</span>
        <span className="boot-text"> file in the DOSBox directory.</span>
      </div>
      <div className="boot-line">&nbsp;</div>
      <div className="boot-line boot-highlight-green">HAVE FUN!</div>
      <div className="boot-line">
        <span className="boot-highlight-green">The DOSBox Team </span>
        <span className="boot-highlight-green">http://www.dosbox.com</span>
      </div>
    </div>
  );
}
