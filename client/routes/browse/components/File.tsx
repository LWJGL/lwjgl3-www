interface Props {
  path: string;
}

export const File = ({ path }: Props) => {
  const url = `https://build.lwjgl.org/${path}`;

  return (
    <tr>
      <td className="text-break">
        <b>{path.split('/').pop()}</b>
        <br />
        <a download={true} href={url}>
          <small>{url}</small>
        </a>
      </td>
    </tr>
  );
};
