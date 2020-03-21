import { scrollSmooth } from '~/services/scrollSmooth';
import { Icon, ArrowUpward } from '~/components/icons';

function scrollTopTop(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  scrollSmooth(0, 0);
}

export function BackToTop() {
  return (
    <p className="text-center">
      <a className="btn btn-link" href="#" onClick={scrollTopTop}>
        top
        <Icon children={<ArrowUpward />} />
      </a>
    </p>
  );
}
