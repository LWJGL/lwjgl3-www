import { scrollSmooth } from '~/services/scrollSmooth';
import { Button } from '~/components/forms/Button';
import { Icon } from '~/components/ui/Icon';
import '~/theme/icons/fa/regular/arrow-to-top';

function scrollTopTop(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();
  scrollSmooth(0, 0);
}

export const BackToTop: React.FC<{ children?: never }> = () => (
  <Button variant="text" tone="neutral" onClick={scrollTopTop}>
    Top <Icon name="fa/regular/arrow-to-top" />
  </Button>
);
