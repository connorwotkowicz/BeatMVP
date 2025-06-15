import { render, fireEvent } from "@testing-library/react";
import SoundControls from "./SoundControls";
import React from "react";

describe("SoundControls", () => {
  let props;

  beforeEach(() => {
    props = {
      tempo: 120,
      setTempo: jest.fn(),
      isPlaying: false,
      onPlayToggle: jest.fn(),
      volume: 0.5,
      setVolume: jest.fn(),
      isMuted: false,
      setIsMuted: jest.fn(),
    };
  });

  it("renders with default props", () => {
    const { getByText, getByLabelText } = render(<SoundControls {...props} />);

    expect(getByText("Sound Controls")).toBeInTheDocument();
    expect(getByText("Play")).toBeInTheDocument();
    expect(getByLabelText("Tempo: 120 BPM")).toBeInTheDocument();
  });

  it("calls onPlayToggle when play button is clicked", () => {
    const { getByText } = render(<SoundControls {...props} />);

    const playButton = getByText("Play");
    fireEvent.click(playButton);

    expect(props.onPlayToggle).toHaveBeenCalled();
  });

  it("toggles mute and updates volume", () => {
    const { container } = render(<SoundControls {...props} />);
    const muteButton = container.querySelector(".mute-button");

    fireEvent.click(muteButton);
    expect(props.setIsMuted).toHaveBeenCalledWith(true);
    expect(props.setVolume).toHaveBeenCalledWith(0);
  });

  it("adjusts tempo slider", () => {
    const { getByLabelText } = render(<SoundControls {...props} />);
    const tempoSlider = getByLabelText("Tempo: 120 BPM");

    fireEvent.change(tempoSlider, { target: { value: 140 } });
    expect(props.setTempo).toHaveBeenCalledWith(140);
  });
});
