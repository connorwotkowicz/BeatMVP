import { render, fireEvent } from "@testing-library/react";
import SequencerGrid from "./SequencerGrid";
import React from "react";

jest.mock('tone', () => {
  return {
    Player: jest.fn(() => ({
      toDestination: jest.fn(function () {
        return {
          start: jest.fn(),
          load: jest.fn(() => Promise.resolve()),
        };
      }),
      load: jest.fn(() => Promise.resolve()),
    })),
    Transport: {
      scheduleRepeat: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      clear: jest.fn(),
      bpm: {
        value: 120,
      },
    },
    Destination: {
      volume: {
        value: 0,
      },
    },
    gainToDb: jest.fn((gain) => gain * 10),
  };
});

describe("SequencerGrid", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("renders 4 rows and 16 steps per row", () => {
    const pattern = Array(4).fill().map(() => Array(16).fill(false));
    const onPatternChange = jest.fn();

    const { getAllByRole } = render(
      <SequencerGrid pattern={pattern} onPatternChange={onPatternChange} />
    );

    const stepButtons = getAllByRole("button").filter(btn =>
      btn.getAttribute("aria-label")?.includes("step")
    );
    expect(stepButtons).toHaveLength(64);
  });

  it("calls onPatternChange when a step is clicked", () => {
    const pattern = Array(4).fill().map(() => Array(16).fill(false));
    const onPatternChange = jest.fn();

    const { getAllByRole } = render(
      <SequencerGrid pattern={pattern} onPatternChange={onPatternChange} />
    );

    const stepButtons = getAllByRole("button").filter(btn =>
      btn.getAttribute("aria-label")?.includes("step")
    );

    fireEvent.click(stepButtons[0]);
    expect(onPatternChange).toHaveBeenCalled();
  });
});
