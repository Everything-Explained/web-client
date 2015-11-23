/// <reference path='../../controllers/utilities' />

interface ScrollbarOptions {

	// The axis to scroll: (x, y, xy)
	axis?: string;

	setLeft?: string;

	// String representing the available css theme
	theme?: string;

	/**
	 * Two settings: inside (set scrollbar inside container), outside (set scrollbar outside container)
	 */
	scrollbarPosition?: string;

	scrollInertia?: number;
	autoDraggerLength?: boolean;
	autoHideScrollbar?: boolean;
	autoExpandScrollbar?: boolean;
	alwaysShowScrollbar?: number;

	mouseWheel?: {
		enable?: boolean;
		scrollAmount?: number;
		axis?: string;
		preventDefault?: boolean;
		deltaFactor?: number;
		normalizeDelta?: boolean;
		disableOver?: string[];
	}

	scrollButtons?: {
		enable?: boolean;
		scrollAmount?: number;
		scrollType?: string;
	}

	advanced?: {
		autoExpandHorizontalScroll?: string;
		updateOnContentResize?: boolean;
		updateOnImageLoad?: boolean;
	}

	callbacks?: {
		onScrollStart?: () => void;
		onScroll?: () => void;
		onTotalScroll?: () => void;
		onTotalScrollBack?: () => void;

	}

	live?: boolean;

}

interface JQuery {
	Draggable: (options?: any) => JQuery;
	Sizeable: (options?: any) => JQuery;
	CharCount: (limit: number, offset?: number) => JQuery;


	/**
	 * Controls the scrollbar after it has been created on the object
	 *
	 * @param method The action to apply to the scrollbar (Check the Docs)
	 */
	mCustomScrollbar(method?: string): JQuery;

	/**
	 * Constrols the scrollbar after it has been created on the object
	 *
	 * @param method The action to apply to the scrollbar (Check the Docs)
	 * @param context An optional argument that depends on the action (method) used
	 */
	mCustomScrollbar(method?: string, context?: any): JQuery;

	/**
	 *
	 */
	mCustomScrollbar(options?: ScrollbarOptions): JQuery;

	/**
	 * Applies to an input and allows you to filter specific keys based on
	 * an ENUM of presets
	 *
	 * @param option A key filter from the KeyFilterfs ENUM
	 */
	KeyFilter: (option: Utilities.KeyFilters) => JQuery;

	/**
	 * Hides/Shows the placeholder when focused/blurred
	 */
	Placeholder: () => JQuery;

	/**
	 * Perform a custom animation of a set of CSS properties.
	 *
	 * @param properties An object of CSS properties and values that the animation will move toward.
	 * @param duration A string or number determining how long the animation will run.
	 * @param complete A function to call once the animation is complete.
	 */
	transition(properties: Object, duration?: string, complete?: Function): JQuery;
	/**
	 * Perform a custom animation of a set of CSS properties.
	 *
	 * @param properties An object of CSS properties and values that the animation will move toward.
	 * @param duration A string or number determining how long the animation will run.
	 * @param complete A function to call once the animation is complete.
	 */
	transition(properties: Object, duration?: number, complete?: Function): JQuery;
	/**
	 * Perform a custom animation of a set of CSS properties.
	 *
	 * @param properties An object of CSS properties and values that the animation will move toward.
	 * @param duration A string or number determining how long the animation will run.
	 * @param easing A string indicating which easing function to use for the transition. (default: swing)
	 * @param complete A function to call once the animation is complete.
	 */
	transition(properties: Object, duration?: string, easing?: string, complete?: Function): JQuery;
	/**
	 * Perform a custom animation of a set of CSS properties.
	 *
	 * @param properties An object of CSS properties and values that the animation will move toward.
	 * @param duration A string or number determining how long the animation will run.
	 * @param easing A string indicating which easing function to use for the transition. (default: swing)
	 * @param complete A function to call once the animation is complete.
	 */
	transition(properties: Object, duration?: number, easing?: string, complete?: Function): JQuery;
	/**
	 * Perform a custom animation of a set of CSS properties.
	 *
	 * @param properties An object of CSS properties and values that the animation will move toward.
	 * @param options A map of additional options to pass to the method.
	 */
	transition(properties: Object, options: JQueryAnimationOptions): JQuery;
}
