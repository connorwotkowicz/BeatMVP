import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import SequencerGrid from "./SequencerGrid";
import React from "react";

jest.mock('tone', () => {
  return {
    start: jest.fn().mockResolvedValue(undefined),
    Player: jest.fn(() => ({
      toDestination: jest.fn().mockReturnThis(),
      start: jest.fn(),
      load: jest.fn(() => Promise.resolve()),
      dispose: jest.fn(),
    })),
    Transport: {
      scheduleRepeat: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      clear: jest.fn(),
      cancel: jest.fn(),
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
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders 4 rows and 16 steps per row", async () => {
    const pattern = Array(4).fill().map(() => Array(16).fill(false));
    const onPatternChange = jest.fn();

    render(
      <SequencerGrid pattern={pattern} onPatternChange={onPatternChange} />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading audio engine...')).not.toBeInTheDocument();
    });

    const stepButtons = screen.getAllByRole("button").filter(btn =>
      btn.getAttribute("aria-label")?.includes("step")
    );
    expect(stepButtons).toHaveLength(64);
  });

  it("calls onPatternChange when a step is clicked", async () => {
    const pattern = Array(4).fill().map(() => Array(16).fill(false));
    const onPatternChange = jest.fn();

    render(
      <SequencerGrid pattern={pattern} onPatternChange={onPatternChange} />
    );


    await waitFor(() => {
      expect(screen.queryByText('Loading audio engine...')).not.toBeInTheDocument();
    });

    const stepButtons = screen.getAllByRole("button").filter(btn =>
      btn.getAttribute("aria-label")?.includes("step")
    );

    fireEvent.click(stepButtons[0]);
    expect(onPatternChange).toHaveBeenCalled();
  });

 it("shows loading state initially", async () => {
  const pattern = Array(4).fill().map(() => Array(16).fill(false));
  const onPatternChange = jest.fn();

  render(
    <SequencerGrid pattern={pattern} onPatternChange={onPatternChange} />
  );


  expect(screen.getByText('Loading audio engine...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByText('Loading audio engine...')).not.toBeInTheDocument();
  }, { timeout: 2000 });
});
});