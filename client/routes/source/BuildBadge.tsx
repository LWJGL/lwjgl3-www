import React from 'react';
import { LazyImg } from '~/components/LazyImg';

interface Props {
  title: string;
  href: string;
  src: string;
  width?: number;
  height?: number;
}

export const BuildBadge: React.FC<Props> = ({ title, href, src, width = 90, height = 20 }) => (
  <tr>
    <th>{title}</th>
    <td>
      <a href={href} target="_blank" rel="noopener external">
        <LazyImg width={width} height={height} src={src} alt={`${title} build status`} />
      </a>
    </td>
  </tr>
);
