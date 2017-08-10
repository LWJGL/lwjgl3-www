import React from 'react';

type BadgeProps = {
  title: string,
  href: string,
  src: string,
};

const BuildBadge = ({ title, href, src }: BadgeProps) =>
  <tr>
    <th>
      {title}
    </th>
    <td>
      <a href={href} target="_blank">
        <img width={90} height={20} src={src} alt={`${title} build status`} />
      </a>
    </td>
  </tr>;

export default BuildBadge;
