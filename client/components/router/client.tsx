import { useRef, unstable_useTransition, useReducer, useLayoutEffect, forwardRef } from 'react';
import { Router, useHref, useLocation, useNavigate, useResolvedPath } from './';
import { BrowserHistory, State, To, Update, createBrowserHistory, createPath } from 'history';

export * from './';

////////////////////////////////////////////////////////////////////////////////
// COMPONENTS
////////////////////////////////////////////////////////////////////////////////

/**
 * A <Router> for use in web browsers. Provides the cleanest URLs.
 */
export function BrowserRouter({ children, window }: BrowserRouterProps) {
  let historyRef = useRef<BrowserHistory>();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({ window });
  }

  // @ts-ignore
  let [isPending, startTransition] = unstable_useTransition();

  let history = historyRef.current;
  let [state, dispatch] = useReducer((_: Update, action: Update) => action, {
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(
    () =>
      history.listen((update) => {
        startTransition(() => {
          dispatch(update);
        });
      }),
    [history, startTransition]
  );

  return (
    <Router
      children={children}
      action={state.action}
      location={state.location}
      navigator={history}
      pending={isPending}
    />
  );
}

export interface BrowserRouterProps {
  children?: React.ReactNode;
  window?: Window;
}

if (!FLAG_PRODUCTION) {
  BrowserRouter.displayName = 'BrowserRouter';
}

function isModifiedEvent(event: React.MouseEvent) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * The public API for rendering a history-aware <a>.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function LinkWithRef(
  { onClick, replace: replaceProp = false, state, target, to, ...rest },
  ref
) {
  let href = useHref(to);
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (onClick) {
      onClick(event);
    }
    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // Ignore everything but left clicks
      (!target || target === '_self') && // Let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // Ignore clicks with modifier keys
    ) {
      event.preventDefault();

      // If the URL hasn't changed, a regular <a> will do a replace instead of
      // a push, so do the same here.
      let replace = !!replaceProp || createPath(location) === createPath(path);

      navigate(to, { replace, state });
    }
  }

  return <a {...rest} href={href} onClick={handleClick} ref={ref} target={target} />;
});

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  replace?: boolean;
  state?: State;
  to: To;
}

if (!FLAG_PRODUCTION) {
  Link.displayName = 'Link';
}

/**
 * A <Link> wrapper that knows if it's "active" or not.
 */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLinkWithRef(
  {
    'aria-current': ariaCurrentProp = 'page',
    activeClassName = 'active',
    activeStyle,
    caseSensitive = false,
    className: classNameProp = '',
    end = false,
    style: styleProp,
    to,
    ...rest
  },
  ref
) {
  let location = useLocation();
  let path = useResolvedPath(to);

  let locationPathname = location.pathname;
  let toPathname = path.pathname;
  if (!caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    toPathname = toPathname.toLowerCase();
  }

  let isActive = end ? locationPathname === toPathname : locationPathname.startsWith(toPathname);

  let ariaCurrent = isActive ? ariaCurrentProp : undefined;
  let className = [classNameProp, isActive ? activeClassName : null].filter(Boolean).join(' ');
  let style = { ...styleProp, ...(isActive ? activeStyle : null) };

  return <Link {...rest} aria-current={ariaCurrent} className={className} ref={ref} style={style} to={to} />;
});

export interface NavLinkProps extends LinkProps {
  activeClassName?: string;
  activeStyle?: object;
  caseSensitive?: boolean;
  end?: boolean;
}

if (!FLAG_PRODUCTION) {
  NavLink.displayName = 'NavLink';
}

// /**
//  * A declarative interface for showing a window.confirm dialog with the given
//  * message when the user tries to navigate away from the current page.
//  *
//  * This also serves as a reference implementation for anyone who wants to
//  * create their own custom prompt component.
//  */
// export function Prompt({ message, when }: PromptProps) {
//   usePrompt(message, when);
//   return null;
// }

// export interface PromptProps {
//   message: string;
//   when?: boolean;
// }

// if (!FLAG_PRODUCTION) {
//   Prompt.displayName = 'Prompt';
// }

// ////////////////////////////////////////////////////////////////////////////////
// // HOOKS
// ////////////////////////////////////////////////////////////////////////////////

// /**
//  * Prevents navigation away from the current page using a window.confirm prompt
//  * with the given message.
//  */
// export function usePrompt(message: string, when = true) {
//   let blocker = useCallback(
//     (tx) => {
//       if (window.confirm(message)) tx.retry();
//     },
//     [message]
//   );

//   useBlocker(blocker, when);
// }

// /**
//  * A convenient wrapper for reading and writing search parameters via the
//  * URLSearchParams interface.
//  */
// export function useSearchParams(defaultInit?: URLSearchParamsInit) {
//   let defaultSearchParamsRef = useRef(createSearchParams(defaultInit));

//   let location = useLocation();
//   let searchParams = useMemo(() => {
//     let searchParams = createSearchParams(location.search);

//     for (let key of defaultSearchParamsRef.current.keys()) {
//       if (!searchParams.has(key)) {
//         defaultSearchParamsRef.current.getAll(key).forEach((value) => {
//           searchParams.append(key, value);
//         });
//       }
//     }

//     return searchParams;
//   }, [location.search]);

//   let navigate = useNavigate();
//   let setSearchParams = useCallback(
//     (nextInit: URLSearchParamsInit, navigateOptions?: { replace?: boolean; state?: State }) => {
//       navigate('?' + createSearchParams(nextInit), navigateOptions);
//     },
//     [navigate]
//   );

//   return [searchParams, setSearchParams] as const;
// }

// /**
//  * Creates a URLSearchParams object using the given initializer.
//  *
//  * This is identical to `new URLSearchParams(init)` except it also
//  * supports arrays as values in the object form of the initializer
//  * instead of just strings. This is convenient when you need multiple
//  * values for a given key, but don't want to use an array initializer.
//  *
//  * For example, instead of:
//  *
//  *   let searchParams = new URLSearchParams([
//  *     ['sort', 'name'],
//  *     ['sort', 'price']
//  *   ]);
//  *
//  * you can do:
//  *
//  *   let searchParams = createSearchParams({
//  *     sort: ['name', 'price']
//  *   });
//  */
// export function createSearchParams(init: URLSearchParamsInit = ''): URLSearchParams {
//   return new URLSearchParams(
//     typeof init === 'string' || Array.isArray(init) || init instanceof URLSearchParams
//       ? init
//       : Object.keys(init).reduce((memo, key) => {
//           let value = init[key];
//           return memo.concat(Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]);
//         }, [] as ParamKeyValuePair[])
//   );
// }

// export type ParamKeyValuePair = [string, string];
// export type URLSearchParamsInit = string | ParamKeyValuePair[] | Record<string, string | string[]> | URLSearchParams;
