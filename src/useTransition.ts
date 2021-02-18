import { TransitionEventHandler, useCallback, useEffect, useState } from "react";

/**
 * Options of the {@link useTransition} hook.
 */
interface UseTransitionOpts {
  /**
   * Wether the initial enter transition, when the state starts with `true` (component is visible)
   * should be disabled/skipped.
   */
  disableInitialEnterTransition?: boolean;

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
): [boolean, TransitionProps] {
  const [state, setState] = useState(Boolean(actualState && opts.disableInitialEnterTransition));
  const [step, setStep] = useState<"entering" | "entered" | "exiting" | "exited" | null>(() =>
    actualState ? "entered" : null
  );

  useEffect(() => {
    // exited -> entering
    if (!state && actualState) {
      setState(true);
      setStep("entering");
    }
    // entered -> exited
    else if (state && !actualState) {
      setStep("exiting");
    }
  }, [state, actualState]);

  // Once the state changed to true, trigger another re-render for the switch to the entered
  // classnames
  useEffect(() => {
    switch (step) {
      case "entering":
        setStep("entered");
        break;
      case "exiting":
        setStep("exited");
        break;
    }
  }, [step]);

  const onTransitionEnd = useCallback(() => {
    if (!actualState) {
      setState(false);
      setStep(null);
    }
  }, [actualState]);

  return [state, { className: step ? opts[step] ?? "" : "", onTransitionEnd }];
}

/**
 * Properties of the element that should have the transition. It is recommended to spread these
 * properties into the element.
 */
export interface TransitionProps {
  /**
   * The classnames that control the transition.
   */
  className: string;
  /**
   * An event handler for the `transitionEnd` event that is used to detect once a certain transition
   * is finished.
   */
  onTransitionEnd: TransitionEventHandler;
}
