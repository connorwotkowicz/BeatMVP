
import { render, waitFor } from "@testing-library/react";
import Dashboard from "./page"; 
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import React from "react";

jest.mock("../../services/api");

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
}));

describe("Dashboard", () => {
  it("shows loading when user is null", () => {
    const { getByText } = render(
      <AuthContext.Provider value={{ user: null }}>
        <Dashboard />
      </AuthContext.Provider>
    );
    expect(getByText("Loading your account...")).toBeInTheDocument();
  });

  it("redirects to login if user.id is missing", () => {
    render(
      <AuthContext.Provider value={{ user: {}, token: "fake-token" }}>
        <Dashboard />
      </AuthContext.Provider>
    );
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("renders user dashboard with saved beats", async () => {
    API.get.mockResolvedValue({
      data: { beats: [{ id: 1, title: "Test Beat" }] },
    });

    const user = { id: 123, email: "test@example.com" };

    const { findByText } = render(
      <AuthContext.Provider value={{ user, token: "fake-token", logout: jest.fn() }}>
        <Dashboard />
      </AuthContext.Provider>
    );

    expect(await findByText("Test Beat")).toBeInTheDocument();
    expect(await findByText(/You’re signed in with/i)).toBeInTheDocument();
  });
});