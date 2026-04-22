import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundary from "../ErrorBoundary";

const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div data-testid="child">Child content</div>;
};

const Fallback = ({ onReset }) => (
  <div data-testid="fallback">
    <p>Error occurred</p>
    <button onClick={onReset}>Retry</button>
  </div>
);

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <ErrorBoundary fallback={Fallback}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders fallback when child throws", () => {
    render(
      <ErrorBoundary fallback={Fallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("fallback")).toBeInTheDocument();
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  it("re-renders children after reset", () => {
    const { rerender } = render(
      <ErrorBoundary fallback={Fallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("fallback")).toBeInTheDocument();

    // Update props so child no longer throws, then reset the boundary
    rerender(
      <ErrorBoundary fallback={Fallback}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText("Retry"));

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("calls onError when child throws", () => {
    const onError = jest.fn();

    render(
      <ErrorBoundary fallback={Fallback} onError={onError} context="test">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object),
      "test"
    );
  });
});
