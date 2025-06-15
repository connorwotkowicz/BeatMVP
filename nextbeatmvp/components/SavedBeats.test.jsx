import { render } from "@testing-library/react";
import SavedBeats from "./SavedBeats";
import React from "react";


describe("SavedBeats", () => {
  it("displays a message when there are no beats", () => {
    const { getByText } = render(<SavedBeats userBeats={[]} />);
    expect(getByText("No saved beats found.")).toBeInTheDocument();
  });

  it("renders a list of saved beats", () => {
    const sampleBeats = [
      { id: 1, title: "Beat One", audio_url: "/audio/beat1.mp3" },
      { id: 2, title: "Beat Two", audio_url: "/audio/beat2.mp3" },
    ];

    const { getByText } = render(<SavedBeats userBeats={sampleBeats} />);

    expect(getByText("Beat One")).toBeInTheDocument();
    expect(getByText("Beat Two")).toBeInTheDocument();
  });
});
