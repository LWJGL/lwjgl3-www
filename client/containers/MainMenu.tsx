import { NavLink } from 'react-router-dom';

interface Props {
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

export const MainMenu: React.FC<Props> = ({ onClick, className }) => (
  <div role="navigation" aria-label="Main Menu" className={className}>
    <ul className="list-unstyled m-0">
      <li>
        <NavLink onClick={onClick} to="/" end>
          HOME
        </NavLink>
      </li>
      <li>
        <NavLink onClick={onClick} to="/guide">
          GET STARTED
        </NavLink>
      </li>
      <li>
        <NavLink onClick={onClick} to="/download">
          DOWNLOAD
        </NavLink>
      </li>
      <li>
        <NavLink onClick={onClick} to="/customize">
          CUSTOMIZE
        </NavLink>
      </li>
      <li>
        <NavLink onClick={onClick} to="/source">
          SOURCE
        </NavLink>
      </li>
      <li>
        <NavLink onClick={onClick} to="/frameworks">
          FRAMEWORKS
        </NavLink>
      </li>
    </ul>
  </div>
);
