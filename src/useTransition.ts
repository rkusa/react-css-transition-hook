import { useLayoutEffect, useState } from "react";

/**
 * Options of the {@link useTransition} hook.
 */
interface UseTransitionOpts {
  /**
   * The duration in ms of the CSS exit transition/animation. The actual state change is delayed
   * until this duration has passed. Defaults to 200ms.
   */
  duration?: number;

  /**
   * The CSS classnames that should be returned when the enter transition is about to start. During
   * the enter animation the classnames will be changed from `entering` to `entered`.
   */
  entering?: string;

  /**
   * The CSS classnames that should be returned when the enter transition is in progress. During
   * the enter animation the classnames will be changed from `entering` to `entered`.
   */
  entered?: string;

  /**
   * The CSS classnames that should be returned when the exit transition is about to start. During
   * the exit animation the classnames will be changed from `exiting` to `exited`.
   */
  exiting?: string;

  /**
   * The CSS classnames that should be returned when the exit transition is in progress. During
   * the exit animation the classnames will be changed from `exiting` to `exited`.
   */
  exited?: string;
}

/**
 * Transition between states using CSS classnames. Changing a state to `actualState` is delayed
 * until the transition has been completed.
 *
 * @param actualState - the actual state the hook should transition to
 * @param opts - a set of options controlling the transition
 *
 * @returns a pair of `[state, className]`, where `state` is the current state that is changed to
 * `actualState` once the transition completed, and `className` is the current set of CSS class
 * names used for the transition. The class names are set according to the `opts`.
 */
export default function useTransition(
  actualState: boolean,
  opts: UseTransitionOpts
): [boolean, string] {
  const [state, setState] = useState(actualState);
  const [className, setClassName] = useState<string | undefined>(() =>
    actualState ? opts.entered : undefined
  );

  useLayoutEffect(() => {
    // entering
    if (!state && actualState) {
      setState(true);
      setClassName(opts.entering);
    }
    // entered
    else if (state && actualState) {
      setTimeout(() => setClassName(opts.entered));
    }
    // exiting, exited
    else if (state && !actualState) {
      setClassName(opts.exiting);
      setTimeout(() => setClassName(opts.exited));
      const timeout = setTimeout(() => {
        setState(false);
        setClassName(undefined);
      }, opts.duration ?? 200);
      return () => clearTimeout(timeout);
    }
    return;
  }, [state, actualState, opts.entering, opts.entered, opts.exiting, opts.exited]);

  return [state, className ?? ""];
}
