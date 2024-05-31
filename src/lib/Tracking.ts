import { trackInput } from "./Matomo";
import { debounce } from "debounce";

/**
 * Generates a function tracking input which is executed after a delay
 * @param fn the actual function that shall be executed
 * @param inputId an identifier of the input
 * @param trackValue whether the input's value shall be included in the event
 * @param delay How long this input shall be debounced
 * @returns a debounced, tracking function
 */
export function createInputHandler(
  fn: Function,
  inputId: string,
  trackValue = false,
  delay = 300
) {
  return debounce(
    (...args: any[]) => {
      trackInput(inputId, trackValue ? args.toString() : undefined);
      fn.call({}, ...args);
    },
    delay,
    false
  );
}

export const handlerFor = (inputId: string, fn: Function) =>
  createInputHandler(fn, inputId);
