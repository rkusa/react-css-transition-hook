import { TransitionEvent } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useTransition, TransitionProps } from "../src/useTransition";

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

    // start at being exited
    expect(result.current[0]).toEqual(false);
    expect(result.current[1].className).toEqual("");

    // kick off the enter transition by changing the state to `true`
    rerender(true);

    // the state will change right away as well as the classname which changes to `entering`
    // and immediately afterwards to `entered`
    const previous = result.all[result.all.length - 2] as [boolean, TransitionProps];
    expect(previous[0]).toEqual(true);
    expect(previous[1].className).toEqual("entering");
    expect(result.current[0]).toEqual(true);
    expect(result.current[1].className).toEqual("entered");
  });

  test("exit transition", () => {
    const { result, rerender } = renderHook(
      (state: boolean) =>
        useTransition(state, {
          disableInitialEnterTransition: true,
          entering: "entering",
          entered: "entered",
          exiting: "exiting",
          exited: "exited"
        }),
      { initialProps: true }
    );

    // start at being entered
    expect(result.current[0]).toEqual(true);
    expect(result.current[1].className).toEqual("entered");

    // kick off the exit transition by changing the state to `false`
    rerender(false);

    // the state will not change right away, but the the classname will, which changes to `exiting`
    // and immediately afterwards to `exited`
    const previous = result.all[result.all.length - 2] as [boolean, TransitionProps];
    expect(previous[0]).toEqual(true);
    expect(previous[1].className).toEqual("exiting");
    expect(result.current[0]).toEqual(true);
    expect(result.current[1].className).toEqual("exited");

    // the state will not change until the the `transitionEnd` event was fired
    act(() => result.current[1].onTransitionEnd(({} as unknown) as TransitionEvent));
    expect(result.current[0]).toEqual(false);
    expect(result.current[1].className).toEqual("");
  });
});
