import * as React from 'react';
import { LazyImg } from '~/components/LazyImg';

type BadgeProps = {
  title: string;
  href: string;
  src: string;
  width?: number;
  height?: number;
};

export const BuildBadge = ({ title, href, src, width = 90, height = 20 }: BadgeProps) => (
  <tr>
    <th>{title}</th>
    <td>
      <a href={href} target="_blank" rel="noopener">
        <LazyImg width={width} height={height} src={src} alt={`${title} build status`} />
      </a>
    </td>
  </tr>
);
