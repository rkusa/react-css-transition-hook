import { renderHook, act } from "@testing-library/react-hooks";
import { useTransition } from "../src";

jest.useFakeTimers();

describe("useTransition", () => {
  test("enter transition", () => {
    const { result, rerender } = renderHook(
      (state: boolean) =>
        useTransition(state, {
          entering: "entering",
          entered: "entered",
          exiting: "exiting",
          exited: "exited"
        }),
      { initialProps: false }
    );

    // start add being exited
    expect(result.current[0]).toEqual(false);
    expect(result.current[1]).toEqual("");

    // kick off the enter transition by changing the state to `true`
    rerender(true);

    // the state will change right away
    expect(result.current[0]).toEqual(true);
    expect(result.current[1]).toEqual("entering");

    // the classnames change to `entered` is queued right away
    act(() => {
      jest.runTimersToTime(0);
    });
    expect(result.current[0]).toEqual(true);
    expect(result.current[1]).toEqual("entered");

    // there are no further changes pending
    act(() => {
      jest.runAllTimers();
    });
    expect(result.current[0]).toEqual(true);
    expect(result.current[1]).toEqual("entered");
  });

  test("exit transition", () => {
    const { result, rerender } = renderHook(
      (state: boolean) =>
        useTransition(state, {
          entering: "entering",
          entered: "entered",
          exiting: "exiting",
          exited: "exited"
        }),
      { initialProps: true }
    );

    // start add being entered
    expect(result.current[0]).toEqual(true);
    expect(result.current[1]).toEqual("entered");

    // kick off the exit transition by changing the state to `false`
    rerender(false);

    // the state will not change right away, but the classnames update to exiting immediately
    expect(result.current[0]).toEqual(true);
    expect(result.current[1]).toEqual("exiting");

    // the classnames change to `exited` is queued right away
    act(() => {
      jest.runTimersToTime(0);
    });
    expect(result.current[0]).toEqual(true);
    expect(result.current[1]).toEqual("exited");

    // the state will not change until the duration hasn't been passed
    act(() => {
      jest.runTimersToTime(100);
    });
    expect(result.current[0]).toEqual(true);
    expect(result.current[1]).toEqual("exited");

    // the state changes after the duration passed
    act(() => {
      jest.runTimersToTime(200);
    });
    expect(result.current[0]).toEqual(false);
    expect(result.current[1]).toEqual("");

    // there are no further changes pending
    act(() => {
      jest.runAllTimers();
    });
    expect(result.current[0]).toEqual(false);
    expect(result.current[1]).toEqual("");
  });

  test("custom duration", () => {
    const { result, rerender } = renderHook(
      (state: boolean) =>
        useTransition(state, {
          duration: 100,
          entering: "entering",
          entered: "entered",
          exiting: "exiting",
          exited: "exited"
        }),
      { initialProps: true }
    );

    // kick off the exit transition by changing the state to `false`
    rerender(false);

    // the state changes after the custom duration passed
    act(() => {
      jest.runTimersToTime(100);
    });
    expect(result.current[0]).toEqual(false);
    expect(result.current[1]).toEqual("");
  });
});
