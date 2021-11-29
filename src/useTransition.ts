import { TransitionEventHandler, useCallback, useEffect, useState } from "react";

/**
 * Options of the {@link useTransition} hook.
 */
interface UseTransitionOpts {
  /**
   * Whether the initial enter transition, when the state starts with `true` (component is visible)
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
 * The step the transition is in.
 */
export type TransitionStep = "entering" | "entered" | "exiting" | "exited" | null;

/**
 * Transition between states using CSS classnames. Changing a state to `actualState` is delayed
 * until the transition has been completed.
 *
 * @param desiredState - the desired state the hook should transition to
 * @param opts - a set of options controlling the transition
 *
 * @returns a pair of `[currentState, className, transition]`, where `currentState` is the current
 * state that is changed to `desiredState` once the transition completed, `className` is the current
 * set of CSS class names used for the transition, and `transition` is the name of the transition
 * the hook is currently in. The class names are set according to the `opts`.
 */
export function useTransition(
  desiredState: boolean,
  opts: UseTransitionOpts
): [boolean, TransitionProps, TransitionStep] {
  const [currentState, setCurrentState] = useState(
    Boolean(desiredState && opts.disableInitialEnterTransition)
  );
  const [transition, setTransition] = useState<TransitionStep>(() =>
    desiredState ? "entered" : null
  );

  useEffect(() => {
    // exited -> entering
    if (!currentState && desiredState) {
      setCurrentState(true);
      setTransition("entering");
    }
    // entered -> exited
    else if (currentState && !desiredState) {
      setTransition("exiting");
    }
  }, [currentState, desiredState]);

  // Once the state changed to true, trigger another re-render for the switch to the entered
  // classnames
  useEffect(() => {
    switch (transition) {
      case "entering":
        setTransition("entered");
        break;
      case "exiting":
        setTransition("exited");
        break;
    }
  }, [transition]);

  const onTransitionEnd = useCallback(() => {
    if (!desiredState) {
      setCurrentState(false);
      setTransition(null);
    }
  }, [desiredState]);

  return [
    currentState,
    { className: transition ? opts[transition] ?? "" : "", onTransitionEnd },
    transition,
  ];
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
