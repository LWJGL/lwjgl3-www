import { scrollSmooth } from '~/services/scrollSmooth';
import { Button } from '~/components/forms/Button';
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/regular/arrow-to-top';

function scrollToTop(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();
  scrollSmooth(0, 0);
}

export const BackToTop: React.FC<{ children?: never }> = () => (
  <Button variant="outline" tone="neutral" onClick={scrollToTop}>
    Top <Icon name="fa/regular/arrow-to-top" />
  </Button>
);
