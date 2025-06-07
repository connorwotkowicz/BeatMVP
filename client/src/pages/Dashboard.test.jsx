import { render, waitFor } from "@testing-library/react";
import Dashboard from "./Dashboard";
import { AuthContext } from "../context/AuthContext";
import { MemoryRouter, useNavigate } from "react-router-dom";
import API from "../services/api";
import React from "react";


jest.mock("../services/api");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Dashboard", () => {
  const mockNavigate = jest.fn();
  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
  });

  it("shows loading when user is null", () => {
    const { getByText } = render(
      <AuthContext.Provider value={{ user: null }}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(getByText("Loading your account...")).toBeInTheDocument();
  });

  it("redirects to login if user.id is missing", () => {
    render(
      <AuthContext.Provider value={{ user: {}, token: "fake-token" }}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("renders user dashboard with saved beats", async () => {
    API.get.mockResolvedValue({
      data: { beats: [{ id: 1, title: "Test Beat" }] },
    });

    const user = { id: 123, email: "test@example.com" };

    const { findByText } = render(
      <AuthContext.Provider value={{ user, token: "fake-token", logout: jest.fn() }}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(await findByText("Test Beat")).toBeInTheDocument();
    expect(await findByText(/You’re signed in with/i)).toBeInTheDocument();
  });
});
