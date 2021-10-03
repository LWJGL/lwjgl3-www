import { useRef, useTransition, useState, useLayoutEffect, forwardRef, useCallback, useMemo } from 'react';
import { createBrowserHistory, createPath } from 'history';
import { Router, useHref, useLocation, useNavigate, useResolvedPath, useBlocker } from './';
import type { BrowserHistory, State, To } from 'history';

export * from './';

////////////////////////////////////////////////////////////////////////////////
// COMPONENTS
////////////////////////////////////////////////////////////////////////////////

export interface BrowserRouterProps {
  basename?: string;
  children?: React.ReactNode;
  window?: Window;
}

/**
 * A <Router> for use in web browsers. Provides the cleanest URLs.
 */
export function BrowserRouter({ basename, children, window }: BrowserRouterProps) {
  let [isPending, startTransition] = useTransition();

  let historyRef = useRef<BrowserHistory>();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({ window });
  }

  let history = historyRef.current;
  let [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(
    () =>
      history.listen((update) => {
        startTransition(() => {
          setState(update);
        });
      }),
    [history, startTransition]
  );

  return (
    <Router
      basename={basename}
      children={children}
      action={state.action}
      location={state.location}
      navigator={history}
      pending={isPending}
    />
  );
}

function isModifiedEvent(event: React.MouseEvent) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  replace?: boolean;
  state?: State;
  to: To;
}

/**
 * The public API for rendering a history-aware <a>.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function LinkWithRef(
  { onClick, replace = false, state, target, to, ...rest },
  ref
) {
  let href = useHref(to);
  let internalOnClick = useLinkClickHandler(to, { replace, state, target });
  function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }

  return <a {...rest} href={href} onClick={handleClick} ref={ref} target={target} />;
});

if (!FLAG_PRODUCTION) {
  Link.displayName = 'Link';
}

export interface NavLinkProps extends Omit<LinkProps, 'className' | 'style'> {
  caseSensitive?: boolean;
  className?: string | ((props: { isActive: boolean }) => string);
  end?: boolean;
  style?: React.CSSProperties | ((props: { isActive: boolean }) => React.CSSProperties);
}

/**
 * A <Link> wrapper that knows if it's "active" or not.
 */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLinkWithRef(
  {
    'aria-current': ariaCurrentProp = 'page',
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

  let className: string;
  if (typeof classNameProp === 'function') {
    className = classNameProp({ isActive });
  } else {
    // If the className prop is not a function, we use a default `active`
    // class for <NavLink />s that are active. In v5 `active` was the default
    // value for `activeClassName`, but we are removing that API and can still
    // use the old default behavior for a cleraner upgrade path and keep the
    // simple styling rules working as the currently do.
    className = [classNameProp, isActive ? 'active' : null].filter(Boolean).join(' ');
  }

  let style = typeof styleProp === 'function' ? styleProp({ isActive }) : styleProp;

  return <Link {...rest} aria-current={ariaCurrent} className={className} ref={ref} style={style} to={to} />;
});

if (!FLAG_PRODUCTION) {
  NavLink.displayName = 'NavLink';
}

////////////////////////////////////////////////////////////////////////////////
// HOOKS
////////////////////////////////////////////////////////////////////////////////

/**
 * Handles the click behavior for router `<Link>` components. This is useful if
 * you need to create custom `<Link>` compoments with the same click behavior we
 * use in our exported `<Link>`.
 */
export function useLinkClickHandler<E extends Element = HTMLAnchorElement, S extends State = State>(
  to: To,
  {
    target,
    replace: replaceProp,
    state,
  }: {
    target?: React.HTMLAttributeAnchorTarget;
    replace?: boolean;
    state?: S;
  } = {}
): (event: React.MouseEvent<E, MouseEvent>) => void {
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to);

  return useCallback(
    (event: React.MouseEvent<E, MouseEvent>) => {
      if (
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
    },
    [location, navigate, path, replaceProp, state, target, to]
  );
}

/**
 * Prevents navigation away from the current page using a window.confirm prompt
 * with the given message.
 */
export function usePrompt(message: string, when = true) {
  let blocker = useCallback(
    (tx) => {
      if (window.confirm(message)) tx.retry();
    },
    [message]
  );

  useBlocker(blocker, when);
}

/**
 * A convenient wrapper for reading and writing search parameters via the
 * URLSearchParams interface.
 */
export function useSearchParams(defaultInit?: URLSearchParamsInit) {
  let defaultSearchParamsRef = useRef(createSearchParams(defaultInit));

  let location = useLocation();
  let searchParams = useMemo(() => {
    let searchParams = createSearchParams(location.search);

    for (let key of defaultSearchParamsRef.current.keys()) {
      if (!searchParams.has(key)) {
        defaultSearchParamsRef.current.getAll(key).forEach((value) => {
          searchParams.append(key, value);
        });
      }
    }

    return searchParams;
  }, [location.search]);

  let navigate = useNavigate();
  let setSearchParams = useCallback(
    (nextInit: URLSearchParamsInit, navigateOptions?: { replace?: boolean; state?: State }) => {
      navigate('?' + createSearchParams(nextInit), navigateOptions);
    },
    [navigate]
  );

  return [searchParams, setSearchParams] as const;
}

export type ParamKeyValuePair = [string, string];

export type URLSearchParamsInit = string | ParamKeyValuePair[] | Record<string, string | string[]> | URLSearchParams;

/**
 * Creates a URLSearchParams object using the given initializer.
 *
 * This is identical to `new URLSearchParams(init)` except it also
 * supports arrays as values in the object form of the initializer
 * instead of just strings. This is convenient when you need multiple
 * values for a given key, but don't want to use an array initializer.
 *
 * For example, instead of:
 *
 *   let searchParams = new URLSearchParams([
 *     ['sort', 'name'],
 *     ['sort', 'price']
 *   ]);
 *
 * you can do:
 *
 *   let searchParams = createSearchParams({
 *     sort: ['name', 'price']
 *   });
 */
export function createSearchParams(init: URLSearchParamsInit = ''): URLSearchParams {
  return new URLSearchParams(
    typeof init === 'string' || Array.isArray(init) || init instanceof URLSearchParams
      ? init
      : Object.keys(init).reduce((memo, key) => {
          let value = init[key];
          return memo.concat(Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]);
        }, [] as ParamKeyValuePair[])
  );
}
