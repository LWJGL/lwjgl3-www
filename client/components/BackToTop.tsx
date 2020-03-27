import { scrollSmooth } from '~/services/scrollSmooth';
import { Icon } from '~/components/Icon';
import '~/components/icons/fa/regular/arrow-to-top';

function scrollTopTop(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  scrollSmooth(0, 0);
}

export function BackToTop() {
  return (
    <p className="text-center">
      <a className="btn btn-link" href="#" onClick={scrollTopTop}>
        top
        <Icon name="fa/regular/arrow-to-top" />
      </a>
    </p>
  );
}
